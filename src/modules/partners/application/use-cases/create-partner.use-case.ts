
import { Injectable, Inject } from '@nestjs/common';
import type { IPartnerRepository } from '../../domain/repositories/partner.repository.interface';
import { Partner } from '../../domain/entities/partner.entity';
import { CreatePartnerDto } from '../../dto/create-partner.dto';

@Injectable()
export class CreatePartnerUseCase {
    constructor(
        @Inject('IPartnerRepository')
        private readonly partnerRepo: IPartnerRepository,
    ) { }

    async execute(companyId: string, dto: CreatePartnerDto, userId: string): Promise<Partner> {
        // We can use repo.create(data) if available, but interface usually defines create(data).
        // Let's assume standard repository pattern: create receives partial entity or DTO and returns saved entity
        // OR create returns unsaved, save returns saved.
        // Base repository 'create' usually combines both (creates and saves).

        const partnerData = {
            ...dto,
            companyId,
            createdBy: userId,
        };
        return await this.partnerRepo.create(partnerData);
    }
}
