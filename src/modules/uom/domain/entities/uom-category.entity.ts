import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@core/domain/entities/base.entity';
import { Uom } from './uom.entity';

@Entity('uom_categories')
export class UomCategory extends BaseTenantEntity {
    @ApiProperty()
    @Column()
    name: string;

    @OneToMany(() => Uom, (uom) => uom.category)
    uoms: Uom[];

    // Domain method
    getReferenceUom(): Uom | undefined {
        return this.uoms?.find(uom => uom.isReference);
    }
}
