// Configuration API
const API_URL = 'http://localhost:3000/api';

// État de l'application
const state = {
    currentPage: 'dashboard',
    currentUser: null,
    users: [],
    scores: [],
    dashboardData: null
};

// Utilitaires
const utils = {
    showLoading() {
        document.getElementById('loading').classList.add('active');
    },

    hideLoading() {
        document.getElementById('loading').classList.remove('active');
    },

    async apiCall(endpoint, options = {}) {
        // Récupère le token du jeu (blockdrop_token)
        const token = localStorage.getItem('blockdrop_token') || localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur API');
        }

        return data;
    },

    formatDate(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },

    formatDateTime(date) {
        return new Date(date).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    showError(message) {
        alert('❌ ' + message);
    },

    showSuccess(message) {
        alert('✅ ' + message);
    },

    async confirm(message) {
        return window.confirm(message);
    }
};

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });
}

function navigateTo(pageName) {
    // Mettre à jour l'état actif de la navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageName);
    });

    // Afficher la bonne page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.toggle('active', page.id === `page-${pageName}`);
    });

    // Mettre à jour le titre
    const titles = {
        dashboard: 'Dashboard',
        users: 'Gestion des utilisateurs',
        scores: 'Gestion des scores',
        stats: 'Statistiques avancées'
    };
    document.getElementById('page-title').textContent = titles[pageName] || pageName;

    // Charger les données de la page
    state.currentPage = pageName;
    loadPageData(pageName);
}

// Chargement des données
async function loadPageData(page) {
    try {
        utils.showLoading();

        switch (page) {
            case 'dashboard':
                await loadDashboard();
                break;
            case 'users':
                await loadUsers();
                break;
            case 'scores':
                await loadScores();
                break;
            case 'stats':
                await loadStats();
                break;
        }
    } catch (error) {
        utils.showError(error.message);
    } finally {
        utils.hideLoading();
    }
}

// Dashboard
async function loadDashboard() {
    const data = await utils.apiCall('/admin/dashboard');
    state.dashboardData = data.data;

    // Mettre à jour les statistiques
    document.getElementById('stat-users').textContent = data.data.overview.totalUsers;
    document.getElementById('stat-games').textContent = data.data.overview.totalGames;
    document.getElementById('stat-scores').textContent = data.data.overview.totalScores.toLocaleString();
    document.getElementById('stat-active').textContent = data.data.overview.activeUsers;

    // Top scores
    const topScoresTable = document.querySelector('#top-scores-table tbody');
    topScoresTable.innerHTML = data.data.topScores.map((score, index) => `
        <tr>
            <td><strong>#${index + 1}</strong></td>
            <td>
                <span style="font-size: 1.2rem">${score.user?.avatar || '🎮'}</span>
                ${score.user?.username || 'Anonyme'}
            </td>
            <td><strong>${score.score.toLocaleString()}</strong></td>
            <td><span class="badge badge-primary">${score.mode}</span></td>
            <td>${utils.formatDate(score.createdAt)}</td>
        </tr>
    `).join('');

    // Utilisateurs récents
    const recentUsersTable = document.querySelector('#recent-users-table tbody');
    recentUsersTable.innerHTML = data.data.recentUsers.map(user => `
        <tr>
            <td><span style="font-size: 1.5rem">${user.avatar}</span></td>
            <td><strong>${user.username}</strong></td>
            <td>${user.email}</td>
            <td>${utils.formatDate(user.createdAt)}</td>
        </tr>
    `).join('');
}

