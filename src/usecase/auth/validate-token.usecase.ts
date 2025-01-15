// src/usecase/auth/validate-token.usecase.ts
import { injectable } from 'tsyringe';
import { SessionRepository } from '@/domain/repositories/session.repository';
import { UserRepository } from '@/domain/repositories/user.repository';
import { RBACRepository } from '@/domain/repositories/rbac.repository';
import { TokenType, Resource, Action } from '@/utils/constants';
import { AuthError } from '@/utils/errors';

interface ValidateTokenResponse {
    userId: number;
    role: string;
    permissions: string[];
}

@injectable()
export class ValidateTokenUseCase {
    constructor(
        private sessionRepository: SessionRepository,
        private userRepository: UserRepository,
        private rbacRepository: RBACRepository
    ) {}

    async execute(token: string): Promise<ValidateTokenResponse> {
        const session = await this.sessionRepository.findByToken(TokenType.ACCESS_TOKEN, token);
        if (!session || session.isAccessTokenExpired()) {
            throw new AuthError('Invalid or expired token');
        }

        const user = await this.userRepository.findById(session.userId);
        if (!user || !user.isActive) {
            throw new AuthError('User not found or inactive');
        }

        const permissions = await this.rbacRepository.getRolePermissions(user.role);

        return {
            userId: user.id,
            role: user.role,
            permissions: permissions.map(p => `${p.resource}:${p.action}`)
        };
    }
}