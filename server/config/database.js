const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Options Mongoose 6+
            // Les anciennes options comme useNewUrlParser et useUnifiedTopology ne sont plus nécessaires
        });

        console.log(`✅ MongoDB connecté: ${conn.connection.host}`);

        // Gestion des événements de connexion
        mongoose.connection.on('error', (err) => {
            console.error('❌ Erreur MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB déconnecté');
        });

        // Gestion de l'arrêt propre
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('MongoDB déconnecté suite à l\'arrêt de l\'application');
                process.exit(0);
            } catch (err) {
                console.error('Erreur lors de la fermeture de MongoDB:', err);
                process.exit(1);
            }
        });

        return conn;

    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
