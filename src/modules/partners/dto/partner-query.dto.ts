import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsBoolean } from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';

export class PartnerQueryDto extends PaginationDto {
    @ApiPropertyOptional({ description: 'Search by name, email, or legal name' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by customer status' })
    @IsOptional()
    @IsBoolean()
    isCustomer?: boolean;

    @ApiPropertyOptional({ description: 'Filter by vendor status' })
    @IsOptional()
    @IsBoolean()
    isVendor?: boolean;

    @ApiPropertyOptional({ description: 'Filter by employee status' })
    @IsOptional()
    @IsBoolean()
    isEmployee?: boolean;

    @ApiPropertyOptional({ description: 'Sort by field', default: 'name' })
    @IsOptional()
    @IsString()
    sortBy?: string = 'name';

    @ApiPropertyOptional({
        description: 'Sort order',
        enum: ['ASC', 'DESC'],
        default: 'ASC',
    })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
