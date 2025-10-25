// GameEngine.js - Contrôleur principal du jeu Tetris

/**
 * Classe de moteur de jeu Tetris
 */
class GameEngine {
    /**
     * Crée une nouvelle instance du moteur de jeu
     * @param {Object} options - Options du jeu
     * @param {number} options.width - Largeur du plateau
     * @param {number} options.height - Hauteur du plateau
     * @param {number} options.level - Niveau de départ
     * @param {boolean} options.isChallengeMode - Si true, mode défi activé
     * @param {Object} options.challenge - Paramètres du défi (si applicable)
     */
    constructor(options = {}) {
        this.width = options.width || 10;
        this.height = options.height || 20;
        this.level = options.level || 1;
        this.isChallengeMode = options.isChallengeMode || false;
        this.challengeParams = options.challenge || {};
        
        this.board = new GameBoard(this.width, this.height);
        this.score = 0;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        this.gameLoopId = null;
        
        this.currentPiece = null;
        this.nextPiece = null;
        this.isHardDrop = false;
        
        this.speedFactor = 1.0; // Pour ajuster la vitesse selon le niveau
        
        // Callback fonctions pour la vue
        this.onRender = null;
        this.onGameOver = null;
        this.onScoreUpdate = null;
        this.onNextPieceUpdate = null;
        
        // Temps entre les chutes de pièces en ms (dépend du niveau)
        this.dropInterval = 1000;
        this.lastDropTime = 0;
        
        // Gestion des combos
        this.combo = 0;
        this.lastComboTime = 0;
        
        // Pour le mode défi
        this.challengeTimer = null;
        this.timeRemaining = 0;
        this.targetLines = 0;
        
        // Pour la sauvegarde automatique
        this.autoSaveInterval = null;
          // Contrôle à la souris
        this.mouseEnabled = false; // Désactivé
        this.mouseStartX = 0;
        this.mouseLastX = 0;
        this.mouseThreshold = 30; // Seuil de déplacement horizontal en pixels
        this.mouseClickY = 0;
        this.mouseDragActive = false;
        this.gameAreaElement = null; // Sera défini lors de l'initialisation
    }    /**
     * Initialise le jeu
     * @param {HTMLElement} gameArea - L'élément DOM de la zone de jeu
     */
    init(gameArea) {
        this.resetGame();
        this.setupChallengeMode();
        this.initializeAutoSave();
        
        // Les contrôles de la souris sont désactivés
        
        this.startGameLoop();
        
        // Démarre la musique du jeu
        Utilities.handleMusic('play');
    }
    
    /**
     * Réinitialise le jeu
     */
    resetGame() {
        this.board.init();
        this.score = 0;
        this.lines = 0;
        this.level = this.isChallengeMode ? this.challengeParams.startLevel || 1 : 1;
        this.gameOver = false;
        this.paused = false;
        this.combo = 0;
        
        // Enregistre l'heure de début
        this.startTime = Date.now();
        
        // Réinitialise la vitesse en fonction du niveau
        this.updateSpeed();
        
        // Crée les premières pièces
        this.currentPiece = Tetromino.createRandom();
        this.nextPiece = Tetromino.createRandom();
        
        // Met à jour les indicateurs
        if (this.onScoreUpdate) {
            this.onScoreUpdate(this.score, this.lines, this.level);
        }
        
        if (this.onNextPieceUpdate) {
            this.onNextPieceUpdate(this.nextPiece);
        }
    }
    
    /**
     * Configure le mode défi si activé
     */
    setupChallengeMode() {
        if (!this.isChallengeMode) return;
        
        switch(this.challengeParams.type) {
            case 'time-trial':
                this.timeRemaining = this.challengeParams.time || 120; // 2min par défaut
                this.startChallengeTimer();
                break;
                
            case 'target-lines':
                this.targetLines = this.challengeParams.lines || 20;
                break;
                
            case 'combo':
                // Paramètres pour le défi combo
                break;
                
            case 'special':
                // Niveaux spéciaux avec obstacles
                this.setupSpecialChallengeBoard();
                break;
        }
    }
    
