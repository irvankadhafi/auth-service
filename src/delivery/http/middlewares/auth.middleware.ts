// src/delivery/http/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { AuthUseCase } from '@/domain/usecases/auth.usecase';
import { RBACRepository } from '@/domain/repositories/rbac.repository';
import { Context } from '@/utils/context';
import { AppError, AuthError } from '@/utils/errors';
import { User } from '@/domain/entities/user.entity';
import { Role } from '@/utils/constants';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new AppError('No token provided', 401);
        }

        const authUseCase = container.resolve<AuthUseCase>('AuthUseCase');
        const rbacRepo = container.resolve<RBACRepository>('RBACRepository');

        // Validasi token dan dapatkan user data
        const tokenData = await authUseCase.validateToken(token);

        // Muat permissions berdasarkan role
        const permissions = await rbacRepo.findPermissionsByRole(tokenData.role);

        // Transform permissions ke Map<Role, Array<{ resource: string; action: string }>>
        const permissionMap = new Map<Role, Array<{ resource: string; action: string }>>();
        permissions.forEach(({ resource, action }) => {
            const rolePermissions = permissionMap.get(tokenData.role) || [];
            rolePermissions.push({ resource, action });
            permissionMap.set(tokenData.role, rolePermissions);
        });

        // Buat instance User dan set permissions
        const user = new User();
        user.id = tokenData.userId;
        user.role = tokenData.role;
        user.setPermission({ RRA: permissionMap });

        // Simpan ke AsyncLocalStorage
        Context.run({ user }, next);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                status: 'error',
                message: error.message,
            });
            return;
        }

        if (error instanceof AuthError) {
            res.status(300).json({
                status: 'error',
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};