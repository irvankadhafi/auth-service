// src/utils/rbac.ts
import { Context } from '@/utils/context';
import { AppError } from '@/utils/error';

export const checkAccess = (resource: string, action: string): void => {
    const context = Context.get();
    if (!context || !context.user) {
        throw new AppError('Unauthorized', 401);
    }

    const { permissions } = context.user;
    const resourcePermissions = permissions.get(resource);

    if (!resourcePermissions || !resourcePermissions.has(action)) {
        throw new AppError('Permission denied', 403);
    }
};