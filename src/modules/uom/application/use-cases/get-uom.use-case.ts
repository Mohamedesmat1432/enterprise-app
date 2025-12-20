import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUomRepository } from '../../domain/repositories/uom.repository.interface';
import { Uom } from '../../domain/entities/uom.entity';

@Injectable()
export class GetUomUseCase {
    constructor(
        @Inject('IUomRepository')
        private readonly uomRepository: IUomRepository,
    ) { }

    async execute(id: string, companyId: string): Promise<Uom> {
        const uom = await this.uomRepository.findByIdAndTenant(id, companyId);
        if (!uom) {
            throw new NotFoundException(`UOM with ID "${id}" not found`);
        }
        return uom;
    }
}
