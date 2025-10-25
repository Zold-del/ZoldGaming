// filepath: c:\Users\antho\Downloads\Jeux.io\tetris (7)\tetris\js\Rewards.js
// Rewards.js - Gestion des récompenses du jeu Tetris

/**
 * Classe pour gérer les récompenses du jeu
 */
class Rewards {
    /**
     * Crée une nouvelle instance du système de récompenses
     * @param {HTMLElement} container - Conteneur où afficher les récompenses
     */
    constructor(container) {
        this.container = container || document.getElementById('app');
        this.onBackToMenuCallback = null;
        this.currentCategory = 'all';
        
        // Définition des récompenses disponibles
        this.rewards = [
            // Cosmétiques - Tetrominos
            {
                id: 'classic-tetromino',
                name: 'Tetrominos Classiques',
                description: 'Le design original des pièces de Tetris',
                type: 'tetromino',
                category: 'tetromino',
                icon: '🎮',
                unlocked: true, // Débloqué par défaut
                applyEffect: () => {
                    GameSettings.tetrominoStyle = 'classic';
                    GameSettings.save();
                    this.applyTetrominoStyle('classic');
                    return 'Style Classique appliqué!';
                }
            },
            {
                id: 'neon-tetromino',
                name: 'Tetrominos Néon',
                description: 'Pièces avec un effet lumineux néon',
                type: 'tetromino',
                category: 'tetromino',
                icon: '💡',
                unlockCondition: { type: 'score', value: 3000 },
                applyEffect: () => {
                    GameSettings.tetrominoStyle = 'neon';
                    GameSettings.save();
                    this.applyTetrominoStyle('neon');
                    return 'Style Néon appliqué!';
                }
            },
            {
                id: 'crystal-tetromino',
                name: 'Tetrominos Cristal',
                description: 'Pièces avec un effet de cristal transparent',
                type: 'tetromino',
                category: 'tetromino',
                icon: '💎',
                unlockCondition: { type: 'level', value: 5 },
                applyEffect: () => {
                    GameSettings.tetrominoStyle = 'crystal';
                    GameSettings.save();
                    this.applyTetrominoStyle('crystal');
                    return 'Style Cristal appliqué!';
                }
            },
            {
                id: 'pixel-tetromino',
                name: 'Tetrominos Pixélisés',
                description: 'Pièces avec un effet rétro pixélisé',
                type: 'tetromino',
                category: 'tetromino',
                icon: '👾',
                unlockCondition: { type: 'lines', value: 50 },
                applyEffect: () => {
                    GameSettings.tetrominoStyle = 'pixel';
                    GameSettings.save();
                    this.applyTetrominoStyle('pixel');
                    return 'Style Pixélisé appliqué!';
                }
            },
            {
                id: 'metallic-tetromino',
                name: 'Tetrominos Métalliques',
                description: 'Pièces avec un effet métallique brillant',
                type: 'tetromino',
                category: 'tetromino',
                icon: '🔧',
                unlockCondition: { type: 'challenge', value: 'lines40' },
                applyEffect: () => {
                    GameSettings.tetrominoStyle = 'metallic';
                    GameSettings.save();
                    this.applyTetrominoStyle('metallic');
                    return 'Style Métallique appliqué!';
                }
            },
            
            // Cosmétiques - Palettes de couleurs
            {
                id: 'classic-palette',
                name: 'Palette Classique',
                description: 'Les couleurs originales du jeu',
                type: 'palette',
                category: 'cosmetic',
                icon: '🎨',
                unlocked: true, // Débloqué par défaut
                applyEffect: () => {
                    GameSettings.graphicsTheme = 'classic';
                    GameSettings.save();
                    this.applyTheme('classic');
                    return 'Palette Classique appliquée!';
                }
            },
            {
                id: 'neon-palette',
                name: 'Palette Néon',
                description: 'Couleurs néon flashy pour un look arcade',
                type: 'palette',
                category: 'cosmetic',
                icon: '💡',
                unlockCondition: { type: 'score', value: 5000 },
                applyEffect: () => {
                    GameSettings.graphicsTheme = 'neon';
                    GameSettings.save();
                    this.applyTheme('neon');
                    return 'Palette Néon appliquée!';
                }
            },
            {
                id: 'pastel-palette',
                name: 'Palette Pastel',
                description: 'Couleurs douces et apaisantes',
                type: 'palette',
                category: 'cosmetic',
                icon: '🌈',
                unlockCondition: { type: 'level', value: 5 },
                applyEffect: () => {
                    GameSettings.graphicsTheme = 'pastel';
                    GameSettings.save();
                    this.applyTheme('pastel');
                    return 'Palette Pastel appliquée!';
                }
            },
            {
                id: 'monochrome-palette',
                name: 'Palette Monochrome',
                description: 'Style noir et blanc minimaliste',
                type: 'palette',
                category: 'cosmetic',
                icon: '⚫⚪',
                unlockCondition: { type: 'challenge', value: 'lines40' },
                applyEffect: () => {
                    GameSettings.graphicsTheme = 'monochrome';
                    GameSettings.save();
                    this.applyTheme('monochrome');
                    return 'Palette Monochrome appliquée!';
                }
            },
            {
                id: 'sunset-palette',
                name: 'Palette Coucher de Soleil',
                description: 'Couleurs chaudes et vibrantes d\'un coucher de soleil',
                type: 'palette',
                category: 'cosmetic',
                icon: '🌅',
                unlockCondition: { type: 'score', value: 10000 },
                applyEffect: () => {
                    GameSettings.graphicsTheme = 'sunset';
                    GameSettings.save();
                    this.applyTheme('sunset');
                    return 'Palette Coucher de Soleil appliquée!';
                }
            },
            {
                id: 'aqua-palette',
                name: 'Palette Aqua',
                description: 'Tons bleus et turquoise des profondeurs marines',
                type: 'palette',
                category: 'cosmetic',
                icon: '🌊',
                unlockCondition: { type: 'level', value: 8 },
                applyEffect: () => {
                    GameSettings.graphicsTheme = 'aqua';
                    GameSettings.save();
                    this.applyTheme('aqua');
                    return 'Palette Aqua appliquée!';
                }
            },
            {
                id: 'retro-palette',
                name: 'Palette Rétro Gaming',
                description: 'Couleurs inspirées des consoles 8-bit classiques',
                type: 'palette',
                category: 'cosmetic',
                icon: '🎮',
                unlockCondition: { type: 'lines', value: 80 },
                applyEffect: () => {
                    GameSettings.graphicsTheme = 'retro';
                    GameSettings.save();
                    this.applyTheme('retro');
                    return 'Palette Rétro Gaming appliquée!';
                }
            },
            {
                id: 'futuristic-palette',
                name: 'Palette Futuriste',
                description: 'Couleurs high-tech du futur avec effets holographiques',
                type: 'palette',
                category: 'cosmetic',
                icon: '👾',
                unlockCondition: { type: 'score', value: 15000 },
                applyEffect: () => {
                    GameSettings.graphicsTheme = 'futuristic';
                    GameSettings.save();
                    this.applyTheme('futuristic');
                    return 'Palette Futuriste appliquée!';
                }
            },
            
            // Badges
            {
                id: 'combo-master',
                name: 'Maître des Combos',
                description: 'Complétez un combo de 5 lignes ou plus',
                type: 'badge',
                category: 'badge',
                icon: '🏆',
                unlockCondition: { type: 'combo', value: 5 },
                applyEffect: () => {
                    return 'Badge obtenu: Maître des Combos! Partagez votre accomplissement!';
                }
            },
            {
                id: 'survivor',
                name: 'Survivant',
                description: 'Atteignez le niveau 15',
                type: 'badge',
                category: 'badge',
                icon: '🛡️',
                unlockCondition: { type: 'level', value: 15 },
                applyEffect: () => {
                    return 'Badge obtenu: Survivant! Vous avez fait preuve d\'endurance!';
                }
            },
            {
                id: 'challenge-champion',
                name: 'Champion du Défi',
                description: 'Complétez tous les défis',
                type: 'badge',
                category: 'badge',
                icon: '👑',
                unlockCondition: { type: 'allChallenges', value: true },
                applyEffect: () => {
                    return 'Badge obtenu: Champion du Défi! Vous êtes le maître incontesté de BlockDrop!';
                }
            },
            // Ajout de nouveaux badges
            {
                id: 'tetris-king',
                name: 'Roi du Tétris',
                description: 'Complétez 4 lignes d\'un coup (Tétris) 5 fois dans une partie',
                type: 'badge',
                category: 'badge',
                icon: '👑',
                unlockCondition: { type: 'tetris', value: 5 },
                applyEffect: () => {
                    return 'Badge obtenu: Roi du Tétris! Vos compétences d\'empilement sont légendaires!';
                }
            },
            {
                id: 'speed-demon',
                name: 'Démon de la Vitesse',
                description: 'Atteignez le niveau 20',
                type: 'badge',
                category: 'badge',
                icon: '😈',
                unlockCondition: { type: 'level', value: 20 },
                applyEffect: () => {
                    return 'Badge obtenu: Démon de la Vitesse! Même à cette vitesse, vous restez précis!';
                }
            },
            {
                id: 'score-hunter',
                name: 'Chasseur de Score',
                description: 'Atteignez un score de 25000 points',
                type: 'badge',
                category: 'badge',
                icon: '🔥',
                unlockCondition: { type: 'score', value: 25000 },
                applyEffect: () => {
                    return 'Badge obtenu: Chasseur de Score! Votre nom restera dans les annales!';
                }
            }
        ];
    }

