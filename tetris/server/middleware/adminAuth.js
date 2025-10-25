const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour vérifier que l'utilisateur est admin
const adminAuth = async (req, res, next) => {
    try {
        // Récupérer le token
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Accès non autorisé - Token manquant'
            });
        }

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Récupérer l'utilisateur
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Vérifier si l'utilisateur est admin
        if (user.role !== 'admin' && user.role !== 'moderator') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé - Privilèges administrateur requis'
            });
        }

        // Ajouter l'utilisateur à la requête
        req.user = user;
        next();
    } catch (error) {
        console.error('Erreur d\'authentification admin:', error);
        return res.status(401).json({
            success: false,
            message: 'Token invalide ou expiré'
        });
    }
};

// Middleware pour vérifier que l'utilisateur est strictement admin (pas moderator)
const strictAdminAuth = async (req, res, next) => {
    try {
        // D'abord vérifier l'authentification admin normale
        await adminAuth(req, res, () => {});
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé - Seuls les administrateurs peuvent effectuer cette action'
            });
        }
        
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Authentification échouée'
        });
    }
};

module.exports = { adminAuth, strictAdminAuth };
