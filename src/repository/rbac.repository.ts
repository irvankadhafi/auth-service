// src/repository/rbac.repository.ts
import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { Redis } from 'ioredis';
import {DEFAULT_ACTIONS, DEFAULT_RESOURCES, Role} from '@/utils/constants';
import { Resource } from '@/domain/entities/resource.entity';
import { Action } from '@/domain/entities/action.entity';
import { RoleResourceAction } from '@/domain/entities/roleResourceAction.entity';
import { RBACRepository, Permission } from '@/domain/repositories/rbac.repository';

@injectable()
export class RBACRepositoryImpl implements RBACRepository {
    private resourceRepo: Repository<Resource>;
    private actionRepo: Repository<Action>;
    private rraRepo: Repository<RoleResourceAction>;
    private RBAC_PERMISSION_CACHE_KEY = 'cache:object:rbac:permission';

    constructor(
        dataSource: DataSource,
        private redis: Redis
    ) {
        this.resourceRepo = dataSource.getRepository(Resource);
        this.actionRepo = dataSource.getRepository(Action);
        this.rraRepo = dataSource.getRepository(RoleResourceAction);
    }

    async createResource(resource: string): Promise<void> {
        const res = new Resource();
        res.id = resource;
        await this.resourceRepo.save(res);
        await this.redis.del(this.RBAC_PERMISSION_CACHE_KEY);
    }

    async createAction(action: string): Promise<void> {
        const act = new Action();
        act.id = action;
        await this.actionRepo.save(act);
        await this.redis.del(this.RBAC_PERMISSION_CACHE_KEY);
    }

    async createRoleResourceAction(role: Role, resource: string, action: string): Promise<void> {
        const rra = new RoleResourceAction();
        rra.role = role;
        rra.resource = resource;
        rra.action = action;
        await this.rraRepo.save(rra);
        await this.redis.del(this.RBAC_PERMISSION_CACHE_KEY);
    }

    async loadPermission(): Promise<Permission> {
        const cachedPermission = await this.redis.get(this.RBAC_PERMISSION_CACHE_KEY);
        if (cachedPermission) {
            return JSON.parse(cachedPermission);
        }

        const permissions = await this.rraRepo.find();
        const permissionMap = new Map<Role, Array<{ resource: string; action: string }>>();

        permissions.forEach(permission => {
            const rolePermissions = permissionMap.get(permission.role) || [];
            rolePermissions.push({
                resource: permission.resource,
                action: permission.action
            });
            permissionMap.set(permission.role, rolePermissions);
        });

        const permission: Permission = {
            RRA: permissionMap
        };

        await this.redis.set(
            this.RBAC_PERMISSION_CACHE_KEY,
            JSON.stringify(permission),
            'EX',
            3600
        );

        return permission;
    }

    async hasPermission(role: Role, resource: string, action: string): Promise<boolean> {
        const permission = await this.loadPermission();
        const rolePermissions = permission.RRA.get(role) || [];

        return rolePermissions.some(
            rra => rra.resource === resource && rra.action === action
        );
    }

    async initializeDefaultPermissions(): Promise<void> {
        // Create default resources
        for (const resource of Object.values(DEFAULT_RESOURCES)) {
            await this.createResource(resource);
        }

        // Create default actions
        for (const action of Object.values(DEFAULT_ACTIONS)) {
            await this.createAction(action);
        }

        // Create default role-resource-actions
        const defaultPermissions = [
            // Admin permissions
            { role: Role.ADMIN, resource: DEFAULT_RESOURCES.USER, action: DEFAULT_ACTIONS.CREATE },
            { role: Role.ADMIN, resource: DEFAULT_RESOURCES.USER, action: DEFAULT_ACTIONS.READ },
            { role: Role.ADMIN, resource: DEFAULT_RESOURCES.USER, action: DEFAULT_ACTIONS.UPDATE },
            { role: Role.ADMIN, resource: DEFAULT_RESOURCES.USER, action: DEFAULT_ACTIONS.DELETE },

            // Manager permissions
            { role: Role.MANAGER, resource: DEFAULT_RESOURCES.EMPLOYEE, action: DEFAULT_ACTIONS.READ },
            { role: Role.MANAGER, resource: DEFAULT_RESOURCES.ATTENDANCE, action: DEFAULT_ACTIONS.READ },
            { role: Role.MANAGER, resource: DEFAULT_RESOURCES.ATTENDANCE, action: DEFAULT_ACTIONS.APPROVE },
            { role: Role.MANAGER, resource: DEFAULT_RESOURCES.ATTENDANCE, action: DEFAULT_ACTIONS.REJECT },

            // Employee permissions
            { role: Role.EMPLOYEE, resource: DEFAULT_RESOURCES.ATTENDANCE, action: DEFAULT_ACTIONS.SUBMIT },
            { role: Role.EMPLOYEE, resource: DEFAULT_RESOURCES.ATTENDANCE, action: DEFAULT_ACTIONS.READ },
        ];

        for (const perm of defaultPermissions) {
            await this.createRoleResourceAction(perm.role, perm.resource, perm.action);
        }
    }
}