    /**
     * Vérifie si une récompense est débloquée
     * @param {Object} reward - Récompense à vérifier
     * @returns {boolean} - True si débloquée
     */
    isUnlocked(reward) {
        // Si la récompense est débloquée par défaut
        if (reward.unlocked) {
            return true;
        }
        
        // En mode local, toutes les récompenses sont débloquées automatiquement
        if (this.isLocalMode()) {
            return true;
        }
        
        // Vérifie dans les récompenses débloquées sauvegardées
        return GameSettings.unlockedRewards.includes(reward.id);
    }
    
    /**
     * Vérifie si le jeu est en mode local (hors itch.io)
     * @returns {boolean} - True si en mode local
     */
    isLocalMode() {
        // Utilise la même logique que AdManager.js pour détecter si on est en mode local
        const isLocalFile = window.location.protocol === 'file:';
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.startsWith('192.168.') ||
                           window.location.hostname.startsWith('10.') ||
                           window.location.hostname.indexOf('.local') !== -1;
                           
        const isItchIo = window.location.hostname.indexOf('itch.io') !== -1;
        
        return isLocalFile || (isLocalhost && !isItchIo);
    }
    
    /**
     * Applique un style de tetromino spécifique
     * @param {string} styleId - ID du style à appliquer
     */
    applyTetrominoStyle(styleId) {
        // Supprime tous les styles de tetrominos existants
        document.documentElement.classList.remove(
            'tetromino-style-classic',
            'tetromino-style-neon',
            'tetromino-style-crystal',
            'tetromino-style-pixel',
            'tetromino-style-metallic'
        );
        
        // Applique le nouveau style
        document.documentElement.classList.add(`tetromino-style-${styleId}`);
        
        // Sauvegarde le style dans les paramètres
        GameSettings.tetrominoStyle = styleId;
        GameSettings.save();
        
        console.log(`Style de tetromino appliqué: ${styleId}`);
    }
    
