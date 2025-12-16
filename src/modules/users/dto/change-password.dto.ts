import { IsStrongPassword } from '@common/index';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: 'OldP@ssw0rd123' })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({ example: 'NewP@ssw0rd456' })
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    newPassword: string;

    @ApiProperty({ example: 'NewP@ssw0rd456' })
    @IsString()
    @IsNotEmpty()
    confirmPassword: string;
}
