import { User } from '../entities/user.entity';
import {Role} from "@/utils/constants";

export interface UserRepository {
    create(user: User): Promise<User>;
    findById(id: number): Promise<User | null>;
    findUsersWithRole(role: Role): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    update(id: number, user: Partial<User>): Promise<User>;
    delete(id: number): Promise<void>;
}