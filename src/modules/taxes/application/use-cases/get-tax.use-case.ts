import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ITaxRepository } from '../../domain/repositories/tax.repository.interface';
import { Tax } from '../../domain/entities/tax.entity';

@Injectable()
export class GetTaxUseCase {
    constructor(
        @Inject('ITaxRepository')
        private readonly taxRepository: ITaxRepository,
    ) { }

    async execute(id: string, companyId: string): Promise<Tax> {
        const tax = await this.taxRepository.findByIdAndTenant(id, companyId);
        if (!tax) {
            throw new NotFoundException(`Tax with ID "${id}" not found`);
        }
        return tax;
    }
}
