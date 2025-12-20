import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export abstract class BaseTenantEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @ApiProperty()
    @Column({ name: 'company_id', type: 'uuid', nullable: true })
    companyId: string;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Exclude()
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;

    @Index()
    @ApiProperty()
    @Column({ name: 'active_company_id', type: 'uuid', nullable: true })
    activeCompanyId: string;

    @ApiProperty()
    @Column({ name: 'created_by', type: 'uuid', nullable: true })
    createdBy: string;

    @ApiProperty()
    @Column({ name: 'updated_by', type: 'uuid', nullable: true })
    updatedBy: string;
}
