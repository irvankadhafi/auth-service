// src/usecase/user.usecase.ts
import { inject, injectable } from 'tsyringe';
import { UserRepository } from '@/domain/repositories/user.repository';
import { checkAccess } from '@/utils/rbac';
import {EnumHelper} from "@/utils/enum-helper";
import {User} from "@/domain/entities/user.entity";
import {UserUseCase} from "@/domain/usecases/user.usecase";
import {AppError} from "@/utils/errors";
import {Resource} from "@/domain/entities/resource.entity";
import {DEFAULT_ACTIONS, DEFAULT_RESOURCES} from "@/utils/constants";

@injectable()
export class UserUsecaseImpl implements UserUseCase {
    constructor(
        @inject('UserRepository') private userRepo: UserRepository
    ) {}

    async findById(userId: number): Promise<User> {
        checkAccess(DEFAULT_RESOURCES.USER, DEFAULT_ACTIONS.READ);

        // Fetch user dari repository
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }

    async createUser(data: { email: string; password: string; role: string }): Promise<User> {
        // Periksa akses ke resource "user" dengan action "read"
        checkAccess('user', 'create');

        // Buat instance baru dari User
        const newUser = new User();
        newUser.email = data.email;
        newUser.password = data.password;
        newUser.role = EnumHelper.toRole(data.role);
        newUser.isActive = true;
        newUser.createdAt = new Date();
        newUser.updatedAt = new Date();

        // Buat user baru
        const user = await this.userRepo.create(newUser);

        return user;
    }
}