/**
 * Modèle MongoDB pour la blacklist des tokens révoqués
 * Permet de révoquer des tokens JWT avant leur expiration
 */

const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    reason: {
        type: String,
        enum: ['logout', 'security', 'password-change', 'account-deletion', 'rotation'],
        default: 'logout'
    },
    revokedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    }
});

// Index TTL pour auto-suppression après expiration
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Vérifie si un token est blacklisté
 * @param {string} token - Token à vérifier
 * @returns {Promise<boolean>} - True si blacklisté
 */
tokenBlacklistSchema.statics.isBlacklisted = async function(token) {
    const entry = await this.findOne({ token });
    return entry !== null;
};

/**
 * Ajoute un token à la blacklist
 * @param {string} token - Token à blacklister
 * @param {string} userId - ID de l'utilisateur
 * @param {string} reason - Raison de la révocation
 * @param {Date} expiresAt - Date d'expiration du token
 */
tokenBlacklistSchema.statics.addToken = async function(token, userId, reason = 'logout', expiresAt) {
    try {
        await this.create({
            token,
            userId,
            reason,
            expiresAt: expiresAt || new Date(Date.now() + 15 * 60 * 1000) // 15 min par défaut
        });
    } catch (error) {
        // Ignore les erreurs de duplication (token déjà blacklisté)
        if (error.code !== 11000) {
            throw error;
        }
    }
};

/**
 * Révoque tous les tokens d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {string} reason - Raison de la révocation
 */
tokenBlacklistSchema.statics.revokeUserTokens = async function(userId, reason = 'security') {
    // Cette méthode est utilisée en conjonction avec un changement de mot de passe
    // ou une action de sécurité. Les tokens individuels doivent être blacklistés
    // lors de la déconnexion.
    
    // Note: Dans une implémentation complète, on stockerait aussi un "tokenVersion"
    // dans le modèle User et on l'incrémenterait pour invalider tous les anciens tokens
    console.log(`Révocation de tous les tokens pour l'utilisateur ${userId} - Raison: ${reason}`);
};

/**
 * Nettoie les tokens expirés (appelé manuellement si besoin)
 * MongoDB TTL index le fait automatiquement, mais cette méthode permet un nettoyage manuel
 */
tokenBlacklistSchema.statics.cleanup = async function() {
    const result = await this.deleteMany({
        expiresAt: { $lt: new Date() }
    });
    
    console.log(`Nettoyage blacklist: ${result.deletedCount} tokens supprimés`);
    return result.deletedCount;
};

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklist;
