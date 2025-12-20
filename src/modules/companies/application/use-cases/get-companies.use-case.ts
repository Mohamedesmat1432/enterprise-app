import { Injectable, Inject } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import type { ICompanyRepository } from '../../domain/repositories/company.repository.interface';

@Injectable()
export class GetCompaniesUseCase {
    constructor(
        @Inject('ICompanyRepository')
        private readonly companyRepository: ICompanyRepository,
    ) { }

    async execute(): Promise<Company[]> {
        return await this.companyRepository.findAll();
    }
}
