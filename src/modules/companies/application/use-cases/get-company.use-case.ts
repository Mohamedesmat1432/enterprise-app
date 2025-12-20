import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import type { ICompanyRepository } from '../../domain/repositories/company.repository.interface';

@Injectable()
export class GetCompanyUseCase {
    constructor(
        @Inject('ICompanyRepository')
        private readonly companyRepository: ICompanyRepository,
    ) { }

    async execute(id: string): Promise<Company> {
        const company = await this.companyRepository.findById(id);
        if (!company) {
            throw new NotFoundException(`Company with ID "${id}" not found`);
        }
        return company;
    }
}
