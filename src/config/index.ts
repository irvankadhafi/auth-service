import dotenv from 'dotenv';

dotenv.config();

export class Config {
    static get NODE_ENV(): string {
        return process.env.NODE_ENV || 'development';
    }

    static get DATABASE_URL(): string {
        return process.env.DATABASE_URL || 'postgresql://localhost:5432/auth_db';
    }

    static get REDIS_URL(): string {
        return process.env.REDIS_URL || 'redis://localhost:6379';
    }

    static get HTTP_PORT(): number {
        return parseInt(process.env.HTTP_PORT || '3000');
    }

    static get GRPC_PORT(): number {
        return parseInt(process.env.GRPC_PORT || '50051');
    }

    static get JWT_SECRET(): string {
        return process.env.JWT_SECRET || 'your-secret-key';
    }
}