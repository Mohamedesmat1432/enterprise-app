import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTenantEntity } from '@core/domain/entities/base.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';

@Entity('taxes')
export class Tax extends BaseTenantEntity {
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 5, scale: 2 })
    amount: number;

    @ApiProperty({ enum: ['percent', 'fixed'], default: 'percent' })
    @Column({ length: 20, default: 'percent' })
    type: 'percent' | 'fixed';

    @ApiProperty({ default: true })
    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @ApiProperty({ default: false })
    @Column({ name: 'is_purchase', default: false })
    isPurchase: boolean;

    @ApiProperty({ default: true })
    @Column({ name: 'is_sale', default: true })
    isSale: boolean;

    @Index()
    @ApiProperty()
    @Column({ name: 'account_id', type: 'uuid', nullable: true })
    accountId: string | null;

    // Domain methods
    calculateTax(amount: number): number {
        if (this.type === 'percent') {
            return (amount * this.amount) / 100;
        }
        return this.amount;
    }

    calculateTotalWithTax(amount: number): number {
        return amount + this.calculateTax(amount);
    }
}
