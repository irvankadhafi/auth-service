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

        // Simpan ke AsyncLocalStorage
        Context.run({ user: tokenData }, next);
    } catch (error) {
       next(error);
    }
};