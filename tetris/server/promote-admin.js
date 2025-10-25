// Script pour promouvoir un utilisateur en admin
require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('./models/User');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function promoteToAdmin() {
    try {
        // Connexion à MongoDB
        console.log('📡 Connexion à MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB\n');

        // Lister tous les utilisateurs
        const users = await User.find().select('username email role');
        
        if (users.length === 0) {
            console.log('❌ Aucun utilisateur trouvé');
            process.exit(0);
        }

        console.log('=== UTILISATEURS EXISTANTS ===\n');
        users.forEach((user, index) => {
            const roleIcon = user.role === 'admin' ? '👑' : user.role === 'moderator' ? '⭐' : '👤';
            console.log(`${index + 1}. ${roleIcon} ${user.username} (${user.email}) - ${user.role}`);
        });
        console.log('');

        const choice = await question('Entrez le numéro de l\'utilisateur à promouvoir en admin: ');
        const userIndex = parseInt(choice) - 1;

        if (userIndex < 0 || userIndex >= users.length) {
            console.log('❌ Choix invalide');
            process.exit(1);
        }

        const selectedUser = users[userIndex];
        
        if (selectedUser.role === 'admin') {
            console.log(`\n⚠️  ${selectedUser.username} est déjà administrateur !`);
            process.exit(0);
        }

        // Promouvoir l'utilisateur
        const user = await User.findById(selectedUser._id);
        user.role = 'admin';
        await user.save();

        console.log('\n✅ Utilisateur promu en administrateur !');
        console.log('\n=== INFORMATIONS ===');
        console.log(`👤 Nom: ${user.username}`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`👑 Nouveau rôle: Administrateur`);
        console.log('\n🔗 Reconnectez-vous pour accéder au panel admin');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
}

promoteToAdmin();
