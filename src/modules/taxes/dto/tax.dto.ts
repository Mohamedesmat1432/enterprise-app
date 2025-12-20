import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateTaxDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ enum: ['percent', 'fixed'] })
    @IsEnum(['percent', 'fixed'])
    type: 'percent' | 'fixed';

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isPurchase?: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isSale?: boolean;

    @ApiProperty()
    @IsUUID()
    @IsOptional()
    accountId?: string;
}
