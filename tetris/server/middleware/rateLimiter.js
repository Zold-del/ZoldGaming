const rateLimit = require('express-rate-limit');

/**
 * Rate limiter général pour l'API
 */
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        success: false,
        message: 'Trop de requêtes, veuillez réessayer plus tard'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter strict pour l'authentification
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives max
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes'
    }
});

/**
 * Rate limiter pour la création de compte
 */
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 3, // 3 comptes max par heure
    message: {
        success: false,
        message: 'Trop de comptes créés depuis cette IP, veuillez réessayer plus tard'
    }
});

module.exports = { apiLimiter, authLimiter, registerLimiter };
