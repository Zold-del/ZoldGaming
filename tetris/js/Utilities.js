// Utilities.js - Fonctions et classes utilitaires pour le Tetris

/** 
 * Classe d'utilitaires pour le jeu Tetris
 */
class Utilities {
    /**
     * Génère un nombre entier aléatoire entre min et max inclus
     * @param {number} min - Valeur minimale
     * @param {number} max - Valeur maximale
     * @returns {number} - Nombre aléatoire
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Joue un son si l'audio est activé
     * @param {string} id - ID de l'élément audio
     * @param {boolean} reset - Si true, le son redémarre depuis le début
     */
    static playSound(id, reset = true) {
        const sound = document.getElementById(id);
        if (sound && GameSettings.soundEnabled) {
            if (reset) {
                sound.currentTime = 0;
            }
            sound.volume = GameSettings.soundVolume;
            sound.play().catch(err => console.log("Erreur audio:", err));
        }
    }

    /**
     * Arrête un son
     * @param {string} id - ID de l'élément audio
     */
    static stopSound(id) {
        const sound = document.getElementById(id);
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    /**
     * Gère la musique du jeu
     * @param {string} action - 'play', 'pause' ou 'stop'
     */
    static handleMusic(action) {
        const music = document.getElementById('theme-music');
        if (!music) return;

        music.volume = GameSettings.musicVolume;

        switch (action) {
            case 'play':
                if (GameSettings.musicEnabled) {
                    music.play().catch(err => console.log("Erreur musique:", err));
                }
                break;
            case 'pause':
                music.pause();
                break;
            case 'stop':
                music.pause();
                music.currentTime = 0;
                break;
        }
    }

    /**
     * Sauvegarde les données du jeu dans le localStorage
     * @param {string} key - Clé pour stocker les données
     * @param {object} data - Données à sauvegarder
     */
    static saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error("Erreur lors de la sauvegarde:", e);
        }
    }

    /**
     * Charge les données du jeu depuis le localStorage
     * @param {string} key - Clé pour récupérer les données
     * @returns {object|null} - Données chargées ou null si non trouvées
     */
    static loadData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Erreur lors du chargement:", e);
            return null;
        }
    }

    /**
     * Crée un élément HTML avec des attributs et des enfants
     * @param {string} tag - Tag HTML à créer
     * @param {object} attributes - Attributs à ajouter à l'élément
     * @param {Array|string} children - Enfants à ajouter à l'élément
     * @returns {HTMLElement} - Élément créé
     */
    static createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Ajoute les attributs
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Ajoute les enfants
        if (typeof children === 'string') {
            element.textContent = children;
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (child instanceof HTMLElement) {
                    element.appendChild(child);
                } else if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                }
            });
        }
        
        return element;
    }

    /**
     * Dictionnaire de traduction pour l'interface
     */
    static translations = {        fr: {
            play: 'Jouer',
            challengeMode: 'Mode Défi',
            rewards: 'Récompenses',
            options: 'Options',
            quit: 'Quitter',
            quitConfirm: 'Êtes-vous sûr de vouloir quitter le jeu ?',
            quitGame: 'Quitter le jeu ?',
            cancel: 'Annuler',
            close: 'Fermer',
            pause: 'PAUSE',
            resume: 'Reprendre',
            restart: 'Recommencer',
            apply: 'Appliquer',
            lockedReward: 'Récompense verrouillée',
            backToMenu: 'Retour au menu',
            leaderboard: 'Classement',
            gameOver: 'Partie terminée',
            finalScore: 'Score final',
            nextLevel: 'Niveau suivant',
            lines: 'Lignes',
            score: 'Score',
            level: 'Niveau',            nextPiece: 'Suivant',
            highScore: 'Meilleur score',
            goal: 'Objectif',
            controls: 'Contrôles',
            retry: 'Réessayer',
            music: 'Musique',
            sound: 'Sons',
            volume: 'Volume global',
            musicVolume: 'Volume musique',
            soundVolume: 'Volume sons',
            theme: 'Thème',            
            language: 'Langue / Language',
            thanksForPlaying: 'Merci d\'avoir joué à BLOCKDROP !',
            version: 'Version',
            selectMusic: 'Sélectionner une musique',
            unlockAll: 'Débloquer Tout',
            reset: 'Réinitialiser',
            newRewardUnlocked: 'Nouvelle récompense débloquée:',
            rewardsReset: 'Toutes les récompenses ont été réinitialisées',
            // Traductions pour les publicités
            advertisement: 'PUBLICITÉ',
            closeInSeconds: 'Fermer dans {seconds}s',
            close: 'Fermer',
            showAds: 'Afficher les publicités',
            adsNote: 'Les publicités nous aident à maintenir et améliorer le jeu. Merci de votre soutien !',
            adBlockerDetected: 'Bloqueur de publicités détecté',
            adConnectionError: 'Erreur de connexion au serveur de publicités',
            adNotApproved: 'Publicités non disponibles en développement local'
        },        en: {
            play: 'Play',
            challengeMode: 'Challenge Mode',
            rewards: 'Rewards',
            options: 'Options',
            quit: 'Quit',
            quitConfirm: 'Are you sure you want to quit the game?',
            quitGame: 'Quit Game?',
            cancel: 'Cancel',
            close: 'Close',
            pause: 'PAUSE',
            resume: 'Resume',
            restart: 'Restart',
            apply: 'Apply',
            lockedReward: 'Locked reward',
            backToMenu: 'Back to menu',
            leaderboard: 'Leaderboard',
            gameOver: 'Game Over',
            finalScore: 'Final Score',
            nextLevel: 'Next Level',
            lines: 'Lines',
            score: 'Score',
            level: 'Level',            
            nextPiece: 'Next',
            highScore: 'High Score',
            goal: 'Goal',
            controls: 'Controls',
            music: 'Music',
            sound: 'Sound',
            volume: 'Master Volume',
            musicVolume: 'Music volume',
            soundVolume: 'Sound volume',
            theme: 'Theme',            
            language: 'Language / Langue',
            thanksForPlaying: 'Thanks for playing BLOCKDROP!',
            version: 'Version',
            selectMusic: 'Select music',
            unlockAll: 'Unlock All',
            reset: 'Reset',
            newRewardUnlocked: 'New reward unlocked:',
            rewardsReset: 'All rewards have been reset',
            // Ad translations
            advertisement: 'ADVERTISEMENT',
            closeInSeconds: 'Close in {seconds}s',
            close: 'Close',
            showAds: 'Show advertisements',
            adsNote: 'Advertisements help us maintain and improve the game. Thank you for your support!',
            adBlockerDetected: 'Ad blocker detected',
            adConnectionError: 'Ad server connection error',
            adNotApproved: 'Ads not available in local development'
        }
    }

    /**
     * Traduit un texte en fonction de la langue actuelle
     * @param {string} key - Clé de traduction
     * @returns {string} - Texte traduit
     */
    static translate(key) {
        const lang = GameSettings.language || 'fr';
        const translations = this.translations[lang] || this.translations.fr;
        return translations[key] || key;
    }
}

