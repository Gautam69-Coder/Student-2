import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication endpoints (login, register, admin-access).
 * 100 requests per 15-minute window per IP.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Too many requests from this IP, please try again after 15 minutes.' },
});

/**
 * Rate limiter for AI endpoints (assistant, code helper, code checker).
 * 30 requests per 15-minute window per IP.
 */
export const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Too many AI requests. Please wait before sending more.' },
});

/**
 * General rate limiter applied to all routes.
 * 200 requests per 15-minute window per IP.
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Too many requests from this IP, please try again later.' },
});
