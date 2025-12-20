import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { Partner } from '@modules/partners/domain/entities/partner.entity';
import type { InvoiceLine } from './invoice-line.entity';

@Entity('invoices')
export class Invoice extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Index()
    @ApiProperty()
    @Column({ name: 'partner_id', type: 'uuid' })
    partnerId: string;

    @ManyToOne(() => Partner)
    @JoinColumn({ name: 'partner_id' })
    partner: Partner;

    @Index({ unique: true })
    @ApiProperty()
    @Column({ unique: true })
    number: string;

    @ApiProperty()
    @Column({ type: 'date' })
    date: Date;

    @ApiProperty()
    @Column({ name: 'due_date', type: 'date' })
    dueDate: Date;

    @ApiProperty({ enum: ['customer_invoice', 'vendor_bill'] })
    @Column({ name: 'type', length: 20 })
    type: 'customer_invoice' | 'vendor_bill';

    @ApiProperty({ enum: ['draft', 'posted', 'paid', 'cancelled'], default: 'draft' })
    @Column({ length: 20, default: 'draft' })
    state: 'draft' | 'posted' | 'paid' | 'cancelled';

    @ApiProperty({ default: 0 })
    @Column({ name: 'untaxed_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
    untaxedAmount: number;

    @ApiProperty({ default: 0 })
    @Column({ name: 'tax_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
    taxAmount: number;

    @ApiProperty({ default: 0 })
    @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
    totalAmount: number;

    @ApiProperty({ default: 0 })
    @Column({ name: 'amount_residual', type: 'decimal', precision: 12, scale: 2, default: 0 })
    amountResidual: number;

    @OneToMany('InvoiceLine', 'invoice', { cascade: true })
    lines: InvoiceLine[];
}
