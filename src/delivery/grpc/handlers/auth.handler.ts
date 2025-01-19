import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import {inject, injectable} from 'tsyringe';
import { UserRepository } from '@/domain/repositories/user.repository';
import { RBACRepository } from '@/domain/repositories/rbac.repository';
import { Logger } from '@/utils/logger';
import { EnumHelper } from '@/utils/enum-helper';
import { AuthUseCase, UserUseCase } from "@/domain/usecases";
import {User} from "@/proto/user_pb";
import {
    AuthenticateAccessTokenRequest,
    AuthenticateAccessTokenResponse,
    FindByIdRequest,
    FindRolePermissionRequest, Permission
} from "@/proto/auth_service_pb";
import { RolePermission as ProtoRolePermission } from "@/proto/auth_service_pb";
import {RolePermission} from "@/rbac/role-permission";

@injectable()
export class AuthGrpcHandler {
    constructor(
        @inject('AuthUseCase') private readonly authUseCase: AuthUseCase,
        @inject('UserUseCase') private userUseCase: UserUseCase,
        @inject('UserRepository') private userRepo: UserRepository,
        @inject('RBACRepository') private rbacRepo: RBACRepository
    ) {
        console.log('AuthGrpcHandler constructed with:', {
            authUseCase: !!authUseCase,
            userRepo: !!userRepo,
            rbacRepo: !!rbacRepo
        });
    }

    async findUserByID(
        call: ServerUnaryCall<FindByIdRequest, User>,
        callback: sendUnaryData<User>
    ): Promise<void> {
        try {
            const request = call.request as FindByIdRequest;
            const user = await this.userUseCase.findById(request.getId());
            if (!user) {
                callback({
                    code: 5, // NOT_FOUND
                    message: 'User not found'
                });
                return;
            }

            const protoUser = new User();
            protoUser.setId(user.id);
            protoUser.setEmail(user.email);
            protoUser.setRole(user.role);
            const createdAt = user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt);
            const updatedAt = user.updatedAt instanceof Date ? user.updatedAt : new Date(user.updatedAt);

            protoUser.setCreatedAt(createdAt.toISOString());
            protoUser.setUpdatedAt(updatedAt.toISOString());

            // Kirim response
            callback(null, protoUser);
        } catch (error) {
            Logger.error('Error in findUserByID:', error);
            callback({
                code: 13,
                message: 'Internal server error'
            });
        }
    }

    async authenticateAccessToken(
        call: ServerUnaryCall<AuthenticateAccessTokenRequest, AuthenticateAccessTokenResponse>,
        callback: sendUnaryData<AuthenticateAccessTokenResponse>
    ): Promise<void> {
        try {
            // Menggunakan access_token sesuai dengan definisi proto
            const user = await this.authUseCase.validateToken(call.request.getAccessToken());
            if (!user) {
                callback({
                    code: 5, // NOT_FOUND
                    message: 'User not found'
                });
                return;
            }

            const protoUser = new User();
            protoUser.setId(user.id);
            protoUser.setEmail(user.email);
            protoUser.setRole(user.role);
            const createdAt = user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt);
            const updatedAt = user.updatedAt instanceof Date ? user.updatedAt : new Date(user.updatedAt);

            protoUser.setCreatedAt(createdAt.toISOString());
            protoUser.setUpdatedAt(updatedAt.toISOString());

            const response = new AuthenticateAccessTokenResponse();
            response.setUser(protoUser);


            const rolePermission = user.getRolePermission();
            if (!rolePermission) {
                callback({
                    code: 13, // INTERNAL
                    message: 'Role permission not found'
                });
                return;
            }

            const protoRolePermission = new ProtoRolePermission();
            protoRolePermission.setRole(user.role);

            rolePermission.permissions.forEach(perm => {
                const protoPermission = new Permission();
                protoPermission.setResource(perm.resource);
                protoPermission.setAction(perm.action);
                protoRolePermission.addPermissions(protoPermission);
            });

            response.setRolePermission(protoRolePermission);

            // Format response sesuai dengan message User di proto
            callback(null, response);
        } catch (error) {
            Logger.error('Error in authenticateAccessToken:', error);
            callback({
                code: 16, // UNAUTHENTICATED
                message: 'Invalid token'
            });
        }
    }

    async findRolePermission(
        call: ServerUnaryCall<FindRolePermissionRequest, RolePermission>,
        callback: sendUnaryData<any>
    ): Promise<void> {
        try {
            const role = EnumHelper.toRole(call.request.getRole());
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