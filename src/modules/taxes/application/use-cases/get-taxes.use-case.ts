import { Injectable, Inject } from '@nestjs/common';
import type { ITaxRepository } from '../../domain/repositories/tax.repository.interface';
import { TaxQueryDto } from '../../dto/tax-query.dto';

@Injectable()
export class GetTaxesUseCase {
    constructor(
        @Inject('ITaxRepository')
        private readonly taxRepository: ITaxRepository,
    ) { }

    async execute(query: TaxQueryDto, companyId: string) {
        return await this.taxRepository.findAllPaginated(query, companyId);
    }

    async getSalesTaxes(companyId: string) {
        return await this.taxRepository.findActiveSalesTaxes(companyId);
    }

    async getPurchaseTaxes(companyId: string) {
        return await this.taxRepository.findActivePurchaseTaxes(companyId);
    }
}
