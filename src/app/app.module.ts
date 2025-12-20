import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { Permission } from '@modules/permissions/domain/entities/permission.entity';
import { Role } from '@modules/roles/domain/entities/role.entity';
import { User } from '@modules/users/domain/entities/user.entity';
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
import { UsersService } from '@modules/users/services/users.service';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { RolesModule } from '@modules/roles/roles.module';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { PermissionsGuard } from '@modules/auth/guards/permissions.guard';
import { TenantGuard } from '@modules/auth/guards/tenant.guard';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { ProfileModule } from '@modules/profile/profile.module';
import { DashboardModule } from '@modules/dashboard/dashboard.module';
import { CompaniesModule } from '@modules/companies/companies.module';
import { PartnersModule } from '@modules/partners/partners.module';
import { UomModule } from '@modules/uom/uom.module';
import { ProductsModule } from '@modules/products/products.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { SalesModule } from '@modules/sales/sales.module';
import { PurchasesModule } from '@modules/purchases/purchases.module';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { InvoicesModule } from '@modules/invoices/invoices.module';
import { TaxesModule } from '@modules/taxes/taxes.module';
import { SettingsModule } from '@modules/settings/settings.module';
import { AuditLogsModule } from '@modules/audit-logs/audit-logs.module';
import { AuditLogSubscriber } from '@common/subscribers/audit-log.subscriber';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
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

        // CRITICAL: Never use synchronize in production!
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
        // Enable SSL in production
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    // Enhanced throttler configuration
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute for general endpoints
      },
      {
        name: 'auth',
        ttl: 900000, // 15 minutes
        limit: 5, // 5 requests per 15 minutes for auth endpoints
      },
    ]),
    CoreModule,
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    ProfileModule,
    DashboardModule,
    CompaniesModule,
    PartnersModule,
    UomModule,
    ProductsModule,
    InventoryModule,
    SalesModule,
    PurchasesModule,
    AccountingModule,
    InvoicesModule,
    TaxesModule,
    SettingsModule,
    AuditLogsModule,
  ],
  controllers: [AppController],
  providers: [
    Reflector,
    AppService,
    AuditLogSubscriber,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