// Utilisateurs
async function loadUsers(page = 1, search = '', role = '') {
    const params = new URLSearchParams({ page, limit: 20, search, role });
    const data = await utils.apiCall(`/admin/users?${params}`);
    state.users = data.data;

    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = data.data.map(user => `
        <tr>
            <td><span style="font-size: 1.5rem">${user.avatar}</span></td>
            <td><strong>${user.username}</strong></td>
            <td>${user.email}</td>
            <td><span class="badge badge-${user.role === 'admin' ? 'danger' : 'primary'}">${user.role}</span></td>
            <td>${user.stats.gamesPlayed}</td>
            <td>${utils.formatDate(user.createdAt)}</td>
            <td>
                <span class="badge badge-${user.isActive ? 'success' : 'danger'}">
                    ${user.isActive ? 'Actif' : 'Inactif'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editUser('${user._id}')">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}', '${user.username}')">🗑️</button>
            </td>
        </tr>
    `).join('');

    // Pagination
    renderPagination('users-pagination', data.pagination, (p) => loadUsers(p, search, role));
}

// Scores
async function loadScores(page = 1, mode = '') {
    const params = new URLSearchParams({ page, limit: 50, mode });
    const data = await utils.apiCall(`/admin/scores?${params}`);
    state.scores = data.data;

    const tbody = document.querySelector('#scores-table tbody');
    tbody.innerHTML = data.data.map(score => `
        <tr>
            <td>
                <span style="font-size: 1.2rem">${score.user?.avatar || '🎮'}</span>
                ${score.user?.username || 'Anonyme'}
            </td>
            <td><strong>${score.score.toLocaleString()}</strong></td>
            <td>${score.lines}</td>
            <td>${score.level}</td>
            <td><span class="badge badge-primary">${score.mode}</span></td>
            <td>${utils.formatDuration(score.duration)}</td>
            <td>${utils.formatDateTime(score.createdAt)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteScore('${score._id}')">🗑️</button>
            </td>
        </tr>
    `).join('');

    // Pagination
    renderPagination('scores-pagination', data.pagination, (p) => loadScores(p, mode));
}

// Statistiques
async function loadStats() {
    const data = await utils.apiCall('/admin/stats');

    // Stats globales
    const globalStats = document.getElementById('global-stats');
    const stats = data.data.scoreStats;
    globalStats.innerHTML = `
        <div class="stat-item">
            <strong>Total parties</strong>
            <span>${stats.totalGames || 0}</span>
        </div>
        <div class="stat-item">
            <strong>Score moyen</strong>
            <span>${Math.round(stats.avgScore || 0).toLocaleString()}</span>
        </div>
        <div class="stat-item">
            <strong>Meilleur score</strong>
            <span>${(stats.maxScore || 0).toLocaleString()}</span>
        </div>
        <div class="stat-item">
            <strong>Lignes moyennes</strong>
            <span>${Math.round(stats.avgLines || 0)}</span>
        </div>
        <div class="stat-item">
            <strong>Niveau moyen</strong>
            <span>${Math.round(stats.avgLevel || 0)}</span>
        </div>
    `;

    // Top joueurs
    const tbody = document.querySelector('#top-players-table tbody');
    tbody.innerHTML = data.data.topPlayers.map((player, index) => `
        <tr>
            <td><strong>#${index + 1}</strong></td>
            <td><span style="font-size: 1.5rem">${player.avatar}</span></td>
            <td><strong>${player.username}</strong></td>
            <td>${player.stats.highScore.toLocaleString()}</td>
            <td>${player.stats.gamesPlayed}</td>
        </tr>
    `).join('');
}

// Pagination
function renderPagination(containerId, pagination, onPageChange) {
    const container = document.getElementById(containerId);
    const { page, pages } = pagination;

    let html = '';

    // Bouton précédent
    html += `<button ${page === 1 ? 'disabled' : ''} onclick="changePage(${page - 1})">←</button>`;

    // Pages
    for (let i = 1; i <= pages; i++) {
        if (i === 1 || i === pages || (i >= page - 2 && i <= page + 2)) {
            html += `<button class="${i === page ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === page - 3 || i === page + 3) {
            html += '<span>...</span>';
        }
    }

    // Bouton suivant
    html += `<button ${page === pages ? 'disabled' : ''} onclick="changePage(${page + 1})">→</button>`;

    container.innerHTML = html;

    // Stocker la fonction de changement de page
    window.changePage = onPageChange;
}

// Actions utilisateurs
async function editUser(userId) {
    const user = state.users.find(u => u._id === userId);
    if (!user) return;

    document.getElementById('edit-user-id').value = user._id;
    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-role').value = user.role;
    document.getElementById('edit-active').checked = user.isActive;

    document.getElementById('modal-edit-user').classList.add('active');
}

async function saveUser() {
    const userId = document.getElementById('edit-user-id').value;
    const userData = {
        username: document.getElementById('edit-username').value,
        email: document.getElementById('edit-email').value,
        role: document.getElementById('edit-role').value,
        isActive: document.getElementById('edit-active').checked
    };

    try {
        utils.showLoading();
        await utils.apiCall(`/admin/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });

        utils.showSuccess('Utilisateur modifié avec succès');
        document.getElementById('modal-edit-user').classList.remove('active');
        await loadUsers();
    } catch (error) {
        utils.showError(error.message);
    } finally {
        utils.hideLoading();
    }
}

