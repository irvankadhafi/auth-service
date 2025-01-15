// src/delivery/http/routes/index.ts
import { Router } from 'express';
import { authRouter } from './auth.route';
import { errorHandler } from '../middlewares/error.handler';
import { requestLogger } from '../middlewares/request.logger';

export const setupRoutes = (app: Router): void => {
    // Middlewares
    app.use(requestLogger);

    // Routes
    app.use('/api/v1/auth', authRouter);

    // Error Handler
    app.use(errorHandler);
};