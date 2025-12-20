import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';
import { Product } from '@modules/products/domain/entities/product.entity';
import { StockLocation } from '@modules/inventory/domain/entities/stock-location.entity';

@Entity('stock_moves')
export class StockMove extends BaseTenantEntity {
    @Index()
    @ApiProperty()
    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Index()
    @ApiProperty()
    @Column({ name: 'source_location_id', type: 'uuid', nullable: true })
    sourceLocationId: string | null;

    @ManyToOne(() => StockLocation)
    @JoinColumn({ name: 'source_location_id' })
    sourceLocation: StockLocation;

    @Index()
    @ApiProperty()
    @Column({ name: 'dest_location_id', type: 'uuid', nullable: true })
    destLocationId: string | null;

    @ManyToOne(() => StockLocation)
    @JoinColumn({ name: 'dest_location_id' })
    destLocation: StockLocation;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 12, scale: 4 })
    quantity: number;

    @ApiProperty({ enum: ['draft', 'done'], default: 'draft' })
    @Column({ length: 20, default: 'draft' })
    state: 'draft' | 'done';

    @ApiProperty({ required: false })
    @Column({ type: 'text', nullable: true })
    reference: string;
}
