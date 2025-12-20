
import { Injectable } from '@nestjs/common';
import { CreatePartnerUseCase } from '../application/use-cases/create-partner.use-case';
import { GetPartnersUseCase } from '../application/use-cases/get-partners.use-case';
import { GetPartnerUseCase } from '../application/use-cases/get-partner.use-case';
import { UpdatePartnerUseCase } from '../application/use-cases/update-partner.use-case';
import { DeletePartnerUseCase } from '../application/use-cases/delete-partner.use-case';
import { CreatePartnerDto } from '../dto/create-partner.dto';
import { UpdatePartnerDto } from '../dto/update-partner.dto';
import { PartnerQueryDto } from '../dto/partner-query.dto';

@Injectable()
export class PartnersService {
    constructor(
        private readonly createUseCase: CreatePartnerUseCase,
        private readonly getPartnersUseCase: GetPartnersUseCase,
        private readonly getPartnerUseCase: GetPartnerUseCase,
        private readonly updateUseCase: UpdatePartnerUseCase,
        private readonly deleteUseCase: DeletePartnerUseCase,
    ) { }

    async create(createPartnerDto: CreatePartnerDto, companyId: string, userId: string) {
        return this.createUseCase.execute(companyId, createPartnerDto, userId);
    }

    async findAll(query: PartnerQueryDto, companyId: string) {
        return this.getPartnersUseCase.execute(companyId, query);
    }

    async findOne(id: string, companyId: string) {
        return this.getPartnerUseCase.execute(companyId, id);
    }

    async update(id: string, updatePartnerDto: UpdatePartnerDto, companyId: string, userId: string) {
        return this.updateUseCase.execute(companyId, id, updatePartnerDto, userId);
    }

    async remove(id: string, companyId: string) {
        return this.deleteUseCase.execute(companyId, id);
    }
}
