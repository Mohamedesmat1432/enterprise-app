import { Injectable, Inject } from '@nestjs/common';
import type { ITaxRepository } from '../../domain/repositories/tax.repository.interface';
import { Tax } from '../../domain/entities/tax.entity';
import { CreateTaxDto } from '../../dto/tax.dto';

@Injectable()
export class CreateTaxUseCase {
    constructor(
        @Inject('ITaxRepository')
        private readonly taxRepository: ITaxRepository,
    ) { }

    async execute(companyId: string, dto: CreateTaxDto): Promise<Tax> {
        const taxData = {
            ...dto,
            companyId,
        };
        return await this.taxRepository.create(taxData);
    }
}
