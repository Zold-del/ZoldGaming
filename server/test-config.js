/**
 * Script de test pour vérifier la configuration du serveur
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration du serveur BlockDrop\n');

// Vérification du fichier .env
console.log('1️⃣  Vérification du fichier .env...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('   ✅ Fichier .env trouvé');
    
    // Lecture du contenu
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT', 'NODE_ENV'];
    let allPresent = true;
    
    requiredVars.forEach(varName => {
        if (envContent.includes(varName + '=')) {
            console.log(`   ✅ ${varName} configuré`);
        } else {
            console.log(`   ❌ ${varName} manquant`);
            allPresent = false;
        }
    });
    
    if (!allPresent) {
        console.log('\n   ⚠️  Veuillez configurer toutes les variables dans .env');
    }
} else {
    console.log('   ❌ Fichier .env non trouvé');
    console.log('   ℹ️  Copiez .env.example vers .env et configurez-le');
}

// Vérification de node_modules
console.log('\n2️⃣  Vérification des dépendances...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
    console.log('   ✅ node_modules trouvé');
    
    // Vérifier les packages principaux
    const requiredPackages = ['express', 'mongoose', 'jsonwebtoken', 'bcryptjs'];
    requiredPackages.forEach(pkg => {
        if (fs.existsSync(path.join(nodeModulesPath, pkg))) {
            console.log(`   ✅ ${pkg} installé`);
        } else {
            console.log(`   ❌ ${pkg} manquant`);
        }
    });
} else {
    console.log('   ❌ node_modules non trouvé');
    console.log('   ℹ️  Exécutez: npm install');
}

// Vérification de la structure des dossiers
console.log('\n3️⃣  Vérification de la structure...');
const requiredDirs = ['config', 'models', 'routes', 'middleware'];
requiredDirs.forEach(dir => {
    if (fs.existsSync(path.join(__dirname, dir))) {
        console.log(`   ✅ Dossier ${dir}/ présent`);
    } else {
        console.log(`   ❌ Dossier ${dir}/ manquant`);
    }
});

// Test de connexion MongoDB (si .env existe)
if (fs.existsSync(envPath)) {
    console.log('\n4️⃣  Test de connexion MongoDB...');
    require('dotenv').config();
    
    if (process.env.MONGODB_URI) {
        console.log(`   ℹ️  URI: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);
        
        // Tenter la connexion
        const mongoose = require('mongoose');
        mongoose.connect(process.env.MONGODB_URI)
            .then(() => {
                console.log('   ✅ Connexion MongoDB réussie!');
                mongoose.connection.close();
                printSummary(true);
            })
            .catch(err => {
                console.log('   ❌ Erreur de connexion MongoDB:');
                console.log(`      ${err.message}`);
                console.log('\n   ℹ️  Assurez-vous que MongoDB est lancé');
                printSummary(false);
            });
    } else {
        console.log('   ❌ MONGODB_URI non configuré');
        printSummary(false);
    }
} else {
    printSummary(false);
}

function printSummary(mongoOk) {
    console.log('\n' + '='.repeat(50));
    console.log('📊 RÉSUMÉ');
    console.log('='.repeat(50));
    
    if (fs.existsSync(envPath) && fs.existsSync(nodeModulesPath) && mongoOk) {
        console.log('✅ Configuration complète!');
        console.log('\n🚀 Vous pouvez démarrer le serveur avec:');
        console.log('   npm run dev');
    } else {
        console.log('⚠️  Configuration incomplète');
        console.log('\n📝 Actions requises:');
        if (!fs.existsSync(envPath)) {
            console.log('   1. Créer le fichier .env à partir de .env.example');
        }
        if (!fs.existsSync(nodeModulesPath)) {
            console.log('   2. Installer les dépendances: npm install');
        }
        if (!mongoOk) {
            console.log('   3. Configurer MongoDB et vérifier la connexion');
        }
    }
    console.log('='.repeat(50) + '\n');
}
