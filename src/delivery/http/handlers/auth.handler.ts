// src/delivery/http/handlers/auth.handler.ts
import { Request, Response } from 'express';
import {inject, injectable} from 'tsyringe';
import { AuthError } from '@/utils/errors';
import { Logger } from '@/utils/logger';
import {AuthUseCase} from "@/domain/usecases/auth.usecase";
import {formatTimeRFC3339} from "@/utils";

@injectable()
export class AuthHandler {
    constructor(
        @inject('AuthUseCase') private authUseCase: AuthUseCase
    ) {}

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const userAgent = req.headers['user-agent'] || '';
            const ipAddress = req.ip || '';

            // Get location from headers or set default
            const latitude = req.headers['x-latitude'] as string || '0';
            const longitude = req.headers['x-longitude'] as string || '0';

            const session = await this.authUseCase.login({
                email,
                password,
                userAgent,
                ipAddress,
                latitude,
                longitude
            });

            res.status(200).json({
                status: 'success',
                data: {
                    accessToken: session.accessToken,
                    accessTokenExpiresAt: session.accessTokenExpiredAt.toISOString(),
                    refreshToken: session.refreshToken,
                    refreshTokenExpiresAt: session.refreshTokenExpiredAt.toISOString(),
                    tokenType: 'Bearer'
                }
            });
        } catch (error) {
            if (error instanceof AuthError) {
                res.status(401).json({
                    status: 'error',
                    message: error.message
                });
                return;
            }

            Logger.error('Error during login:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(400).json({
                    status: 'error',
                    message: 'Token is required'
                });
                return;
            }

            await this.authUseCase.logout(token);

            res.status(200).json({
                status: 'success',
                message: 'Logged out successfully'
            });
        } catch (error) {
            if (error instanceof AuthError) {
                res.status(401).json({
                    status: 'error',
                    message: error.message
                });
                return;
            }

            Logger.error('Error during logout:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({
                    status: 'error',
                    message: 'Refresh token is required'
                });
                return;
            }

            const session = await this.authUseCase.refreshToken(refreshToken);

            res.status(200).json({
                status: 'success',
                data: {
                    accessToken: session.accessToken,
                    refreshToken: session.refreshToken,
                    expiresIn: session.expiresIn,
                    tokenType: 'Bearer'
                }
            });
        } catch (error) {
            if (error instanceof AuthError) {
                res.status(401).json({
                    status: 'error',
                    message: error.message
                });
                return;
            }

            Logger.error('Error during refresh token:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}