import { Logger } from '@nestjs/common';
import { PartnersService } from '@modules/partners/services/partners.service';

export async function seedPartners(partnersService: PartnersService, companyId: string, userId: string, logger: Logger) {
    logger.log('🤝 Seeding Partners...');

    const partnersData = [
        {
            name: 'Main Customer',
            email: 'customer@test.com',
            isCustomer: true,
            isVendor: false,
        },
        {
            name: 'Main Vendor',
            email: 'vendor@test.com',
            isCustomer: false,
            isVendor: true,
        },
    ];

    for (const partnerData of partnersData) {
        try {
            await partnersService.create(partnerData as any, companyId, userId);
            logger.log(`  ✅ Created partner: ${partnerData.name}`);
        } catch (error) {
            logger.log(`  ⏭️  Partner may already exist: ${partnerData.name}`);
        }
    }
}
