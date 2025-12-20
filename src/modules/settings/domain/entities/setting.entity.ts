import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@core/domain/entities/base.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';

@Entity('settings')
export class Setting extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ApiProperty()
    @Column({ unique: true })
    key: string;

    @ApiProperty()
    @Column({ type: 'text' })
    value: string;

    @ApiProperty()
    @Column({ nullable: true })
    description: string;

    @ApiProperty({ enum: ['string', 'number', 'boolean', 'json'], default: 'string' })
    @Column({ length: 20, default: 'string' })
    type: 'string' | 'number' | 'boolean' | 'json';

    // Domain methods
    getTypedValue(): any {
        switch (this.type) {
            case 'number':
                return Number(this.value);
            case 'boolean':
                return this.value === 'true';
            case 'json':
                try {
                    return JSON.parse(this.value);
                } catch {
                    return this.value;
                }
            default:
                return this.value;
        }
    }

    setTypedValue(value: any): void {
        switch (this.type) {
            case 'json':
                this.value = JSON.stringify(value);
                break;
            default:
                this.value = String(value);
        }
    }
}
