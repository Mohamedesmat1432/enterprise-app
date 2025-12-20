import { Injectable, Inject } from '@nestjs/common';
import type { IUomRepository } from '../../domain/repositories/uom.repository.interface';
import { UomQueryDto } from '../../dto/uom-query.dto';

@Injectable()
export class GetUomsUseCase {
    constructor(
        @Inject('IUomRepository')
        private readonly uomRepository: IUomRepository,
    ) { }

    async execute(query: UomQueryDto, companyId: string) {
        return await this.uomRepository.findAllPaginated(query, companyId);
    }
}
