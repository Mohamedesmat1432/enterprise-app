import { IsString, IsNotEmpty, IsArray, IsDateString, ValidateNested, IsUUID, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSalesOrderLineDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    uomId: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    unitPrice: number;

    @ApiPropertyOptional({ default: 0 })
    @IsNumber()
    @IsOptional()
    discount?: number;
}

export class CreateSalesOrderDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    salespersonId?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    warehouseId?: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    orderDate: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    expectedDeliveryDate?: string;

    @ApiPropertyOptional({ default: 'USD' })
    @IsString()
    @IsOptional()
    currencyCode?: string;

    @ApiProperty({ type: [CreateSalesOrderLineDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSalesOrderLineDto)
    lines: CreateSalesOrderLineDto[];
}