    /**
     * Configure un tableau spécial pour le mode défi
     */
    setupSpecialChallengeBoard() {
        if (this.challengeParams.boardPreset) {
            // Ajoute des blocs ou obstacles prédéfinis
            for (const preset of this.challengeParams.boardPreset) {
                this.board.grid[preset.y][preset.x] = preset.type || 'X';
            }
        }
    }
    
    /**
     * Démarre le timer pour le mode défi time-trial
     */
    startChallengeTimer() {
        if (this.challengeTimer) {
            clearInterval(this.challengeTimer);
        }
        
        this.challengeTimer = setInterval(() => {
            this.timeRemaining--;
            
            if (this.onChallengeUpdate) {
                this.onChallengeUpdate({
                    timeRemaining: this.timeRemaining,
                    targetLines: this.targetLines,
                    currentLines: this.lines
                });
            }
            
            if (this.timeRemaining <= 0) {
                this.challengeComplete(this.lines >= this.targetLines);
            }
        }, 1000);
    }
    
    /**
     * Finalise un défi
     * @param {boolean} success - Si le défi est réussi
     */
    challengeComplete(success) {
        if (this.challengeTimer) {
            clearInterval(this.challengeTimer);
            this.challengeTimer = null;
        }
        
        if (success) {
            // Débloque des récompenses selon le défi
            this.unlockRewards();
        }
        
        if (this.onChallengeComplete) {
            this.onChallengeComplete(success, this.score, this.lines);
        }
        
        // Fin de partie
        this.gameOver = true;
    }
    
    /**
     * Débloque des récompenses basées sur la performance
     */
    unlockRewards() {
        let reward = null;
        
        if (this.isChallengeMode) {
            // Récompenses spécifiques au défi
            switch(this.challengeParams.type) {
                case 'time-trial':
                    if (this.lines >= this.targetLines) {
                        reward = 'speed-master';
                    }
                    break;
                    
                case 'combo':
                    if (this.combo >= 4) {
                        reward = 'combo-king';
                    }
                    break;
            }
        } else {
            // Récompenses basées sur le score
            if (this.score >= 10000) {
                reward = 'high-scorer';
            }
            
            // Récompenses basées sur le niveau
            if (this.level >= 10) {
                reward = 'survivor';
            }
        }
        
        if (reward && !GameSettings.unlockedRewards.includes(reward)) {
            GameSettings.unlockedRewards.push(reward);
            Utilities.saveData('blockdrop-rewards', GameSettings.unlockedRewards);
            
            if (this.onRewardUnlocked) {
                this.onRewardUnlocked(reward);
            }
        }
    }
    
