import { UserSession } from '../entities/user-session.entity';
import { IRepository } from '@app/../core/domain/repositories/base-repository.interface';

export interface IUserSessionRepository extends IRepository<UserSession> {
    findByUserId(userId: string): Promise<UserSession[]>;
    findByRefreshToken(token: string): Promise<UserSession | null>;
    revokeAllForUser(userId: string): Promise<void>;
}
