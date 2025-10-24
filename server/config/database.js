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
                console.error('❌ Erreur de connexion MongoDB:', err.message || err);
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

module.exports = connectDB;
