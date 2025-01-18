import { Role } from '@/utils/constants';
import {User} from "@/domain/entities/user.entity";

export interface UserUseCase {
    findById(userId: number): Promise<User>;
    createUser(data: { email: string; password: string; role: string }): Promise<User>;
}