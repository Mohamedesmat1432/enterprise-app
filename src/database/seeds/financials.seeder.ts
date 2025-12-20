import { Logger } from '@nestjs/common';
import { AccountingService } from '@modules/accounting/services/accounting.service';
import { TaxesService } from '@modules/taxes/services/taxes.service';

export async function seedFinancials(accountingService: AccountingService, taxesService: TaxesService, companyId: string, logger: Logger) {
    logger.log('💰 Seeding Financials...');

    try {
        // Seed Accounts
        // Seed Accounts
        const accounts = [
            { name: 'Accounts Receivable', code: '110000', type: 'asset' as any },
            { name: 'Accounts Payable', code: '210000', type: 'liability' as any },
            { name: 'Bank Account', code: '101000', type: 'asset' as any },
            { name: 'Cash', code: '101001', type: 'asset' as any },
            { name: 'Product Sales', code: '410000', type: 'income' as any },
            { name: 'Cost of Goods Sold', code: '510000', type: 'expense' as any },
            { name: 'General Expenses', code: '510001', type: 'expense' as any },
            { name: 'VAT (Input)', code: '110100', type: 'asset' as any },
            { name: 'VAT (Output)', code: '210100', type: 'liability' as any },
        ];

        for (const acc of accounts) {
            await accountingService.createAccount(companyId, acc);
            logger.log(`  ✅ Created account: ${acc.name} (${acc.code})`);
        }

        // Seed Taxes
        await taxesService.create(companyId, {
            name: 'VAT 15% (Sales)',
            amount: 15,
            type: 'percent',
            isSale: true,
            isPurchase: false,
        });
        await taxesService.create(companyId, {
            name: 'VAT 15% (Purchase)',
            amount: 15,
            type: 'percent',
            isSale: false,
            isPurchase: true,
        });
        logger.log('  ✅ Created Sales & Purchase Taxes (15%)');

    } catch (error) {
        logger.log('  ⏭️  Financials may already exist');
    }
}
