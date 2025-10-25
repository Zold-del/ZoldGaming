// main.js - BlockDrop

/**
 * Classe de l'application BlockDrop qui coordonne tous les composants
 */
class BlockDropApp {    /**
     * Initialise l'application BlockDrop
     */      constructor() {
        // Conteneur principal de l'application
        this.appContainer = document.getElementById('app');
          
        // Instances des différents composants du jeu
        this.mainMenu = new MainMenu(this.appContainer);
        this.loginMenu = new LoginMenu(this.appContainer);
        this.leaderboardMenu = new LeaderboardMenu(this.appContainer);
        this.gameInstance = null;
        this.challengeMode = new ChallengeMode(this.appContainer);
        this.rewards = new Rewards(this.appContainer);
        this.optionsMenu = new OptionsMenu(this.appContainer);
        this.pauseMenu = new PauseMenu(this.appContainer);
        
        // Initialise le gestionnaire de publicités
        this.adManager = new AdManager();
        this.adManager.init();
        
        // État actuel de l'application
        this.currentState = 'menu';
        
        // Variable pour suivre si on vient du menu pause
        this.comingFromPauseMenu = false;
        
        // Gestion de l'audio de fond
        this.setupAudio();
        
        // Application des thèmes visuels
        this.setupVisualThemes();
        
        // Configuration des callbacks pour la navigation entre écrans
        this.setupCallbacks();
    }
      /**
     * Configure les éléments audio du jeu
     */
    setupAudio() {
        // Charge les paramètres audio
        GameSettings.load();
        
        // Précharge les sons
        const audioElements = ['theme-music', 'rotate-sound', 'drop-sound', 'line-sound', 'gameover-sound'];
        audioElements.forEach(id => {
            const audio = document.getElementById(id);
            if (audio) {
                audio.volume = id === 'theme-music' ? GameSettings.musicVolume : GameSettings.soundVolume;
            }
        });
    }
    
    /**
     * Configure les thèmes visuels du jeu
     */
    setupVisualThemes() {
        // Applique le thème de couleurs
        const theme = GameSettings.graphicsTheme || 'classic';
        this.rewards.applyTheme(theme);
        
        // Initialisation des styles de tetrominos
        const tetrominoStyle = GameSettings.tetrominoStyle || 'classic';
        document.documentElement.classList.remove(
            'tetromino-style-classic',
            'tetromino-style-neon',
            'tetromino-style-crystal',
            'tetromino-style-pixel',
            'tetromino-style-metallic',
            'tetromino-style-futuristic'
        );
        document.documentElement.classList.add(`tetromino-style-${tetrominoStyle}`);
    }
    
