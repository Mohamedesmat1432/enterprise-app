import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '@modules/users/domain/entities/user.entity';
import { BaseEntity } from '@core/domain/entities/base.entity';

@Entity('user_sessions')
export class UserSession extends BaseEntity {
    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'refresh_token', type: 'text' })
    refreshToken: string;

    @Column({ name: 'user_agent', type: 'text', nullable: true })
    userAgent: string;

    @Column({ name: 'ip_address', type: 'text', nullable: true })
    ipAddress: string;

    @Column({ name: 'expires_at', type: 'timestamp' })
    expiresAt: Date;

    @Column({ name: 'is_revoked', type: 'boolean', default: false })
    isRevoked: boolean;
}
