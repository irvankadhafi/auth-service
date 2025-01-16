import { Role } from '@/utils/constants';

export interface Permission {
    RRA: Map<Role, Array<{ resource: string; action: string }>>;
}

export interface RBACRepository {
    createResource(resource: string): Promise<void>;
    createAction(action: string): Promise<void>;
    createRoleResourceAction(role: Role, resource: string, action: string): Promise<void>;
    loadPermission(): Promise<Permission>;
    hasPermission(role: Role, resource: string, action: string): Promise<boolean>;
    initializeDefaultPermissions(): Promise<void>;
    findPermissionsByRole(role: Role): Promise<Array<{ resource: string; action: string }>>;
}