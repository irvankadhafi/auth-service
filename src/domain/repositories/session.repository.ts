import { Session } from '../entities/session.entity';
import { TokenType } from '@/utils/constants';

export interface SessionRepository {
    create(session: Session): Promise<Session>;
    findByToken(tokenType: TokenType, token: string): Promise<Session | null>;
    findById(id: number): Promise<Session | null>;
    findByUserId(userId: number): Promise<Session[]>;
    delete(id: number): Promise<void>;
    deleteByUserId(userId: number): Promise<void>;
    refreshToken(oldSession: Session, newSession: Session): Promise<void>;
}