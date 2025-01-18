// src/utils/rbac.ts
import { Context } from '@/utils/context';
import {AppError} from "@/utils/errors";
import {Role} from "@/utils/constants";



export const checkAccess = (resource: string, action: string): void => {
    const context = Context.get();
    console.log('Current Context:', context); // Debugging

    if (context?.user?.role == Role.INTERNAL_SERVICE){
        console.error('Internal service call'); // Debugging
        return
    }

    if (!context || !context.user) {
        console.error('Unauthorized access attempt'); // Debugging
        throw new AppError('Unauthorized', 401);
    }

    const { permissions } = context.user;
    const resourcePermissions = permissions.get(resource);

    if (!resourcePermissions || !resourcePermissions.has(action)) {
        console.error(`Permission denied for resource: ${resource}, action: ${action}`); // Debugging
        throw new AppError('Permission denied', 403);
    }
};
