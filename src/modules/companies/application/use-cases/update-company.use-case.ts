import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import type { ICompanyRepository } from '../../domain/repositories/company.repository.interface';
import { UpdateCompanyDto } from '../../dto/update-company.dto';

@Injectable()
export class UpdateCompanyUseCase {
    constructor(
        @Inject('ICompanyRepository')
        private readonly companyRepository: ICompanyRepository,
    ) { }

    async execute(id: string, dto: UpdateCompanyDto): Promise<Company> {
        return await this.companyRepository.update(id, dto);
    }
}
