import { Injectable, Inject } from '@nestjs/common';
import type { IUomCategoryRepository } from '../../domain/repositories/uom-category.repository.interface';
import { UomCategory } from '../../domain/entities/uom-category.entity';
import { CreateUomCategoryDto } from '../../dto/create-uom-category.dto';

@Injectable()
export class CreateUomCategoryUseCase {
    constructor(
        @Inject('IUomCategoryRepository')
        private readonly categoryRepository: IUomCategoryRepository,
    ) { }

    async execute(dto: CreateUomCategoryDto, companyId: string): Promise<UomCategory> {
        return await this.categoryRepository.create({ ...dto, companyId });
    }
}
