const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Score = require('../models/Score');
const { adminAuth, strictAdminAuth } = require('../middleware/adminAuth');

// ========================================
// DASHBOARD - Statistiques générales
// ========================================
router.get('/dashboard', adminAuth, async (req, res) => {
    try {
        const [
            totalUsers,
            totalGames,
            totalScores,
            activeUsers,
            topScores,
            recentUsers
        ] = await Promise.all([
            User.countDocuments(),
            Score.countDocuments(),
            Score.aggregate([
                { $group: { _id: null, total: { $sum: '$score' } } }
            ]),
            User.countDocuments({ 
                lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }),
            Score.find()
                .populate('user', 'username avatar')
                .sort('-score')
                .limit(10),
            User.find()
                .sort('-createdAt')
                .limit(5)
                .select('username email createdAt avatar')
        ]);

        // Statistiques par mode de jeu
        const gamesByMode = await Score.aggregate([
            {
                $group: {
                    _id: '$mode',
                    count: { $sum: 1 },
                    avgScore: { $avg: '$score' }
                }
            }
        ]);

        // Activité des derniers 7 jours
        const last7Days = await Score.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    games: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalGames,
                    totalScores: totalScores[0]?.total || 0,
                    activeUsers
                },
                topScores,
                recentUsers,
                gamesByMode,
                activity: last7Days
            }
        });
    } catch (error) {
        console.error('Erreur dashboard admin:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques'
        });
    }
});

// ========================================
// GESTION DES UTILISATEURS
// ========================================

// Lister tous les utilisateurs
router.get('/users', adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', role = '' } = req.query;
        
        const query = {};
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) {
            query.role = role;
        }

        const users = await User.find(query)
            .select('-password')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Erreur liste utilisateurs:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des utilisateurs'
        });
    }
});

// Obtenir un utilisateur spécifique
router.get('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Récupérer les scores de l'utilisateur
        const scores = await Score.find({ user: user._id })
            .sort('-score')
            .limit(10);

        res.json({
            success: true,
            data: {
                user,
                scores
            }
        });
    } catch (error) {
        console.error('Erreur détails utilisateur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'utilisateur'
        });
    }
});

// Modifier un utilisateur
router.put('/users/:id', strictAdminAuth, async (req, res) => {
    try {
        const { username, email, role, isActive } = req.body;
        
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Empêcher de modifier son propre rôle
        if (user._id.toString() === req.user._id.toString() && role && role !== user.role) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas modifier votre propre rôle'
            });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (role) user.role = role;
        if (typeof isActive !== 'undefined') user.isActive = isActive;

        await user.save();

        res.json({
            success: true,
            message: 'Utilisateur modifié avec succès',
            data: user
        });
    } catch (error) {
        console.error('Erreur modification utilisateur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la modification de l\'utilisateur'
        });
    }
});

// Supprimer un utilisateur
router.delete('/users/:id', strictAdminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Empêcher de supprimer son propre compte
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas supprimer votre propre compte'
            });
        }

        // Supprimer aussi tous les scores de l'utilisateur
        await Score.deleteMany({ user: user._id });
        await user.deleteOne();

        res.json({
            success: true,
            message: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur suppression utilisateur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'utilisateur'
        });
    }
});

// ========================================
// GESTION DES SCORES
// ========================================

// Lister tous les scores
router.get('/scores', adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 50, mode = '', userId = '' } = req.query;
        
        const query = {};
        if (mode) query.mode = mode;
        if (userId) query.user = userId;

        const scores = await Score.find(query)
            .populate('user', 'username email avatar')
            .sort('-score')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Score.countDocuments(query);

        res.json({
            success: true,
            data: scores,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Erreur liste scores:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des scores'
        });
    }
});

// Supprimer un score
router.delete('/scores/:id', strictAdminAuth, async (req, res) => {
    try {
        const score = await Score.findById(req.params.id);
        
        if (!score) {
            return res.status(404).json({
                success: false,
                message: 'Score non trouvé'
            });
        }

        await score.deleteOne();

        res.json({
            success: true,
            message: 'Score supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur suppression score:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du score'
        });
    }
});

// Supprimer tous les scores d'un utilisateur
router.delete('/users/:id/scores', strictAdminAuth, async (req, res) => {
    try {
        const result = await Score.deleteMany({ user: req.params.id });

        res.json({
            success: true,
            message: `${result.deletedCount} score(s) supprimé(s)`
        });
    } catch (error) {
        console.error('Erreur suppression scores utilisateur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression des scores'
        });
    }
});

// ========================================
// STATISTIQUES AVANCÉES
// ========================================

// Statistiques détaillées
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const [userStats, scoreStats] = await Promise.all([
            User.aggregate([
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 }
                    }
                }
            ]),
            Score.aggregate([
                {
                    $group: {
                        _id: null,
                        totalGames: { $sum: 1 },
                        avgScore: { $avg: '$score' },
                        maxScore: { $max: '$score' },
                        avgLines: { $avg: '$lines' },
                        avgLevel: { $avg: '$level' }
                    }
                }
            ])
        ]);

        // Top joueurs
        const topPlayers = await User.find()
            .sort('-stats.highScore')
            .limit(10)
            .select('username stats.highScore stats.gamesPlayed avatar');

        res.json({
            success: true,
            data: {
                userStats,
                scoreStats: scoreStats[0] || {},
                topPlayers
            }
        });
    } catch (error) {
        console.error('Erreur statistiques:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques'
        });
    }
});

module.exports = router;
