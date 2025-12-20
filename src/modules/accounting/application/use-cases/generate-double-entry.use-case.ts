
import { Injectable, Inject } from '@nestjs/common';
import type { IJournalRepository } from '../../domain/repositories/journal.repository.interface';
import { Journal } from '../../domain/entities/journal.entity';
import { JournalEntry } from '../../domain/entities/journal-entry.entity';

@Injectable()
export class GenerateDoubleEntryUseCase {
    constructor(
        @Inject('IJournalRepository')
        private readonly journalRepository: IJournalRepository,
    ) { }

    async execute(
        companyId: string,
        journalName: string,
        date: Date,
        entries: { accountId: string; debit: number; credit: number }[],
    ) {
        // Validate double entry principle
        const totalDebit = entries.reduce((acc, e) => acc + Number(e.debit || 0), 0);
        const totalCredit = entries.reduce((acc, e) => acc + Number(e.credit || 0), 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            throw new Error(`Accounting mismatch: Total Debit (${totalDebit}) != Total Credit (${totalCredit})`);
        }

        const journal = new Journal();
        journal.companyId = companyId;
        journal.name = journalName;
        journal.date = date;
        journal.state = 'posted';
        journal.totalAmount = totalDebit;

        const journalEntries = entries.map(e => {
            const entry = new JournalEntry();
            entry.companyId = companyId;
            entry.accountId = e.accountId;
            entry.debit = e.debit;
            entry.credit = e.credit;
            return entry;
        });

        return await this.journalRepository.createWithEntries(journal, journalEntries);
    }
}
