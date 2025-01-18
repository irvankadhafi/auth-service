import {NextFunction, Request, Response} from 'express';
import {inject, injectable} from 'tsyringe';
import {UserUseCase} from "@/domain/usecases/user.usecase";

@injectable()
export class UserHandler {
    constructor(
        @inject('UserUseCase') private userUseCase: UserUseCase
    ) {}


    async findUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
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
            next(error);
        }
    }
}