import { Injectable } from '@nestjs/common';
import { CreateUomUseCase } from '../application/use-cases/create-uom.use-case';
import { CreateUomCategoryUseCase } from '../application/use-cases/create-uom-category.use-case';
import { GetUomsUseCase } from '../application/use-cases/get-uoms.use-case';
import { GetUomCategoriesUseCase } from '../application/use-cases/get-uom-categories.use-case';
import { GetUomUseCase } from '../application/use-cases/get-uom.use-case';
import { CreateUomDto } from '../dto/create-uom.dto';
import { CreateUomCategoryDto } from '../dto/create-uom-category.dto';
import { UomQueryDto } from '../dto/uom-query.dto';
import { UomCategoryQueryDto } from '../dto/uom-category-query.dto';

@Injectable()
export class UomService {
    constructor(
        private readonly createUomUseCase: CreateUomUseCase,
        private readonly createCategoryUseCase: CreateUomCategoryUseCase,
        private readonly getUomsUseCase: GetUomsUseCase,
        private readonly getCategoriesUseCase: GetUomCategoriesUseCase,
        private readonly getUomUseCase: GetUomUseCase,
    ) { }

    async createCategory(dto: CreateUomCategoryDto, companyId: string) {
        return this.createCategoryUseCase.execute(dto, companyId);
    }

    async findAllCategories(companyId: string, query?: UomCategoryQueryDto) {
        return this.getCategoriesUseCase.execute(query || {} as UomCategoryQueryDto, companyId);
    }

    async createUom(dto: CreateUomDto, companyId: string) {
        return this.createUomUseCase.execute(dto, companyId);
    }

    async findAllUoms(companyId: string, query?: UomQueryDto) {
        return this.getUomsUseCase.execute(query || {} as UomQueryDto, companyId);
    }

    async findOneUom(id: string, companyId: string) {
        return this.getUomUseCase.execute(id, companyId);
    }
}
