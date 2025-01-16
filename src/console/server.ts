// src/console/server.ts
import express from 'express';
import { createServer } from 'http';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import Redis from 'ioredis';
import { Logger } from '@/utils/logger';
import { Config } from '@/config';
import { setupRoutes } from '@/delivery/http/routes';
// import { setupGraphQL } from '@/delivery/graphql';
// import { setupGRPC } from '@/delivery/grpc';

// Repositories
import { UserRepositoryImpl } from '@/repository/user.repository';
import { SessionRepositoryImpl } from '@/repository/session.repository';
import { RBACRepositoryImpl } from '@/repository/rbac.repository';

// Use Cases
import { LoginUseCase } from '@/usecase/auth/login.usecase';
import { ValidateTokenUseCase } from '@/usecase/auth/validate-token.usecase';
import {LogoutUseCase} from "@/usecase/auth/logout.usecase";
import {RefreshTokenUseCase} from "@/usecase/auth/refresh-token.usecase";

export class Server {
    private httpServer: express.Application;
    private dataSource!: DataSource;
    private redis!: Redis;
    private logger: typeof Logger;

    constructor() {
        this.httpServer = express();
        this.logger = Logger;
    }

    async initialize(): Promise<void> {
        await this.setupDatabase();
        await this.setupRedis();
        await setupContainer(this.dataSource, this.redis); // Use the shared setup function
        // await this.setupDependencyInjection();
    }

    private async setupDatabase(): Promise<void> {
        this.dataSource = new DataSource({
            type: 'postgres',
            url: Config.DATABASE_URL,
            entities: ['src/domain/entities/*.entity.ts'],
            synchronize: false,
            logging: true
        });

        await this.dataSource.initialize();
        this.logger.info('Database connected successfully');
    }

    private async setupRedis(): Promise<void> {
        this.redis = new Redis(Config.REDIS_URL);
        this.logger.info('Redis connected successfully');
    }

    private async setupDependencyInjection(): Promise<void> {
        // Register instances
        container.registerInstance('DataSource', this.dataSource);
        container.registerInstance('Redis', this.redis);
        container.registerInstance('Logger', this.logger);

        // Register repositories
        container.registerSingleton('UserRepository', UserRepositoryImpl);
        container.registerSingleton('SessionRepository', SessionRepositoryImpl);
        container.registerSingleton('RBACRepository', RBACRepositoryImpl);

        // Debug log
        console.log('UserRepository registered:', container.isRegistered('UserRepository'));

        // Register use cases
        container.registerSingleton(LoginUseCase);
        container.registerSingleton(ValidateTokenUseCase);
    }

    async start(): Promise<void> {
        await this.initialize();

        // Setup delivery methods
        await Promise.all([
            this.setupHttp(),
            // this.setupGraphQL(),
            // this.setupGRPC()
        ]);

        this.setupGracefulShutdown();
    }

    private async setupHttp(): Promise<void> {
        const httpPort = Config.HTTP_PORT;

        this.httpServer.use(express.json());
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

    private setupGracefulShutdown(): void {
        const shutdown = async () => {
            this.logger.info('Shutting down...');

            try {
                await this.redis.quit();
                await this.dataSource.destroy();
                this.logger.info('Connections closed');
                process.exit(0);
            } catch (error) {
                this.logger.error('Error during shutdown:', error);
                process.exit(1);
            }
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
}

export async function setupContainer(dataSource: DataSource, redis: Redis): Promise<void> {
    // Pastikan DataSource sudah diinisialisasi
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }

    // Register instances
    container.registerInstance('DataSource', dataSource);
    container.registerInstance('Redis', redis);
    container.registerInstance('Logger', Logger);

    // Register repositories
    container.registerSingleton('UserRepository', UserRepositoryImpl);
    container.registerSingleton('SessionRepository', SessionRepositoryImpl);
    container.registerSingleton('RBACRepository', RBACRepositoryImpl);

    // Register use cases
    container.registerSingleton(LoginUseCase);
    container.registerSingleton(ValidateTokenUseCase);
    container.registerSingleton(LogoutUseCase);
    container.registerSingleton(RefreshTokenUseCase);

    console.log('UserRepository registered:', container.isRegistered('UserRepository'));
}