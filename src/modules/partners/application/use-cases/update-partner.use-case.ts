
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPartnerRepository } from '../../domain/repositories/partner.repository.interface';
import { Partner } from '../../domain/entities/partner.entity';
import { UpdatePartnerDto } from '../../dto/update-partner.dto';

@Injectable()
export class UpdatePartnerUseCase {
    constructor(
        @Inject('IPartnerRepository')
        private readonly partnerRepo: IPartnerRepository,
    ) { }

    async execute(companyId: string, id: string, dto: UpdatePartnerDto, userId: string): Promise<Partner> {
        const partner = await this.partnerRepo.findByIdAndTenant(id, companyId);
        if (!partner) {
            throw new NotFoundException(`Partner with ID "${id}" not found`);
        }

        Object.assign(partner, {
            ...dto,
            updatedBy: userId,
        });

        return await this.partnerRepo.save(partner);
    }
}
