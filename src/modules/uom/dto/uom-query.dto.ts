import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsUUID, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UomQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ default: 'name' })
    @IsOptional()
    @IsString()
    sortBy?: string = 'name';

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC' })
    @IsOptional()
    @IsString()
    sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
