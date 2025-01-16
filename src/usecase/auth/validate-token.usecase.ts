import {inject, injectable} from 'tsyringe';
import {SessionRepository} from '@/domain/repositories/session.repository';
import {RBACRepository} from '@/domain/repositories/rbac.repository';
import {ValidateTokenResponse} from '@/domain/usecases/auth.usecase';
import {AuthError} from '@/utils/errors';
import {TokenType} from "@/utils/constants";

@injectable()
export class ValidateTokenUseCase {
    constructor(
        @inject('SessionRepository') private sessionRepo: SessionRepository,
        @inject('RBACRepository') private rbacRepo: RBACRepository
    ) {
        console.log('ValidateTokenUseCase constructed with:', {
            sessionRepo: !!sessionRepo,
            rbacRepo: !!rbacRepo
        });
    }

    async execute(token: string): Promise<ValidateTokenResponse> {
        console.log('Executing ValidateTokenUseCase with token:', token);
        const session = await this.sessionRepo.findByToken(TokenType.ACCESS_TOKEN, token);
        if (!session) {
            throw new AuthError('Invalid token');
        }

        // Check if token is expired
        if (session.isAccessTokenExpired()) {
            throw new AuthError('Token expired');
        }

        // Load user permissions
        const permissions = await this.rbacRepo.loadPermission();
        const userPermissions = permissions.RRA.get(session.role) || [];

        // Transform permissions to map for easier access
        const permissionMap = new Map<string, string[]>();
        userPermissions.forEach(({ resource, action }) => {
            const actions = permissionMap.get(resource) || [];
            actions.push(action);
            permissionMap.set(resource, actions);
        });

        return {
            userId: session.userId,
            role: session.role,
            permissions: permissionMap
        };
    }
}