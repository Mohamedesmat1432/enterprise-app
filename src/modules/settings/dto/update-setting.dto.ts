import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
    @ApiPropertyOptional({ description: 'Setting value (will be converted based on type)' })
    @IsOptional()
    value?: any;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;
}
