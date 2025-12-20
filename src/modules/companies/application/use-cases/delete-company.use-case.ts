import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICompanyRepository } from '../../domain/repositories/company.repository.interface';

@Injectable()
export class DeleteCompanyUseCase {
    constructor(
        @Inject('ICompanyRepository')
        private readonly companyRepository: ICompanyRepository,
    ) { }

    async execute(id: string): Promise<void> {
        const company = await this.companyRepository.findById(id);
        if (!company) {
            throw new NotFoundException(`Company with ID "${id}" not found`);
        }
        await this.companyRepository.delete(id);
    }
}
