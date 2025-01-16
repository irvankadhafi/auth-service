// src/delivery/grpc/handlers/auth.handler.ts
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import {inject, injectable} from 'tsyringe';
import { ValidateTokenUseCase } from '@/usecase/auth/validate-token.usecase';
import { UserRepository } from '@/domain/repositories/user.repository';
import { RBACRepository } from '@/domain/repositories/rbac.repository';
import { Logger } from '@/utils/logger';
import { EnumHelper } from '@/utils/enum-helper';
import {request} from "express";

@injectable()
export class AuthGrpcHandler {
    constructor(
        @inject(ValidateTokenUseCase) private validateTokenUseCase: ValidateTokenUseCase,
        @inject('UserRepository') private userRepo: UserRepository,
        @inject('RBACRepository') private rbacRepo: RBACRepository
    ) {}

    async findUserByID(
        call: ServerUnaryCall<{ id: number }, any>,
        callback: sendUnaryData<any>
    ): Promise<void> {
        try {
            const user = await this.userRepo.findById(call.request.id);
            if (!user) {
                callback({
                    code: 5, // NOT_FOUND
                    message: 'User not found'
                });
                return;
            }

            callback(null, {
                id: user.id,
                email: user.email,
                role: user.role,
                created_at: user.createdAt.toISOString(),
                updated_at: user.updatedAt.toISOString()
            });
        } catch (error) {
            Logger.error('Error in findUserByID:', error);
            callback({
                code: 13,
                message: 'Internal server error'
            });
        }
    }

    async authenticateAccessToken(
        call: ServerUnaryCall<{ access_token: string }, any>,
        callback: sendUnaryData<any>
    ): Promise<void> {
        try {
            console.log({call});
            // Menggunakan access_token sesuai dengan definisi proto
            const result = await this.validateTokenUseCase.execute(call.request.access_token);

            // Ambil data user
            const user = await this.userRepo.findById(result.userId);
            if (!user) {
                callback({
                    code: 5, // NOT_FOUND
                    message: 'User not found'
                });
                return;
            }

            // Format response sesuai dengan message User di proto
            callback(null, {
                id: user.id,
                email: user.email,
                role: user.role,
                created_at: user.createdAt.toISOString(),
                updated_at: user.updatedAt.toISOString()
            });
        } catch (error) {
            Logger.error('Error in authenticateAccessToken:', error);
            callback({
                code: 16, // UNAUTHENTICATED
                message: 'Invalid token'
            });
        }
    }

    async findRolePermission(
        call: ServerUnaryCall<{ role: string }, any>,
        callback: sendUnaryData<any>
    ): Promise<void> {
        try {
            const role = EnumHelper.toRole(call.request.role);
            const permissions = await this.rbacRepo.loadPermission();
            const rolePermissions = permissions.RRA.get(role);

            if (!rolePermissions) {
                callback({
                    code: 5,
                    message: 'Permissions not found for role'
                });
                return;
            }

            callback(null, {
                role: role,
                permissions: rolePermissions
            });
        } catch (error) {
            Logger.error('Error in findRolePermission:', error);
            callback({
                code: 13,
                message: 'Internal server error'
            });
        }
    }
}