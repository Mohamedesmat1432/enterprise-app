import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Awesome Product' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'SKU12345' })
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiPropertyOptional({ example: '1234567890123' })
    @IsString()
    @IsOptional()
    barcode?: string;

    @ApiProperty({ enum: ['stockable', 'consumable', 'service'], default: 'stockable' })
    @IsEnum(['stockable', 'consumable', 'service'])
    @IsNotEmpty()
    productType: 'stockable' | 'consumable' | 'service';

    @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    @IsUUID()
    @IsNotEmpty()
    uomId: string;

    @ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    @IsUUID()
    @IsOptional()
    purchaseUomId?: string;

    @ApiPropertyOptional({ default: 0 })
    @IsNumber()
    @IsOptional()
    salePrice?: number;

    @ApiPropertyOptional({ default: 0 })
    @IsNumber()
    @IsOptional()
    costPrice?: number;

    @ApiPropertyOptional({ default: true })
    @IsBoolean()
    @IsOptional()
    canBeSold?: boolean;

    @ApiPropertyOptional({ default: true })
    @IsBoolean()
    @IsOptional()
    canBePurchased?: boolean;

    @ApiPropertyOptional({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
