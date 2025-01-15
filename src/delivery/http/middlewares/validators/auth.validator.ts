// src/delivery/http/middlewares/validators/auth.validator.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required()
});

export const validateLoginRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await loginSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error instanceof Joi.ValidationError) {
            res.status(400).json({
                status: 'error',
                message: 'Invalid request data',
                errors: error.details // TypeScript sekarang tahu bahwa `error.details` ada
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

export const validateRefreshTokenRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await refreshTokenSchema.validateAsync(req.body);
        next();
    } catch (error) {
        if (error instanceof Joi.ValidationError) {
            res.status(400).json({
                status: 'error',
                message: 'Invalid request data',
                errors: error.details // Sama seperti di atas
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};