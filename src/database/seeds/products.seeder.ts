import { Logger } from '@nestjs/common';
import { UomService } from '@modules/uom/services/uom.service';
import { ProductsService } from '@modules/products/services/products.service';

export async function seedProducts(uomService: UomService, productsService: ProductsService, companyId: string, userId: string, logger: Logger) {
    logger.log('📦 Seeding Products & UOMs...');

    try {
        // 1. Seed UOM Category
        const category = await uomService.createCategory({ name: 'Unit' }, companyId);

        // 2. Seed UOM
        const uom = await uomService.createUom({
            name: 'Units',
            categoryId: category.id,
            ratio: 1,
            isReference: true,
        }, companyId);

        // 3. Seed Products
        const productsData = [
            {
                name: 'Enterprise Laptop',
                sku: 'LAP-001',
                productType: 'storable' as any,
                uomId: uom.id,
                salePrice: 1200,
                costPrice: 800,
            },
            {
                name: 'Wireless Mouse',
                sku: 'MOU-001',
                productType: 'storable' as any,
                uomId: uom.id,
                salePrice: 50,
                costPrice: 20,
            },
        ];

        for (const prodData of productsData) {
            await productsService.create(prodData as any, companyId, userId);
            logger.log(`  ✅ Created product: ${prodData.name}`);
        }
    } catch (error) {
        logger.log('  ⏭️  Products/UOMs may already exist');
    }
}
