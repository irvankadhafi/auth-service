// src/delivery/http/routes/auth.route.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthHandler } from '../handlers/auth.handler';
import { validateLoginRequest, validateRefreshTokenRequest } from '../middlewares/validators/auth.validator';

export const authRouter = Router();

// Delay resolving AuthHandler until the container is ready
const getAuthHandler = () => container.resolve(AuthHandler);

authRouter.post('/login', validateLoginRequest, (req, res) => getAuthHandler().login(req, res));
authRouter.post('/logout', (req, res) => getAuthHandler().logout(req, res));
authRouter.post('/refresh-token', validateRefreshTokenRequest, (req, res) => getAuthHandler().refreshToken(req, res));