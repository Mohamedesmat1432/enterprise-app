import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';
import type { Warehouse } from './warehouse.entity';

@Entity('stock_locations')
export class StockLocation extends BaseTenantEntity {
    @Index()
    @ApiProperty()
    @Column({ name: 'warehouse_id', type: 'uuid' })
    warehouseId: string;

    @ManyToOne('Warehouse', 'locations')
    @JoinColumn({ name: 'warehouse_id' })
    warehouse: Warehouse;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty({ enum: ['internal', 'customer', 'vendor'], default: 'internal' })
    @Column({ length: 20, default: 'internal' })
    usage: 'internal' | 'customer' | 'vendor';
}
