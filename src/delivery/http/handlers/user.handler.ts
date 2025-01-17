import { Request, Response } from 'express';
import {inject, injectable} from 'tsyringe';
import { AuthError } from '@/utils/errors';
import { Logger } from '@/utils/logger';
import {UserUseCase} from "@/domain/usecases/user.usecase";

@injectable()
export class UserHandler {
    constructor(
        @inject('UserUseCase') private userUseCase: UserUseCase
    ) {}


    async findUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);
            const user = await this.userUseCase.findById(userId);

            res.status(200).json({
                status: 'success',
                data: {
                    user: user
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

            Logger.error('Error during find user by id:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}