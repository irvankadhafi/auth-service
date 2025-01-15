// import { Role, Resource, Action } from '@/utils/constants';
// import { RoleResourceAction } from '../entities/role-resource-action.entity';
//
// export interface RBACRepository {
//     createPermission(rra: RoleResourceAction): Promise<void>;
//     hasPermission(role: Role, resource: Resource, action: Action): Promise<boolean>;
//     getRolePermissions(role: Role): Promise<RoleResourceAction[]>;
//     loadPermission(): Promise<{ RRA: Map<Role, Array<{ Resource: Resource; Action: Action }>> }>;
//     initializeDefaultPermissions(): Promise<void>;
// }
//
// // src/domain/repositories/rbac.repository.ts
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
}