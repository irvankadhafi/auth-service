// src/config/container.ts
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { Redis } from 'ioredis';
import { UserRepository } from '@/domain/repositories/user.repository';
import { UserRepositoryImpl } from '@/repository/user.repository';
import { SessionRepository } from '@/domain/repositories/session.repository';
import { SessionRepositoryImpl } from '@/repository/session.repository';
import { RBACRepository } from '@/domain/repositories/rbac.repository';
import { RBACRepositoryImpl } from '@/repository/rbac.repository';
import { LoginUseCase } from '@/usecase/auth/login.usecase';
import { ValidateTokenUseCase } from '@/usecase/auth/validate-token.usecase';

export function setupContainer() {
    // Database
    const dataSource = new DataSource({
        // database configuration
    });

    // Redis
    const redis = new Redis({
        // redis configuration
    });

    // Repositories
    container.registerInstance('DataSource', dataSource);
    container.registerInstance('Redis', redis);
    container.registerSingleton<UserRepository>('UserRepository', UserRepositoryImpl);
    container.registerSingleton<SessionRepository>('SessionRepository', SessionRepositoryImpl);
    container.registerSingleton<RBACRepository>('RBACRepository', RBACRepositoryImpl);

    // Use Cases
    container.registerSingleton(LoginUseCase);
    container.registerSingleton(ValidateTokenUseCase);
}