// src/usecase/auth/refresh-token.usecase.ts
import { inject, injectable } from 'tsyringe';
import { randomBytes } from 'crypto';
import { SessionRepository } from '@/domain/repositories/session.repository';
import { UserRepository } from '@/domain/repositories/user.repository';
import { LoginResponse } from '@/domain/usecases/auth.usecase';
import { Session } from '@/domain/entities/session.entity';
import { AuthError } from '@/utils/errors';
import { TokenType } from '@/utils/constants';

@injectable()
export class RefreshTokenUseCase {
    constructor(
        @inject('SessionRepository') private sessionRepo: SessionRepository,
        @inject('UserRepository') private userRepo: UserRepository
    ) {}

    async execute(refreshToken: string): Promise<LoginResponse> {
        // Find session by refresh token
        const oldSession = await this.sessionRepo.findByToken(TokenType.REFRESH_TOKEN, refreshToken);
        if (!oldSession) {
            throw new AuthError('Invalid refresh token');
        }

        // Generate new tokens
        const accessToken = randomBytes(32).toString('hex');
        const newRefreshToken = randomBytes(32).toString('hex');

        // Create new session
        const now = new Date();
        const newSession = new Session();
        newSession.userId = oldSession.userId;
        newSession.accessToken = accessToken;
        newSession.refreshToken = newRefreshToken;
        newSession.accessTokenExpiredAt = new Date(now.getTime() + 1 * 60 * 60 * 1000);
        newSession.refreshTokenExpiredAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        newSession.userAgent = oldSession.userAgent;
        newSession.ipAddress = oldSession.ipAddress;
        newSession.latitude = oldSession.latitude;
        newSession.longitude = oldSession.longitude;
        newSession.createdAt = now;
        newSession.updatedAt = now;

        // Refresh session
        await this.sessionRepo.refreshToken(oldSession, newSession);

        // Get user data
        const user = await this.userRepo.findById(oldSession.userId);
        if (!user) {
            throw new AuthError('User not found');
        }

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            expiresIn: newSession.accessTokenExpiredAt.getTime()
        };
    }
}