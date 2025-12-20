import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { CompaniesService } from '@modules/companies/services/companies.service';
import { CompaniesController } from '@modules/companies/controllers/companies.controller';
import { TypeOrmCompanyRepository } from './infrastructure/persistence/typeorm-company.repository';
import { CreateCompanyUseCase } from './application/use-cases/create-company.use-case';
import { GetCompaniesUseCase } from './application/use-cases/get-companies.use-case';
import { GetCompanyUseCase } from './application/use-cases/get-company.use-case';
import { UpdateCompanyUseCase } from './application/use-cases/update-company.use-case';
import { DeleteCompanyUseCase } from './application/use-cases/delete-company.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([Company])],
    controllers: [CompaniesController],
    providers: [
        CompaniesService,
        CreateCompanyUseCase,
        GetCompaniesUseCase,
        GetCompanyUseCase,
        UpdateCompanyUseCase,
        DeleteCompanyUseCase,
        {
            provide: 'ICompanyRepository',
            useClass: TypeOrmCompanyRepository,
        },
    ],
    exports: [
        CompaniesService,
        'ICompanyRepository',
        TypeOrmModule,
        CreateCompanyUseCase,
        GetCompaniesUseCase,
        GetCompanyUseCase,
        UpdateCompanyUseCase,
        DeleteCompanyUseCase,
    ],
})
export class CompaniesModule { }