    /**
     * Initialise la sauvegarde automatique
     */
    initializeAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            if (!this.gameOver && !this.paused) {
                this.saveGameState();
            }
        }, 30000); // Sauvegarde toutes les 30 secondes
    }
    
    /**
     * Sauvegarde l'état actuel du jeu
     */
    saveGameState() {
        const gameState = {
            board: this.board.grid,
            score: this.score,
            lines: this.lines,
            level: this.level,
            nextPiece: {
                type: this.nextPiece.type,
                rotation: this.nextPiece.rotation
            },
            currentPiece: {
                type: this.currentPiece.type,
                rotation: this.currentPiece.rotation,
                x: this.currentPiece.x,
                y: this.currentPiece.y
            },
            isChallengeMode: this.isChallengeMode,
            challengeParams: this.challengeParams,
            timeRemaining: this.timeRemaining,
            targetLines: this.targetLines,
            timestamp: Date.now()
        };
        
        Utilities.saveData('blockdrop-gamestate', gameState);
    }
    
    /**
     * Charge l'état sauvegardé du jeu
     * @returns {boolean} - True si chargement réussi
     */
    loadGameState() {
        const savedState = Utilities.loadData('blockdrop-gamestate');
        
        if (!savedState) return false;
        
        // Vérifie si la sauvegarde est récente (moins de 24h)
        const isRecent = (Date.now() - savedState.timestamp) < 86400000;
        
        if (!isRecent) return false;
        
        try {
            // Restaure l'état du plateau
            this.board.grid = savedState.board;
            
            // Restaure les stats
            this.score = savedState.score || 0;
            this.lines = savedState.lines || 0;
            this.level = savedState.level || 1;
            
            // Restaure les pièces
            if (savedState.currentPiece) {
                this.currentPiece = new Tetromino(savedState.currentPiece.type);
                this.currentPiece.rotation = savedState.currentPiece.rotation;
                this.currentPiece.x = savedState.currentPiece.x;
                this.currentPiece.y = savedState.currentPiece.y;
            }
            
            if (savedState.nextPiece) {
                this.nextPiece = new Tetromino(savedState.nextPiece.type);
                this.nextPiece.rotation = savedState.nextPiece.rotation;
            }
            
            // Restaure les paramètres de défi
            this.isChallengeMode = savedState.isChallengeMode || false;
            this.challengeParams = savedState.challengeParams || {};
            this.timeRemaining = savedState.timeRemaining || 0;
            this.targetLines = savedState.targetLines || 0;
            
            // Met à jour la vitesse
            this.updateSpeed();
            
            // Mise à jour de l'interface
            if (this.onScoreUpdate) {
                this.onScoreUpdate(this.score, this.lines, this.level);
            }
            
            if (this.onNextPieceUpdate) {
                this.onNextPieceUpdate(this.nextPiece);
            }
            
            if (this.isChallengeMode && this.onChallengeUpdate) {
                this.onChallengeUpdate({
                    timeRemaining: this.timeRemaining,
                    targetLines: this.targetLines,
                    currentLines: this.lines
                });
            }
            
            return true;
        } catch (e) {
            console.error("Erreur lors du chargement de la sauvegarde:", e);
            return false;
        }
    }
    
    /**
     * Démarre la boucle principale du jeu
     */
    startGameLoop() {
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }
        
        // Temps de la frame précédente
        let lastTime = 0;
        
        // Boucle principale du jeu
        const gameLoop = (timestamp) => {
            if (!this.paused && !this.gameOver) {
                const deltaTime = timestamp - lastTime;
                lastTime = timestamp;
                
                this.update(deltaTime);
                this.render();
            }
            
            this.gameLoopId = requestAnimationFrame(gameLoop);
        };
        
        this.gameLoopId = requestAnimationFrame(gameLoop);
    }
    
    /**
     * Met à jour l'état du jeu
     * @param {number} deltaTime - Temps écoulé depuis la dernière frame
     */
    update(deltaTime) {
        // Mise à jour de la chute automatique
        this.lastDropTime += deltaTime;
        
        // Vérifie si c'est le moment de faire descendre la pièce
        if (this.lastDropTime >= this.dropInterval || this.isHardDrop) {
            this.moveDown();
            this.lastDropTime = 0;
            
            if (this.isHardDrop) {
                this.isHardDrop = false;
            }
        }
        
        // Vérifie le temps pour les combos
        if (this.combo > 0) {
            this.lastComboTime += deltaTime;
            if (this.lastComboTime > 5000) { // 5 secondes pour maintenir un combo
                this.combo = 0;
            }
        }
    }
    
    /**
     * Fait descendre la pièce d'un cran
     * @returns {boolean} - True si la pièce peut encore descendre
     */
    moveDown() {
        // Clone la pièce pour tester son déplacement
        const testPiece = this.currentPiece.clone();
        testPiece.moveY(1);
        
        if (this.board.isValidPosition(testPiece)) {
            // La position est valide, on déplace la pièce
            this.currentPiece = testPiece;
            return true;
        } else {
            // La pièce ne peut plus descendre, on la fixe sur le plateau
            this.landPiece();
            return false;
        }
    }
      /**
     * Fixe la pièce actuelle sur le plateau et gère la suite
     */
    landPiece() {
        // Place la pièce sur le plateau et récupère le nombre de lignes complétées
        const linesCleared = this.board.placeTetromino(this.currentPiece);
        
        if (linesCleared > 0) {
            // Mise à jour du score et du niveau
            this.updateScore(linesCleared);
            
            // Vérifie si objectifs du défi sont atteints
            this.checkChallengeObjectives(linesCleared);
        } else if (linesCleared === -1) {
            // Game over: pièce en partie au-dessus du plateau
            this.gameOver = true;
            
            // Joue le son de fin de partie
            Utilities.playSound('gameover-sound');
            Utilities.handleMusic('pause');
            
            // Affiche l'écran de fin
            if (this.onGameOver) {
                this.onGameOver(this.score, this.lines, this.level);
            }
            
            // Sauvegarde du score
            this.saveHighScore();
            return;
        }
        
        // Prépare la prochaine pièce
        this.currentPiece = this.nextPiece;
        this.nextPiece = Tetromino.createRandom();
        
        // Met à jour l'affichage de la prochaine pièce
        if (this.onNextPieceUpdate) {
            this.onNextPieceUpdate(this.nextPiece);
        }
        
        // Vérifie si la nouvelle pièce peut être placée
        if (!this.board.isValidPosition(this.currentPiece)) {
            this.gameOver = true;
            
            // Joue le son de fin de partie
            Utilities.playSound('gameover-sound');
            Utilities.handleMusic('pause');
            
            // Affiche l'écran de fin
            if (this.onGameOver) {
                this.onGameOver(this.score, this.lines, this.level);
            }
            
            // Sauvegarde du score
            this.saveHighScore();
        }
    }
    
    /**
     * Vérifie si les objectifs du défi sont atteints
     * @param {number} linesCleared - Nombre de lignes complétées
     */
    checkChallengeObjectives(linesCleared) {
        if (!this.isChallengeMode) return;
        
        switch(this.challengeParams.type) {
            case 'target-lines':
                if (this.lines >= this.targetLines) {
                    this.challengeComplete(true);
                }
                break;
                
            case 'combo':
                // Vérifie les objectifs de combo
                if (linesCleared >= 2) {
                    this.combo++;
                    this.lastComboTime = 0;
                    
                    if (this.combo >= this.challengeParams.comboTarget) {
                        this.challengeComplete(true);
                    }
                }
                break;
        }
        
        if (this.onChallengeUpdate) {
            this.onChallengeUpdate({
                timeRemaining: this.timeRemaining,
                targetLines: this.targetLines,
                currentLines: this.lines,
                combo: this.combo
            });
        }
    }
    
    /**
     * Met à jour le score en fonction des lignes complétées
     * @param {number} linesCleared - Nombre de lignes complétées
     */
    updateScore(linesCleared) {
        // Points de base selon le nombre de lignes
        const basePoints = {
            1: 100,
            2: 300,
            3: 500,
            4: 800
        };
        
        // Calcul du score avec bonus de niveau et combo
        const comboMultiplier = Math.max(1, this.combo * 0.5);
        const levelMultiplier = this.level;
        const points = basePoints[linesCleared] * levelMultiplier * comboMultiplier;
        
        // Mise à jour du score
        this.score += Math.floor(points);
        this.lines += linesCleared;
        
        // Mise à jour du combo et déclenchement des effets visuels
        if (linesCleared >= 2) {
            this.combo++;
            this.lastComboTime = 0;
            
            // Déclenche les effets visuels de combo
            if (this.onComboEffect) {
                this.onComboEffect(linesCleared, this.combo, Math.floor(points));
            }
        } else {
            // Réinitialise le combo si une seule ligne
            this.combo = 0;
        }
          // Vérifie si passage au niveau suivant (tous les 10 lignes)
        const newLevel = Math.floor(this.lines / 10) + 1;
        let leveledUp = false;
        
        if (newLevel > this.level) {
            this.level = newLevel;
            this.updateSpeed();
            leveledUp = true;
        }
        
        // Mise à jour de l'interface
        if (this.onScoreUpdate) {
            this.onScoreUpdate(this.score, this.lines, this.level, leveledUp);
        }
    }
    
    /**
     * Met à jour la vitesse du jeu en fonction du niveau
     */
    updateSpeed() {
        // La vitesse augmente avec le niveau
        this.dropInterval = Math.max(100, 1000 - ((this.level - 1) * 100));
        
        // Facteur de vitesse pour les modes spéciaux
        if (this.isChallengeMode && this.challengeParams.speedFactor) {
            this.dropInterval *= this.challengeParams.speedFactor;
        }
    }
    
    /**
     * Sauvegarde le score dans les high scores
     */
    saveHighScore() {
        if (this.gameOver && this.score > 0) {
            const highScores = GameSettings.highScores || [];
            
            // Ajoute le score actuel
            highScores.push({
                score: this.score,
                lines: this.lines,
                level: this.level,
                date: new Date().toISOString(),
                mode: this.isChallengeMode ? 'challenge' : 'classic'
            });
            
            // Trie par score décroissant
            highScores.sort((a, b) => b.score - a.score);
            
            // Limite à 10 scores maximum
            GameSettings.highScores = highScores.slice(0, 10);
            
            // Sauvegarde
            Utilities.saveData('blockdrop-highscores', GameSettings.highScores);
        }
    }
    
    /**
     * Gère le rendu du jeu
     */
    render() {
        if (this.onRender) {
            this.onRender(this.board, this.currentPiece);
        }
    }
    
    /* === Méthodes de contrôle === */
    
    /**
     * Déplace la pièce vers la gauche
     */
    moveLeft() {
        if (this.paused || this.gameOver) return;
        
        const testPiece = this.currentPiece.clone();
        testPiece.moveX(-1);
        
        if (this.board.isValidPosition(testPiece)) {
            this.currentPiece = testPiece;
        }
    }
    
    /**
     * Déplace la pièce vers la droite
     */
    moveRight() {
        if (this.paused || this.gameOver) return;
        
        const testPiece = this.currentPiece.clone();
        testPiece.moveX(1);
        
        if (this.board.isValidPosition(testPiece)) {
            this.currentPiece = testPiece;
        }
    }
      /**
     * Fait descendre la pièce rapidement (soft drop)
     */
    softDrop() {
        if (this.paused || this.gameOver) return;
        
        // Sauvegarde l'intervalle original si ce n'est pas déjà fait
        if (!this.originalDropInterval) {
            this.originalDropInterval = this.dropInterval;
        }
        
        // Accélère temporairement la chute
        this.dropInterval = 50;
    }
    
    /**
     * Restaure la vitesse normale après un soft drop
     */
    restoreDropSpeed() {
        if (this.originalDropInterval) {
            this.dropInterval = this.originalDropInterval;
            this.originalDropInterval = null;
        }
    }
      /**
     * Fait tomber la pièce jusqu'en bas (hard drop)
     */
    hardDrop() {
        if (this.paused || this.gameOver) return;
        
        // Descend la pièce jusqu'à ce qu'elle ne puisse plus descendre
        let droppedY = 0;
        while (this.moveDown()) {
            droppedY++;
        }
        
        // Bonus de score pour le hard drop
        if (droppedY > 0) {
            this.score += droppedY * 2;
            
            // Indique que c'est un hard drop pour les effets visuels
            this.isHardDrop = true;
            
            if (this.onScoreUpdate) {
                this.onScoreUpdate(this.score, this.lines, this.level);
            }
            
            // Trigger l'effet de shake si callback existe
            if (this.onHardDrop) {
                this.onHardDrop(droppedY);
            }
        }
    }
      /**
     * Fait tourner la pièce dans le sens horaire
     */
    rotate() {
        if (this.paused || this.gameOver) return;
        
        // Sauvegarde l'état original de la pièce
        const originalPiece = this.currentPiece.clone();
        
        // Crée une copie pour tester la rotation
        const testPiece = this.currentPiece.clone();
        testPiece.rotate();
        
        if (this.board.isValidPosition(testPiece)) {
            // Si la rotation directe est valide, l'appliquer
            this.currentPiece = testPiece;
        } else {
            // Tente le wall kick (décalage pour permettre la rotation)
            // Commence par les décalages horizontaux, puis vers le bas uniquement si nécessaire
            const kicks = [
                { x: 1, y: 0 },   // Décalage à droite
                { x: -1, y: 0 },  // Décalage à gauche
                { x: 2, y: 0 },   // Double décalage à droite
                { x: -2, y: 0 },  // Double décalage à gauche
                { x: 0, y: 1 }    // Décalage vers le bas (en dernier recours)
            ];
            
            let kickSuccess = false;
            
            for (const kick of kicks) {
                const kickedPiece = testPiece.clone();
                kickedPiece.x += kick.x;
                kickedPiece.y += kick.y;
                
                if (this.board.isValidPosition(kickedPiece)) {
                    this.currentPiece = kickedPiece;
                    kickSuccess = true;
                    break;
                }
            }
            
            // Si aucun kick n'a fonctionné, on garde la position originale
            if (!kickSuccess) {
                this.currentPiece = originalPiece;
            }
        }
    }
      /**
     * Fait tourner la pièce dans le sens antihoraire
     */
    rotateReverse() {
        if (this.paused || this.gameOver) return;
        
        // Sauvegarde l'état original de la pièce
        const originalPiece = this.currentPiece.clone();
        
        // Crée une copie pour tester la rotation
        const testPiece = this.currentPiece.clone();
        testPiece.rotateReverse();
        
        if (this.board.isValidPosition(testPiece)) {
            // Si la rotation directe est valide, l'appliquer
            this.currentPiece = testPiece;
        } else {
            // Même système de wall kick que pour la rotation normale
            const kicks = [
                { x: 1, y: 0 },   // Décalage à droite
                { x: -1, y: 0 },  // Décalage à gauche
                { x: 2, y: 0 },   // Double décalage à droite
                { x: -2, y: 0 },  // Double décalage à gauche
                { x: 0, y: 1 }    // Décalage vers le bas (en dernier recours)
            ];
            
            let kickSuccess = false;
            
            for (const kick of kicks) {
                const kickedPiece = testPiece.clone();
                kickedPiece.x += kick.x;
                kickedPiece.y += kick.y;
                
                if (this.board.isValidPosition(kickedPiece)) {
                    this.currentPiece = kickedPiece;
                    kickSuccess = true;
                    break;
                }
            }
            
            // Si aucun kick n'a fonctionné, on garde la position originale
            if (!kickSuccess) {
                this.currentPiece = originalPiece;
            }
        }
    }
    
    /**
     * Met le jeu en pause ou reprend le jeu
     */
    togglePause() {
        this.paused = !this.paused;
        
        if (this.paused) {
            Utilities.handleMusic('pause');
            
            // Affiche le menu pause
            if (this.onPause) {
                this.onPause();
            }
        } else {
            Utilities.handleMusic('play');
            
            // Cache le menu pause
            if (this.onResume) {
                this.onResume();
            }
        }
    }
    
    /**
     * Arrête le jeu et libère les ressources
     */
    destroy() {
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }
        
        if (this.challengeTimer) {
            clearInterval(this.challengeTimer);
        }
        
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        Utilities.handleMusic('stop');
    }    /**
     * Configure les événements pour le contrôle à la souris
     * @param {HTMLElement} gameArea - L'élément DOM de la zone de jeu
     */
    setupMouseControls(gameArea) {
        // Les contrôles de la souris sont désactivés
        return;
    }
}