/**
 * Configuration globale du jeu
 */
const GameSettings = {    musicEnabled: true,
    soundEnabled: true,
    musicVolume: 0.5,
    soundVolume: 0.7,graphicsTheme: 'classic', // classic, neon, pastel
    tetrominoStyle: 'classic', // classic, neon, crystal, pixel, metallic
    language: 'fr', // fr, en
    selectedMusic: 'theme1', // Musique sélectionnée
    highScores: [],
    unlockedRewards: [],
    
    // Sauvegarde les paramètres
    save() {
        Utilities.saveData('blockdrop-settings', {
            musicEnabled: this.musicEnabled,
            soundEnabled: this.soundEnabled,            musicVolume: this.musicVolume,
            soundVolume: this.soundVolume,
            graphicsTheme: this.graphicsTheme,
            tetrominoStyle: this.tetrominoStyle,
            language: this.language
        });
    },
    
    // Charge les paramètres
    load() {
        const saved = Utilities.loadData('blockdrop-settings');
        if (saved) {            this.musicEnabled = saved.musicEnabled ?? true;
            this.soundEnabled = saved.soundEnabled ?? true;
            this.musicVolume = saved.musicVolume ?? 0.5;
            this.soundVolume = saved.soundVolume ?? 0.7;
            this.graphicsTheme = saved.graphicsTheme ?? 'classic';
            this.tetrominoStyle = saved.tetrominoStyle ?? 'classic';
            this.language = saved.language ?? 'fr';
        }
        
        // Charge les scores élevés
        const scores = Utilities.loadData('blockdrop-highscores');
        if (scores) {
            this.highScores = scores;
        }
        
        // Charge les récompenses débloquées
        const rewards = Utilities.loadData('blockdrop-rewards');
        if (rewards) {
            this.unlockedRewards = rewards;
        }
    }
};
