import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Column,
    Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export abstract class BaseEntity {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Exclude()
    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date;

    @ApiProperty()
    @Column({ name: 'created_by', type: 'uuid', nullable: true })
    createdBy: string;

    @ApiProperty()
    @Column({ name: 'updated_by', type: 'uuid', nullable: true })
    updatedBy: string;
}

export abstract class AggregateRoot extends BaseEntity {
    // Add domain event logic here in the future
}

export abstract class BaseTenantEntity extends BaseEntity {
    @Index()
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
    @Column({ name: 'company_id', type: 'uuid' })
    companyId: string;
}
