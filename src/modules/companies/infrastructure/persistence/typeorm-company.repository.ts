import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';
import { Company } from '../../domain/entities/company.entity';
import { ICompanyRepository } from '../../domain/repositories/company.repository.interface';

@Injectable()
export class TypeOrmCompanyRepository
    extends BaseTypeOrmRepository<Company>
    implements ICompanyRepository {
    constructor(
        @InjectRepository(Company)
        repository: Repository<Company>,
    ) {
        super(repository);
    }

    async findByName(name: string): Promise<Company | null> {
        return this.repository.findOne({ where: { name } });
    }
}
