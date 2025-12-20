import { Injectable } from '@nestjs/common';
import { CreateCompanyUseCase } from '../application/use-cases/create-company.use-case';
import { GetCompaniesUseCase } from '../application/use-cases/get-companies.use-case';
import { GetCompanyUseCase } from '../application/use-cases/get-company.use-case';
import { UpdateCompanyUseCase } from '../application/use-cases/update-company.use-case';
import { DeleteCompanyUseCase } from '../application/use-cases/delete-company.use-case';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { Company } from '../domain/entities/company.entity';

@Injectable()
export class CompaniesService {
    constructor(
        private readonly createCompanyUseCase: CreateCompanyUseCase,
        private readonly getCompaniesUseCase: GetCompaniesUseCase,
        private readonly getCompanyUseCase: GetCompanyUseCase,
        private readonly updateCompanyUseCase: UpdateCompanyUseCase,
        private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
    ) { }

    async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
        return this.createCompanyUseCase.execute(createCompanyDto);
    }

    async findAll(): Promise<Company[]> {
        return this.getCompaniesUseCase.execute();
    }

    async findOne(id: string): Promise<Company> {
        return this.getCompanyUseCase.execute(id);
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        return this.updateCompanyUseCase.execute(id, updateCompanyDto);
    }

    async remove(id: string): Promise<void> {
        return this.deleteCompanyUseCase.execute(id);
    }
}
