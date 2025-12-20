import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { Partner } from '@modules/partners/domain/entities/partner.entity';
import type { PurchaseOrderLine } from './purchase-order-line.entity';

@Entity('purchase_orders')
export class PurchaseOrder extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Index()
    @ApiProperty()
    @Column({ name: 'vendor_id', type: 'uuid' })
    vendorId: string;

    @ManyToOne(() => Partner)
    @JoinColumn({ name: 'vendor_id' })
    vendor: Partner;

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

    @ApiProperty({ enum: ['draft', 'confirmed', 'received', 'cancelled'], default: 'draft' })
    @Column({ length: 20, default: 'draft' })
    state: 'draft' | 'confirmed' | 'received' | 'cancelled';

    @ApiProperty({ default: 0 })
    @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
    totalAmount: number;

    @OneToMany('PurchaseOrderLine', 'order')
    lines: PurchaseOrderLine[];
}
