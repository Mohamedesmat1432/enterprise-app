import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
    @ApiProperty({ example: 'admin', description: 'The name of the role to assign' })
    @IsString()
    @IsNotEmpty()
    roleName: string;
}
