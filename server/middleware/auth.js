const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware pour vérifier le token JWT
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Récupère le token depuis les headers ou les cookies
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }
        
        // Vérifie si le token existe
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Non autorisé - Token manquant'
            });
        }
        
        try {
            // Vérifie et décode le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Récupère l'utilisateur depuis la base de données
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Compte désactivé'
                });
            }
            
            // Ajoute l'utilisateur à la requête
            req.user = user;
            next();
            
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token invalide ou expiré'
            });
        }
        
    } catch (error) {
        console.error('Erreur dans authMiddleware:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

/**
 * Middleware optionnel - Ne bloque pas si pas de token
 */
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id).select('-password');
                
                if (user && user.isActive) {
                    req.user = user;
                }
            } catch (error) {
                // Token invalide, on continue sans utilisateur
            }
        }
        
        next();
        
    } catch (error) {
        next();
    }
};

module.exports = { authMiddleware, optionalAuth };
