import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tax } from './domain/entities/tax.entity';
import { TaxesService } from './services/taxes.service';
import { TaxesController } from './controllers/taxes.controller';
import { TypeOrmTaxRepository } from './infrastructure/persistence/typeorm-tax.repository';
import { GetTaxesUseCase } from './application/use-cases/get-taxes.use-case';
import { GetTaxUseCase } from './application/use-cases/get-tax.use-case';
import { CreateTaxUseCase } from './application/use-cases/create-tax.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([Tax])],
    controllers: [TaxesController],
    providers: [
        TaxesService,
        {
            provide: 'ITaxRepository',
            useClass: TypeOrmTaxRepository,
        },
        GetTaxesUseCase,
        GetTaxUseCase,
        CreateTaxUseCase,
    ],
    exports: [
        TaxesService,
        'ITaxRepository',
        GetTaxesUseCase,
        GetTaxUseCase,
        CreateTaxUseCase,
    ],
})
export class TaxesModule { }