    /**
     * Applique un thème de couleurs spécifique
     * @param {string} themeId - ID du thème à appliquer
     */
    applyTheme(themeId) {
        // Définition des thèmes
        const themes = {
            'classic': {
                primary: '#00ffe7',
                secondary: '#ff00a2',
                background: '#181825'
            },
            'neon': {
                primary: '#00ff41',
                secondary: '#ff00ff',
                background: '#000000'
            },
            'pastel': {
                primary: '#a5d8ff',
                secondary: '#ffc7c7',
                background: '#343a40'
            },
            'monochrome': {
                primary: '#ffffff',
                secondary: '#aaaaaa',
                background: '#111111'
            },
            'sunset': {
                primary: '#ff9e00',
                secondary: '#ff0058',
                background: '#2c0735'
            },
            'aqua': {
                primary: '#00ffcc',
                secondary: '#0088ff',
                background: '#001f3f'
            },
            'retro': {
                primary: '#ffcc00',
                secondary: '#cc3300',
                background: '#006666'
            },
            'futuristic': {
                primary: '#4deeea',
                secondary: '#b643cd',
                background: '#1a1b2e'
            }
        };
        
        // Applique le thème au DOM
        const theme = themes[themeId] || themes.classic;
        const root = document.documentElement;
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--secondary', theme.secondary);
        root.style.setProperty('--background', theme.background);
    }
    
