import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { User } from '@modules/users/domain/entities/user.entity';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';

@Entity('audit_logs')
export class AuditLog extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ApiProperty()
    @Column({ name: 'user_id', type: 'uuid', nullable: true })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ApiProperty()
    @Column()
    action: string;

    @Index()
    @ApiProperty()
    @Column()
    entity: string;

    @Index()
    @ApiProperty()
    @Column({ name: 'entity_id', type: 'uuid', nullable: true })
    entityId: string;

    @ApiProperty()
    @Column({ type: 'jsonb', nullable: true })
    changes: any;


}
