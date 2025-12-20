import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { Partner } from '@modules/partners/domain/entities/partner.entity';
import { Invoice } from './invoice.entity';

@Entity('payments')
export class Payment extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ApiProperty()
    @Column({ name: 'partner_id', type: 'uuid' })
    partnerId: string;

    @ManyToOne(() => Partner)
    @JoinColumn({ name: 'partner_id' })
    partner: Partner;

    @ApiProperty()
    @Column({ name: 'invoice_id', type: 'uuid', nullable: true })
    invoiceId: string;

    @ManyToOne(() => Invoice)
    @JoinColumn({ name: 'invoice_id' })
    invoice: Invoice;

    @ApiProperty()
    @Column({ type: 'date' })
    date: Date;

    @ApiProperty({ default: 0 })
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    amount: number;

    @ApiProperty({ enum: ['inbound', 'outbound'] })
    @Column({ length: 20 })
    type: 'inbound' | 'outbound';

    @ApiProperty({ enum: ['draft', 'posted', 'cancelled'], default: 'draft' })
    @Column({ length: 20, default: 'draft' })
    state: 'draft' | 'posted' | 'cancelled';

    @ApiProperty()
    @Column({ nullable: true })
    memo: string;
}
