import {inject, injectable} from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { User } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';
import {Role} from "@/utils/constants";
import { Redis } from "ioredis";

@injectable()
export class UserRepositoryImpl implements UserRepository {
    private repository: Repository<User>;

    constructor(
        @inject('DataSource') private dataSource: DataSource,
        @inject('Redis') private redis: Redis
    ) {
        this.repository = dataSource.getRepository(User);
    }

    // Create a new user and invalidate cache
    async create(user: User): Promise<User> {
        const savedUser = await this.repository.save(user);

        // Invalidate cache
        await this.invalidateCacheById(savedUser.id);
        await this.invalidateCacheByEmail(savedUser.email);

        return savedUser;
    }

    // Find user by ID with caching
    async findById(id: number): Promise<User | null> {
        const cacheKey = this.getCacheKeyById(id);

        // Check Redis cache
        const cachedUser = await this.redis.get(cacheKey);
        if (cachedUser) {
            return JSON.parse(cachedUser) as User;
        }

        // Fetch from database if not in cache
        const user = await this.repository.findOneBy({ id });
        if (user) {
            await this.cacheUser(user);
        }

        return user;
    }

    async findUsersWithRole(role: Role): Promise<User[]> {
        return this.repository
            .createQueryBuilder('user')
            .where('user.role = :role', { role })
            .getMany();
    }

    // Find user by email with caching
    async findByEmail(email: string): Promise<User | null> {
        const cacheKey = this.getCacheKeyByEmail(email);

        // Check Redis cache for ID
        const cachedId = await this.redis.get(cacheKey);
        if (cachedId) {
            return this.findById(Number(cachedId));
        }

        // Fetch user from database if not in cache
        const user = await this.repository.findOneBy({ email });
        if (user) {
            // Cache the ID and user data
            await this.cacheUser(user);
        }

        return user;
    }

    // Update user and invalidate cache
    async update(id: number, userData: Partial<User>): Promise<User> {
        await this.repository.update(id, userData);

        // Invalidate cache
        await this.invalidateCacheById(id);

        // Fetch updated user
        const updatedUser = await this.findById(id);
        return updatedUser!;
    }

    // Delete user and invalidate cache
    async delete(id: number): Promise<void> {
        const user = await this.findById(id);
        if (user) {
            // Invalidate cache
            await this.invalidateCacheById(id);
            await this.invalidateCacheByEmail(user.email);
        }

        await this.repository.delete(id);
    }

    // Cache user data in Redis
    private async cacheUser(user: User): Promise<void> {
        const cacheKeyById = this.getCacheKeyById(user.id);
        const cacheKeyByEmail = this.getCacheKeyByEmail(user.email);

        // Cache user data with a TTL of 1 hour
        const userData = JSON.stringify(user);
        await this.redis.set(cacheKeyById, userData, 'EX', 3600);
        await this.redis.set(cacheKeyByEmail, user.id.toString(), 'EX', 3600);
    }

    // Invalidate cache by user ID
    private async invalidateCacheById(id: number): Promise<void> {
        const cacheKey = this.getCacheKeyById(id);
        await this.redis.del(cacheKey);
    }

    // Invalidate cache by user email
    private async invalidateCacheByEmail(email: string): Promise<void> {
        const cacheKey = this.getCacheKeyByEmail(email);
        await this.redis.del(cacheKey);
    }

    // Generate cache key for user by ID
    private getCacheKeyById(id: number): string {
        return `cache:user:id:${id}`;
    }

    // Generate cache key for user by email
    private getCacheKeyByEmail(email: string): string {
        return `cache:user:email:${email}`;
    }
}