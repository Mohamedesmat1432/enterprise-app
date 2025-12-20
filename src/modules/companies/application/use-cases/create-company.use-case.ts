import { Injectable, Inject } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import type { ICompanyRepository } from '../../domain/repositories/company.repository.interface';
import { CreateCompanyDto } from '../../dto/create-company.dto';

@Injectable()
export class CreateCompanyUseCase {
    constructor(
        @Inject('ICompanyRepository')
        private readonly companyRepository: ICompanyRepository,
    ) { }

    async execute(dto: CreateCompanyDto): Promise<Company> {
        return await this.companyRepository.create(dto);
    }
}
