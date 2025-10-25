const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const { authMiddleware } = require('../middleware/auth');
const { authLimiter, registerLimiter } = require('../middleware/rateLimiter');
const { generateTokenPair, verifyRefreshToken, hash } = require('../utils/encryption');

/**
 * Génère un token JWT (ancienne méthode - conservée pour compatibilité)
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

/**
 * Génère une paire de tokens sécurisés (nouvelle méthode)
 */
const generateSecureTokens = (userId, role = 'user') => {
    return generateTokenPair(userId, role);
};

/**
 * @route   POST /api/auth/register
 * @desc    Créer un nouveau compte
 * @access  Public
 */
router.post('/register', 
    registerLimiter,
    [
        body('username')
            .trim()
            .isLength({ min: 3, max: 30 })
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Nom d\'utilisateur invalide (3-30 caractères, lettres, chiffres, - et _ uniquement)'),
        body('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('Email invalide'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    ],
    async (req, res) => {
        try {
            // Validation des données
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { username, email, password } = req.body;

            // Vérifie si l'utilisateur existe déjà
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: existingUser.email === email 
                        ? 'Cet email est déjà utilisé' 
                        : 'Ce nom d\'utilisateur est déjà pris'
                });
            }

            // Crée le nouvel utilisateur
            const user = await User.create({
                username,
                email,
                password
            });

            // Génère une paire de tokens sécurisés
            const tokens = generateSecureTokens(user._id, user.role);

            res.status(201).json({
                success: true,
                message: 'Compte créé avec succès',
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                expiresIn: tokens.expiresIn,
                user: user.getPublicProfile()
            });

        } catch (error) {
            console.error('Erreur lors de la création du compte:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création du compte'
            });
        }
    }
);

/**
 * @route   POST /api/auth/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
router.post('/login',
    authLimiter,
    [
        body('login').trim().notEmpty().withMessage('Email ou nom d\'utilisateur requis'),
        body('password').notEmpty().withMessage('Mot de passe requis')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { login, password } = req.body;

            // Cherche l'utilisateur par email ou username
            const user = await User.findOne({
                $or: [
                    { email: login.toLowerCase() },
                    { username: login }
                ]
            }).select('+password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Compte désactivé'
                });
            }

            // Vérifie le mot de passe
            const isMatch = await user.comparePassword(password);

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            // Met à jour la dernière connexion
            user.lastLogin = Date.now();
            await user.save();

            // Génère le token
            const token = generateToken(user._id);

            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                user: user.getPublicProfile()
            });

        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion'
            });
        }
    }
);

/**
 * @route   GET /api/auth/me
 * @desc    Obtenir les informations de l'utilisateur connecté
 * @access  Private
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role, // 👈 AJOUT DU ROLE
                stats: user.stats,
                rewards: user.rewards,
                settings: user.settings,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
});

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Mettre à jour le profil
 * @access  Private
 */
router.put('/update-profile',
    authMiddleware,
    [
        body('avatar').optional().isString().trim(),
        body('settings').optional().isObject()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { avatar, settings } = req.body;
            const user = await User.findById(req.user._id);

            if (avatar) user.avatar = avatar;
            if (settings) {
                user.settings = { ...user.settings, ...settings };
            }

            await user.save();

            res.json({
                success: true,
                message: 'Profil mis à jour',
                user: user.getPublicProfile()
            });

        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour'
            });
        }
    }
);

/**
 * @route   POST /api/auth/logout
 * @desc    Déconnexion
 * @access  Private
 */
router.post('/logout', authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'Déconnexion réussie'
    });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Rafraîchir l'access token avec un refresh token
 * @access  Public (mais nécessite un refresh token valide)
 */
router.post('/refresh',
    [
        body('refreshToken').notEmpty().withMessage('Refresh token requis')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { refreshToken } = req.body;

            // Vérifie si le refresh token est blacklisté
            const isBlacklisted = await TokenBlacklist.isBlacklisted(hash(refreshToken));
            if (isBlacklisted) {
                return res.status(401).json({
                    success: false,
                    message: 'Refresh token invalide'
                });
            }

            // Vérifie et décrypte le refresh token
            const decoded = verifyRefreshToken(refreshToken);

            // Vérifie que l'utilisateur existe toujours
            const user = await User.findById(decoded.id);
            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur introuvable'
                });
            }

            // Génère une nouvelle paire de tokens
            const tokens = generateSecureTokens(user._id, user.role);

            // Optionnel: Blacklist l'ancien refresh token (rotation stricte)
            const tokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours
            await TokenBlacklist.addToken(hash(refreshToken), user._id, 'rotation', tokenExpiry);

            res.json({
                success: true,
                message: 'Token rafraîchi',
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                expiresIn: tokens.expiresIn
            });

        } catch (error) {
            console.error('Erreur lors du refresh:', error);
            res.status(401).json({
                success: false,
                message: 'Refresh token invalide ou expiré'
            });
        }
    }
);

/**
 * @route   POST /api/auth/revoke
 * @desc    Révoquer un token (déconnexion avec blacklist)
 * @access  Private
 */
router.post('/revoke', authMiddleware, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token manquant'
            });
        }

        // Décode le token pour obtenir l'expiration
        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000);

        // Ajoute le token à la blacklist
        await TokenBlacklist.addToken(hash(token), req.user._id, 'logout', expiresAt);

        // Si un refresh token est fourni, le blacklister aussi
        if (req.body.refreshToken) {
            const refreshExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await TokenBlacklist.addToken(hash(req.body.refreshToken), req.user._id, 'logout', refreshExpiry);
        }

        res.json({
            success: true,
            message: 'Token révoqué avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la révocation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la révocation'
        });
    }
});

module.exports = router;