async function deleteUser(userId, username) {
    if (!await utils.confirm(`Voulez-vous vraiment supprimer l'utilisateur "${username}" ?\nCette action est irréversible.`)) {
        return;
    }

    try {
        utils.showLoading();
        await utils.apiCall(`/admin/users/${userId}`, {
            method: 'DELETE'
        });

        utils.showSuccess('Utilisateur supprimé avec succès');
        await loadUsers();
    } catch (error) {
        utils.showError(error.message);
    } finally {
        utils.hideLoading();
    }
}

async function deleteScore(scoreId) {
    if (!await utils.confirm('Voulez-vous vraiment supprimer ce score ?')) {
        return;
    }

    try {
        utils.showLoading();
        await utils.apiCall(`/admin/scores/${scoreId}`, {
            method: 'DELETE'
        });

        utils.showSuccess('Score supprimé avec succès');
        await loadScores();
    } catch (error) {
        utils.showError(error.message);
    } finally {
        utils.hideLoading();
    }
}

// Authentification
async function checkAuth() {
    try {
        const data = await utils.apiCall('/auth/me');
        state.currentUser = data.user;

        // Vérifier si admin
        if (data.user.role !== 'admin' && data.user.role !== 'moderator') {
            utils.showError('Accès refusé - Vous n\'êtes pas administrateur');
            logout();
            return false;
        }

        // Afficher les infos admin
        document.getElementById('admin-name').textContent = data.user.username;
        document.getElementById('admin-avatar').textContent = data.user.avatar;

        return true;
    } catch (error) {
        console.error('Erreur auth:', error);
        utils.showError('Session expirée - ' + error.message);
        logout();
        return false;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('blockdrop_token');
    window.location.href = 'index.html';
}

// Event listeners
function setupEventListeners() {
    // Bouton de rafraîchissement
    document.getElementById('btn-refresh').addEventListener('click', () => {
        loadPageData(state.currentPage);
    });

    // Bouton de déconnexion
    document.getElementById('btn-logout').addEventListener('click', logout);

    // Recherche utilisateurs
    let searchTimeout;
    document.getElementById('user-search').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            loadUsers(1, e.target.value, document.getElementById('role-filter').value);
        }, 500);
    });

    // Filtre rôle
    document.getElementById('role-filter').addEventListener('change', (e) => {
        loadUsers(1, document.getElementById('user-search').value, e.target.value);
    });

    // Filtre mode
    document.getElementById('mode-filter').addEventListener('change', (e) => {
        loadScores(1, e.target.value);
    });

    // Modal
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });

    // Sauvegarder utilisateur
    document.getElementById('btn-save-user').addEventListener('click', saveUser);
}

// Initialisation
async function init() {
    // Vérifier l'authentification
    const isAuth = await checkAuth();
    if (!isAuth) return;

    // Configurer la navigation
    setupNavigation();

    // Configurer les event listeners
    setupEventListeners();

    // Charger le dashboard
    await loadPageData('dashboard');
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', init);

// Rendre les fonctions globales pour les onclick
window.editUser = editUser;
window.deleteUser = deleteUser;
window.deleteScore = deleteScore;
