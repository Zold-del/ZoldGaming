// Tetromino.js - Définition des pièces du jeu Tetris

/**
 * Classe représentant une pièce de Tetris (Tetromino)
 */
class Tetromino {
    /**
     * Crée une nouvelle pièce de Tetris
     * @param {string} type - Type de pièce (I, O, T, S, Z, J, L, P, U, X)
     */
    constructor(type) {
        this.type = type;
        this.rotation = 0;
        this.x = 0;
        this.y = 0;
        
        // Définition des shapes pour chaque pièce selon leur type
        this.shapes = this.getShapes();
        
        // Position initiale centrée en haut
        this.x = Math.floor((10 - this.getWidth()) / 2);
        this.y = -this.getHeight();
    }
    
    /**
     * Retourne la matrice de la forme actuelle de la pièce
     * @returns {Array<Array<number>>}
     */
    getCurrentShape() {
        return this.shapes[this.rotation];
    }
    
    /**
     * Obtient la largeur de la pièce dans son orientation actuelle
     * @returns {number}
     */
    getWidth() {
        return this.getCurrentShape()[0].length;
    }
    
    /**
     * Obtient la hauteur de la pièce dans son orientation actuelle
     * @returns {number}
     */
    getHeight() {
        return this.getCurrentShape().length;
    }
    
    /**
     * Fait tourner la pièce dans le sens horaire
     */
    rotate() {
        const prevRotation = this.rotation;
        this.rotation = (this.rotation + 1) % this.shapes.length;
        
        // Jouer le son de rotation
        Utilities.playSound('rotate-sound');
        
        return { prevRotation };
    }
    
    /**
     * Fait tourner la pièce dans le sens antihoraire
     */
    rotateReverse() {
        const prevRotation = this.rotation;
        this.rotation = (this.rotation - 1 + this.shapes.length) % this.shapes.length;
        
        // Jouer le son de rotation
        Utilities.playSound('rotate-sound');
        
        return { prevRotation };
    }
    
    /**
     * Déplace la pièce sur l'axe X
     * @param {number} dx - Déplacement sur l'axe X
     */
    moveX(dx) {
        this.x += dx;
    }
    
    /**
     * Déplace la pièce sur l'axe Y
     * @param {number} dy - Déplacement sur l'axe Y
     */
    moveY(dy) {
        this.y += dy;
    }
    
