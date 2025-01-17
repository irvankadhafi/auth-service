// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { AuthUseCase } from '@/domain/usecases/auth.usecase';
import { RBACRepository } from '@/domain/repositories/rbac.repository';
import { Context } from '@/utils/context';
import { AppError } from '@/utils/error';
import {UserUseCase} from "@/domain/usecases/user.usecase";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new AppError('No token provided', 401);
        }

        const authUseCase = container.resolve<AuthUseCase>('AuthUseCase');
        const userUseCase = container.resolve<UserUseCase>('UserUseCase');
        const rbacRepo = container.resolve<RBACRepository>('RBACRepository');

        // Validasi token dan dapatkan user data
        const tokenData = await authUseCase.validateToken(token);

        // Muat permissions berdasarkan role
        const permissions = await rbacRepo.findPermissionsByRole(tokenData.role);

        // Transform permissions ke Map<Resource, Set<Action>>
        const permissionMap = new Map<string, Set<string>>();
        permissions.forEach(({ resource, action }) => {
            if (!permissionMap.has(resource)) {
                permissionMap.set(resource, new Set());
            }
            permissionMap.get(resource)!.add(action);
        });

        // Simpan ke AsyncLocalStorage
        Context.run(
            {
                user: {
                    userId: tokenData.userId,
                    role: tokenData.role,
                    permissions: permissionMap,
                },
            },
            next
        );
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
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