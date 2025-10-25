// Script pour promouvoir ZoldDev en admin
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB\n');

        // Trouver tous les utilisateurs
        const users = await User.find({}).select('-password');
        
        console.log(`📊 Nombre total d'utilisateurs : ${users.length}\n`);
        
        console.log('👥 LISTE DES COMPTES :');
        users.forEach(user => {
            const adminStatus = user.role === 'admin' ? '👑 ADMIN' : user.role === 'moderator' ? '�️ MODERATOR' : '�👤 USER';
            console.log(`  - ${user.username} (${user.email}) ${adminStatus}`);
            console.log(`    ID: ${user._id}`);
            console.log(`    Role: ${user.role}\n`);
        });

        // Promouvoir ZoldDev en admin
        const zoldDev = await User.findOne({ username: 'ZoldDev' });
        
        if (!zoldDev) {
            console.log('❌ Utilisateur "ZoldDev" non trouvé');
            await mongoose.connection.close();
            process.exit(1);
        }

        if (zoldDev.role === 'admin') {
            console.log('✅ ZoldDev est déjà administrateur !');
        } else {
            zoldDev.role = 'admin';
            await zoldDev.save();
            console.log('✅ ZoldDev promu en administrateur !');
            console.log('\n🔗 Reconnectez-vous pour accéder au Panel Admin');
        }

        // Afficher le résultat
        const updatedUser = await User.findOne({ username: 'ZoldDev' }).select('-password');
        console.log('\n📋 STATUT FINAL :');
        console.log(`  Username: ${updatedUser.username}`);
        console.log(`  Email: ${updatedUser.email}`);
        console.log(`  Role: ${updatedUser.role}`);
        console.log(`  ID: ${updatedUser._id}`);

        await mongoose.connection.close();
        console.log('\n✅ Déconnecté');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        console.error(error);
        process.exit(1);
    }
}

fixAdmin();
