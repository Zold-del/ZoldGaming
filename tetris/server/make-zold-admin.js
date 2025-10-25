// Script pour promouvoir Zold en admin
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function promoteZold() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB\n');

        const user = await User.findOne({ username: 'Zold' });
        
        if (!user) {
            console.log('❌ Utilisateur "Zold" non trouvé');
            process.exit(1);
        }

        if (user.role === 'admin') {
            console.log('✅ Zold est déjà administrateur !');
            process.exit(0);
        }

        user.role = 'admin';
        await user.save();

        console.log('✅ Zold promu en administrateur !');
        console.log('\n🔗 Déconnectez-vous et reconnectez-vous pour voir le bouton Panel Admin');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

promoteZold();
