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
    }

    async start(): Promise<void> {
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

        const serviceImplementation = {
            findUserByID: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) =>
                this.authHandler.findUserByID(call, callback),

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