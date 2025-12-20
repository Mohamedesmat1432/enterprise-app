import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUomCategoryDto {
    @ApiProperty({ example: 'Unit' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
