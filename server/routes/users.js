const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/users/:userId
 * @desc    Obtenir le profil public d'un utilisateur
 * @access  Public
 */
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            success: true,
            user: user.getPublicProfile()
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
 * @route   PUT /api/users/settings
 * @desc    Mettre à jour les paramètres
 * @access  Private
 */
router.put('/settings',
    authMiddleware,
    [
        body('settings').isObject().withMessage('Format de paramètres invalide'),
        body('settings.language').optional().isIn(['en', 'fr', 'es', 'de']).withMessage('Langue invalide'),
        body('settings.musicVolume').optional().isFloat({ min: 0, max: 1 }).withMessage('Volume invalide'),
        body('settings.sfxVolume').optional().isFloat({ min: 0, max: 1 }).withMessage('Volume invalide')
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

            const user = await User.findById(req.user._id);
            user.settings = { ...user.settings, ...req.body.settings };
            await user.save();

            res.json({
                success: true,
                message: 'Paramètres mis à jour',
                settings: user.settings
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
 * @route   PUT /api/users/avatar
 * @desc    Changer l'avatar
 * @access  Private
 */
router.put('/avatar',
    authMiddleware,
    [
        body('avatar').isString().trim().notEmpty().withMessage('Avatar invalide')
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

            const user = await User.findById(req.user._id);
            user.avatar = req.body.avatar;
            await user.save();

            res.json({
                success: true,
                message: 'Avatar mis à jour',
                avatar: user.avatar
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
 * @route   POST /api/users/rewards/unlock
 * @desc    Déverrouiller une récompense
 * @access  Private
 */
router.post('/rewards/unlock',
    authMiddleware,
    [
        body('rewardId').isString().trim().notEmpty().withMessage('ID de récompense invalide')
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

            const { rewardId } = req.body;
            const user = await User.findById(req.user._id);

            // Vérifie si déjà déverrouillé
            if (user.rewards.unlocked.includes(rewardId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Récompense déjà déverrouillée'
                });
            }

            user.rewards.unlocked.push(rewardId);
            await user.save();

            res.json({
                success: true,
                message: 'Récompense déverrouillée',
                rewards: user.rewards
            });

        } catch (error) {
            console.error('Erreur lors du déverrouillage:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du déverrouillage'
            });
        }
    }
);

/**
 * @route   PUT /api/users/rewards/equip
 * @desc    Équiper une récompense
 * @access  Private
 */
router.put('/rewards/equip',
    authMiddleware,
    [
        body('type').isIn(['colorPalette', 'tetrominoStyle']).withMessage('Type invalide'),
        body('itemId').isString().trim().notEmpty().withMessage('ID invalide')
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

            const { type, itemId } = req.body;
            const user = await User.findById(req.user._id);

            // Vérifie que la récompense est déverrouillée
            if (!user.rewards.unlocked.includes(itemId) && itemId !== 'default') {
                return res.status(400).json({
                    success: false,
                    message: 'Cette récompense n\'est pas déverrouillée'
                });
            }

            // Équipe la récompense
            if (type === 'colorPalette') {
                user.rewards.equippedColorPalette = itemId;
            } else if (type === 'tetrominoStyle') {
                user.rewards.equippedTetrominoStyle = itemId;
            }

            await user.save();

            res.json({
                success: true,
                message: 'Récompense équipée',
                rewards: user.rewards
            });

        } catch (error) {
            console.error('Erreur lors de l\'équipement:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'équipement'
            });
        }
    }
);

/**
 * @route   GET /api/users/search
 * @desc    Rechercher des utilisateurs
 * @access  Public
 */
router.get('/search', async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Requête trop courte (minimum 2 caractères)'
            });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: q, $options: 'i' } }
            ],
            isActive: true
        })
        .select('username avatar stats.highScore stats.gamesPlayed')
        .limit(parseInt(limit));

        res.json({
            success: true,
            count: users.length,
            users: users.map(user => ({
                id: user._id,
                username: user.username,
                avatar: user.avatar,
                highScore: user.stats.highScore,
                gamesPlayed: user.stats.gamesPlayed
            }))
        });

    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche'
        });
    }
});

/**
 * @route   GET /api/users/stats/top
 * @desc    Obtenir les meilleurs joueurs (par statistiques)
 * @access  Public
 */
router.get('/stats/top', async (req, res) => {
    try {
        const { stat = 'highScore', limit = 10 } = req.query;

        const validStats = ['highScore', 'gamesPlayed', 'totalLines', 'maxLevel'];
        if (!validStats.includes(stat)) {
            return res.status(400).json({
                success: false,
                message: 'Statistique invalide'
            });
        }

        const sortField = `stats.${stat}`;
        const users = await User.find({ isActive: true })
            .select('username avatar stats')
            .sort({ [sortField]: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            stat,
            count: users.length,
            users: users.map(user => ({
                id: user._id,
                username: user.username,
                avatar: user.avatar,
                value: user.stats[stat],
                stats: user.stats
            }))
        });

    } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
});

/**
 * @route   DELETE /api/users/me
 * @desc    Supprimer le compte utilisateur (RGPD)
 * @access  Private
 */
router.delete('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Supprime tous les scores de l'utilisateur
        const Score = require('../models/Score');
        await Score.deleteMany({ userId });
        
        // Supprime l'utilisateur
        await User.findByIdAndDelete(userId);
        
        res.json({ 
            success: true, 
            message: 'Compte supprimé avec succès' 
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la suppression du compte' 
        });
    }
});

/**
 * @route   GET /api/users/me/export
 * @desc    Exporter toutes les données utilisateur (RGPD)
 * @access  Private
 */
router.get('/me/export', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const Score = require('../models/Score');
        const scores = await Score.find({ userId: req.user._id });
        
        const exportData = {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                stats: user.stats,
                rewards: user.rewards,
                settings: user.settings,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            },
            scores: scores.map(s => ({
                score: s.score,
                lines: s.lines,
                level: s.level,
                duration: s.duration,
                mode: s.mode,
                createdAt: s.createdAt
            })),
            exportDate: new Date().toISOString()
        };
        
        res.json({ 
            success: true, 
            data: exportData 
        });
    } catch (error) {
        console.error('Erreur lors de l\'export des données:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de l\'export des données' 
        });
    }
});

module.exports = router;
