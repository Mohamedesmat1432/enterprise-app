import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsIn } from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';

export class UserQueryDto extends PaginationDto {
    @ApiPropertyOptional({ description: 'Search by name or email' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by role name' })
    @IsOptional()
    @IsString()
    role?: string;

    @ApiPropertyOptional({
        description: 'Filter by status',
        enum: ['active', 'locked', 'disabled'],
    })
    @IsOptional()
    @IsEnum(['active', 'locked', 'disabled'])
    status?: 'active' | 'locked' | 'disabled';

    @ApiPropertyOptional({ description: 'Sort by field', default: 'id' })
    @IsOptional()
    @IsString()
    sortBy?: string = 'id';

    @ApiPropertyOptional({
        description: 'Sort order',
        enum: ['ASC', 'DESC'],
        default: 'ASC',
    })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
