// src/console/migrate-rbac.ts
import { Command } from 'commander';
import { container } from 'tsyringe';
import { Logger } from '@/utils/logger';
import { Role, DEFAULT_RESOURCES, DEFAULT_ACTIONS } from '@/utils/constants';
import { RBACRepository } from '@/domain/repositories/rbac.repository';
import { DataSource } from 'typeorm';
import { Config } from '@/config';
import Redis from 'ioredis';
import { setupContainer } from './server';

export const migrateRBACCommand = new Command('migrate:rbac')
    .description('Migrate RBAC default permissions')
    .action(async () => {
        try {
            Logger.info('Starting RBAC migration...');

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

            // Resolve RBACRepository
            const rbacRepo = container.resolve<RBACRepository>('RBACRepository');

            // Create resources
            Logger.info('Creating resources...');
            for (const resource of Object.values(DEFAULT_RESOURCES)) {
                await rbacRepo.createResource(resource);
                Logger.info(`Created resource: ${resource}`);
            }

            // Create actions
            Logger.info('Creating actions...');
            for (const action of Object.values(DEFAULT_ACTIONS)) {
                await rbacRepo.createAction(action);
                Logger.info(`Created action: ${action}`);
            }

            // Create default permissions
            Logger.info('Creating role-resource-action mappings...');

            // Admin permissions (all access)
            for (const resource of Object.values(DEFAULT_RESOURCES)) {
                for (const action of Object.values(DEFAULT_ACTIONS)) {
                    await rbacRepo.createRoleResourceAction(Role.ADMIN, resource, action);
                    Logger.info(`Created permission: ${Role.ADMIN} - ${resource} - ${action}`);
                }
            }

            // Manager permissions
            const managerPermissions = [
                { resource: DEFAULT_RESOURCES.EMPLOYEE, action: DEFAULT_ACTIONS.READ },
                { resource: DEFAULT_RESOURCES.ATTENDANCE, action: DEFAULT_ACTIONS.READ },
                { resource: DEFAULT_RESOURCES.ATTENDANCE, action: DEFAULT_ACTIONS.APPROVE },
                { resource: DEFAULT_RESOURCES.ATTENDANCE, action: DEFAULT_ACTIONS.REJECT },
                { resource: DEFAULT_RESOURCES.REPORT, action: DEFAULT_ACTIONS.READ }
            ];

            for (const perm of managerPermissions) {
                await rbacRepo.createRoleResourceAction(Role.MANAGER, perm.resource, perm.action);
                Logger.info(`Created permission: ${Role.MANAGER} - ${perm.resource} - ${perm.action}`);
            }

            // Employee permissions
            const employeePermissions = [
                { resource: DEFAULT_RESOURCES.ATTENDANCE, action: DEFAULT_ACTIONS.SUBMIT },
                { resource: DEFAULT_RESOURCES.ATTENDANCE, action: DEFAULT_ACTIONS.READ }
            ];

            for (const perm of employeePermissions) {
                await rbacRepo.createRoleResourceAction(Role.EMPLOYEE, perm.resource, perm.action);
                Logger.info(`Created permission: ${Role.EMPLOYEE} - ${perm.resource} - ${perm.action}`);
            }

            Logger.info('RBAC migration completed successfully!');

            // Cleanup connections
            await redis.quit();
            await dataSource.destroy();
            process.exit(0);
        } catch (error) {
            Logger.error('RBAC migration failed:', error);
            process.exit(1);
        }
    });