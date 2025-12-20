import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { JournalEntry } from './journal-entry.entity';

@Entity('accounts')
export class Account extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({ unique: true })
    code: string;

    @ApiProperty({ enum: ['asset', 'liability', 'income', 'expense', 'equity'], default: 'asset' })
    @Column({ length: 20 })
    type: 'asset' | 'liability' | 'income' | 'expense' | 'equity';

    @ApiProperty({ default: 0 })
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    balance: number;

    @OneToMany(() => JournalEntry, (entry) => entry.account)
    entries: JournalEntry[];
}
