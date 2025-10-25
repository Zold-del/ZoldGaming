// BackgroundEffects.js - Gestion des effets d'arrière-plan

/**
 * Classe pour gérer les effets visuels en arrière-plan
 */
class BackgroundEffects {
    /**
     * Initialise les effets d'arrière-plan
     */
    static init() {
        this.createBackgroundTetrominos();
        
        // Ajoute un événement pour rafraîchir l'animation périodiquement
        // pour éviter que toutes les pièces ne disparaissent
        setInterval(() => {
            this.refreshBackgroundPieces();
        }, 40000); // Toutes les 40 secondes
    }

    /**
     * Crée les pièces de tetris qui tombent en arrière-plan
     */
    static createBackgroundTetrominos() {
        // Crée le conteneur pour les pièces d'arrière-plan
        const container = document.createElement('div');
        container.className = 'background-tetrominos';
        document.body.appendChild(container);

        // Types de tetrominos et leurs couleurs
        const tetrominoTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        const colors = {
            'I': 'var(--color-i)',
            'O': 'var(--color-o)',
            'T': 'var(--color-t)',
            'S': 'var(--color-s)',
            'Z': 'var(--color-z)',
            'J': 'var(--color-j)',
            'L': 'var(--color-l)'
        };

        // Formes des tetrominos
        const shapes = {
            'I': [[1, 1, 1, 1]],
            'O': [[1, 1], [1, 1]],
            'T': [[0, 1, 0], [1, 1, 1]],
            'S': [[0, 1, 1], [1, 1, 0]],
            'Z': [[1, 1, 0], [0, 1, 1]],
            'J': [[1, 0, 0], [1, 1, 1]],
            'L': [[0, 0, 1], [1, 1, 1]]
        };        // Génère un certain nombre de pièces
        const numPieces = 25; // Augmenté pour avoir plus de pièces en arrière-plan
        
        for (let i = 0; i < numPieces; i++) {
            // Choisit un type de tetromino aléatoire
            const type = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
            const shape = shapes[type];
            
            // Crée un élément pour ce tetromino
            const tetromino = document.createElement('div');
            tetromino.className = 'bg-tetromino';
            
            // Définit la forme du tetromino avec une grille CSS
            const sizeBase = 20; // Taille de base d'une cellule en pixels
            const sizeVariation = Math.random() < 0.3 ? 0.6 : (Math.random() < 0.7 ? 1 : 1.5); // Variation de taille
            const size = sizeBase * sizeVariation;
            const width = Math.max(...shape.map(row => row.length));
            const height = shape.length;
            
            tetromino.style.width = (width * size) + 'px';
            tetromino.style.height = (height * size) + 'px';
            tetromino.style.position = 'relative';
            
            // Crée chaque cellule du tetromino
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (shape[y] && shape[y][x]) {
                        const cell = document.createElement('div');
                        cell.style.position = 'absolute';
                        cell.style.left = (x * size) + 'px';
                        cell.style.top = (y * size) + 'px';
                        cell.style.width = size + 'px';
                        cell.style.height = size + 'px';
                        cell.style.backgroundColor = colors[type];
                        cell.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.5) inset';
                        cell.style.border = '1px solid rgba(255, 255, 255, 0.6)';
                        tetromino.appendChild(cell);
                    }
                }
            }
            
            // Positionne aléatoirement le tetromino horizontalement, mais avec une distribution plus large
            tetromino.style.left = (Math.random() * 120 - 10) + 'vw'; // Entre -10% et 110% de la largeur de la fenêtre
            
            // Positionne verticalement avec une distribution sur toute la hauteur pour démarrage initial
            tetromino.style.top = (Math.random() * -200 - 50) + 'vh'; // Entre -50% et -250% de la hauteur
            
            // Définit une vitesse et rotation aléatoire avec plus de variation
            const duration = 15 + Math.random() * 25; // Entre 15 et 40 secondes
            const delay = Math.random() * -40; // Délai jusqu'à -40s pour décalage initial
            tetromino.style.animationDuration = duration + 's';
            tetromino.style.animationDelay = delay + 's';
            
            // Ajoute au conteneur
            container.appendChild(tetromino);
        }
    }

    /**
     * Rafraîchit quelques pièces en arrière-plan pour maintenir une animation continue
     */
    static refreshBackgroundPieces() {
        const container = document.querySelector('.background-tetrominos');
        if (!container) return;

        // Ajoute quelques nouvelles pièces
        const tetrominoTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        const colors = {
            'I': 'var(--color-i)',
            'O': 'var(--color-o)',
            'T': 'var(--color-t)',
            'S': 'var(--color-s)',
            'Z': 'var(--color-z)',
            'J': 'var(--color-j)',
            'L': 'var(--color-l)'
        };

        // Formes des tetrominos
        const shapes = {
            'I': [[1, 1, 1, 1]],
            'O': [[1, 1], [1, 1]],
            'T': [[0, 1, 0], [1, 1, 1]],
            'S': [[0, 1, 1], [1, 1, 0]],
            'Z': [[1, 1, 0], [0, 1, 1]],
            'J': [[1, 0, 0], [1, 1, 1]],
            'L': [[0, 0, 1], [1, 1, 1]]
        };

        // Ajoute quelques nouvelles pièces
        for (let i = 0; i < 5; i++) {
            // Choisit un type de tetromino aléatoire
            const type = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
            const shape = shapes[type];
            
            // Crée un élément pour ce tetromino
            const tetromino = document.createElement('div');
            tetromino.className = 'bg-tetromino';
            
            // Définit la forme du tetromino
            const size = 20 * (Math.random() < 0.3 ? 0.7 : (Math.random() < 0.7 ? 1 : 1.4));
            const width = Math.max(...shape.map(row => row.length));
            const height = shape.length;
            
            tetromino.style.width = (width * size) + 'px';
            tetromino.style.height = (height * size) + 'px';
            tetromino.style.position = 'relative';
            
            // Crée chaque cellule du tetromino
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (shape[y] && shape[y][x]) {
                        const cell = document.createElement('div');
                        cell.style.position = 'absolute';
                        cell.style.left = (x * size) + 'px';
                        cell.style.top = (y * size) + 'px';
                        cell.style.width = size + 'px';
                        cell.style.height = size + 'px';
                        cell.style.backgroundColor = colors[type];
                        cell.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.5) inset';
                        cell.style.border = '1px solid rgba(255, 255, 255, 0.6)';
                        tetromino.appendChild(cell);
                    }
                }
            }
            
            // Positionne le tetromino
            tetromino.style.left = (Math.random() * 120 - 10) + 'vw';
            tetromino.style.top = '-50vh';
            
            // Définit une animation
            tetromino.style.animationDuration = (15 + Math.random() * 25) + 's';
            tetromino.style.animationDelay = '0s';
            
            // Ajoute au conteneur
            container.appendChild(tetromino);
        }

        // Supprime certaines pièces anciennes pour éviter une surcharge
        const allPieces = container.querySelectorAll('.bg-tetromino');
        if (allPieces.length > 40) {
            // Supprime les pièces les plus anciennes
            for (let i = 0; i < 5 && i < allPieces.length; i++) {
                container.removeChild(allPieces[i]);
            }
        }
    }
}

// Initialise les effets au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    BackgroundEffects.init();
});
