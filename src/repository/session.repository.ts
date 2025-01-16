// src/repository/session.repository.ts
import {inject, injectable} from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { Redis } from 'ioredis';
import { Session } from '@/domain/entities/session.entity';
import { SessionRepository } from '@/domain/repositories/session.repository';
import { TokenType } from '@/utils/constants';

@injectable()
export class SessionRepositoryImpl implements SessionRepository {
    private repository: Repository<Session>;

    constructor(
        @inject('DataSource') private dataSource: DataSource,
        @inject('Redis') private redis: Redis
    ) {
        if (!dataSource.isInitialized) {
            throw new Error('DataSource is not initialized');
        }
        this.repository = dataSource.getRepository(Session);
    }

    async create(session: Session): Promise<Session> {
        const savedSession = await this.repository.save(session);
        await this.cacheSession(savedSession);
        return savedSession;
    }

    async findByToken(tokenType: TokenType, token: string): Promise<Session | null> {
        console.log(`SessionRepositoryImpl.findByToken called with type: ${tokenType}, token: ${token}`);

        const cacheKey = Session.newSessionTokenCacheKey(token);

        // Try to get from cache first
        const cachedSession = await this.redis.get(cacheKey);
        if (cachedSession) {
            const sessionData = JSON.parse(cachedSession);
            return this.transformToSessionEntity(sessionData);
        }

        const session = await this.repository.findOne({
            where: tokenType === TokenType.ACCESS_TOKEN
                ? { accessToken: token }
                : { refreshToken: token }
        });

        if (session) {
            // Cache the session
            await this.cacheSession(session);
            return this.transformToSessionEntity(session);
        }

        return session;
    }

    private transformToSessionEntity(data: any): Session {
        const session = new Session();
        Object.assign(session, {
            id: data.id,
            userId: data.userId,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            accessTokenExpiredAt: new Date(data.accessTokenExpiredAt),
            refreshTokenExpiredAt: new Date(data.refreshTokenExpiredAt),
            userAgent: data.userAgent,
            latitude: data.latitude,
            longitude: data.longitude,
            ipAddress: data.ipAddress,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            role: data.role
        });
        return session;
    }

    private async cacheSession(session: Session): Promise<void> {
        const cacheKey = Session.newSessionTokenCacheKey(session.accessToken);
        await this.redis.set(cacheKey, JSON.stringify(session), 'EX', 3600); // 1 hour
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
        const cacheKey = Session.newSessionTokenCacheKeyByID(id);
        await this.redis.del(cacheKey);
    }

    async deleteByUserId(userId: number): Promise<void> {
        const sessions = await this.repository.find({ where: { userId } });
        for (const session of sessions) {
            await this.delete(session.id);
        }
    }

    async findById(id: number): Promise<Session | null> {
        const cacheKey = Session.newSessionTokenCacheKeyByID(id);
        const cachedSession = await this.redis.get(cacheKey);

        if (cachedSession) {
            return JSON.parse(cachedSession);
        }

        const session = await this.repository.findOne({
            where: { id: id }
        });

        if (session) {
            await this.cacheSession(session);
        }

        return session;
    }

    async findByUserId(userId: number): Promise<Session[]> {
        return await this.repository.find({ where: { userId } });
    }

    // Implementasi refreshToken
    async refreshToken(oldSession: Session, newSession: Session): Promise<void> {
        // Hapus sesi lama
        await this.delete(oldSession.id);

        // Simpan sesi baru
        await this.create(newSession);
    }
}