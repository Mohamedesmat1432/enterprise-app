import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '../../domain/entities/user-session.entity';
import { IUserSessionRepository } from '../../domain/repositories/user-session.repository.interface';
import { BaseTypeOrmRepository } from '@app/../core/infrastructure/persistence/base-typeorm.repository';

@Injectable()
export class TypeOrmUserSessionRepository
    extends BaseTypeOrmRepository<UserSession>
    implements IUserSessionRepository {
    constructor(
        @InjectRepository(UserSession)
        private readonly sessionRepo: Repository<UserSession>,
    ) {
        super(sessionRepo);
    }

    async findByUserId(userId: string): Promise<UserSession[]> {
        return await this.sessionRepo.find({ where: { userId } });
    }

    async findByRefreshToken(token: string): Promise<UserSession | null> {
        return await this.sessionRepo.findOne({ where: { refreshToken: token } });
    }

    async revokeAllForUser(userId: string): Promise<void> {
        await this.sessionRepo.update({ userId }, { isRevoked: true });
    }
}
