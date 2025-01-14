import { Server, ServerCredentials } from '@grpc/grpc-js';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { container } from 'tsyringe';
import { Config } from '../config/constants';
import { Logger } from '../utils/logger';
import { authServiceHandlers } from '../infrastructure/grpc/implementations';
import { AuthServiceService } from '../infrastructure/grpc/proto/auth_grpc_pb';
import { setupRoutes } from '../delivery/http/routes';
import { schema } from '../delivery/http/graphql/schema';
import { DataSource } from 'typeorm';
import { RedisClient } from '../infrastructure/redis/redis-client';

export class ServerConsole {
    private httpServer: express.Application;
    private grpcServer: Server;
    private apolloServer: ApolloServer;
    private isShuttingDown = false;

    constructor(
        private logger: Logger,
        private dataSource: DataSource,
        private redisClient: RedisClient
    ) {
        this.httpServer = express();
        this.grpcServer = new Server();
    }

    private async setupHttp(): Promise<void> {
        const httpPort = Config.HTTP_PORT;

        // Setup middlewares & routes
        setupRoutes(this.httpServer);

        return new Promise((resolve) => {
            const server = this.httpServer.listen(httpPort, () => {
                this.logger.info(`HTTP Server running on port ${httpPort}`);
                resolve();
            });

            // HTTP Graceful shutdown
            process.on('SIGTERM', () => {
                this.logger.info('SIGTERM received. Shutting down HTTP server...');
                server.close(() => {
                    this.logger.info('HTTP server closed');
                });
            });
        });
    }

    private async setupGraphql(): Promise<void> {
        this.apolloServer = new ApolloServer({
            schema,
            context: ({ req }) => ({
                req,
                container
            })
        });

        await this.apolloServer.start();
        this.apolloServer.applyMiddleware({ app: this.httpServer });

        this.logger.info(`GraphQL Server running at /graphql`);
    }

    private async setupGrpc(): Promise<void> {
        const grpcPort = Config.GRPC_PORT;

        // Add services
        this.grpcServer.addService(AuthServiceService, authServiceHandlers);

        return new Promise((resolve, reject) => {
            this.grpcServer.bindAsync(
                `0.0.0.0:${grpcPort}`,
                ServerCredentials.createInsecure(),
                (error, port) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    this.grpcServer.start();
                    this.logger.info(`gRPC Server running on port ${port}`);
                    resolve();
                }
            );
        });
    }

    private async gracefulShutdown(): Promise<void> {
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;

        this.logger.info('Graceful shutdown initiated...');

        try {
            // Stop accepting new requests
            this.grpcServer.tryShutdown(async () => {
                this.logger.info('gRPC server shutdown complete');
            });

            // Close Apollo Server
            await this.apolloServer.stop();
            this.logger.info('GraphQL server shutdown complete');

            // Close database connections
            await this.dataSource.destroy();
            this.logger.info('Database connections closed');

            // Close Redis connections
            await this.redisClient.quit();
            this.logger.info('Redis connections closed');

            this.logger.info('Graceful shutdown completed');
            process.exit(0);
        } catch (error) {
            this.logger.error('Error during graceful shutdown:', error);
            process.exit(1);
        }
    }

    async run(): Promise<void> {
        try {
            // Initialize database connection
            await this.dataSource.initialize();
            this.logger.info('Database connection established');

            // Initialize Redis connection
            await this.redisClient.connect();
            this.logger.info('Redis connection established');

            // Setup all servers
            await Promise.all([
                this.setupHttp(),
                this.setupGraphql(),
                this.setupGrpc()
            ]);

            // Setup graceful shutdown
            process.on('SIGTERM', this.gracefulShutdown.bind(this));
            process.on('SIGINT', this.gracefulShutdown.bind(this));

            this.logger.info('All servers started successfully');
        } catch (error) {
            this.logger.error('Failed to start servers', error);
            throw error;
        }
    }
}