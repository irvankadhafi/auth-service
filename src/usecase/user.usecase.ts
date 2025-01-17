// src/usecase/user.usecase.ts
import { inject, injectable } from 'tsyringe';
import { UserRepository } from '@/domain/repositories/user.repository';
import { checkAccess } from '@/utils/rbac';
import { AppError } from '@/utils/error';
import {EnumHelper} from "@/utils/enum-helper";
import {User} from "@/domain/entities/user.entity";
import {UserUseCase} from "@/domain/usecases/user.usecase";

@injectable()
export class UserUsecaseImpl implements UserUseCase {
    constructor(
        @inject('UserRepository') private userRepo: UserRepository
    ) {}

    async findById(userId: number): Promise<User> {
        // Cek akses ke resource "user" dengan action "read"
        checkAccess('user', 'read');

        // Fetch user dari repository
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }

    async createUser(data: { email: string; password: string; role: string }): Promise<User> {
        // Cek akses ke resource "user" dengan action "create"
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