import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@modules/products/domain/entities/product.entity';
import { Uom } from '@modules/uom/domain/entities/uom.entity';
import type { Invoice } from './invoice.entity';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';

@Entity('invoice_lines')
export class InvoiceLine extends BaseTenantEntity {
    @Index()
    @ApiProperty()
    @Column({ name: 'invoice_id', type: 'uuid' })
    invoiceId: string;

    @ManyToOne('Invoice', 'lines', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'invoice_id' })
    invoice: Invoice;

    @Index()
    @ApiProperty()
    @Column({ name: 'product_id', type: 'uuid', nullable: true })
    productId: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 12, scale: 4 })
    quantity: number;

    @Index()
    @ApiProperty()
    @Column({ name: 'uom_id', type: 'uuid', nullable: true })
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
