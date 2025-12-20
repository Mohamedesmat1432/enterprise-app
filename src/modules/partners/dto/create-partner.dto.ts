import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePartnerDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'John Doe Enterprises' })
    @IsString()
    @IsOptional()
    legalName?: string;

    @ApiPropertyOptional({ example: 'john@example.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ example: '+1234567890' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ example: '+0987654321' })
    @IsString()
    @IsOptional()
    mobile?: string;

    @ApiPropertyOptional({ example: 'https://johndoe.com' })
    @IsString()
    @IsOptional()
    website?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    street?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    city?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    state?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    postalCode?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    country?: string;

    @ApiPropertyOptional({ default: false })
    @IsBoolean()
    @IsOptional()
    isCustomer?: boolean;

    @ApiPropertyOptional({ default: false })
    @IsBoolean()
    @IsOptional()
    isVendor?: boolean;

    @ApiPropertyOptional({ default: false })
    @IsBoolean()
    @IsOptional()
    isEmployee?: boolean;

    @ApiPropertyOptional({ default: 0 })
    @IsNumber()
    @IsOptional()
    creditLimit?: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    paymentTerms?: string;

    @ApiPropertyOptional({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
