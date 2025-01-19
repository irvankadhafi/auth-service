import { Role } from '@/utils/constants';
import {User} from "@/domain/entities/user.entity";
import {Session} from "@/domain/entities/session.entity";

export interface LoginRequest {
    email: string;
    password: string;
    userAgent?: string;
    ipAddress?: string;
    latitude?: string;
    longitude?: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        email: string;
        role: Role;
    };
    expiresIn: number;
}

export interface ValidateTokenResponse {
    userId: number;
    role: Role;
    permissions: Map<string, string[]>;
}

export interface AuthUseCase {
    login(req: LoginRequest): Promise<Session>;
    validateToken(token: string): Promise<User>;
    refreshToken(token: string): Promise<LoginResponse>;
    logout(token: string): Promise<void>;
}

export interface TokenData {
    userId: number;
    role: string;
    permissions: Map<string, string[]>;
}

export interface ValidateTokenResponse extends TokenData {}