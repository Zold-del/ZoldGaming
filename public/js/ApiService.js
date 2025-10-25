/**
 * Service API pour communiquer avec le serveur BlockDrop
 */
class ApiService {
    constructor() {
        // URL de base de l'API
        this.baseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api'
            : '/api'; // En production, l'API sera sur le même domaine
        
        // Token d'authentification
        this.token = localStorage.getItem('blockdrop_token');
        
        // Informations de l'utilisateur connecté
        this.currentUser = null;
        
        // Charge l'utilisateur si token présent
        if (this.token) {
            this.loadCurrentUser();
        }
    }

    /**
     * Effectue une requête HTTP
     */
    async request(endpoint, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Ajoute le token si disponible
        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur réseau');
            }

            return data;
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }

    /**
     * Enregistre un nouveau compte
     */
    async register(username, email, password) {
        try {
            const data = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });

            if (data.success) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('blockdrop_token', data.token);
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Connexion
     */
    async login(login, password) {
        try {
            const data = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ login, password })
            });

            if (data.success) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('blockdrop_token', data.token);
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Déconnexion
     */
    async logout() {
        try {
            if (this.token) {
                await this.request('/auth/logout', { method: 'POST' });
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            this.token = null;
            this.currentUser = null;
            localStorage.removeItem('blockdrop_token');
        }
    }

    /**
     * Charge les informations de l'utilisateur connecté
     */
    async loadCurrentUser() {
        try {
            const data = await this.request('/auth/me');
            if (data.success) {
                this.currentUser = data.user;
            }
            return data;
        } catch (error) {
            // Token invalide ou expiré
            this.token = null;
            this.currentUser = null;
            localStorage.removeItem('blockdrop_token');
            throw error;
        }
    }

    /**
     * Met à jour le profil de l'utilisateur
     */
    async updateProfile(updates) {
        try {
            const data = await this.request('/auth/update-profile', {
                method: 'PUT',
                body: JSON.stringify(updates)
            });

            if (data.success) {
                this.currentUser = data.user;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Enregistre un score
     */
    async saveScore(scoreData) {
        try {
            const data = await this.request('/scores', {
                method: 'POST',
                body: JSON.stringify(scoreData)
            });

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupère le classement
     */
    async getLeaderboard(mode = 'classic', limit = 100, period = 'all') {
        try {
            const data = await this.request(`/scores/leaderboard?mode=${mode}&limit=${limit}&period=${period}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupère les scores d'un utilisateur
     */
    async getUserScores(userId, mode = null, limit = 20) {
        try {
            const modeParam = mode ? `&mode=${mode}` : '';
            const data = await this.request(`/scores/user/${userId}?limit=${limit}${modeParam}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupère le rang de l'utilisateur connecté
     */
    async getMyRank(mode = 'classic') {
        try {
            const data = await this.request(`/scores/my-rank?mode=${mode}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Vérifie si l'utilisateur est connecté
     */
    isAuthenticated() {
        return this.token !== null && this.currentUser !== null;
    }

    /**
     * Récupère l'utilisateur connecté
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Vérifie la disponibilité du serveur
     */
    async checkServerHealth() {
        try {
            const response = await fetch(this.baseUrl.replace('/api', '/health'));
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Serveur non disponible:', error);
            return false;
        }
    }
}

// Instance globale du service API
window.apiService = new ApiService();
