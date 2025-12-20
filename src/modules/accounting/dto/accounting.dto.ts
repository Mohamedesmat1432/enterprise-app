import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateAccountDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ enum: ['asset', 'liability', 'income', 'expense'] })
    @IsEnum(['asset', 'liability', 'income', 'expense'])
    type: 'asset' | 'liability' | 'income' | 'expense';
}

export class CreateJournalDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    date: string;
}

export class CreateJournalEntryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    accountId: string;

    @ApiProperty()
    @IsOptional()
    debit?: number;

    @ApiProperty()
    @IsOptional()
    credit?: number;
}
