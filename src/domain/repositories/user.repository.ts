// src/domain/repositories/user.repository.ts
import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { AppDataSource } from '@/config/database';
import { User, UserRole } from '../entities/user.entity';

@injectable()
export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async create(email: string, password: string, fullName: string, role: UserRole = 'MEMBER'): Promise<User> {
        const user = new User(email, password, fullName, role);
        return this.repository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | null> {
        return this.repository.findOne({ where: { id } });
    }

    async update(id: number, data: Partial<Pick<User, 'email' | 'password' | 'fullName' | 'role'>>): Promise<User | null> {
        await this.repository.update(id, data);
        return this.findById(id);
    }
}