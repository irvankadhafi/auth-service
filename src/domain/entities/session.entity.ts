// src/domain/entities/session.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'user_id' })
    userId!: number;

    @Column({ name: 'access_token', unique: true })
    accessToken!: string;

    @Column({ name: 'refresh_token', unique: true })
    refreshToken!: string;

    @Column({ name: 'access_token_expired_at' })
    accessTokenExpiredAt!: Date;

    @Column({ name: 'refresh_token_expired_at' })
    refreshTokenExpiredAt!: Date;

    @Column({ name: 'user_agent' })
    userAgent!: string;

    @Column()
    latitude!: string;

    @Column()
    longitude!: string;

    @Column({ name: 'ip_address' })
    ipAddress!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    isAccessTokenExpired(): boolean {
        return new Date() > this.accessTokenExpiredAt;
    }

    static newSessionTokenCacheKey(token: string): string {
        return `cache:id:session_token:${token}`;
    }

    static newSessionTokenCacheKeyByID(id: number): string {
        return `cache:object:session:id:${id}`;
    }
}