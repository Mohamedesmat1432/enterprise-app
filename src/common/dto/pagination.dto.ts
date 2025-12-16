import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { PAGINATION } from '../constants';

/**
 * Shared pagination query DTO
 * Use this as a base for paginated list endpoints
 */
export class PaginationDto {
    @ApiPropertyOptional({
        minimum: 1,
        default: PAGINATION.DEFAULT_PAGE,
        description: 'Page number',
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number = PAGINATION.DEFAULT_PAGE;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: PAGINATION.MAX_LIMIT,
        default: PAGINATION.DEFAULT_LIMIT,
        description: 'Number of items per page',
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(PAGINATION.MAX_LIMIT)
    @IsOptional()
    limit?: number = PAGINATION.DEFAULT_LIMIT;
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/**
 * Creates a paginated response object
 */
export function createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
}
