import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '@app/app.module';

// Consolidated Core Seeder (Permissions, Companies, Roles, Users)
import { seedCore } from './core.seeder';

// Other Modular Seeders
import { seedPartners } from './partners.seeder';
import { seedProducts } from './products.seeder';
import { seedInventory } from './inventory.seeder';
import { seedFinancials } from './financials.seeder';

// Services
import { PermissionsService } from '@modules/permissions/services/permissions.service';
import { RolesService } from '@modules/roles/services/roles.service';
import { UsersService } from '@modules/users/services/users.service';
import { CompaniesService } from '@modules/companies/services/companies.service';
import { PartnersService } from '@modules/partners/services/partners.service';
import { UomService } from '@modules/uom/services/uom.service';
import { ProductsService } from '@modules/products/services/products.service';
import { InventoryService } from '@modules/inventory/services/inventory.service';
import { AccountingService } from '@modules/accounting/services/accounting.service';
import { TaxesService } from '@modules/taxes/services/taxes.service';

async function seed() {
  const logger = new Logger('Seeder');
  logger.log('🌱 Starting enhanced modular database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    // 1. Core Data (Permissions, Companies, Roles, Users) - Consolidated Seeder
    const { companyId, adminUser } = await seedCore(
      app.get(PermissionsService),
      app.get(CompaniesService),
      app.get(RolesService),
      app.get(UsersService),
      logger
    );

    if (companyId && adminUser) {
      const userId = adminUser.id;

      // 4. Operational Data (Tenant Specific)
      await seedPartners(app.get(PartnersService), companyId, userId, logger);
      await seedProducts(app.get(UomService), app.get(ProductsService), companyId, userId, logger);
      await seedInventory(app.get(InventoryService), companyId, userId, logger);

      // 5. Financial Data
      await seedFinancials(app.get(AccountingService), app.get(TaxesService), companyId, logger);
    }

    logger.log('');
    logger.log('✨ All modules seeded successfully!');
    logger.log('');

  } catch (error) {
    logger.error('❌ Seeding failed:', error.message);
    logger.error(error.stack);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
