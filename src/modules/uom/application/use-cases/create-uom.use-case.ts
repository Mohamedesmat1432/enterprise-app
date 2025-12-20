import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUomRepository } from '../../domain/repositories/uom.repository.interface';
import type { IUomCategoryRepository } from '../../domain/repositories/uom-category.repository.interface';
import { Uom } from '../../domain/entities/uom.entity';
import { CreateUomDto } from '../../dto/create-uom.dto';

@Injectable()
export class CreateUomUseCase {
    constructor(
        @Inject('IUomRepository')
        private readonly uomRepository: IUomRepository,
        @Inject('IUomCategoryRepository')
        private readonly categoryRepository: IUomCategoryRepository,
    ) { }

    async execute(dto: CreateUomDto, companyId: string): Promise<Uom> {
        const category = await this.categoryRepository.findByIdAndTenant(dto.categoryId, companyId);
        if (!category) {
            throw new NotFoundException(`Category with ID "${dto.categoryId}" not found`);
        }

        return await this.uomRepository.create({ ...dto, companyId });
    }
}
