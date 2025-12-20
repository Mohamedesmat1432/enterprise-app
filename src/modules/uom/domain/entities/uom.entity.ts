import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@core/domain/entities/base.entity';
import { UomCategory } from './uom-category.entity';

@Entity('uom')
export class Uom extends BaseTenantEntity {
    @Index()
    @ApiProperty()
    @Column({ name: 'category_id', type: 'uuid' })
    categoryId: string;

    @ManyToOne(() => UomCategory, (category) => category.uoms)
    @JoinColumn({ name: 'category_id' })
    category: UomCategory;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 12, scale: 4 })
    ratio: number;

    @ApiProperty({ default: false })
    @Column({ name: 'is_reference', default: false })
    isReference: boolean;

    // Domain methods
    convertTo(quantity: number, targetUom: Uom): number {
        // Convert from this UOM to target UOM
        return (quantity * this.ratio) / targetUom.ratio;
    }

    convertFrom(quantity: number, sourceUom: Uom): number {
        // Convert from source UOM to this UOM
        return (quantity * sourceUom.ratio) / this.ratio;
    }
}
