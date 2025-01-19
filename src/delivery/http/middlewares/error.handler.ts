import { Request, Response, NextFunction } from 'express';
import { Logger } from '@/utils/logger';
import { AppError, AuthError, PermissionError } from '@/utils/errors';

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
        method: req.method,
    });

    // Menggunakan switch case untuk menangani berbagai jenis error
    switch (true) {
        case err instanceof AuthError:
            res.status(401).json({
                status: 'error',
                message: err.message,
            });
            break;

        case err instanceof AppError:
            res.status(err.statusCode).json({
                status: 'error',
                message: err.message,
            });
            break;

        case err instanceof PermissionError:
            res.status(401).json({
                status: 'error',
                message: err.message,
            });
            break;

        default:
            // Tangani error lainnya sebagai error internal
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            });
            break;
    }
};