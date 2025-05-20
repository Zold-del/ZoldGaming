// auth.js - Gestion de l'authentification des utilisateurs via localStorage

// Structure des données utilisateur
/*
user = {
    id: string,
    username: string,
    avatar: string (URL),
    coins: number,
    createdAt: date,
    games: {
        gameId: {
            highScore: number,
            timesPlayed: number,
            lastPlayed: date
        }
    },
    inventory: [itemId1, itemId2, ...],
    settings: {
        theme: string,
        sfx: boolean,
        music: boolean
    }
}
*/

// Vérifier si l'utilisateur est connecté
function checkLoginStatus() {
    const currentUser = getCurrentUser();
    const navProfil = document.getElementById('nav-profil');
    const navConnexion = document.getElementById('nav-connexion');
    
    if (currentUser) {
        if (navProfil) navProfil.textContent = currentUser.username;
        if (navConnexion) navConnexion.textContent = 'Déconnexion';
        if (navConnexion) {
            navConnexion.href = '#';
            navConnexion.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
                window.location.reload();
            });
        }
    } else {
        if (navProfil) navProfil.textContent = 'Profil';
        if (navConnexion) navConnexion.textContent = 'Connexion';
        if (navConnexion) navConnexion.href = 'connexion.html';
    }
}

// Récupérer l'utilisateur actuellement connecté
function getCurrentUser() {
    const userJSON = localStorage.getItem('zoldgaming_current_user');
    return userJSON ? JSON.parse(userJSON) : null;
}

// Récupérer tous les utilisateurs enregistrés
function getAllUsers() {
    const usersJSON = localStorage.getItem('zoldgaming_users');
    return usersJSON ? JSON.parse(usersJSON) : [];
}

// Enregistrer les modifications de la liste d'utilisateurs
function saveUsers(users) {
    localStorage.setItem('zoldgaming_users', JSON.stringify(users));
}

// Créer un nouvel utilisateur
function registerUser(username, password) {
    const users = getAllUsers();
    
    // Vérifier si le nom d'utilisateur existe déjà
    if (users.find(user => user.username.toLowerCase() === username.toLowerCase())) {
        return {
            success: false,
            message: 'Ce nom d\'utilisateur est déjà pris'
        };
    }
    
    // Créer le nouvel utilisateur
    const newUser = {
        id: generateUID(),
        username: username,
        password: hashPassword(password), // En production, utilisez un système de hachage sécurisé
        avatar: 'images/avatars/default.png',
        coins: 100, // Monnaie de départ
        createdAt: new Date().toISOString(),
        games: {},
        inventory: [],
        settings: {
            theme: 'default',
            sfx: true,
            music: true
        }
    };
    
    // Ajouter l'utilisateur à la liste
    users.push(newUser);
    saveUsers(users);
    
    // Connecter automatiquement
    const userForStorage = { ...newUser };
    delete userForStorage.password; // Ne jamais stocker le mot de passe en session
    localStorage.setItem('zoldgaming_current_user', JSON.stringify(userForStorage));
    
    return {
        success: true,
        user: userForStorage
    };
}

// Connecter un utilisateur
function loginUser(username, password) {
    const users = getAllUsers();
    const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.password === hashPassword(password)
    );
    
    if (!user) {
        return {
            success: false,
            message: 'Nom d\'utilisateur ou mot de passe incorrect'
        };
    }
    
    // Créer une copie sans le mot de passe
    const userForStorage = { ...user };
    delete userForStorage.password;
    
    // Stocker dans localStorage
    localStorage.setItem('zoldgaming_current_user', JSON.stringify(userForStorage));
    
    return {
        success: true,
        user: userForStorage
    };
}

// Déconnecter l'utilisateur
function logout() {
    localStorage.removeItem('zoldgaming_current_user');
}

// Mettre à jour un utilisateur
function updateUser(userData) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return false;
    
    // Mettre à jour les données utilisateur
    const updatedUser = {
        ...users[userIndex],
        ...userData,
        // Conserver le mot de passe d'origine
        password: users[userIndex].password
    };
    
    users[userIndex] = updatedUser;
    saveUsers(users);
    
    // Mettre à jour l'utilisateur en session
    const userForStorage = { ...updatedUser };
    delete userForStorage.password;
    localStorage.setItem('zoldgaming_current_user', JSON.stringify(userForStorage));
    
    return true;
}

// Mettre à jour le score d'un jeu
function updateGameScore(gameId, score) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return false;
    
    // Initialiser les données du jeu si nécessaire
    if (!users[userIndex].games[gameId]) {
        users[userIndex].games[gameId] = {
            highScore: 0,
            timesPlayed: 0,
            lastPlayed: null
        };
    }
    
    const gameData = users[userIndex].games[gameId];
    
    // Mettre à jour les statistiques
    gameData.timesPlayed++;
    gameData.lastPlayed = new Date().toISOString();
    
    // Mettre à jour le high score si nécessaire
    if (score > gameData.highScore) {
        gameData.highScore = score;
        
        // Bonus de pièces pour nouveau record
        users[userIndex].coins += Math.floor(score / 10);
    } else {
        // Gain de pièces standard
        users[userIndex].coins += Math.floor(score / 20);
    }
    
    users[userIndex].games[gameId] = gameData;
    saveUsers(users);
    
    // Mettre à jour l'utilisateur en session
    const userForStorage = { ...users[userIndex] };
    delete userForStorage.password;
    localStorage.setItem('zoldgaming_current_user', JSON.stringify(userForStorage));
    
    return true;
}

// Fonction simple de hachage (NE PAS UTILISER EN PRODUCTION)
// En production, utilisez bcrypt ou un autre algorithme sécurisé
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

// Initialiser les données utilisateur si c'est la première visite
function initializeUserData() {
    if (!localStorage.getItem('zoldgaming_users')) {
        saveUsers([]);
    }
}

// Appeler l'initialisation au chargement
initializeUserData();
