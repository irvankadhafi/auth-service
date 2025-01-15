import { User } from '../entities/user.entity';

export interface UserRepository {
    create(user: User): Promise<User>;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: number, user: Partial<User>): Promise<User>;
    delete(id: number): Promise<void>;
}