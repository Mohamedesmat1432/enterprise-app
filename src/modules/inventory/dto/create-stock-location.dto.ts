import { IsString, IsNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockLocationDto {
    @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    @IsUUID()
    @IsNotEmpty()
    warehouseId: string;

    @ApiProperty({ example: 'Shelf A' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: ['internal', 'customer', 'vendor'], default: 'internal' })
    @IsEnum(['internal', 'customer', 'vendor'])
    @IsNotEmpty()
    usage: 'internal' | 'customer' | 'vendor';
}
