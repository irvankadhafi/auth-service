// src/delivery/http/middlewares/request.logger.ts
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@/utils/logger';

export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    Logger.info(`${req.method} ${req.path}`, {
        body: req.body,
        query: req.query,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });
    next();
};