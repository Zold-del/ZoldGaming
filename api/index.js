require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const connectDB = require('../server/config/database');

// Import des routes
const authRoutes = require('../server/routes/auth');
const userRoutes = require('../server/routes/users');
const scoreRoutes = require('../server/routes/scores');
const adminRoutes = require('../server/routes/admin');
const mongoose = require('mongoose');

// Initialisation de l'application
const app = express();

// Connexion à la base de données
connectDB();

// Middleware de sécurité stricte
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'"],
            mediaSrc: ["'self'", "blob:"],
            objectSrc: ["'none'"],
            frameSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    noSniff: true,
    xssFilter: true
}));

// Protection contre les injections NoSQL
app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`[SECURITY] NoSQL injection attempt blocked: ${key} from ${req.ip}`);
    }
}));

// Protection XSS
app.use(xss());

// Protection HPP
app.use(hpp({
    whitelist: ['sort', 'limit', 'page', 'fields', 'filter', 'stat', 'mode', 'timeframe']
}));

// Configuration CORS
const corsOptions = {
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting global (retiré car problématique sur serverless)
// app.use('/api/', apiLimiter);

// Routes de santé
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Route to inspect MongoDB connection state for debugging
app.get('/api/db-status', (req, res) => {
    try {
        const state = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
        const host = mongoose.connection.host || null;
        res.json({
            success: true,
            connected: state === 1,
            state,
            host
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error reading mongoose state', error: err.message });
    }
});

// Route to inspect presence of environment variables in runtime (safe, no secrets)
app.get('/api/debug-env', (req, res) => {
    try {
        const uri = process.env.MONGODB_URI || null;
        let host = null;
        if (uri) {
            const m = uri.match(/@([^/?]+)/);
            if (m && m[1]) host = m[1]; // host: cluster0.xxxx.mongodb.net
        }
        res.json({
            success: true,
            mongodb_present: !!uri,
            mongodb_length: uri ? uri.length : 0,
            mongodb_host: host
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error reading env', error: err.message });
    }
});

// Routes API (sans le préfixe /api car déjà dans l'URL)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/admin', adminRoutes);

// Route 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err);

    // Erreur de validation Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    // Erreur de cast Mongoose (ID invalide)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'ID invalide'
        });
    }

    // Erreur de duplication MongoDB
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `Ce ${field} est déjà utilisé`
        });
    }

    // Erreur JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token invalide'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expiré'
        });
    }

    // Erreur générique
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erreur serveur',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Export pour Vercel serverless
module.exports = app;
