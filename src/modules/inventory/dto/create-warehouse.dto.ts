import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseDto {
    @ApiProperty({ example: 'Main Warehouse' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
