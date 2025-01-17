// src/types/express/index.d.ts
import { User } from '@/domain/entities/user.entity';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                role: string;
                permissions: Map<string, string[]>;
            };
        }
    }
}