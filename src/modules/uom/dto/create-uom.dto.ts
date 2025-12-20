import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUomDto {
    @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({ example: 'Units' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    ratio: number;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsNotEmpty()
    isReference: boolean;
}
