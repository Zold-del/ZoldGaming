// Script pour créer un compte administrateur
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

async function createAdmin() {
    try {
        // Connexion à MongoDB
        console.log('📡 Connexion à MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB\n');

        // Vérifier s'il existe déjà un admin
        const existingAdmin = await User.findOne({ role: 'admin' });
        
        if (existingAdmin) {
            console.log('⚠️  Un administrateur existe déjà !');
            console.log(`   Utilisateur: ${existingAdmin.username}`);
            console.log(`   Email: ${existingAdmin.email}\n`);
            
            const overwrite = await question('Voulez-vous créer un nouvel administrateur quand même ? (oui/non): ');
            if (overwrite.toLowerCase() !== 'oui') {
                console.log('❌ Opération annulée');
                process.exit(0);
            }
            console.log('');
        }

        // Collecter les informations
        console.log('=== CRÉATION D\'UN COMPTE ADMINISTRATEUR ===\n');
        
        const username = await question('Nom d\'utilisateur (min 3 caractères): ');
        const email = await question('Email: ');
        const password = await question('Mot de passe (min 6 caractères): ');
        
        // Validation basique
        if (username.length < 3) {
            throw new Error('Le nom d\'utilisateur doit contenir au moins 3 caractères');
        }
        
        if (!email.includes('@')) {
            throw new Error('Email invalide');
        }
        
        if (password.length < 6) {
            throw new Error('Le mot de passe doit contenir au moins 6 caractères');
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });

        if (existingUser) {
            // Mettre à jour l'utilisateur existant
            console.log('\n⚠️  Cet utilisateur existe déjà. Mise à jour en admin...');
            existingUser.role = 'admin';
            if (password) existingUser.password = password;
            await existingUser.save();
            console.log('✅ Utilisateur mis à jour en tant qu\'administrateur !');
        } else {
            // Créer un nouvel admin
            const admin = new User({
                username,
                email,
                password,
                role: 'admin',
                avatar: '👑'
            });

            await admin.save();
            console.log('\n✅ Compte administrateur créé avec succès !');
        }

        console.log('\n=== INFORMATIONS DU COMPTE ===');
        console.log(`👤 Nom d'utilisateur: ${username}`);
        console.log(`📧 Email: ${email}`);
        console.log(`👑 Rôle: Administrateur`);
        console.log('\n🔗 Accédez au panel admin à: http://localhost:3000/admin.html');
        console.log('');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Lancer le script
createAdmin();
