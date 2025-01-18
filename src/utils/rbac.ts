// src/utils/rbac.ts
import { Context } from '@/utils/context';
import { AppError } from "@/utils/errors";
import { Role } from "@/utils/constants";
import { Resource } from "@/domain/entities/resource.entity";
import { Action } from "@/domain/entities/action.entity";

export const checkAccess = (resource: string, action: string): void => {
    const user = Context.getUser();
    console.log('Current User:', user); // Debugging

    if (!user) {
        console.error('Unauthorized access attempt'); // Debugging
        throw new AppError('Unauthorized', 401);
    }

    // Jika user adalah internal service, bypass permission check
    if (user.role === Role.INTERNAL_SERVICE) {
        console.log('Internal service call'); // Debugging
        return;
    }

    // Buat instance Resource dan Action untuk pengecekan
    const resourceEntity = new Resource();
    resourceEntity.id = resource;

    const actionEntity = new Action();
    actionEntity.id = action;

    // Gunakan method hasAccess dari User entity
    if (!user.hasAccess(resourceEntity, actionEntity)) {
        console.error(`Permission denied for resource: ${resource}, action: ${action}`); // Debugging
        throw new AppError('Permission denied', 403);
    }
};