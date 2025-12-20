import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uom } from './domain/entities/uom.entity';
import { UomCategory } from './domain/entities/uom-category.entity';
import { UomService } from './services/uom.service';
import { UomController } from './controllers/uom.controller';
import { TypeOrmUomRepository } from './infrastructure/persistence/typeorm-uom.repository';
import { TypeOrmUomCategoryRepository } from './infrastructure/persistence/typeorm-uom-category.repository';
import { GetUomsUseCase } from './application/use-cases/get-uoms.use-case';
import { GetUomCategoriesUseCase } from './application/use-cases/get-uom-categories.use-case';
import { GetUomUseCase } from './application/use-cases/get-uom.use-case';
import { CreateUomUseCase } from './application/use-cases/create-uom.use-case';
import { CreateUomCategoryUseCase } from './application/use-cases/create-uom-category.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([Uom, UomCategory])],
    controllers: [UomController],
    providers: [
        UomService,
        {
            provide: 'IUomRepository',
            useClass: TypeOrmUomRepository,
        },
        {
            provide: 'IUomCategoryRepository',
            useClass: TypeOrmUomCategoryRepository,
        },
        GetUomsUseCase,
        GetUomCategoriesUseCase,
        GetUomUseCase,
        CreateUomUseCase,
        CreateUomCategoryUseCase,
    ],
    exports: [
        UomService,
        'IUomRepository',
        'IUomCategoryRepository',
        GetUomsUseCase,
        GetUomCategoriesUseCase,
        GetUomUseCase,
        CreateUomUseCase,
        CreateUomCategoryUseCase,
    ],
})
export class UomModule { }
