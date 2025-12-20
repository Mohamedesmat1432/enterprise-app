
import { Journal } from '../entities/journal.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { IRepository } from '@core/domain/repositories/base-repository.interface';
import { PaginatedResponse } from '@common/dto/pagination.dto';

export interface IJournalRepository extends IRepository<Journal> {
    create(data: Journal): Promise<Journal>;
    findAllPaginated(companyId: string, page: number, limit: number): Promise<PaginatedResponse<Journal>>;
    saveEntries(entries: JournalEntry[]): Promise<JournalEntry[]>;
    createWithEntries(journal: Journal, entries: JournalEntry[]): Promise<Journal>;
}
