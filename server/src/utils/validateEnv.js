/**
 * Validates that all required environment variables are set.
 * Call this BEFORE any other module initialization to prevent
 * the server from running with undefined secrets (BUG-12).
 */
const REQUIRED_ENV_VARS = [
    'JWT_SECRET',
    'MONGO_URI',
    'ENCRYPTION_SECRET',
    'ADMIN_SECRET',
    'ADMIN_PASS',
];

export function validateEnv() {
    const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(
            `❌ Missing required environment variables: ${missing.join(', ')}\n` +
            'Please set them in your .env file before starting the server.'
        );
    }
}
