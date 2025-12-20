import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class SettingQueryDto {
    @ApiPropertyOptional({ description: 'Search by key or description' })
    @IsOptional()
    @IsString()
    search?: string;

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

    @ApiPropertyOptional({ enum: ['key', 'createdAt'], default: 'key' })
    @IsOptional()
    @IsString()
    sortBy?: string = 'key';

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC' })
    @IsOptional()
    @IsString()
    sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
