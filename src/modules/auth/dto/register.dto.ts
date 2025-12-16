import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsStrongPassword } from '@common/index';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({ example: 25, minimum: 1, maximum: 150 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(150)
  age: number;

  @ApiProperty({ example: 'StrongP@ss123' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
