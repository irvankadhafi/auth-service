// src/rbac/role-permission.ts
import { Role } from "@/utils/constants";
import { Permission } from "@/rbac/permission";
import { Resource } from "@/domain/entities/resource.entity";
import { Action } from "@/domain/entities/action.entity";

export class RolePermission {
    constructor(
        private role: Role,
        private permission: Permission
    ) {}

    hasAccess(resource: Resource, action: Action): boolean {
        // Admin has all permissions
        if (this.role === Role.ADMIN) {
            return true;
        }

        return this.permission.hasAccess(resource, action);
    }
}