import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, IsOptional, ValidateNested, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceLineDto {
    @ApiProperty()
    @IsUUID()
    @IsOptional()
    productId?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty()
    @IsUUID()
    @IsOptional()
    uomId?: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    unitPrice: number;
}

export class CreateInvoiceDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    partnerId: string;

    @ApiProperty()
    @IsDateString()
    date: string;

    @ApiProperty()
    @IsDateString()
    dueDate: string;

    @ApiProperty({ enum: ['customer_invoice', 'vendor_bill'] })
    @IsEnum(['customer_invoice', 'vendor_bill'])
    type: 'customer_invoice' | 'vendor_bill';

    @ApiProperty({ type: [CreateInvoiceLineDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateInvoiceLineDto)
    lines: CreateInvoiceLineDto[];
}

export class CreatePaymentDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    partnerId: string;

    @ApiProperty()
    @IsUUID()
    @IsOptional()
    invoiceId?: string;

    @ApiProperty()
    @IsDateString()
    date: string;

    @ApiProperty()
    @IsNumber()
    amount: number;

    @ApiProperty({ enum: ['inbound', 'outbound'] })
    @IsEnum(['inbound', 'outbound'])
    type: 'inbound' | 'outbound';

    @ApiProperty()
    @IsString()
    @IsOptional()
    memo?: string;
}
