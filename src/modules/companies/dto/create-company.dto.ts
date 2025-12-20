import { IsString, IsNotEmpty, IsOptional, IsEmail, IsUrl, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
    @ApiProperty({ example: 'My Awesome Company' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'My Awesome Company LLC' })
    @IsString()
    @IsOptional()
    legalName?: string;

    @ApiPropertyOptional({ example: 'VAT123456789' })
    @IsString()
    @IsOptional()
    vatNumber?: string;

    @ApiPropertyOptional({ example: 'info@awesome-co.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ example: '+1234567890' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ example: 'https://awesome-co.com' })
    @IsUrl()
    @IsOptional()
    website?: string;

    @ApiPropertyOptional({ example: 'USD' })
    @IsString()
    @IsOptional()
    currencyCode?: string;

    @ApiPropertyOptional({ example: 'UTC' })
    @IsString()
    @IsOptional()
    timezone?: string;

    @ApiPropertyOptional({ example: 'USA' })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiPropertyOptional({ example: '123 Business St, City, Country' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional({ example: 'https://awesome-co.com/logo.png' })
    @IsUrl()
    @IsOptional()
    logoUrl?: string;

    @ApiPropertyOptional({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
