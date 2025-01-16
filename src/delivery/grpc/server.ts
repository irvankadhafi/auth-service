// src/delivery/grpc/server.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { container } from 'tsyringe';
import { join } from 'path';
import { Logger } from '@/utils/logger';
import { AuthGrpcHandler } from './handlers/auth.handler';
import { Config } from '@/config';

export class GrpcServer {
    private server: grpc.Server;
    private authHandler: AuthGrpcHandler;

    constructor() {
        this.server = new grpc.Server();
        this.authHandler = container.resolve(AuthGrpcHandler);

        console.log('Container registrations:', {
            sessionRepo: container.isRegistered('SessionRepository'),
            authUseCase: container.isRegistered('AuthUseCase')
        });
    }

    async initialize() {
        // Resolve handler after container setup
        this.authHandler = container.resolve(AuthGrpcHandler);

        console.log('GrpcServer initialized with:', {
            authHandler: !!this.authHandler,
            authUseCase: container.isRegistered('AuthUseCase'),
            sessionRepo: container.isRegistered('SessionRepository')
        });
    }

    async start(): Promise<void> {
        await this.initialize();

        const packageDefinition = protoLoader.loadSync(
            join(__dirname, '../../../proto/auth.proto'),
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            }
        );

        const proto = grpc.loadPackageDefinition(packageDefinition);
        // Debug logging untuk melihat service definition
        console.log('Loaded proto service methods:',
            Object.keys((proto as any).auth.AuthService.service));

        const serviceImplementation = {
            findUserById: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
                console.log('findUserById called with request:', call.request);
                return this.authHandler.findUserByID(call, callback);
            },
            authenticateAccessToken: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) =>
                this.authHandler.authenticateAccessToken(call, callback),

            findRolePermission: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) =>
                this.authHandler.findRolePermission(call, callback)
        };

        this.server.addService(
            (proto as any).auth.AuthService.service,
            serviceImplementation
        );

        return new Promise((resolve, reject) => {
            const address = `0.0.0.0:${Config.GRPC_PORT}`;
            this.server.bindAsync(
                address,
                grpc.ServerCredentials.createInsecure(),
                (error, port) => {
                    if (error) {
                        Logger.error('Failed to start gRPC server:', error);
                        reject(error);
                        return;
                    }
                    this.server.start();
                    Logger.info(`gRPC Server listening on ${address}`);
                    resolve();
                }
            );
        });
    }

    async stop(): Promise<void> {
        return new Promise((resolve) => {
            this.server.tryShutdown(() => {
                Logger.info('gRPC Server shutdown complete');
                resolve();
            });
        });
    }
}