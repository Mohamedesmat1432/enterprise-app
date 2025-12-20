import { Injectable, Inject } from '@nestjs/common';
import type { IUomCategoryRepository } from '../../domain/repositories/uom-category.repository.interface';
import { UomCategoryQueryDto } from '../../dto/uom-category-query.dto';

@Injectable()
export class GetUomCategoriesUseCase {
    constructor(
        @Inject('IUomCategoryRepository')
        private readonly categoryRepository: IUomCategoryRepository,
    ) { }

    async execute(query: UomCategoryQueryDto, companyId: string) {
        return await this.categoryRepository.findAllPaginated(query, companyId);
    }
}
