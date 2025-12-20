import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@modules/products/domain/entities/product.entity';
import { StockLocation } from './stock-location.entity';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';

@Entity('stock_quant')
export class StockQuant extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Index()
    @ApiProperty()
    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Index()
    @ApiProperty()
    @Column({ name: 'location_id', type: 'uuid' })
    locationId: string;

    @ManyToOne(() => StockLocation)
    @JoinColumn({ name: 'location_id' })
    location: StockLocation;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
    quantity: number;
}
