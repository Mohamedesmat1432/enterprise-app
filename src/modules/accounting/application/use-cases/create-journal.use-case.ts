import { Injectable, Inject } from '@nestjs/common';
import type { IJournalRepository } from '../../domain/repositories/journal.repository.interface';
import { CreateJournalDto } from '../../dto/accounting.dto';
import { Journal } from '../../domain/entities/journal.entity';
import { JournalEntry } from '../../domain/entities/journal-entry.entity';

@Injectable()
export class CreateJournalUseCase {
    constructor(
        @Inject('IJournalRepository')
        private readonly journalRepository: IJournalRepository,
    ) { }

    async execute(companyId: string, dto: CreateJournalDto): Promise<Journal> {
        // Basic creation without entries for now, matching previous service logic
        // But wait, the service createJournal only saved the journal, not entries?
        // Service: 
        // async createJournal(companyId: string, dto: CreateJournalDto) {
        //     const journal = this.journalRepository.create({ ...dto, companyId, date: new Date(dto.date) });
        //     return await this.journalRepository.save(journal);
        // }
        // Yes, it was simple.

        const journal = new Journal();
        Object.assign(journal, dto);
        journal.companyId = companyId;
        journal.date = new Date(dto.date);

        return await this.journalRepository.create(journal);
    }
}
