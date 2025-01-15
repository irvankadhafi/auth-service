import { injectable } from 'tsyringe';
import { compare } from 'bcrypt';
import { UserRepository } from '@/domain/repositories/user.repository';
import { SessionRepository } from '@/domain/repositories/session.repository';
import { Session } from '@/domain/entities/session.entity';
import { generateToken } from '@/utils/token';
import { AuthError } from '@/utils/errors';

interface LoginDTO {
    email: string;
    password: string;
    userAgent: string;
    ipAddress: string;
    latitude: string;
    longitude: string;
}

@injectable()
export class LoginUseCase {
    constructor(
        private userRepository: UserRepository,
        private sessionRepository: SessionRepository
    ) {}

    async execute(data: LoginDTO): Promise<Session> {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new AuthError('Invalid credentials');
        }

        const isValidPassword = await compare(data.password, user.password);
        if (!isValidPassword) {
            throw new AuthError('Invalid credentials');
        }

        if (!user.isActive) {
            throw new AuthError('User is inactive');
        }

        const session = new Session();
        session.userId = user.id;
        session.accessToken = generateToken();
        session.refreshToken = generateToken();
        session.accessTokenExpiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        session.refreshTokenExpiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        session.userAgent = data.userAgent;
        session.ipAddress = data.ipAddress;
        session.latitude = data.latitude;
        session.longitude = data.longitude;

        return await this.sessionRepository.create(session);
    }
}