    /**
     * Applique un fond d'écran spécifique
     * @param {string} bgId - ID du fond d'écran à appliquer
     */
    applyBackground(bgId) {
        // Mets à jour l'URL du fond d'écran dans le CSS
        const root = document.documentElement;
        const bgUrls = {
            'city': 'url(assets/images/backgrounds/city.png)',
            'space': 'url(assets/images/backgrounds/space.png)',
            'retro': 'url(assets/images/backgrounds/retro.png)',
            'matrix': 'url(assets/images/backgrounds/matrix.png)',
            'arcade': 'url(assets/images/backgrounds/arcade.png)'
        };
        
        const bgUrl = bgUrls[bgId] || '';
        root.style.setProperty('--background-image', bgUrl);
    }
    
    /**
     * Applique l'effet d'une récompense
     * @param {string} rewardId - ID de la récompense
     * @returns {string} - Message de retour
     */
    applyReward(rewardId) {
        const reward = this.rewards.find(r => r.id === rewardId);
        if (!reward || !this.isUnlocked(reward)) {
            return 'Cette récompense n\'est pas encore débloquée.';
        }
        
        if (typeof reward.applyEffect === 'function') {
            return reward.applyEffect();
        }
        
        return 'Cette récompense n\'a pas d\'effet applicable.';
    }
    
