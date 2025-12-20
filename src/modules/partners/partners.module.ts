
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './domain/entities/partner.entity';
import { PartnersService } from './services/partners.service';
import { PartnersController } from './controllers/partners.controller';
import { TypeOrmPartnerRepository } from './infrastructure/persistence/typeorm-partner.repository';
import { CreatePartnerUseCase } from './application/use-cases/create-partner.use-case';
import { GetPartnersUseCase } from './application/use-cases/get-partners.use-case';
import { GetPartnerUseCase } from './application/use-cases/get-partner.use-case';
import { UpdatePartnerUseCase } from './application/use-cases/update-partner.use-case';
import { DeletePartnerUseCase } from './application/use-cases/delete-partner.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([Partner])],
    controllers: [PartnersController],
    providers: [
        PartnersService,
        { provide: 'IPartnerRepository', useClass: TypeOrmPartnerRepository },
        CreatePartnerUseCase,
        GetPartnersUseCase,
        GetPartnerUseCase,
        UpdatePartnerUseCase,
        DeletePartnerUseCase,
    ],
    exports: [
        PartnersService,
        'IPartnerRepository',
    ],
})
export class PartnersModule { }
