// src/delivery/http/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { RBACRepository } from '@/domain/repositories/rbac.repository';
import { AuthUseCase } from "@/domain/usecases/auth.usecase";
import { AppError } from '@/utils/error';

export const authorize = (resource: string, action: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new AppError('No token provided', 401);
            }

            const authUseCase = container.resolve<AuthUseCase>('AuthUseCase');
            const rbacRepo = container.resolve<RBACRepository>('RBACRepository');

            // Validate token and get user data
            const tokenData = await authUseCase.validateToken(token);

            // Check permission
            const hasPermission = await rbacRepo.hasPermission(
                tokenData.role,
                resource,
                action
            );

            if (!hasPermission) {
                throw new AppError('Permission denied', 403);
            }

            // Set user data in request
            req.user = {
                userId: tokenData.userId,
                role: tokenData.role,
                permissions: tokenData.permissions
            };

            next();
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    status: 'error',
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    };
};