    /**
     * Définit les formes pour chaque type de pièce et leurs rotations
     * @returns {Array<Array<Array<number>>>}
     */
    getShapes() {
        switch(this.type) {
            // Pièce I (barre)
            case 'I':
                return [
                    [
                        [0, 0, 0, 0],
                        [1, 1, 1, 1],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 1, 0],
                        [0, 0, 1, 0],
                        [0, 0, 1, 0],
                        [0, 0, 1, 0]
                    ],
                    [
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [1, 1, 1, 1],
                        [0, 0, 0, 0]
                    ],
                    [
                        [0, 1, 0, 0],
                        [0, 1, 0, 0],
                        [0, 1, 0, 0],
                        [0, 1, 0, 0]
                    ]
                ];
            
            // Pièce O (carré)
            case 'O':
                return [
                    [
                        [1, 1],
                        [1, 1]
                    ]
                ];
            
            // Pièce T
            case 'T':
                return [
                    [
                        [0, 1, 0],
                        [1, 1, 1],
                        [0, 0, 0]
                    ],
                    [
                        [0, 1, 0],
                        [0, 1, 1],
                        [0, 1, 0]
                    ],
                    [
                        [0, 0, 0],
                        [1, 1, 1],
                        [0, 1, 0]
                    ],
                    [
                        [0, 1, 0],
                        [1, 1, 0],
                        [0, 1, 0]
                    ]
                ];
            
            // Pièce S
            case 'S':
                return [
                    [
                        [0, 1, 1],
                        [1, 1, 0],
                        [0, 0, 0]
                    ],
                    [
                        [0, 1, 0],
                        [0, 1, 1],
                        [0, 0, 1]
                    ],
                    [
                        [0, 0, 0],
                        [0, 1, 1],
                        [1, 1, 0]
                    ],
                    [
                        [1, 0, 0],
                        [1, 1, 0],
                        [0, 1, 0]
                    ]
                ];
            
            // Pièce Z
            case 'Z':
                return [
                    [
                        [1, 1, 0],
                        [0, 1, 1],
                        [0, 0, 0]
                    ],
                    [
                        [0, 0, 1],
                        [0, 1, 1],
                        [0, 1, 0]
                    ],
                    [
                        [0, 0, 0],
                        [1, 1, 0],
                        [0, 1, 1]
                    ],
                    [
                        [0, 1, 0],
                        [1, 1, 0],
                        [1, 0, 0]
                    ]
                ];
            
            // Pièce J
            case 'J':
                return [
                    [
                        [1, 0, 0],
                        [1, 1, 1],
                        [0, 0, 0]
                    ],
                    [
                        [0, 1, 1],
                        [0, 1, 0],
                        [0, 1, 0]
                    ],
                    [
                        [0, 0, 0],
                        [1, 1, 1],
                        [0, 0, 1]
                    ],
                    [
                        [0, 1, 0],
                        [0, 1, 0],
                        [1, 1, 0]
                    ]
                ];
            
            // Pièce L
            case 'L':
                return [
                    [
                        [0, 0, 1],
                        [1, 1, 1],
                        [0, 0, 0]
                    ],
                    [
                        [0, 1, 0],
                        [0, 1, 0],
                        [0, 1, 1]
                    ],
                    [
                        [0, 0, 0],
                        [1, 1, 1],
                        [1, 0, 0]
                    ],
                    [
                        [1, 1, 0],
                        [0, 1, 0],
                        [0, 1, 0]
                    ]
                ];                // Pièce P (forme en P)
            case 'P':
                return [
                    [
                        [1, 1, 0],
                        [1, 1, 0],
                        [1, 0, 0]
                    ],
                    [
                        [1, 1, 1],
                        [0, 1, 1],
                        [0, 0, 0]
                    ],
                    [
                        [0, 0, 1],
                        [0, 1, 1],
                        [0, 1, 1]
                    ],
                    [
                        [0, 0, 0],
                        [1, 1, 0],
                        [1, 1, 1]
                    ]
                ];
                
            // Pièce U (forme en U)
            case 'U':
                return [
                    [
                        [1, 0, 1],
                        [1, 1, 1],
                        [0, 0, 0]
                    ],
                    [
                        [0, 1, 1],
                        [0, 1, 0],
                        [0, 1, 1]
                    ],
                    [
                        [0, 0, 0],
                        [1, 1, 1],
                        [1, 0, 1]
                    ],
                    [
                        [1, 1, 0],
                        [0, 1, 0],
                        [1, 1, 0]
                    ]
                ];
                
            // Pièce X (forme en X ou croix)
            case 'X':
                return [
                    [
                        [0, 1, 0],
                        [1, 1, 1],
                        [0, 1, 0]
                    ]
                ];
                
            default:
                console.error("Type de pièce inconnu:", this.type);
                return [];
        }
    }
    
    /**
     * Clone cette pièce
     * @returns {Tetromino} - Nouvelle instance identique
     */
    clone() {
        const clone = new Tetromino(this.type);
        clone.x = this.x;
        clone.y = this.y;
        clone.rotation = this.rotation;
        clone.falling = this.falling;
        
        // Copie d'autres propriétés potentiellement importantes
        if (this.ghostPiece !== undefined) clone.ghostPiece = this.ghostPiece;
        if (this.locked !== undefined) clone.locked = this.locked;
        
        return clone;
    }
      /**
     * Crée une pièce aléatoire
     * @returns {Tetromino}
     */
    static createRandom() {
        const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'P', 'U', 'X'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        return new Tetromino(randomType);
    }
}
