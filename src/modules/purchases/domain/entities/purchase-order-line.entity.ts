import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import type { PurchaseOrder } from './purchase-order.entity';
import { Product } from '@modules/products/domain/entities/product.entity';
import { Uom } from '@modules/uom/domain/entities/uom.entity';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';

@Entity('purchase_order_lines')
export class PurchaseOrderLine extends BaseTenantEntity {
    @Index()
    @ApiProperty()
    @Column({ name: 'order_id', type: 'uuid' })
    orderId: string;

    @ManyToOne('PurchaseOrder', 'lines', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: PurchaseOrder;

    @Index()
    @ApiProperty()
    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 12, scale: 4 })
    quantity: number;

    @Index()
    @ApiProperty()
    @Column({ name: 'uom_id', type: 'uuid' })
    uomId: string;

    @ManyToOne(() => Uom)
    @JoinColumn({ name: 'uom_id' })
    uom: Uom;

    @ApiProperty()
    @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2, default: 0 })
    unitPrice: number;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    subtotal: number;
}
