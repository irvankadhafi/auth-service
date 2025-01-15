// src/delivery/http/handlers/auth.handler.ts
import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { LoginUseCase } from '@/usecase/auth/login.usecase';
import { LogoutUseCase } from '@/usecase/auth/logout.usecase';
import { RefreshTokenUseCase } from '@/usecase/auth/refresh-token.usecase';
import { AuthError } from '@/utils/errors';
import { Logger } from '@/utils/logger';

@injectable()
export class AuthHandler {
    constructor(
        private loginUseCase: LoginUseCase,
        private logoutUseCase: LogoutUseCase,
        private refreshTokenUseCase: RefreshTokenUseCase
    ) {}

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const userAgent = req.headers['user-agent'] || '';
            const ipAddress = req.ip || '';

            // Get location from headers or set default
            const latitude = req.headers['x-latitude'] as string || '0';
            const longitude = req.headers['x-longitude'] as string || '0';

            const session = await this.loginUseCase.execute({
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

            await this.logoutUseCase.execute(token);

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

            const session = await this.refreshTokenUseCase.execute(refreshToken);

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