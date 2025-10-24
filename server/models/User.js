const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Le nom d\'utilisateur est requis'],
        unique: true,
        trim: true,
        minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'],
        maxlength: [30, 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères'],
        match: [/^[a-zA-Z0-9_-]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores']
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
        select: false // Ne pas retourner le mot de passe par défaut
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: '🎮'
    },
    stats: {
        gamesPlayed: {
            type: Number,
            default: 0
        },
        highScore: {
            type: Number,
            default: 0
        },
        totalLines: {
            type: Number,
            default: 0
        },
        maxLevel: {
            type: Number,
            default: 0
        },
        totalPlayTime: {
            type: Number,
            default: 0 // en secondes
        }
    },
    rewards: {
        unlocked: [{
            type: String
        }],
        equipped: {
            palette: {
                type: String,
                default: 'classic-palette'
            },
            tetromino: {
                type: String,
                default: 'classic-tetromino'
            }
        }
    },
    settings: {
        language: {
            type: String,
            default: 'fr',
            enum: ['fr', 'en']
        },
        musicVolume: {
            type: Number,
            default: 0.5,
            min: 0,
            max: 1
        },
        soundVolume: {
            type: Number,
            default: 0.5,
            min: 0,
            max: 1
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// Hash le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
    // Ne hash que si le mot de passe a été modifié
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Erreur lors de la comparaison des mots de passe');
    }
};

// Méthode pour obtenir les données publiques de l'utilisateur
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        username: this.username,
        avatar: this.avatar,
        role: this.role, // 👈 AJOUT DU ROLE
        stats: this.stats,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('User', userSchema);
