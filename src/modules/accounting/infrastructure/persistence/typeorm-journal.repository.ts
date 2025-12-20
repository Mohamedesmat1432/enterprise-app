
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Journal } from '../../domain/entities/journal.entity';
import { JournalEntry } from '../../domain/entities/journal-entry.entity';
import { IJournalRepository } from '../../domain/repositories/journal.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';
import { PaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class TypeOrmJournalRepository
    extends BaseTenantTypeOrmRepository<Journal>
    implements IJournalRepository {
    constructor(
        @InjectRepository(Journal)
        repository: Repository<Journal>,
        @InjectRepository(JournalEntry)
        private readonly entryRepository: Repository<JournalEntry>,
        private readonly dataSource: DataSource,
    ) {
        super(repository);
    }

    async findAllPaginated(companyId: string, page: number, limit: number): Promise<PaginatedResponse<Journal>> {
        const skip = (page - 1) * limit;

        const [data, total] = await this.repository.findAndCount({
            where: { companyId },
            relations: ['entries'],
            skip,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }

    async saveEntries(entries: JournalEntry[]): Promise<JournalEntry[]> {
        return this.entryRepository.save(entries);
    }

    async createWithEntries(journal: Journal, entries: JournalEntry[]): Promise<Journal> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const savedJournal = await queryRunner.manager.save(journal);

            // Re-map journalId just in case
            const journalEntries = entries.map((e) => {
                e.journalId = savedJournal.id;
                return e;
            });

            await queryRunner.manager.save(JournalEntry, journalEntries);
            await queryRunner.commitTransaction();
            return savedJournal;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
