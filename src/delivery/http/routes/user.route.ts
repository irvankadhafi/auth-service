import { Router } from 'express';
import { container } from 'tsyringe';
import { UserHandler } from '../handlers/user.handler';
import { authMiddleware} from "@/delivery/http/middlewares/auth.middleware";

export const userRouter = Router();

// Delay resolving UserHandler until the container is ready
const getUserHandler = () => container.resolve(UserHandler);

userRouter.get('/:id', authMiddleware, (req, res,next) => getUserHandler().findUserById(req, res,next));