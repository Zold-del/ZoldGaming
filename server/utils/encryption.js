/**
 * Utilitaires de cryptage et sécurité JWT
 * Gère le cryptage des tokens, refresh tokens, et rotation automatique
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Algorithme de cryptage
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;

/**
 * Crypte un texte avec AES-256-CBC
 * @param {string} text - Texte à crypter
 * @returns {string} - Texte crypté en format hex
 */
function encrypt(text) {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('Erreur de cryptage:', error);
        throw new Error('Échec du cryptage');
    }
}

/**
 * Décrypte un texte crypté avec AES-256-CBC
 * @param {string} text - Texte crypté en format hex
 * @returns {string} - Texte décrypté
 */
function decrypt(text) {
    try {
        const parts = text.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        const encryptedText = parts.join(':');
        const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
        
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error('Erreur de décryptage:', error);
        throw new Error('Échec du décryptage');
    }
}

/**
 * Génère un token JWT d'accès
 * @param {string} userId - ID de l'utilisateur
 * @param {string} role - Rôle de l'utilisateur (user, admin)
 * @returns {string} - Token JWT
 */
function generateAccessToken(userId, role = 'user') {
    const payload = {
        id: userId,
        role: role,
        type: 'access',
        iat: Date.now()
    };
    
    return jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '15m' } // Token court pour plus de sécurité
    );
}

/**
 * Génère un refresh token JWT
 * @param {string} userId - ID de l'utilisateur
 * @returns {string} - Refresh token crypté
 */
function generateRefreshToken(userId) {
    const payload = {
        id: userId,
        type: 'refresh',
        iat: Date.now()
    };
    
    const token = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
        { expiresIn: '30d' } // Refresh token longue durée
    );
    
    // Crypte le refresh token pour plus de sécurité
    return encrypt(token);
}

/**
 * Vérifie et décrypte un refresh token
 * @param {string} encryptedToken - Refresh token crypté
 * @returns {Object} - Payload décodé du token
 */
function verifyRefreshToken(encryptedToken) {
    try {
        // Décrypte le token
        const token = decrypt(encryptedToken);
        
        // Vérifie le token JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
        );
        
        if (decoded.type !== 'refresh') {
            throw new Error('Type de token invalide');
        }
        
        return decoded;
    } catch (error) {
        console.error('Erreur de vérification du refresh token:', error);
        throw new Error('Refresh token invalide');
    }
}

/**
 * Vérifie un access token
 * @param {string} token - Access token
 * @returns {Object} - Payload décodé du token
 */
function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key'
        );
        
        if (decoded.type !== 'access') {
            throw new Error('Type de token invalide');
        }
        
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expiré');
        }
        throw new Error('Token invalide');
    }
}

/**
 * Génère une paire de tokens (access + refresh)
 * @param {string} userId - ID de l'utilisateur
 * @param {string} role - Rôle de l'utilisateur
 * @returns {Object} - { accessToken, refreshToken }
 */
function generateTokenPair(userId, role = 'user') {
    return {
        accessToken: generateAccessToken(userId, role),
        refreshToken: generateRefreshToken(userId),
        expiresIn: 900 // 15 minutes en secondes
    };
}

/**
 * Rotation de token - Génère un nouveau token à partir d'un ancien valide
 * @param {string} oldToken - Ancien token JWT
 * @returns {Object} - Nouveau token et refresh token
 */
async function rotateToken(oldToken) {
    try {
        const decoded = verifyAccessToken(oldToken);
        
        // Génère une nouvelle paire de tokens
        return generateTokenPair(decoded.id, decoded.role);
    } catch (error) {
        throw new Error('Impossible de faire la rotation du token');
    }
}

/**
 * Hash une valeur avec SHA-256
 * @param {string} value - Valeur à hasher
 * @returns {string} - Hash en hexadécimal
 */
function hash(value) {
    return crypto
        .createHash('sha256')
        .update(value)
        .digest('hex');
}

/**
 * Génère un ID unique sécurisé
 * @returns {string} - ID unique
 */
function generateSecureId() {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * Compare deux valeurs de manière sécurisée (protection timing attack)
 * @param {string} a - Première valeur
 * @param {string} b - Deuxième valeur
 * @returns {boolean} - True si les valeurs sont identiques
 */
function secureCompare(a, b) {
    try {
        return crypto.timingSafeEqual(
            Buffer.from(a),
            Buffer.from(b)
        );
    } catch {
        return false;
    }
}

module.exports = {
    encrypt,
    decrypt,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    verifyAccessToken,
    generateTokenPair,
    rotateToken,
    hash,
    generateSecureId,
    secureCompare
};
