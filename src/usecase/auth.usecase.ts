import {AuthUseCase, LoginRequest, LoginResponse, ValidateTokenResponse} from "@/domain/usecases/auth.usecase";
import {inject, injectable} from "tsyringe";
import {UserRepository} from "@/domain/repositories/user.repository";
import {SessionRepository} from "@/domain/repositories/session.repository";
import {RBACRepository} from "@/domain/repositories/rbac.repository";
import {AuthError} from "@/utils/errors";
import bcrypt from "bcrypt";
import {randomBytes} from "crypto";
import {Session} from "@/domain/entities/session.entity";
import {TokenType} from "@/utils/constants";

@injectable()
export class AuthUseCaseImpl implements AuthUseCase {
    constructor(
        @inject('UserRepository') private userRepo: UserRepository,
        @inject('SessionRepository') private sessionRepo: SessionRepository,
        @inject('RBACRepository') private rbacRepo: RBACRepository
    ) {}

    async login(req: LoginRequest): Promise<LoginResponse> {
        // Find user
        const user = await this.userRepo.findByEmail(req.email);
        if (!user) {
            throw new AuthError('Invalid email or password');
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(req.password, user.password).catch(() => false);
        if (!isValidPassword) {
            throw new AuthError('Invalid email or password');
        }

        // Validate latitude and longitude
        const latitude = req.latitude || '0';
        const longitude = req.longitude || '0';
        if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
            throw new AuthError('Invalid location data');
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
        session.latitude = latitude;
        session.longitude = longitude;
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
                role: user.role,
            },
            expiresIn: session.accessTokenExpiredAt.getTime(),
        };
    }

    async logout(token: string): Promise<void> {
        const session = await this.sessionRepo.findByToken(TokenType.ACCESS_TOKEN, token);
        if (!session) {
            throw new AuthError('Invalid token');
        }

        await this.sessionRepo.delete(session.id);
    }

    async refreshToken(refreshToken: string): Promise<LoginResponse> {
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

    async validateToken(token: string): Promise<ValidateTokenResponse> {
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