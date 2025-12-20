import { Entity, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { Uom } from '@modules/uom/domain/entities/uom.entity';

@Entity('products')
export class Product extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ApiProperty()
    @Column()
    name: string;

    @Index()
    @ApiProperty({ required: false })
    @Column({ nullable: true })
    sku: string;

    @Index()
    @ApiProperty({ required: false })
    @Column({ nullable: true })
    barcode: string;

    @ApiProperty({ enum: ['stockable', 'consumable', 'service'], default: 'stockable' })
    @Column({ name: 'product_type', length: 20, default: 'stockable' })
    productType: 'stockable' | 'consumable' | 'service';

    @Index()
    @ApiProperty()
    @Column({ name: 'uom_id', type: 'uuid' })
    uomId: string;

    @ManyToOne(() => Uom)
    @JoinColumn({ name: 'uom_id' })
    uom: Uom;

    @Index()
    @ApiPropertyOptional()
    @Column({ name: 'purchase_uom_id', type: 'uuid', nullable: true })
    purchaseUomId: string;

    @ManyToOne(() => Uom)
    @JoinColumn({ name: 'purchase_uom_id' })
    purchaseUom: Uom;

    @ApiProperty({ default: 0 })
    @Column({ name: 'sale_price', type: 'decimal', precision: 12, scale: 2, default: 0 })
    salePrice: number;

    @ApiProperty({ default: 0 })
    @Column({ name: 'cost_price', type: 'decimal', precision: 12, scale: 2, default: 0 })
    costPrice: number;

    @ApiProperty({ default: true })
    @Column({ name: 'can_be_sold', default: true })
    canBeSold: boolean;

    @ApiProperty({ default: true })
    @Column({ name: 'can_be_purchased', default: true })
    canBePurchased: boolean;

    @ApiProperty({ default: true })
    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
