// GameBoard.js - Gestion de la grille de jeu Tetris

/**
 * Classe représentant le plateau de jeu Tetris
 */
class GameBoard {
    /**
     * Crée un nouveau plateau de jeu
     * @param {number} width - Largeur du plateau (nombre de colonnes)
     * @param {number} height - Hauteur du plateau (nombre de lignes)
     */
    constructor(width = 10, height = 20) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.init();
    }
    
    /**
     * Initialise la grille du plateau
     */
    init() {
        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = null; // Cellule vide
            }
        }
    }
      /**
     * Vérifie si une position est valide pour la pièce actuelle
     * @param {Tetromino} tetromino - Pièce à vérifier
     * @returns {boolean} - True si position valide, false sinon
     */
    isValidPosition(tetromino) {
        if (!tetromino) {
            console.error("Erreur: tentative de vérifier une position avec une pièce null");
            return false;
        }
        
        try {
            const shape = tetromino.getCurrentShape();
            
            if (!shape || !Array.isArray(shape)) {
                console.error("Erreur: forme de pièce invalide", shape);
                return false;
            }
            
            for (let y = 0; y < shape.length; y++) {
                if (!shape[y] || !Array.isArray(shape[y])) {
                    console.error("Erreur: ligne de forme invalide", y, shape[y]);
                    return false;
                }
                
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        // Position absolue sur la grille
                        const boardX = tetromino.x + x;
                        const boardY = tetromino.y + y;
                        
                        // Vérification des limites
                        if (boardX < 0 || boardX >= this.width || 
                            boardY >= this.height) {
                            return false;
                        }
                        
                        // Vérifie si la position est déjà occupée (ignore les valeurs négatives de Y - au-dessus du plateau)
                        if (boardY >= 0 && this.grid[boardY][boardX] !== null) {
                            return false;
                        }
                    }
                }
            }
            return true;
        } catch (error) {
            console.error("Erreur lors de la vérification de position:", error);
            return false;
        }
    }
      /**
     * Fixe une pièce sur le plateau
     * @param {Tetromino} tetromino - Pièce à fixer
     * @returns {number} - Nombre de lignes complétées
     */
    placeTetromino(tetromino) {
        if (!tetromino) {
            console.error("Erreur: tentative de placer une pièce null ou undefined");
            return 0;
        }
        
        console.log(`Placement d'une pièce de type ${tetromino.type} à (${tetromino.x}, ${tetromino.y})`);
        
        const shape = tetromino.getCurrentShape();
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const boardX = tetromino.x + x;
                    const boardY = tetromino.y + y;
                    
                    if (boardY >= 0 && boardY < this.height) {
                        this.grid[boardY][boardX] = tetromino.type;
                    } else {
                        // La pièce est en partie au-dessus du plateau - Game Over
                        console.warn("Game Over: pièce placée au-dessus du plateau");
                        return -1;
                    }
                }
            }
        }
        
        // Joue le son de placement
        Utilities.playSound('drop-sound');
        
        // Vérifie et supprime les lignes complètes
        const linesCleared = this.checkLines();
        console.log(`${linesCleared} lignes à supprimer après placement`);
        return linesCleared;
    }/**
     * Vérifie si des lignes sont complètes et les supprime
     * @returns {number} - Nombre de lignes supprimées
     */    checkLines() {
        let linesCleared = 0;
        const linesToClear = [];
        
        // Détermine quelles lignes sont complètes
        for (let y = 0; y < this.height; y++) {
            let isComplete = true;
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y] === undefined || this.grid[y][x] === null) {
                    isComplete = false;
                    break;
                }
            }
            if (isComplete) {
                linesToClear.push(y);
                linesCleared++;
                console.log(`Ligne ${y} complète!`);
            }
        }
        
        if (linesCleared > 0) {
            console.log(`${linesCleared} lignes complètes trouvées:`, linesToClear);
            
            // Joue le son de ligne complétée
            Utilities.playSound('line-sound');
            
            // Flash des lignes à supprimer avant la suppression
            this.flashLines(linesToClear, () => {
                // Suppression différée pour permettre l'animation de flash
                console.log("Animation flash terminée, suppression des lignes");
                this.removeLines(linesToClear);            });
        }
        
        return linesCleared;
    }/**
     * Fait flasher les lignes avant de les supprimer (effet visuel)
     * @param {Array<number>} lines - Indices des lignes à flasher
     * @param {Function} callback - Fonction à appeler après le flash
     */
    flashLines(lines, callback) {
        if (!lines || !Array.isArray(lines) || lines.length === 0) {
            console.warn("flashLines appelé avec un tableau vide ou invalide");
            if (typeof callback === 'function') {
                callback();
            }
            return;
        }
        
        console.log("Préparation animation flash pour lignes:", lines);
        
        // Cette fonction est appelée par la vue
        if (this.onFlashLines && typeof this.onFlashLines === 'function') {
            try {
                this.onFlashLines(lines, () => {
                    console.log("Callback d'animation de flash appelé");
                    if (typeof callback === 'function') {
                        callback();
                    } else {
                        console.warn("Callback d'animation fourni mais n'est pas une fonction");
                    }
                });
            } catch (error) {
                console.error("Erreur lors de l'animation de flash:", error);
                if (typeof callback === 'function') {
                    callback();
                }
            }
        } else {
            // Si pas de callback de vue, supprime directement
            console.log("Pas de callback d'animation, suppression directe des lignes");
            if (typeof callback === 'function') {
                callback();
            }
        }
    }/**
     * Supprime les lignes spécifiées et fait descendre les blocs au-dessus
     * @param {Array<number>} lines - Indices des lignes à supprimer
     */    removeLines(lines) {
        if (!lines || lines.length === 0) return;
        
        // Vérification et débogage
        console.log("Début de suppression de lignes. Lignes à supprimer:", lines);
        
        // S'assurer que les lignes sont dans un ordre descendant (de bas en haut)
        // Important: nous devons supprimer de bas en haut pour ne pas perturber les indices
        const sortedLines = [...lines].sort((a, b) => b - a);
        console.log("Lignes triées pour suppression:", sortedLines);
        
        // Sauvegarde de la longueur originale de la grille
        const originalGridLength = this.grid.length;
        console.log("Taille de la grille avant suppression:", originalGridLength);
        
        // Approche alternative: créer une nouvelle grille sans les lignes complètes
        const newGrid = [];
        
        // Ajoute les nouvelles lignes vides en haut (autant que de lignes supprimées)
        for (let i = 0; i < sortedLines.length; i++) {
            const newRow = Array(this.width).fill(null);
            newGrid.push(newRow);
        }
        
        // Copie les lignes non complètes de la grille actuelle
        for (let y = 0; y < this.height; y++) {
            if (!sortedLines.includes(y)) {
                newGrid.push([...this.grid[y]]);
            }
        }
        
        // Remplace l'ancienne grille par la nouvelle
        this.grid = newGrid;
        
        // Vérification de la taille de la grille après manipulation
        console.log("Taille de la grille après reconstruction:", this.grid.length);
          // Vérification de la taille de la grille après manipulation
        console.log("Taille de la grille après reconstruction:", this.grid.length);
        
        // Vérification d'intégrité: s'assurer que la grille a toujours la bonne taille
        if (this.grid.length !== originalGridLength) {
            console.log(`Ajustement de la taille de la grille: ${this.grid.length} à ${originalGridLength}`);
            // Correction si nécessaire
            while (this.grid.length < this.height) {
                const newRow = Array(this.width).fill(null);
                this.grid.unshift(newRow);
            }
            while (this.grid.length > this.height) {
                this.grid.pop();
            }
        }
        
        // Met à jour la vue
        if (this.onGridUpdated) {
            this.onGridUpdated();
        } else {
            console.warn("Pas de callback onGridUpdated défini");
        }
    }
    
    /**
     * Dessine un fantôme de la pièce actuelle jusqu'en bas du plateau
     * @param {Tetromino} tetromino - Pièce actuelle
     * @returns {Tetromino} - Position fantôme de la pièce
     */
    getGhostPiece(tetromino) {
        const ghost = tetromino.clone();
        
        // Descend le fantôme jusqu'à ce qu'il ne puisse plus descendre
        while (this.isValidPosition(ghost)) {
            ghost.moveY(1);
        }
        
        // Remonte d'une case pour avoir une position valide
        ghost.moveY(-1);
        
        return ghost;
    }
    
    /**
     * Vérifie si la partie est terminée (pièces atteignent le haut)
     * @returns {boolean}
     */
    isGameOver() {
        // Vérifie si la première ligne contient des blocs
        for (let x = 0; x < this.width; x++) {
            if (this.grid[0][x] !== null) {
                return true;
            }
        }
        return false;
    }
}
