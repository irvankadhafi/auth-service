import {inject, injectable} from 'tsyringe';
import {SessionRepository} from '@/domain/repositories/session.repository';
import {AuthError} from '@/utils/errors';
import {TokenType} from "@/utils/constants";

@injectable()
export class LogoutUseCase {
    constructor(
        @inject('SessionRepository') private sessionRepo: SessionRepository
    ) {}

    async execute(token: string): Promise<void> {
        const session = await this.sessionRepo.findByToken(TokenType.ACCESS_TOKEN, token);
        if (!session) {
            throw new AuthError('Invalid token');
        }

        await this.sessionRepo.delete(session.id);
    }
}