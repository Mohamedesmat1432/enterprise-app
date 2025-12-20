import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { Partner } from '@modules/partners/domain/entities/partner.entity';
import { User } from '@modules/users/domain/entities/user.entity';
import type { SalesOrderLine } from './sales-order-line.entity';

@Entity('sales_orders')
export class SalesOrder extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Index()
    @ApiProperty()
    @Column({ name: 'customer_id', type: 'uuid' })
    customerId: string;

    @ManyToOne(() => Partner)
    @JoinColumn({ name: 'customer_id' })
    customer: Partner;

    @Index()
    @ApiProperty({ required: false })
    @Column({ name: 'salesperson_id', type: 'uuid', nullable: true })
    salespersonId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'salesperson_id' })
    salesperson: User;

    @Index()
    @ApiProperty({ required: false })
    @Column({ name: 'warehouse_id', type: 'uuid', nullable: true })
    warehouseId: string;

    @ManyToOne('Warehouse')
    @JoinColumn({ name: 'warehouse_id' })
    warehouse: any;

    @ApiProperty()
    @Column({ type: 'date', name: 'order_date' })
    orderDate: Date;

    @ApiProperty({ required: false })
    @Column({ type: 'date', name: 'expected_delivery_date', nullable: true })
    expectedDeliveryDate: Date;

    @ApiProperty({ enum: ['draft', 'confirmed', 'delivered', 'cancelled'], default: 'draft' })
    @Column({ length: 20, default: 'draft' })
    state: 'draft' | 'confirmed' | 'delivered' | 'cancelled';

    @ApiProperty({ default: 'USD' })
    @Column({ name: 'currency_code', length: 10, default: 'USD' })
    currencyCode: string;

    @ApiProperty({ default: 0 })
    @Column({ name: 'untaxed_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
    untaxedAmount: number;

    @ApiProperty({ default: 0 })
    @Column({ name: 'tax_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
    taxAmount: number;

    @ApiProperty({ default: 0 })
    @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
    totalAmount: number;

    @OneToMany('SalesOrderLine', 'order')
    lines: SalesOrderLine[];
}
