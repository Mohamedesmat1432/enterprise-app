import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';

@Entity('partners')
export class Partner extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty({ required: false })
    @Column({ name: 'legal_name', nullable: true })
    legalName: string;

    @Index()
    @ApiProperty({ required: false })
    @Column({ nullable: true })
    email: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    phone: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    mobile: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    website: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    street: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    city: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    state: string;

    @ApiProperty({ required: false })
    @Column({ name: 'postal_code', nullable: true })
    postalCode: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    country: string;

    @Index()
    @ApiProperty({ default: false })
    @Column({ name: 'is_customer', default: false })
    isCustomer: boolean;

    @Index()
    @ApiProperty({ default: false })
    @Column({ name: 'is_vendor', default: false })
    isVendor: boolean;

    @ApiProperty({ default: false })
    @Column({ name: 'is_employee', default: false })
    isEmployee: boolean;

    @ApiProperty({ default: 0 })
    @Column({ name: 'credit_limit', type: 'decimal', precision: 12, scale: 2, default: 0 })
    creditLimit: number;

    @ApiProperty({ required: false })
    @Column({ name: 'payment_terms', length: 50, nullable: true })
    paymentTerms: string;

    @ApiProperty({ default: true })
    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
