// src/rbac/permission.ts
import { Resource } from "@/domain/entities/resource.entity";
import { Action } from "@/domain/entities/action.entity";
import { Role } from "@/utils/constants";
import { Context } from "@/utils/context";

export class Permission {
    constructor(
        private resourceActions: Map<Role, Array<{ resource: string; action: string }>>
    ) {}

    hasAccess(resource: Resource, action: Action): boolean {
        const role = Context.getUser()?.role;
        if (!role) return false;

        const rolePermissions = this.resourceActions.get(role);
        if (!rolePermissions) return false;

        return rolePermissions.some(
            (perm) => perm.resource === resource.id && perm.action === action.id
        );
    }
}