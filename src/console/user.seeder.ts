// src/console/user.seeder.ts
import 'reflect-metadata'; // Tambahkan ini di baris paling atas
import { Command } from 'commander';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { Logger } from '@/utils/logger';
import { Config } from '@/config';
import { Role } from '@/utils/constants';
import { UserRepository } from '@/domain/repositories/user.repository';
import { UserRepositoryImpl } from '@/repository/user.repository';
import { User } from '@/domain/entities/user.entity';
import bcrypt from 'bcrypt';
import { setupContainer } from './server';
import Redis from 'ioredis';

export const userSeederCommand = new Command('seed:user')
    .description('Seed default users for testing')
    .action(async () => {
        console.log('userSeederCommand is running...'); // Tambahkan ini
        try {
            Logger.info('Starting user seeder...');

            // Initialize database connection
            const dataSource = new DataSource({
                type: 'postgres',
                url: Config.DATABASE_URL,
                entities: ['src/domain/entities/*.entity.ts'],
                synchronize: false,
                logging: true
            });

            await dataSource.initialize();
            Logger.info('Database connected successfully');

            // Initialize Redis
            const redis = new Redis(Config.REDIS_URL);
            Logger.info('Redis connected successfully');

            // Setup dependency injection
            await setupContainer(dataSource, redis);

            // Resolve UserRepository
            const userRepo = container.resolve<UserRepository>('UserRepository');

            // Define users to seed
            const usersToSeed = [
                {
                    email: 'admin@example.com',
                    password: 'password123',
                    role: Role.ADMIN
                },
                {
                    email: 'manager@example.com',
                    password: 'password123',
                    role: Role.MANAGER
                },
                {
                    email: 'employee@example.com',
                    password: 'password123',
                    role: Role.EMPLOYEE
                }
            ];

            // Seed users
            for (const userData of usersToSeed) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const user = new User();
                user.email = userData.email;
                user.password = hashedPassword;
                user.role = userData.role;

                try {
                    await userRepo.create(user);
                    Logger.info(`Seeded user: ${userData.email} with role: ${userData.role}`);
                } catch (error) {
                    Logger.warn(`User ${userData.email} might already exist:`, error);
                }
            }

            Logger.info('User seeder completed successfully!');

            // Cleanup connections
            await redis.quit();
            await dataSource.destroy();
            process.exit(0);
        } catch (error) {
            Logger.error('User seeder failed:', error);
            process.exit(1);
        }
    });