// Script pour vérifier les utilisateurs dans MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Score = require('./models/Score');

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB\n');

        const users = await User.find({}).select('-password');
        console.log(`📊 Nombre d'utilisateurs : ${users.length}`);
        console.log('\n👥 UTILISATEURS :');
        users.forEach(user => {
            const adminBadge = user.isAdmin ? '👑 ADMIN' : '👤 USER';
            console.log(`  - ${user.username} (${user.email}) ${adminBadge}`);
            console.log(`    ID: ${user._id}`);
            console.log(`    Créé le: ${user.createdAt}`);
            console.log(`    isAdmin: ${user.isAdmin}`);
            console.log(`    Stats: ${user.stats.gamesPlayed} parties jouées\n`);
        });

        const scores = await Score.find({}).populate('user', 'username').sort('-score').limit(10);
        console.log(`\n🏆 TOP 10 SCORES :`);
        scores.forEach((score, index) => {
            console.log(`  ${index + 1}. ${score.user?.username || 'Anonyme'} - ${score.score} points (${score.mode})`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Déconnecté');
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

checkData();
