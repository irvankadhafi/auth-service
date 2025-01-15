// src/delivery/http/middlewares/error.handler.ts
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@/utils/logger';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    Logger.error('Error handling request:', err);

    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};