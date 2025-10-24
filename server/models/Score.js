const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    lines: {
        type: Number,
        required: true,
        min: 0
    },
    level: {
        type: Number,
        required: true,
        min: 1
    },
    duration: {
        type: Number, // Durée de la partie en secondes
        required: true
    },
    mode: {
        type: String,
        enum: ['classic', 'challenge'],
        default: 'classic'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 2592000 // Les scores expirent après 30 jours
    }
});

// Index pour rechercher rapidement les meilleurs scores
scoreSchema.index({ score: -1, createdAt: -1 });
scoreSchema.index({ user: 1, score: -1 });

module.exports = mongoose.model('Score', scoreSchema);
