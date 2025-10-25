const mongoose = require('mongoose');

/**
 * Serverless-friendly mongoose connection with caching.
 *
 * Vercel and other serverless platforms create short-lived function instances.
 * Re-using an existing mongoose connection saves time and avoids opening many
 * connections which can exhaust Atlas connection limits.
 */

const cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        if (!process.env.MONGODB_URI) {
            const msg = 'MONGODB_URI is not defined in environment variables';
            console.error('❌', msg);
            throw new Error(msg);
        }

        // Helper to mask credentials when printing the URI in logs
        const maskUri = (uri) => {
            try {
                // replace username:password@ with ***:***@
                return uri.replace(/\/\/.*:.*@/, '//***:***@');
            } catch (e) {
                return '***';
            }
        };

        // Start the connection and cache the promise
        cached.promise = mongoose.connect(process.env.MONGODB_URI, {})
            .then((mongooseInstance) => {
                console.log(`✅ MongoDB connecté: ${mongooseInstance.connection.host}`);

                // Attach some event listeners once
                mongoose.connection.on('error', (err) => {
                    console.error('❌ Erreur MongoDB:', err);
                });

                mongoose.connection.on('disconnected', () => {
                    console.log('⚠️ MongoDB déconnecté');
                });

                return mongooseInstance;
            })
            .catch((err) => {
                // Clear cached promise so retries can be attempted
                cached.promise = null;

                // Friendly, actionable error messages for common failures
                const msg = err && err.message ? err.message : String(err);
                if (/auth|authentication/i.test(msg)) {
                    console.error('❌ Erreur de connexion MongoDB (auth):', msg);
                    console.error('   → Vérifiez la variable d\'environnement `MONGODB_URI` (mot de passe utilisateur / nom utilisateur).');
                    console.error('   → Assurez-vous que la valeur sur Vercel est l\'URI brute (ex: mongodb+srv://user:pass@...) et ne contient pas de préfixe `MONGODB_URI=`.');
                    console.error('   → Si vous avez changé le mot de passe dans Atlas, mettez à jour `MONGODB_URI` en conséquence.');
                } else if (/ETIMEDOUT|ECONNREFUSED|network/i.test(msg)) {
                    console.error('❌ Erreur de connexion MongoDB (network):', msg);
                    console.error('   → Vérifiez que Network Access dans MongoDB Atlas autorise l\'IP de votre hébergeur (0.0.0.0/0 pour test).');
                } else {
                    console.error('❌ Erreur de connexion MongoDB:', msg);
                }

                // Show masked URI to help debugging without leaking secrets
                try {
                    console.error('   → MONGODB_URI (masquée):', maskUri(process.env.MONGODB_URI || ''));
                } catch (e) {}

                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

module.exports = connectDB;
