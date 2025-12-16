/**
 * PostgreSQL error codes for common database operations
 * Reference: https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export const PG_ERROR_CODES = {
    UNIQUE_VIOLATION: '23505',
    FOREIGN_KEY_VIOLATION: '23503',
    NOT_NULL_VIOLATION: '23502',
    CHECK_VIOLATION: '23514',
} as const;

/**
 * System roles that cannot be deleted
 */
export const SYSTEM_ROLES = ['Admin', 'User'] as const;

/**
 * Default pagination values
 */
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
} as const;

/**
 * Cache TTL values in milliseconds
 */
export const CACHE_TTL = {
    SHORT: 30000, // 30 seconds
    MEDIUM: 60000, // 1 minute
    LONG: 300000, // 5 minutes
    PERMISSIONS: 60000, // 1 minute for permissions cache
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
    AUTH: {
        LOGIN: { limit: 5, ttl: 900000 }, // 5 attempts per 15 minutes
        REGISTER: { limit: 3, ttl: 3600000 }, // 3 registrations per hour
    },
    API: {
        DEFAULT: { limit: 100, ttl: 60000 }, // 100 requests per minute
    },
} as const;

/**
 * Account lockout configuration
 */
export const ACCOUNT_LOCKOUT = {
    MAX_FAILED_ATTEMPTS: 5,
    LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes
} as const;
