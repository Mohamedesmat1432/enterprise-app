import { Injectable } from '@nestjs/common';
import { CreateTaxUseCase } from '../application/use-cases/create-tax.use-case';
import { GetTaxesUseCase } from '../application/use-cases/get-taxes.use-case';
import { GetTaxUseCase } from '../application/use-cases/get-tax.use-case';
import { CreateTaxDto } from '../dto/tax.dto';
import { TaxQueryDto } from '../dto/tax-query.dto';

@Injectable()
export class TaxesService {
    constructor(
        private readonly createTaxUseCase: CreateTaxUseCase,
        private readonly getTaxesUseCase: GetTaxesUseCase,
        private readonly getTaxUseCase: GetTaxUseCase,
    ) { }

    async create(companyId: string, dto: CreateTaxDto) {
        return this.createTaxUseCase.execute(companyId, dto);
    }

    async findAll(companyId: string, type?: 'sale' | 'purchase') {
        if (type === 'sale') {
            return this.getTaxesUseCase.getSalesTaxes(companyId);
        }
        if (type === 'purchase') {
            return this.getTaxesUseCase.getPurchaseTaxes(companyId);
        }
        return this.getTaxesUseCase.execute({} as TaxQueryDto, companyId);
    }

    async findOne(id: string, companyId: string) {
        return this.getTaxUseCase.execute(id, companyId);
    }

    async getSalesTaxes(companyId: string) {
        return this.getTaxesUseCase.getSalesTaxes(companyId);
    }

    async getPurchaseTaxes(companyId: string) {
        return this.getTaxesUseCase.getPurchaseTaxes(companyId);
    }
}
