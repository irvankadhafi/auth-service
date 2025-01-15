import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { LoginUseCase } from '@/usecase/auth/login.usecase';
import { AuthError } from '@/utils/errors';

@injectable()
export class AuthHandler {
    constructor(private loginUseCase: LoginUseCase) {}

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
                    expiresIn: session.accessTokenExpiredAt,
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

            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}