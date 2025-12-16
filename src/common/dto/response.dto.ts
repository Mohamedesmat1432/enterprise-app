import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard success response for mutations
 */
export class SuccessResponseDto {
    @ApiProperty({ example: 'Operation completed successfully' })
    message: string;

    @ApiProperty({ example: true })
    success: boolean;

    constructor(message: string) {
        this.message = message;
        this.success = true;
    }
}

/**
 * Standard error response
 */
export class ErrorResponseDto {
    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ example: 'Error message' })
    message: string;

    @ApiProperty({ example: 'Bad Request' })
    error: string;
}

/**
 * Creates a standard success response
 */
export function successResponse(message: string): SuccessResponseDto {
    return new SuccessResponseDto(message);
}
