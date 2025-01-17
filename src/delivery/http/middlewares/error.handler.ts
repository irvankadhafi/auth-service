// src/delivery/http/middlewares/error.handler.ts
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@/utils/logger';
import {AppError} from "@/utils/error";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    Logger.error('Error handling request:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
        return;
    }

    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};