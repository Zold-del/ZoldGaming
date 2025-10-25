const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Score = require('../models/Score');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   POST /api/scores
 * @desc    Enregistrer un nouveau score
 * @access  Private
 */
router.post('/',
    authMiddleware,
    [
        body('score').isInt({ min: 0 }).withMessage('Score invalide'),
        body('lines').isInt({ min: 0 }).withMessage('Nombre de lignes invalide'),
        body('level').isInt({ min: 1 }).withMessage('Niveau invalide'),
        body('duration').isInt({ min: 0 }).withMessage('Durée invalide'),
        body('mode').optional().isIn(['classic', 'challenge', 'endless']).withMessage('Mode invalide')
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

            const { score, lines, level, duration, mode } = req.body;
            const userId = req.user._id;

            // Crée le nouveau score
            const newScore = await Score.create({
                user: userId,
                score,
                lines,
                level,
                duration,
                mode: mode || 'classic'
            });

            // Met à jour les statistiques de l'utilisateur
            const user = await User.findById(userId);
            
            user.stats.gamesPlayed += 1;
            user.stats.totalLines += lines;
            user.stats.totalPlayTime += duration;
            
            if (score > user.stats.highScore) {
                user.stats.highScore = score;
            }
            
            if (level > user.stats.maxLevel) {
                user.stats.maxLevel = level;
            }

            await user.save();

            // Populate le score avec les infos utilisateur
            await newScore.populate('user', 'username avatar');

            res.status(201).json({
                success: true,
                message: 'Score enregistré',
                score: newScore,
                updatedStats: user.stats
            });

        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du score:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'enregistrement du score'
            });
        }
    }
);

/**
 * @route   GET /api/scores/leaderboard
 * @desc    Obtenir le classement global
 * @access  Public
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const { 
            mode = 'classic', 
            limit = 100, 
            period = 'all' 
        } = req.query;

        let dateFilter = {};
        
        // Filtre par période
        if (period === 'daily') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            dateFilter = { createdAt: { $gte: yesterday } };
        } else if (period === 'weekly') {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            dateFilter = { createdAt: { $gte: lastWeek } };
        } else if (period === 'monthly') {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            dateFilter = { createdAt: { $gte: lastMonth } };
        }

        // Récupère les meilleurs scores avec agrégation pour éviter les doublons
        const leaderboard = await Score.aggregate([
            {
                $match: {
                    mode,
                    ...dateFilter
                }
            },
            {
                $sort: { score: -1 }
            },
            {
                $group: {
                    _id: '$user',
                    bestScore: { $first: '$score' },
                    lines: { $first: '$lines' },
                    level: { $first: '$level' },
                    duration: { $first: '$duration' },
                    createdAt: { $first: '$createdAt' }
                }
            },
            {
                $sort: { bestScore: -1 }
            },
            {
                $limit: parseInt(limit)
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 0,
                    score: '$bestScore',
                    lines: 1,
                    level: 1,
                    duration: 1,
                    createdAt: 1,
                    username: '$user.username',
                    avatar: '$user.avatar',
                    userId: '$user._id'
                }
            }
        ]);

        res.json({
            success: true,
            mode,
            period,
            count: leaderboard.length,
            leaderboard
        });

    } catch (error) {
        console.error('Erreur lors de la récupération du classement:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du classement'
        });
    }
});

/**
 * @route   GET /api/scores/user/:userId
 * @desc    Obtenir l'historique des scores d'un utilisateur
 * @access  Public
 */
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { mode, limit = 20, skip = 0 } = req.query;

        const filter = { user: userId };
        if (mode) filter.mode = mode;

        const scores = await Score.find(filter)
            .sort({ score: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('user', 'username avatar');

        const total = await Score.countDocuments(filter);

        res.json({
            success: true,
            count: scores.length,
            total,
            scores
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des scores:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des scores'
        });
    }
});

/**
 * @route   GET /api/scores/my-rank
 * @desc    Obtenir le rang de l'utilisateur connecté
 * @access  Private
 */
router.get('/my-rank', authMiddleware, async (req, res) => {
    try {
        const { mode = 'classic' } = req.query;
        const userId = req.user._id;

        // Trouve le meilleur score de l'utilisateur
        const userBestScore = await Score.findOne({
            user: userId,
            mode
        }).sort({ score: -1 });

        if (!userBestScore) {
            return res.json({
                success: true,
                rank: null,
                message: 'Aucun score enregistré'
            });
        }

        // Compte combien d'utilisateurs ont un meilleur score
        const betterScores = await Score.aggregate([
            {
                $match: { mode }
            },
            {
                $group: {
                    _id: '$user',
                    bestScore: { $max: '$score' }
                }
            },
            {
                $match: {
                    bestScore: { $gt: userBestScore.score }
                }
            },
            {
                $count: 'count'
            }
        ]);

        const rank = betterScores.length > 0 ? betterScores[0].count + 1 : 1;

        res.json({
            success: true,
            rank,
            score: userBestScore.score,
            mode
        });

    } catch (error) {
        console.error('Erreur lors du calcul du rang:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du calcul du rang'
        });
    }
});

/**
 * @route   DELETE /api/scores/:scoreId
 * @desc    Supprimer un score (admin ou propriétaire)
 * @access  Private
 */
router.delete('/:scoreId', authMiddleware, async (req, res) => {
    try {
        const { scoreId } = req.params;
        const score = await Score.findById(scoreId);

        if (!score) {
            return res.status(404).json({
                success: false,
                message: 'Score non trouvé'
            });
        }

        // Vérifie que l'utilisateur est le propriétaire
        if (score.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Non autorisé'
            });
        }

        await score.deleteOne();

        res.json({
            success: true,
            message: 'Score supprimé'
        });

    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression'
        });
    }
});

module.exports = router;
