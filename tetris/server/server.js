require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const scoreRoutes = require('./routes/scores');
const adminRoutes = require('./routes/admin');

// Import des limiteurs
const { apiLimiter } = require('./middleware/rateLimiter');

// Initialisation de l'application
const app = express();

// Configurer le trust proxy pour Vercel
app.set('trust proxy', 1);

// Connexion à la base de données
connectDB();

// Middleware de sécurité
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        }
    },
    crossOriginEmbedderPolicy: false
}));

// Configuration CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Autorise les requêtes sans origine (comme les apps mobiles ou les requêtes directes)
        if (!origin) return callback(null, true);
        
        // Liste des origines autorisées
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5500',
            'http://localhost:8080',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5500',
            'http://127.0.0.1:8080',
            process.env.CLIENT_URL // URL de production spécifique
        ].filter(Boolean); // Filtre les valeurs null/undefined
        
        // En production, autorise aussi les domaines Vercel
        if (process.env.NODE_ENV === 'production') {
            if (origin.includes('.vercel.app') || origin.includes('zold-gaming') || origin.includes('zolds-projects')) {
                console.log('Origine Vercel autorisée:', origin);
                return callback(null, true);
            }
        }
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Origine non autorisée:', origin);
            console.log('Origines autorisées:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Servir les fichiers statiques du jeu
app.use(express.static('../', {
    index: 'index.html',
    extensions: ['html']
}));

// Rate limiting global
app.use('/api/', apiLimiter);

// Routes de santé
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Routes API
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

// Démarrage du serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║     🎮 BLOCKDROP API SERVER 🎮        ║
╠════════════════════════════════════════╣
║  Port:        ${PORT}                       ║
║  Environment: ${process.env.NODE_ENV || 'development'}           ║
║  Status:      ✅ Running                ║
╚════════════════════════════════════════╝
    `);
});

// Gestion des rejets de promesses non gérées
process.on('unhandledRejection', (err) => {
    console.error('❌ Rejet de promesse non géré:', err);
    // En production, on pourrait arrêter le serveur proprement
    if (process.env.NODE_ENV === 'production') {
        console.log('Arrêt du serveur...');
        process.exit(1);
    }
});

module.exports = app;
