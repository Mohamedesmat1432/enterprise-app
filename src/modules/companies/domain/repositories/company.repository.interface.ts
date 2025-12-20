import { IRepository } from '@core/domain/repositories/base-repository.interface';
import { Company } from '../entities/company.entity';

export interface ICompanyRepository extends IRepository<Company> {
    findByName(name: string): Promise<Company | null>;
}
