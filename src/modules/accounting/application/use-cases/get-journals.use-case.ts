import { Injectable, Inject } from '@nestjs/common';
import type { IJournalRepository } from '../../domain/repositories/journal.repository.interface';
import { Journal } from '../../domain/entities/journal.entity';
import { PaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class GetJournalsUseCase {
    constructor(
        @Inject('IJournalRepository')
        private readonly journalRepository: IJournalRepository,
    ) { }

    async execute(companyId: string, page: number, limit: number): Promise<PaginatedResponse<Journal>> {
        return await this.journalRepository.findAllPaginated(companyId, page, limit);
    }
}
