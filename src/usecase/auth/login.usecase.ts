import { inject, injectable } from 'tsyringe';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserRepository } from '@/domain/repositories/user.repository';
import { SessionRepository } from '@/domain/repositories/session.repository';
import { RBACRepository } from '@/domain/repositories/rbac.repository';
import { LoginRequest, LoginResponse } from '@/domain/usecases/auth.usecase';
import { Session } from '@/domain/entities/session.entity';
import { AuthError } from '@/utils/errors';

@injectable()
export class LoginUseCase {
    constructor(
        @inject('UserRepository') private userRepo: UserRepository,
        @inject('SessionRepository') private sessionRepo: SessionRepository,
        @inject('RBACRepository') private rbacRepo: RBACRepository
    ) {}

    async execute(req: LoginRequest): Promise<LoginResponse> {
        // Find user
        const user = await this.userRepo.findByEmail(req.email);
        if (!user) {
            throw new AuthError('Invalid email or password');
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(req.password, user.password);
        if (!isValidPassword) {
            throw new AuthError('Invalid email or password');
        }

        // Generate tokens
        const accessToken = randomBytes(32).toString('hex');
        const refreshToken = randomBytes(32).toString('hex');

        // Create session
        const now = new Date();
        const session = new Session();
        session.userId = user.id;
        session.accessToken = accessToken;
        session.refreshToken = refreshToken;
        session.accessTokenExpiredAt = new Date(now.getTime() + 1 * 60 * 60 * 1000); // 1 hour
        session.refreshTokenExpiredAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        session.userAgent = req.userAgent || '';
        session.ipAddress = req.ipAddress || '';
        session.latitude = req.latitude || '';
        session.longitude = req.longitude || '';
        session.createdAt = now;
        session.updatedAt = now;

        await this.sessionRepo.create(session);

        // Load permissions
        const permissions = await this.rbacRepo.loadPermission();

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            expiresIn: session.accessTokenExpiredAt.getTime()
        };
    }
}