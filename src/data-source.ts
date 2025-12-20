import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '@modules/users/domain/entities/user.entity';
import { Role } from '@modules/roles/domain/entities/role.entity';
import { Permission } from '@modules/permissions/domain/entities/permission.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { Partner } from '@modules/partners/domain/entities/partner.entity';
import { Uom } from '@modules/uom/domain/entities/uom.entity';
import { UomCategory } from '@modules/uom/domain/entities/uom-category.entity';
import { Product } from '@modules/products/domain/entities/product.entity';
import { Warehouse } from '@modules/inventory/domain/entities/warehouse.entity';
import { StockLocation } from '@modules/inventory/domain/entities/stock-location.entity';
import { StockMove } from '@modules/inventory/domain/entities/stock-move.entity';
import { StockQuant } from '@modules/inventory/domain/entities/stock-quant.entity';
import { SalesOrder } from '@modules/sales/domain/entities/sales-order.entity';
import { SalesOrderLine } from '@modules/sales/domain/entities/sales-order-line.entity';
import { PurchaseOrder } from '@modules/purchases/domain/entities/purchase-order.entity';
import { PurchaseOrderLine } from '@modules/purchases/domain/entities/purchase-order-line.entity';
import { Account } from '@modules/accounting/domain/entities/account.entity';
import { Journal } from '@modules/accounting/domain/entities/journal.entity';
import { JournalEntry } from '@modules/accounting/domain/entities/journal-entry.entity';
import { Invoice } from '@modules/invoices/domain/entities/invoice.entity';
import { InvoiceLine } from '@modules/invoices/domain/entities/invoice-line.entity';
import { Payment } from '@modules/invoices/domain/entities/payment.entity';
import { Tax } from '@modules/taxes/domain/entities/tax.entity';
import { Setting } from '@modules/settings/domain/entities/setting.entity';
import { AuditLog } from '@modules/audit-logs/domain/entities/audit-log.entity';
import { UserSession } from '@modules/auth/domain/entities/user-session.entity';

import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'P@ssw0rd',
  database: process.env.DB_DATABASE || 'enterprise_db',
  entities: [
    User,
    Role,
    Permission,
    Company,
    Partner,
    Uom,
    UomCategory,
    Product,
    Warehouse,
    StockLocation,
    StockMove,
    StockQuant,
    SalesOrder,
    SalesOrderLine,
    PurchaseOrder,
    PurchaseOrderLine,
    Account,
    Journal,
    JournalEntry,
    Invoice,
    InvoiceLine,
    Payment,
    Tax,
    Setting,
    AuditLog,
    UserSession,
  ],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
