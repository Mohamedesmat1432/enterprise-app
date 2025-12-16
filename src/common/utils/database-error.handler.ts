import { ConflictException } from '@nestjs/common';
import { PG_ERROR_CODES } from '../constants';

/**
 * Handles PostgreSQL database errors and transforms them into appropriate HTTP exceptions
 * @param error - The error thrown by the database operation
 * @param conflictMessage - Custom message for unique constraint violations
 */
export function handleDatabaseError(
    error: any,
    conflictMessage = 'Resource already exists',
): never {
    if (error.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
        throw new ConflictException(conflictMessage);
    }
    throw error;
}

/**
 * Checks if an error is a PostgreSQL unique violation
 */
export function isUniqueViolation(error: any): boolean {
    return error?.code === PG_ERROR_CODES.UNIQUE_VIOLATION;
}

/**
 * Checks if an error is a PostgreSQL foreign key violation
 */
export function isForeignKeyViolation(error: any): boolean {
    return error?.code === PG_ERROR_CODES.FOREIGN_KEY_VIOLATION;
}
