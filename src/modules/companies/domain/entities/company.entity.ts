import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@modules/users/domain/entities/user.entity';
import { BaseEntity } from '@core/domain/entities/base.entity';

@Entity('companies')
export class Company extends BaseEntity {
    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty({ required: false })
    @Column({ name: 'legal_name', nullable: true })
    legalName: string;

    @ApiProperty({ required: false })
    @Column({ name: 'vat_number', length: 50, nullable: true })
    vatNumber: string;

    @ApiProperty({ required: false })
    @Column({ length: 150, nullable: true })
    email: string;

    @ApiProperty({ required: false })
    @Column({ length: 50, nullable: true })
    phone: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    website: string;

    @ApiProperty({ required: false })
    @Column({ name: 'currency_code', length: 10, default: 'USD' })
    currencyCode: string;

    @ApiProperty({ required: false })
    @Column({ length: 50, default: 'UTC' })
    timezone: string;

    @ApiProperty({ required: false })
    @Column({ length: 50, nullable: true })
    country: string;

    @ApiProperty({ required: false })
    @Column({ type: 'text', nullable: true })
    address: string;

    @ApiProperty({ required: false })
    @Column({ name: 'logo_url', nullable: true })
    logoUrl: string;

    @ApiProperty()
    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @ApiProperty({ required: false })
    @Column({ name: 'parent_id', type: 'uuid', nullable: true })
    parentId: string | null;

    @ManyToOne(() => Company, (company) => company.children)
    @JoinColumn({ name: 'parent_id' })
    parent: Company;

    @OneToMany(() => Company, (company) => company.parent)
    children: Company[];

    @ApiProperty({ required: false })
    @Column({ name: 'fiscal_year_last_day', type: 'int', default: 31 })
    fiscalYearLastDay: number;

    @ApiProperty({ required: false })
    @Column({ name: 'fiscal_year_last_month', type: 'int', default: 12 })
    fiscalYearLastMonth: number;

    @OneToMany(() => User, (user) => user.company)
    users: User[];
}
