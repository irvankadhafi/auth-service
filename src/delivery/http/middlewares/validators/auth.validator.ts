import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
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
        res.status(400).json({
            status: 'error',
            message: 'Invalid request data',
            errors: error.details
        });
    }
};