    /**
     * Configure tous les callbacks entre les différentes vues
     */
    setupCallbacks() {
        // Callbacks du menu principal
        this.mainMenu.setPlayCallback(() => this.startGame());
        this.mainMenu.setChallengeCallback(() => this.showChallengeMode());
        this.mainMenu.setRewardsCallback(() => this.showRewards());
        this.mainMenu.setOptionsCallback(() => this.showOptions());
        this.mainMenu.setLeaderboardCallback(() => this.showLeaderboard());
        this.mainMenu.setLoginCallback(() => this.showLogin());
        
        // Callbacks du menu de connexion
        this.loginMenu.setBackToMenuCallback(() => this.showMainMenu());
        this.loginMenu.setOnLoginCallback((user) => {
            console.log('Utilisateur connecté:', user);
            this.showMainMenu();
        });

        // Callbacks du classement
        this.leaderboardMenu.setBackToMenuCallback(() => this.showMainMenu());
        
        // Callbacks du mode défi
        this.challengeMode.setStartChallengeCallback(params => this.startChallengeGame(params));
        this.challengeMode.setBackToMenuCallback(() => this.showMainMenu());
        
        // Callbacks des récompenses
        this.rewards.setBackToMenuCallback(() => this.showMainMenu());
        
        // Callbacks des options
        this.optionsMenu.setBackToMenuCallback(() => this.showMainMenu());
        
        // Callbacks du menu pause
        this.pauseMenu.setResumeCallback(() => this.resumeGame());
        this.pauseMenu.setRestartCallback(() => this.restartGame());
        this.pauseMenu.setSettingsCallback(() => this.showOptionsFromPause());
        this.pauseMenu.setQuitCallback(() => this.quitGameToMenu());
    }    /**
     * Démarre une nouvelle partie standard
     * @param {Object} options - Options du jeu
     */
    startGame(options = {}) {
        // Change l'état de l'application
        this.currentState = 'game';
        
        // Vide le conteneur
        this.appContainer.innerHTML = '';
        
        // S'assure que les thèmes visuels sont appliqués
        this.setupVisualThemes();
        
        // Crée le conteneur du jeu
        const gameContainer = this.createGameInterface();
        
        // Initialise le moteur de jeu
        this.gameInstance = new GameEngine(options);
        
        // Configure les callbacks du jeu
        this.setupGameCallbacks();
        
        // Récupère l'élément de la zone de jeu
        const gameArea = document.getElementById('blockdrop-grid');
        
        // Initialise et démarre le jeu en passant l'élément de la zone de jeu
        this.gameInstance.init(gameArea);
        
        // Ajoute les écouteurs de clavier
        this.setupKeyboardListeners();
    }    /**
     * Démarre une partie en mode défi
     * @param {Object} challengeParams - Paramètres du défi
     */
    startChallengeGame(challengeParams) {
        // Change l'état de l'application
        this.currentState = 'game';
        
        // Vide le conteneur
        this.appContainer.innerHTML = '';
        
        // S'assure que les thèmes visuels sont appliqués
        this.setupVisualThemes();
        
        // Crée le conteneur du jeu
        const gameContainer = this.createGameInterface(true);
        
        // Initialise le moteur de jeu en mode défi
        this.gameInstance = new GameEngine({
            isChallengeMode: true,
            challenge: challengeParams
        });
          // Configure les callbacks du jeu
        this.setupGameCallbacks();
        
        // Récupère l'élément de la zone de jeu
        const gameArea = document.getElementById('blockdrop-grid');
        
        // Initialise et démarre le jeu en passant l'élément de la zone de jeu
        this.gameInstance.init(gameArea);
        
        // Ajoute les écouteurs de clavier
        this.setupKeyboardListeners();
    }
    
