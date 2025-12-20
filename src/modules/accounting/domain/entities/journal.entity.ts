import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import type { JournalEntry } from './journal-entry.entity';

@Entity('journals')
export class Journal extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({ type: 'date' })
    date: Date;

    @ApiProperty({ enum: ['draft', 'posted'], default: 'draft' })
    @Column({ length: 20, default: 'draft' })
    state: 'draft' | 'posted';

    @ApiProperty({ default: 0 })
    @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
    totalAmount: number;

    @OneToMany('JournalEntry', 'journal')
    entries: JournalEntry[];
}