    /**
     * Affiche l'écran des récompenses
     */
    render() {
        // Vide le conteneur
        this.container.innerHTML = '';
        
        // Crée le conteneur des récompenses
        const rewardsContainer = Utilities.createElement('div', { class: 'rewards-container' });
        
        // Ajoute le titre
        const title = Utilities.createElement('h1', { class: 'rewards-title' }, Utilities.translate('rewards').toUpperCase());
        rewardsContainer.appendChild(title);
        
        // Crée les catégories de récompenses
        const categories = Utilities.createElement('div', { class: 'rewards-categories' });
        
        // Définition des catégories
        const categoryOptions = GameSettings.language === 'fr' ? [
            { id: 'all', name: 'Toutes' },
            { id: 'tetromino', name: 'Tetrominos' },
            { id: 'cosmetic', name: 'Palettes' },
            { id: 'badge', name: 'Badges' }
        ] : [
            { id: 'all', name: 'All' },
            { id: 'tetromino', name: 'Tetrominos' },
            { id: 'cosmetic', name: 'Palettes' },
            { id: 'badge', name: 'Badges' }
        ];
        
        // Ajoute les boutons de catégories
        categoryOptions.forEach(cat => {
            const categoryBtn = Utilities.createElement('div', {
                class: `reward-category ${this.currentCategory === cat.id ? 'active' : ''}`,
                dataset: { category: cat.id }
            }, cat.name);
            
            // Ajoute l'écouteur de clic pour changer de catégorie
            categoryBtn.addEventListener('click', () => {
                this.currentCategory = cat.id;
                this.render();
            });
            
            categories.appendChild(categoryBtn);
        });
        
        rewardsContainer.appendChild(categories);
        
        // Crée la grille des récompenses
        const rewardsGrid = Utilities.createElement('div', { class: 'rewards-grid' });
        
        // Filtre les récompenses par catégorie
        const filteredRewards = this.currentCategory === 'all' 
            ? this.rewards
            : this.rewards.filter(reward => reward.category === this.currentCategory);
        
        // Ajoute chaque récompense à la grille
        filteredRewards.forEach(reward => {
            const isUnlocked = this.isUnlocked(reward);
            
            // Create container with proper height for the button positioning
            const rewardItem = Utilities.createElement('div', {
                class: `reward-item ${isUnlocked ? '' : 'locked'}`,
                dataset: { rewardId: reward.id },
                style: 'display: flex; flex-direction: column; min-height: 220px; padding-bottom: 50px;'
            });
            
            // Add the icon
            const iconElem = Utilities.createElement('div', { class: 'reward-icon' }, reward.icon);
            rewardItem.appendChild(iconElem);
            
            // Add the name
            const nameElem = Utilities.createElement('div', { class: 'reward-name' }, reward.name);
            rewardItem.appendChild(nameElem);
            
            // Add the description
            const descElem = Utilities.createElement('div', { 
                class: 'reward-desc',
                style: 'flex-grow: 1; margin-bottom: 10px;' 
            }, isUnlocked ? reward.description : Utilities.translate('lockedReward'));
            rewardItem.appendChild(descElem);
            
            // Add the apply button if unlocked and applicable
            if (isUnlocked && reward.type !== 'badge') {
                const btnContainer = Utilities.createElement('div', {
                    style: 'width: 100%; position: absolute; bottom: 15px; left: 0; display: flex; justify-content: center;'
                });
                
                const applyBtn = Utilities.createElement('button', { 
                    class: 'apply-reward-btn',
                    dataset: { rewardId: reward.id },
                    style: 'position: static; transform: none; margin: 0;'
                }, Utilities.translate('apply'));
                
                btnContainer.appendChild(applyBtn);
                rewardItem.appendChild(btnContainer);
            }
            
            // Ajoute une info-bulle pour les récompenses verrouillées
            if (!isUnlocked && reward.unlockCondition) {
                let unlockText = GameSettings.language === 'fr' ? 'Condition de déverrouillage: ' : 'Unlock condition: ';
                
                if (GameSettings.language === 'fr') {
                    switch(reward.unlockCondition.type) {
                        case 'score':
                            unlockText += `Atteindre ${reward.unlockCondition.value} points`;
                            break;
                        case 'level':
                            unlockText += `Atteindre le niveau ${reward.unlockCondition.value}`;
                            break;
                        case 'lines':
                            unlockText += `Compléter ${reward.unlockCondition.value} lignes`;
                            break;
                        case 'combo':
                            unlockText += `Réaliser un combo de ${reward.unlockCondition.value} lignes`;
                            break;
                        case 'challenge':
                            unlockText += `Compléter le défi "${reward.unlockCondition.value}"`;
                            break;
                        case 'allChallenges':
                            unlockText += "Compléter tous les défis";
                            break;
                        case 'tetris':
                            unlockText += `Réaliser ${reward.unlockCondition.value} Tetris dans une partie`;
                            break;
                        default:
                            unlockText += "Déverrouillage spécial";
                    }
                } else {
                    switch(reward.unlockCondition.type) {
                        case 'score':
                            unlockText += `Reach ${reward.unlockCondition.value} points`;
                            break;
                        case 'level':
                            unlockText += `Reach level ${reward.unlockCondition.value}`;
                            break;
                        case 'lines':
                            unlockText += `Complete ${reward.unlockCondition.value} lines`;
                            break;
                        case 'combo':
                            unlockText += `Get a ${reward.unlockCondition.value} line combo`;
                            break;
                        case 'challenge':
                            unlockText += `Complete the "${reward.unlockCondition.value}" challenge`;
                            break;
                        case 'allChallenges':
                            unlockText += "Complete all challenges";
                            break;
                        case 'tetris':
                            unlockText += `Get ${reward.unlockCondition.value} Tetris in one game`;
                            break;
                        default:
                            unlockText += "Special unlock";
                    }
                }
                
                const tooltip = Utilities.createElement('div', { class: 'reward-tooltip' }, unlockText);
                rewardItem.appendChild(tooltip);
                
                // Affiche la tooltip au survol
                rewardItem.addEventListener('mouseenter', () => {
                    tooltip.style.display = 'block';
                });
                
                rewardItem.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                });
            }
            
            // Pour les badges débloqués, ajouter un effet spécial
            if (isUnlocked && reward.type === 'badge') {
                rewardItem.classList.add('badge-unlocked');
            }
            
            rewardsGrid.appendChild(rewardItem);
        });
        
        rewardsContainer.appendChild(rewardsGrid);
        
        // Ajoute les écouteurs d'événements pour les boutons d'application
        setTimeout(() => {
            const applyButtons = document.querySelectorAll('.apply-reward-btn');
            applyButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const rewardId = btn.dataset.rewardId;
                    const message = this.applyReward(rewardId);
                    this.showNotification(message);
                });
            });
        }, 100);
        
        // Ajoute le bouton retour
        const buttonContainer = Utilities.createElement('div', {
            style: 'display: flex; justify-content: center; gap: 1rem; margin-top: 2rem;'
        });
        
        const backButton = Utilities.createElement('button', {}, Utilities.translate('backToMenu'));
        backButton.addEventListener('click', () => {
            if (this.onBackToMenuCallback) {
                this.onBackToMenuCallback();
            }
        });
        buttonContainer.appendChild(backButton);
        
        // Ajoute les boutons de développement avec un code secret (Shift+D)
        let keySequence = '';
        document.addEventListener('keydown', (e) => {
            // Ajoute la touche à la séquence
            keySequence += e.key;
            
            // Limite la taille de la séquence
            if (keySequence.length > 10) {
                keySequence = keySequence.substring(1);
            }
            
            // Vérifie si la séquence contient "ShiftD"
            if (keySequence.includes('ShiftD') && this.container.querySelector('.rewards-container')) {
                // Si le bouton de développement n'est pas déjà présent
                if (!document.getElementById('dev-unlock-all')) {
                    const devUnlockAll = Utilities.createElement('button', {
                        id: 'dev-unlock-all',
                        style: 'background: #dc3545; margin-left: 1rem;'
                    }, Utilities.translate('unlockAll'));
                    
                    devUnlockAll.addEventListener('click', () => {
                        this.unlockAllRewards();
                    });
                    
                    const devResetAll = Utilities.createElement('button', {
                        id: 'dev-reset-all',
                        style: 'background: #6c757d; margin-left: 0.5rem;'
                    }, Utilities.translate('reset'));
                    
                    devResetAll.addEventListener('click', () => {
                        this.resetAllRewards();
                    });
                    
                    buttonContainer.appendChild(devUnlockAll);
                    buttonContainer.appendChild(devResetAll);
                    
                    // Réinitialise la séquence
                    keySequence = '';
                }
            }
        });
        
        rewardsContainer.appendChild(buttonContainer);
        this.container.appendChild(rewardsContainer);
    }
    
    /**
     * Définit le callback pour retourner au menu principal
     * @param {Function} callback - Fonction à appeler pour retourner au menu
     */
    setBackToMenuCallback(callback) {
        this.onBackToMenuCallback = callback;
    }
    
    /**
     * Affiche une notification stylisée
     * @param {string} message - Message à afficher
     * @param {string} type - Type de notification ('success', 'info', 'warning')
     */
    showNotification(message, type = 'success') {
        // Supprime les anciennes notifications
        const oldNotifs = document.querySelectorAll('.game-notification');
        oldNotifs.forEach(notif => {
            document.body.removeChild(notif);
        });
        
        // Couleurs selon le type
        const colors = {
            success: { bg: '#28a745', color: '#fff', icon: '🎉' },
            info: { bg: '#0dcaf0', color: '#000', icon: 'ℹ️' },
            warning: { bg: '#ffc107', color: '#000', icon: '⚠️' },
            error: { bg: '#dc3545', color: '#fff', icon: '❌' }
        };
        
        const style = colors[type] || colors.info;
        
        // Crée une notification temporaire avec animation
        const notification = Utilities.createElement('div', {
            class: 'game-notification',
            style: `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: ${style.bg};
                color: ${style.color};
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                font-family: 'Press Start 2P', monospace;
                font-size: 14px;
                max-width: 400px;
                transform: translateY(100px);
                opacity: 0;
                transition: transform 0.5s, opacity 0.5s;
            `
        });
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 24px;">${style.icon}</div>
                <div>${message}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Effet d'apparition
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Disparition après 4 secondes
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            
            // Supprime l'élément du DOM après la fin de l'animation
            setTimeout(() => {
                try {
                    document.body.removeChild(notification);
                } catch(e) {
                    // L'élément peut déjà avoir été supprimé
                }
            }, 500);
        }, 4000);
    }
    
    /**
     * Débloque une récompense par son ID
     * @param {string} rewardId - ID de la récompense à débloquer
     */
    unlockReward(rewardId) {
        if (!GameSettings.unlockedRewards.includes(rewardId)) {
            GameSettings.unlockedRewards.push(rewardId);
            Utilities.saveData('blockdrop-rewards', GameSettings.unlockedRewards);
            
            // Trouve la récompense pour l'affichage
            const reward = this.rewards.find(r => r.id === rewardId);
            if (reward) {
                const unlockMsg = `${reward.icon} ${Utilities.translate('newRewardUnlocked')} ${reward.name}!`;
                this.showNotification(unlockMsg, 'success');
            }
            
            // Si l'écran de récompenses est actuellement affiché, on le met à jour
            if (this.container.querySelector('.rewards-container')) {
                this.render();
            }
            
            return true;
        }
        return false;
    }
    
    /**
     * Vérifie et débloque les récompenses basées sur la performance d'une partie
     * @param {Object} stats - Statistiques de la partie (score, niveau, lignes, etc.)
     */
    checkAndUnlockRewards(stats) {
        let unlockedSomething = false;
        
        this.rewards.forEach(reward => {
            if (!this.isUnlocked(reward) && reward.unlockCondition) {
                let shouldUnlock = false;
                
                switch(reward.unlockCondition.type) {
                    case 'score':
                        shouldUnlock = stats.score >= reward.unlockCondition.value;
                        break;
                    case 'level':
                        shouldUnlock = stats.level >= reward.unlockCondition.value;
                        break;
                    case 'lines':
                        shouldUnlock = stats.lines >= reward.unlockCondition.value;
                        break;
                    case 'combo':
                        shouldUnlock = stats.maxCombo >= reward.unlockCondition.value;
                        break;
                    case 'challenge':
                        shouldUnlock = stats.completedChallenges && 
                                      stats.completedChallenges.includes(reward.unlockCondition.value);
                        break;
                    case 'allChallenges':
                        shouldUnlock = stats.completedChallenges && 
                                      stats.completedChallenges.length === stats.totalChallenges;
                        break;
                    case 'tetris':
                        shouldUnlock = stats.tetrisCount >= reward.unlockCondition.value;
                        break;
                    case 'timePlayed':
                        shouldUnlock = stats.totalPlayTime >= reward.unlockCondition.value;
                        break;
                    case 'perfectClear':
                        shouldUnlock = stats.perfectClears >= reward.unlockCondition.value;
                        break;
                    case 'hardDrop':
                        shouldUnlock = stats.hardDrops >= reward.unlockCondition.value;
                        break;
                }
                
                if (shouldUnlock) {
                    unlockedSomething = this.unlockReward(reward.id) || unlockedSomething;
                }
            }
        });
        
        return unlockedSomething;
    }
    
    /**
     * Débloque toutes les récompenses (fonction de développement/debug)
     */
    unlockAllRewards() {
        let unlocked = 0;
        this.rewards.forEach(reward => {
            if (!this.isUnlocked(reward)) {
                GameSettings.unlockedRewards.push(reward.id);
                unlocked++;
            }
        });
        
        if (unlocked > 0) {
            Utilities.saveData('blockdrop-rewards', GameSettings.unlockedRewards);
            this.showNotification(`${unlocked} récompenses débloquées!`, 'success');
            
            // Si l'écran de récompenses est actuellement affiché, on le met à jour
            if (this.container.querySelector('.rewards-container')) {
                this.render();
            }
        }
        
        return unlocked;
    }
    
    /**
     * Réinitialise toutes les récompenses (fonction de développement/debug)
     */
    resetAllRewards() {
        // Garde uniquement les récompenses débloquées par défaut
        GameSettings.unlockedRewards = [];
        Utilities.saveData('blockdrop-rewards', GameSettings.unlockedRewards);
        this.showNotification(Utilities.translate('rewardsReset'), 'info');
        
        // Si l'écran de récompenses est actuellement affiché, on le met à jour
        if (this.container.querySelector('.rewards-container')) {
            this.render();
        }
    }
}