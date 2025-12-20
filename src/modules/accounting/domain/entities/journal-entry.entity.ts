import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import type { Journal } from './journal.entity';
import { Account } from './account.entity';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';

@Entity('journal_entries')
export class JournalEntry extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;



    @Index()
    @ApiProperty()
    @Column({ name: 'journal_id', type: 'uuid' })
    journalId: string;

    @ManyToOne('Journal', 'entries', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'journal_id' })
    journal: Journal;

    @Index()
    @ApiProperty()
    @Column({ name: 'account_id', type: 'uuid' })
    accountId: string;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ApiProperty({ default: 0 })
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    debit: number;

    @ApiProperty({ default: 0 })
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    credit: number;
}
