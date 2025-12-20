import { IsString, IsNotEmpty, IsArray, IsDateString, ValidateNested, IsUUID, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePurchaseOrderLineDto {
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
}

export class CreatePurchaseOrderDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    vendorId: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    orderDate: string;

    @ApiProperty({ type: [CreatePurchaseOrderLineDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseOrderLineDto)
    lines: CreatePurchaseOrderLineDto[];
}
