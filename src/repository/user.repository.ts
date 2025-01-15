import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { User } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';

@injectable()
export class UserRepositoryImpl implements UserRepository {
    private repository: Repository<User>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(User);
    }

    async create(user: User): Promise<User> {
        return await this.repository.save(user);
    }

    async findById(id: number): Promise<User | null> {
        return await this.repository.findOneBy({ id });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOneBy({ email });
    }

    async update(id: number, userData: Partial<User>): Promise<User> {
        await this.repository.update(id, userData);
        return (await this.findById(id))!;
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}