import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsEnum } from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';

export class ProductQueryDto extends PaginationDto {
    @ApiPropertyOptional({ description: 'Search by name, sku, or barcode' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ enum: ['stockable', 'consumable', 'service'] })
    @IsOptional()
    @IsEnum(['stockable', 'consumable', 'service'])
    productType?: 'stockable' | 'consumable' | 'service';

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
