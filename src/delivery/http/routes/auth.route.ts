// src/delivery/http/routes/auth.route.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthHandler } from '../handlers/auth.handler';
import { validateLoginRequest } from '../middlewares/validators/auth.validator';

export const authRouter = Router();
const authHandler = container.resolve(AuthHandler);

authRouter.post('/login', validateLoginRequest, (req, res) => authHandler.login(req, res));