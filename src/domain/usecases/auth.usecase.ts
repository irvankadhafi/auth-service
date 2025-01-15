import { Role } from '@/utils/constants';

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
    login(req: LoginRequest): Promise<LoginResponse>;
    validateToken(token: string): Promise<ValidateTokenResponse>;
    refreshToken(token: string): Promise<LoginResponse>;
    logout(token: string): Promise<void>;
}