    /**
     * Crée l'interface du jeu BlockDrop
     * @param {boolean} isChallenge - Si true, ajoute des éléments spécifiques au mode défi
     * @returns {HTMLElement} - Le conteneur du jeu
     */
    createGameInterface(isChallenge = false) {
        // Crée le conteneur principal du jeu
        const gameContainer = Utilities.createElement('div', { class: 'game-container' });
        
        // Crée le plateau de jeu
        const boardContainer = Utilities.createElement('div', { class: 'game-board' });
        
        // Crée la grille
        const grid = Utilities.createElement('div', { class: 'grid', id: 'blockdrop-grid' });
        
        // Ajoute les cellules à la grille
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = Utilities.createElement('div', { 
                    class: 'cell',
                    dataset: { x: x, y: y }
                });
                grid.appendChild(cell);
            }
        }
        
        boardContainer.appendChild(grid);
        gameContainer.appendChild(boardContainer);
          // Crée le panneau d'information
        const infoPanel = Utilities.createElement('div', { class: 'game-info' });
          // Section pour le titre du jeu
        const gameTitleContainer = Utilities.createElement('div', { class: 'game-title-container' });
        gameTitleContainer.appendChild(Utilities.createElement('div', { 
            class: 'game-title', 
            style: 'color: var(--primary); font-size: 1rem; margin-bottom: 1rem;' 
        }, 'BLOCKDROP'));
        infoPanel.appendChild(gameTitleContainer);
          // Section pour la prochaine pièce
        const nextPieceContainer = Utilities.createElement('div', { class: 'next-piece' });
        nextPieceContainer.appendChild(Utilities.createElement('div', { class: 'next-piece-title' }, Utilities.translate('nextPiece').toUpperCase()));
        nextPieceContainer.appendChild(Utilities.createElement('div', { class: 'next-piece-container', id: 'next-piece' }));
        infoPanel.appendChild(nextPieceContainer);
        
        // Section pour le score
        const scorePanel = Utilities.createElement('div', { class: 'score-panel' });
        scorePanel.appendChild(Utilities.createElement('div', { class: 'score-title' }, Utilities.translate('score').toUpperCase()));
        scorePanel.appendChild(Utilities.createElement('div', { class: 'score-value', id: 'score-value' }, '0'));
        infoPanel.appendChild(scorePanel);
        
        // Section pour le niveau
        const levelPanel = Utilities.createElement('div', { class: 'level-panel' });
        levelPanel.appendChild(Utilities.createElement('div', { class: 'level-title' }, Utilities.translate('level').toUpperCase()));
        levelPanel.appendChild(Utilities.createElement('div', { class: 'level-value', id: 'level-value' }, '1'));
        infoPanel.appendChild(levelPanel);
          // Section pour les lignes
        const linesPanel = Utilities.createElement('div', { class: 'level-panel' });
        linesPanel.appendChild(Utilities.createElement('div', { class: 'level-title' }, Utilities.translate('lines').toUpperCase()));
        linesPanel.appendChild(Utilities.createElement('div', { class: 'level-value', id: 'lines-value' }, '0'));
        infoPanel.appendChild(linesPanel);
        
        // Si mode défi, ajoute des éléments spécifiques
        if (isChallenge) {
            const challengePanel = Utilities.createElement('div', { class: 'level-panel' });
            challengePanel.appendChild(Utilities.createElement('div', { class: 'level-title' }, GameSettings.language === 'fr' ? 'OBJECTIF' : 'GOAL'));
            challengePanel.appendChild(Utilities.createElement('div', { class: 'level-value', id: 'challenge-value' }, '---'));
            infoPanel.appendChild(challengePanel);
        }        // Section pour les contrôles
        const controlsPanel = Utilities.createElement('div', { class: 'controls-hint' });
        
        // Contenu spécifique à la langue
        if (GameSettings.language === 'fr') {
            controlsPanel.innerHTML = `
                ← → : Déplacer<br>
                ↑ ou Espace : Rotation<br>
                ↓ : Descente rapide<br>
                Shift : Rotation inverse<br>
                Échap : Pause
            `;
        } else {
            controlsPanel.innerHTML = `
                ← → : Move<br>
                ↑ or Space : Rotate<br>
                ↓ : Fast Drop<br>
                Shift : Reverse Rotation<br>
                Esc : Pause
            `;
        }
        
        infoPanel.appendChild(controlsPanel);
        
        gameContainer.appendChild(infoPanel);
        this.appContainer.appendChild(gameContainer);
        
        return gameContainer;
    }
    
    /**
     * Configure les callbacks pour le jeu
     */
    setupGameCallbacks() {
        if (!this.gameInstance) return;
        
        // Callback pour le rendu du jeu
        this.gameInstance.onRender = (board, currentPiece) => {
            this.renderGame(board, currentPiece);
        };
          // Callback pour la mise à jour du score
        this.gameInstance.onScoreUpdate = (score, lines, level, leveledUp) => {
            document.getElementById('score-value').textContent = score;
            document.getElementById('lines-value').textContent = lines;
            
            // Applique l'effet d'animation si le joueur a monté de niveau
            const levelValue = document.getElementById('level-value');
            levelValue.textContent = level;
            
            if (leveledUp) {
                levelValue.classList.remove('level-up');
                // Force le navigateur à reconnaître le changement avant de réappliquer l'animation
                void levelValue.offsetWidth;
                levelValue.classList.add('level-up');
                
                // Joue un son de niveau supérieur
                Utilities.playSound('line-sound');
            }
        };
        
        // Callback pour la mise à jour de la prochaine pièce
        this.gameInstance.onNextPieceUpdate = (nextPiece) => {
            this.renderNextPiece(nextPiece);
        };
        
        // Callback pour la fin de partie
        this.gameInstance.onGameOver = (score, lines, level) => {
            this.showGameOver(score, lines, level);
        };
        
        // Callback pour la mise en pause
        this.gameInstance.onPause = () => {
            this.pauseMenu.show();
        };
        
        // Callback pour la reprise du jeu
        this.gameInstance.onResume = () => {
            this.pauseMenu.hide();
        };
        
        // Callback pour la mise à jour du défi
        this.gameInstance.onChallengeUpdate = (challengeInfo) => {
            const challengeValue = document.getElementById('challenge-value');
            if (challengeValue) {
                if (challengeInfo.timeRemaining) {
                    // Formatage du temps restant en minutes:secondes
                    const minutes = Math.floor(challengeInfo.timeRemaining / 60);
                    const seconds = challengeInfo.timeRemaining % 60;
                    challengeValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                } else if (challengeInfo.targetLines) {
                    // Affichage des lignes à compléter
                    challengeValue.textContent = `${challengeInfo.currentLines}/${challengeInfo.targetLines}`;
                }
            }
        };
        
        // Callback pour les effets visuels de ligne complétée
        this.gameInstance.board.onFlashLines = (lines, callback) => {
            this.flashLines(lines, callback);
        };
        
        // Callback pour la mise à jour de la grille
        this.gameInstance.board.onGridUpdated = () => {
            this.renderGame(this.gameInstance.board, this.gameInstance.currentPiece);
        };
          // Callback pour le déverrouillage d'une récompense
        this.gameInstance.onRewardUnlocked = (rewardId) => {
            this.showRewardUnlocked(rewardId);
        };
        
        // Callback pour l'effet de hard drop
        this.gameInstance.onHardDrop = (droppedDistance) => {
            // Plus la distance est grande, plus l'effet est intense
            const gameBoard = document.querySelector('.game-board');
            if (gameBoard && droppedDistance > 5) {
                gameBoard.classList.add('shake-board');
                
                // Retire la classe après l'animation
                setTimeout(() => {
                    gameBoard.classList.remove('shake-board');
                }, 300);
                
                // Joue un son d'impact si la distance est importante
                Utilities.playSound('drop-sound');
            }
        };
        
        // Callback pour les effets de combo
        this.gameInstance.onComboEffect = (linesCleared, comboCount, points) => {
            this.showComboEffect(linesCleared, comboCount, points);
        };
    }
    
    /**
     * Affiche les effets visuels de combo
     * @param {number} linesCleared - Nombre de lignes effacées
     * @param {number} comboCount - Compteur de combo
     * @param {number} points - Points gagnés
     */
    showComboEffect(linesCleared, comboCount, points) {
        const gameBoard = document.querySelector('.game-board');
        const scoreValue = document.getElementById('score-value');
        
        // Effet sur le plateau de jeu
        if (gameBoard) {
            // Retire les anciennes classes de combo
            gameBoard.classList.remove('combo-active-2', 'combo-active-3', 'combo-active-4', 'combo-board-effect');
            
            // Force un reflow pour réinitialiser l'animation
            void gameBoard.offsetWidth;
            
            // Ajoute la nouvelle classe de combo
            gameBoard.classList.add('combo-board-effect');
            if (linesCleared >= 2) {
                gameBoard.classList.add(`combo-active-${linesCleared}`);
            }
            
            // Retire la classe après l'animation
            setTimeout(() => {
                gameBoard.classList.remove('combo-board-effect');
            }, 1000);
            
            setTimeout(() => {
                gameBoard.classList.remove('combo-active-2', 'combo-active-3', 'combo-active-4');
            }, 1500);
        }
        
        // Effet sur le score
        if (scoreValue) {
            scoreValue.classList.add('combo-score-boost');
            setTimeout(() => {
                scoreValue.classList.remove('combo-score-boost');
            }, 600);
        }
        
        // Création de la notification de combo
        const comboNotification = document.createElement('div');
        comboNotification.className = `combo-notification combo-${linesCleared}`;
        
        // Texte du combo
        const comboNames = {
            2: 'DOUBLE!',
            3: 'TRIPLE!',
            4: 'TETRIS!'
        };
        
        comboNotification.innerHTML = `
            <div class="combo-text">${comboNames[linesCleared] || 'COMBO!'}</div>
            <div class="combo-points">+${points} pts</div>
        `;
        
        document.body.appendChild(comboNotification);
        
        // Crée des particules pour l'effet de feu d'artifice
        if (linesCleared >= 3) {
            this.createComboParticles(comboNotification, linesCleared);
        }
        
        // Supprime la notification après l'animation
        setTimeout(() => {
            comboNotification.style.opacity = '0';
            comboNotification.style.transform = 'translate(-50%, -50%) scale(0.5)';
            comboNotification.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                if (comboNotification.parentNode) {
                    document.body.removeChild(comboNotification);
                }
            }, 300);
        }, 2000);
        
        // Joue un son spécial pour les combos
        Utilities.playSound('line-sound');
    }
    
    /**
     * Crée des particules pour l'effet de combo
     * @param {HTMLElement} sourceElement - Élément source pour les particules
     * @param {number} linesCleared - Nombre de lignes pour déterminer l'intensité
     */
    createComboParticles(sourceElement, linesCleared) {
        const particleCount = linesCleared * 8; // Plus de lignes = plus de particules
        const colors = linesCleared === 4 
            ? ['#ffd700', '#ffeb3b', '#fff'] 
            : linesCleared === 3 
            ? ['#ff00ff', '#ff69b4', '#fff']
            : ['#ffa500', '#ff6347', '#fff'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'combo-particle';
            
            // Position aléatoire autour de la notification
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 100 + Math.random() * 150;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.cssText = `
                left: 50%;
                top: 50%;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                --tx: ${tx}px;
                --ty: ${ty}px;
                box-shadow: 0 0 10px ${colors[0]};
            `;
            
            sourceElement.appendChild(particle);
            
            // Supprime la particule après l'animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
      /**
     * Met en place les écouteurs de clavier pour contrôler le jeu
     */
    setupKeyboardListeners() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
    
    /**
     * Gère les événements clavier (touche enfoncée)
     * @param {KeyboardEvent} e - Événement clavier
     */
    handleKeyDown(e) {
        if (this.currentState !== 'game' || !this.gameInstance) return;
        
        // Empêche le scrolling de la page
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
        
        if (this.gameInstance.gameOver) return;
        
        if (this.gameInstance.paused) {
            // Si en pause, seule la touche Échap permet de reprendre
            if (e.key === 'Escape') {
                this.gameInstance.togglePause();
            }
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                this.gameInstance.moveLeft();
                break;
                
            case 'ArrowRight':
                this.gameInstance.moveRight();
                break;
                
            case 'ArrowDown':
                this.gameInstance.softDrop();
                break;
                
            case 'ArrowUp':
            case ' ': // Espace
                this.gameInstance.rotate();
                break;
                
            case 'Shift':
                this.gameInstance.rotateReverse();
                break;
                
            case 'Control':
                this.gameInstance.hardDrop();
                break;
                
            case 'Escape':
                this.gameInstance.togglePause();
                break;
        }
    }
    
    /**
     * Gère les événements clavier (touche relâchée)
     * @param {KeyboardEvent} e - Événement clavier
     */
    handleKeyUp(e) {
        if (this.currentState !== 'game' || !this.gameInstance) return;
        
        if (e.key === 'ArrowDown') {
            // Restaure la vitesse normale quand la flèche du bas est relâchée
            this.gameInstance.restoreDropSpeed();
        }
    }
    
    /**
     * Effectue le rendu du jeu
     * @param {GameBoard} board - Plateau de jeu
     * @param {Tetromino} currentPiece - Pièce actuelle
     */    renderGame(board, currentPiece) {
        const grid = document.getElementById('blockdrop-grid');
        if (!grid) return;
        
        // Récupère toutes les cellules
        const cells = grid.childNodes;
        
        // Nettoie la grille
        cells.forEach(cell => {
            cell.className = 'cell';
        });
        
        // Dessine les pièces fixées sur le plateau
        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                if (board.grid[y][x] !== null) {
                    const index = y * board.width + x;
                    cells[index].className = `cell tetromino tetromino-${board.grid[y][x].toLowerCase()}`;
                }
            }
        }
        
        // Dessine le fantôme de la pièce
        const ghostPiece = board.getGhostPiece(currentPiece);
        if (ghostPiece) {
            const ghostShape = ghostPiece.getCurrentShape();
            for (let y = 0; y < ghostShape.length; y++) {
                for (let x = 0; x < ghostShape[y].length; x++) {
                    if (ghostShape[y][x]) {
                        const boardX = ghostPiece.x + x;
                        const boardY = ghostPiece.y + y;
                        
                        if (boardY >= 0 && boardY < board.height && 
                            boardX >= 0 && boardX < board.width) {
                            const index = boardY * board.width + boardX;
                            cells[index].classList.add('ghost');
                        }
                    }
                }
            }
        }
          // Dessine la pièce actuelle
        if (currentPiece) {
            const shape = currentPiece.getCurrentShape();
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        const boardX = currentPiece.x + x;
                        const boardY = currentPiece.y + y;
                        
                        if (boardY >= 0 && boardY < board.height && 
                            boardX >= 0 && boardX < board.width) {
                            const index = boardY * board.width + boardX;
                            cells[index].className = `cell tetromino tetromino-${currentPiece.type.toLowerCase()}`;
                            
                            // Ajoute l'effet de chute si la pièce est en train de tomber
                            if (currentPiece.falling) {
                                cells[index].classList.add('falling');
                            }
                        }
                    }
                }
            }
            // Réinitialise l'indicateur de chute après le rendu
            currentPiece.falling = false;
        }
    }
    
    /**
     * Effectue le rendu de la prochaine pièce
     * @param {Tetromino} nextPiece - Prochaine pièce
     */
    renderNextPiece(nextPiece) {
        const container = document.getElementById('next-piece');
        if (!container || !nextPiece) return;
        
        // Vide le conteneur
        container.innerHTML = '';
        
        // Crée une mini-grille pour la pièce
        const grid = Utilities.createElement('div', {
            style: 'display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); width: 100%; height: 100%;'
        });
        
        // Remplit la grille de cellules vides
        for (let i = 0; i < 16; i++) {
            grid.appendChild(Utilities.createElement('div', { class: 'cell' }));
        }
        
        // Dessine la pièce
        const shape = nextPiece.shapes[0]; // Utilise toujours la première rotation
        for (let y = 0; y < Math.min(shape.length, 4); y++) {
            for (let x = 0; x < Math.min(shape[y].length, 4); x++) {
                if (shape[y][x]) {
                    const index = y * 4 + x;
                    grid.childNodes[index].className = `cell tetromino tetromino-${nextPiece.type.toLowerCase()}`;
                }
            }
        }
        
        container.appendChild(grid);
    }    /**
     * Affiche un effet de flash sur les lignes complétées
     * @param {Array<number>} lines - Indices des lignes à flasher
     * @param {Function} callback - Fonction à appeler après l'effet
     */    
    flashLines(lines, callback) {
        const grid = document.getElementById('blockdrop-grid');
        const gameBoard = document.querySelector('.game-board');
        
        if (!grid || !lines || lines.length === 0) {
            // Si pas de grille ou pas de lignes, appelle directement le callback
            if (typeof callback === 'function') {
                callback();
            }
            return;
        }
        
        console.log("Animation de flash pour les lignes:", lines);
        
        // Ajoute la classe flash aux lignes
        lines.forEach(lineIndex => {
            for (let x = 0; x < 10; x++) {
                const cellIndex = lineIndex * 10 + x;
                if (cellIndex >= 0 && cellIndex < grid.childNodes.length) {
                    const cell = grid.childNodes[cellIndex];
                    
                    // Applique l'effet de flash
                    cell.classList.add('flash-line');
                    
                    // Ajoute un effet de lumière supplémentaire pour accentuer l'animation
                    const glowEffect = document.createElement('div');
                    glowEffect.className = 'glow-effect';
                    glowEffect.style.position = 'absolute';
                    glowEffect.style.top = '0';
                    glowEffect.style.left = '0';
                    glowEffect.style.width = '100%';
                    glowEffect.style.height = '100%';
                    glowEffect.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)';
                    glowEffect.style.pointerEvents = 'none';
                    cell.appendChild(glowEffect);
                }
            }
        });
        
        // Ajoute un effet de secousse au plateau de jeu
        if (gameBoard) {
            gameBoard.classList.add('shake-board');
            
            // Retire la classe après l'animation
            setTimeout(() => {
                gameBoard.classList.remove('shake-board');
            }, 300);
        }
        
        // Attend la fin de l'animation puis supprime les lignes
        setTimeout(() => {
            // Supprime les éléments de brillance ajoutés
            lines.forEach(lineIndex => {
                for (let x = 0; x < 10; x++) {
                    const cellIndex = lineIndex * 10 + x;
                    if (cellIndex >= 0 && cellIndex < grid.childNodes.length) {
                        const cell = grid.childNodes[cellIndex];
                        const glowEffect = cell.querySelector('.glow-effect');
                        if (glowEffect) {
                            cell.removeChild(glowEffect);
                        }
                    }
                }
            });
            
            // Appelle le callback pour continuer le traitement des lignes
            if (typeof callback === 'function') {
                callback();
            } else {
                console.error("Le callback n'est pas une fonction valide");
            }
        }, 600); // Un peu plus long pour l'animation améliorée
    }    /**
     * Affiche l'écran de fin de jeu
     * @param {number} score - Score final
     * @param {number} lines - Nombre de lignes complétées
     * @param {number} level - Niveau atteint
     */    showGameOver(score, lines, level) {
        // Affiche une publicité interstitielle après la partie
        this.adManager.showInterstitial(() => {
            // Code exécuté après la fermeture de la pub
            this.displayGameOverScreen(score, lines, level);
        });
    }
    
    /**
     * Affiche l'écran de Game Over (après la pub)
     * @param {number} score - Score final
     * @param {number} lines - Nombre de lignes complétées
     * @param {number} level - Niveau atteint
     */
    displayGameOverScreen(score, lines, level) {
        // Enregistre le score en ligne si connecté
        if (window.apiService && window.apiService.isAuthenticated()) {
            const duration = Math.floor((Date.now() - this.gameInstance.startTime) / 1000);
            window.apiService.saveScore({
                score,
                lines,
                level,
                duration,
                mode: this.gameInstance.isChallengeMode ? 'challenge' : 'classic'
            }).then(data => {
                if (data.success) {
                    console.log('Score enregistré avec succès');
                }
            }).catch(error => {
                console.error('Erreur lors de l\'enregistrement du score:', error);
            });
        }

        // Crée le conteneur de fin de jeu
        const gameOverContainer = Utilities.createElement('div', { class: 'game-over' });
        
        // Ajoute le titre du jeu
        gameOverContainer.appendChild(Utilities.createElement('div', { 
            class: 'game-title',
            style: 'color: var(--primary); font-size: 1.2rem; margin-bottom: 1rem;'
        }, 'BLOCKDROP'));
          gameOverContainer.appendChild(Utilities.createElement('div', { class: 'game-over-text' }, Utilities.translate('gameOver').toUpperCase()));
        gameOverContainer.appendChild(Utilities.createElement('div', { class: 'final-score' }, `${Utilities.translate('finalScore')}: ${score}`));
        
        const statsText = Utilities.createElement('div', {}, `Lignes: ${lines} | Niveau: ${level}`);
        gameOverContainer.appendChild(statsText);
          const backButton = Utilities.createElement('button', { style: 'margin-top: 2rem;' }, Utilities.translate('backToMenu'));
        backButton.addEventListener('click', () => {
            this.quitGameToMenu();
        });
        
        const retryButton = Utilities.createElement('button', { style: 'margin-top: 1rem;' }, GameSettings.language === 'fr' ? 'Réessayer' : 'Retry');
        retryButton.addEventListener('click', () => {
            gameOverContainer.remove();
            this.restartGame();
        });
        
        gameOverContainer.appendChild(backButton);
        gameOverContainer.appendChild(retryButton);
        
        this.appContainer.appendChild(gameOverContainer);
        
        // Vérifie si de nouvelles récompenses ont été débloquées
        const stats = {
            score: score,
            lines: lines,
            level: level
        };
        
        this.rewards.checkAndUnlockRewards(stats);
          // Vérifie les récompenses
    }
    
    /**
     * Affiche une notification de récompense débloquée
     * @param {string} rewardId - ID de la récompense débloquée
     */
    showRewardUnlocked(rewardId) {
        // Trouve la récompense par son ID
        const reward = this.rewards.rewards.find(r => r.id === rewardId);
        if (!reward) return;
        
        // Crée une notification temporaire
        const notification = Utilities.createElement('div', {
            style: `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--primary);
                color: var(--dark);
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                z-index: 1000;
                animation: fadeIn 0.5s, fadeOut 0.5s 4.5s;
            `
        });
        
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 0.5rem;">Nouvelle Récompense!</div>
            <div>${reward.icon} ${reward.name}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Supprime la notification après 5 secondes
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 5000);
    }
      /**
     * Affiche un indice visuel pour les contrôles à la souris au début de la partie
     * @param {HTMLElement} gameArea - L'élément de la zone de jeu
     */
    showMouseControlHint(gameArea) {
        // Fonction désactivée - contrôles de souris retirés
        return;
    }
      /**
     * Ajoute les zones visuelles pour les contrôles à la souris
     * @param {HTMLElement} gameArea - L'élément de la zone de jeu
     */
    addMouseControlZones(gameArea) {
        // Fonction désactivée - contrôles de souris retirés
        return;
    }
    
    /**
     * Met le jeu en pause ou le reprend
     */
    togglePause() {
        if (this.gameInstance) {
            this.gameInstance.togglePause();
        }
    }
    
    /**
     * Reprend le jeu après une pause
     */
    resumeGame() {
        if (this.gameInstance && this.gameInstance.paused) {
            this.gameInstance.togglePause();
        }
    }
      /**
     * Redémarre la partie en cours
     */
    restartGame() {
        if (this.gameInstance) {
            // Cache le menu pause
            this.pauseMenu.hide();
            
            // S'assure que les thèmes visuels sont appliqués
            this.setupVisualThemes();
            
            // Réinitialise le jeu
            this.gameInstance.resetGame();
            
            // Si le jeu était en pause, le reprendre
            if (this.gameInstance.paused) {
                this.gameInstance.togglePause();
            }
        }
    }/**
     * Quitte le jeu en cours et retourne au menu principal
     */
    quitGameToMenu() {
        if (this.gameInstance) {
            // Nettoie le moteur de jeu
            this.gameInstance.destroy();
            this.gameInstance = null;
            
            // Cache le menu pause
            this.pauseMenu.hide();
        }
        
        // Vérifie si nous sommes sur itch.io et tente de fermer la fenêtre
        const isItchIo = window.location.hostname.indexOf('itch.io') !== -1;
        if (isItchIo) {
            // Essaie de fermer la fenêtre
            window.close();
            
            // Fallback au menu principal si la fermeture échoue
            setTimeout(() => {
                // Change l'état et affiche le menu principal
                this.currentState = 'menu';
                this.showMainMenu();
            }, 100);
        } else {
            // Change l'état et affiche le menu principal
            this.currentState = 'menu';
            this.showMainMenu();
        }
    }
      /**
     * Affiche le menu principal
     */
    showMainMenu() {
        this.currentState = 'menu';
        this.mainMenu.render();
    }
    
    /**
     * Affiche le mode défi
     */
    showChallengeMode() {
        this.currentState = 'challenge';
        this.challengeMode.render();
    }
    
    /**
     * Affiche les récompenses
     */
    showRewards() {
        this.currentState = 'rewards';
        this.rewards.render();
    }    /**
     * Affiche les options
     */
    showOptions() {
        // Réinitialise la variable pour indiquer qu'on ne vient pas du menu pause
        this.comingFromPauseMenu = false;
        
        this.currentState = 'options';
        this.optionsMenu.render();
    }

    /**
     * Affiche le menu de connexion
     */
    showLogin() {
        this.currentState = 'login';
        this.loginMenu.render();
    }

    /**
     * Affiche le classement
     */
    showLeaderboard() {
        this.currentState = 'leaderboard';
        this.leaderboardMenu.render();
    }    /**
     * Affiche les options depuis le menu pause
     */
    showOptionsFromPause() {
        // On stocke le fait qu'on vient du menu pause
        this.comingFromPauseMenu = true;
        
        // Cache le menu pause
        this.pauseMenu.hide();
        
        // Affiche les options
        this.currentState = 'options';
        this.optionsMenu.render();
        
        // Modifie le callback de retour
        this.optionsMenu.setBackToMenuCallback(() => {
            // Si on venait du menu pause
            if (this.comingFromPauseMenu) {
                // Retourne à l'état de jeu sans quitter la partie
                this.currentState = 'game';
                this.comingFromPauseMenu = false; // Réinitialise la variable
                
                // Force la réinitialisation des styles
                this.setupVisualThemes();
                
                // Rafraîchit le rendu du jeu
                if (this.gameInstance) {
                    this.renderGame(this.gameInstance.board, this.gameInstance.currentPiece);
                    this.renderNextPiece(this.gameInstance.nextPiece);
                }
                
                // S'assure que le jeu est en pause
                if (!this.gameInstance.paused) {
                    this.gameInstance.togglePause();
                }
                
                // Affiche à nouveau le menu pause
                this.pauseMenu.show();
            } else {
                // Comportement normal pour les options depuis le menu principal
                this.showMainMenu();
            }
        });
    }
}

// Initialisation de l'application
window.onload = () => {
    // Initialise le système de consentement RGPD
    window.cookieConsent = new CookieConsent();
    window.cookieConsent.init();
    
    window.blockDropApp = new BlockDropApp();
    window.blockDropApp.showMainMenu();
    
    // Précharge les polices
    if ('fonts' in document) {
        document.fonts.load('1em "Press Start 2P"');
    }
};
