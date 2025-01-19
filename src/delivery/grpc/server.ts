// src/delivery/grpc/server.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { container } from 'tsyringe';
import { join } from 'path';
import { Logger } from '@/utils/logger';
import { AuthGrpcHandler } from './handlers/auth.handler';
import { Config } from '@/config';
import {wrapHandler} from "@/delivery/grpc/utils/handlerWrapper";

import { AuthServiceService, IAuthServiceServer } from '@/proto/auth_service_grpc_pb';

import {
    FindByIdRequest,
    AuthenticateAccessTokenRequest,
    FindRolePermissionRequest,
    RolePermission, AuthenticateAccessTokenResponse,
} from '@/proto/auth_service_pb';

import {
    CreateUserRequest, FindUserByEmailRequest,
    User
} from '@/proto/user_pb';

export class GrpcServer {
    private server: grpc.Server;
    private authHandler!: AuthGrpcHandler;

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

        // Implementasi service
        const serviceImplementation: IAuthServiceServer = {
            findUserById: wrapHandler(
                (call: grpc.ServerUnaryCall<FindByIdRequest, User>, callback: grpc.sendUnaryData<User>) => {
                    console.log('findUserById called with request:', call.request);
                    return this.authHandler.findUserByID(call, callback);
                }
            ),
            createUser: wrapHandler(
                (call: grpc.ServerUnaryCall<CreateUserRequest, User>, callback: grpc.sendUnaryData<User>) => {
                    console.log('createUser called with request:', call.request);
                    // return this.authHandler.createUser(call, callback);
                }
            ),
            findUserByEmail: wrapHandler(
                (call: grpc.ServerUnaryCall<FindUserByEmailRequest, User>, callback: grpc.sendUnaryData<User>) => {
                    console.log('findUserByEmail called with request:', call.request);
                    // return this.authHandler.findUserByEmail(call, callback);
                }
            ),
            authenticateAccessToken: wrapHandler(
                (
                    call: grpc.ServerUnaryCall<AuthenticateAccessTokenRequest, AuthenticateAccessTokenResponse>,
                    callback: grpc.sendUnaryData<AuthenticateAccessTokenResponse>
                ) => {
                    return this.authHandler.authenticateAccessToken(call, callback);
                }
            ),
            findRolePermission: wrapHandler(
                (
                    call: grpc.ServerUnaryCall<FindRolePermissionRequest, RolePermission>,
                    callback: grpc.sendUnaryData<RolePermission>
                ) => {
                    return this.authHandler.findRolePermission(call, callback);
                }
            ),
        };

        // Tambahkan service ke server
        this.server.addService(
            AuthServiceService,
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