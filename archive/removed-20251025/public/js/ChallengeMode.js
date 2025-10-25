// ChallengeMode.js - Mode défi du jeu Tetris

/**
 * Classe pour le mode Défi du jeu
 */
class ChallengeMode {
    /**
     * Crée une nouvelle instance du mode défi
     * @param {HTMLElement} container - Conteneur où afficher le menu de défi
     */
    constructor(container) {
        this.container = container || document.getElementById('app');
        this.onStartChallengeCallback = null;
        this.onBackToMenuCallback = null;
        
        // Définition des défis disponibles
        this.challenges = [
            {
                id: 'lines40',
                name: 'Sprint 40 lignes',
                description: 'Complétez 40 lignes aussi vite que possible',
                icon: '⏱️',
                type: 'target-lines',
                params: {
                    lines: 40,
                    startLevel: 1
                }
            },
            {
                id: 'timeAttack',
                name: 'Contre-la-montre',
                description: 'Faites un maximum de lignes en 2 minutes',
                icon: '⏰',
                type: 'time-trial',
                params: {
                    time: 120, // 2 minutes
                    startLevel: 1
                }
            },
            {
                id: 'combo',
                name: 'Maître des combos',
                description: 'Réalisez un combo de 4 lignes consécutives',
                icon: '🔥',
                type: 'combo',
                params: {
                    comboTarget: 4,
                    startLevel: 1
                }
            },
            {
                id: 'speedChallenge',
                name: 'Vitesse extrême',
                description: 'Survivez 1 minute à vitesse maximale',
                icon: '⚡',
                type: 'time-trial',
                params: {
                    time: 60, // 1 minute
                    startLevel: 10,
                    speedFactor: 0.8
                }
            },
            {
                id: 'obstacles',
                name: 'Obstacles',
                description: 'Complétez 20 lignes avec des obstacles sur le plateau',
                icon: '🧱',
                type: 'special',
                params: {
                    lines: 20,
                    startLevel: 2,
                    boardPreset: this.generateObstaclePreset()
                }
            },
            {
                id: 'invisibleBlock',
                name: 'Pièces furtives',
                description: 'Les pièces deviennent invisibles après placement',
                icon: '👻',
                type: 'special',
                params: {
                    lines: 10,
                    startLevel: 2,
                    invisibleBlocks: true
                }
            }
        ];
    }
    
    /**
     * Génère un préréglage aléatoire d'obstacles pour le défi Obstacles
     * @returns {Array} - Liste des obstacles à placer
     */
    generateObstaclePreset() {
        const obstacles = [];
        
        // Génère entre 10 et 15 blocs d'obstacles
        const count = Utilities.randomInt(10, 15);
        
        for (let i = 0; i < count; i++) {
            // Place les obstacles dans la moitié inférieure du plateau
            const x = Utilities.randomInt(0, 9);
            const y = Utilities.randomInt(10, 18);
            
            // Évite les doublons
            if (!obstacles.some(obs => obs.x === x && obs.y === y)) {
                obstacles.push({
                    x: x,
                    y: y,
                    type: 'X' // Type spécial pour les obstacles
                });
            }
        }
        
        return obstacles;
    }
    
    /**
     * Affiche le menu des défis
     */
    render() {
        // Vide le conteneur
        this.container.innerHTML = '';
        
        // Crée le conteneur des défis
        const challengeContainer = Utilities.createElement('div', { class: 'challenge-container' });
        
        // Ajoute le titre
        const title = Utilities.createElement('h1', { class: 'challenge-title' }, 'MODE DÉFI');
        challengeContainer.appendChild(title);
        
        // Crée la grille des cartes de défi
        const challengeCards = Utilities.createElement('div', { class: 'challenge-cards' });
        
        // Ajoute chaque défi à la grille
        this.challenges.forEach(challenge => {
            const card = Utilities.createElement('div', {
                class: 'challenge-card',
                dataset: { challengeId: challenge.id }
            }, [
                Utilities.createElement('div', { class: 'challenge-icon' }, challenge.icon),
                Utilities.createElement('div', { class: 'challenge-name' }, challenge.name),
                Utilities.createElement('div', { class: 'challenge-desc' }, challenge.description)
            ]);
            
            // Ajoute l'écouteur de clic pour démarrer le défi
            card.addEventListener('click', () => this.selectChallenge(challenge));
            
            challengeCards.appendChild(card);
        });
        
        challengeContainer.appendChild(challengeCards);
        
        // Ajoute le bouton retour
        const backButton = Utilities.createElement('button', {
            style: 'margin-top: 2rem;'
        }, 'Retour au menu');
        
        backButton.addEventListener('click', () => {
            if (this.onBackToMenuCallback) {
                this.onBackToMenuCallback();
            }
        });
        
        challengeContainer.appendChild(backButton);
        this.container.appendChild(challengeContainer);
    }
    
    /**
     * Gère la sélection d'un défi
     * @param {Object} challenge - Défi sélectionné
     */
    selectChallenge(challenge) {
        // Crée une boîte de dialogue pour confirmer et expliquer le défi
        const modal = Utilities.createElement('div', { class: 'modal' }, [
            Utilities.createElement('div', { class: 'modal-content' }, [
                Utilities.createElement('h2', {}, challenge.name),
                Utilities.createElement('p', {}, challenge.description),
                Utilities.createElement('div', { class: 'modal-buttons' }, [
                    Utilities.createElement('button', { id: 'start-challenge-btn' }, 'Démarrer'),
                    Utilities.createElement('button', { id: 'cancel-challenge-btn' }, 'Annuler')
                ])
            ])
        ]);
        
        // Ajoute le modal au DOM
        document.body.appendChild(modal);
        
        // Ajoute les écouteurs d'événements
        document.getElementById('start-challenge-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            
            if (this.onStartChallengeCallback) {
                // Prépare les paramètres du défi
                const challengeParams = {
                    type: challenge.type,
                    ...challenge.params
                };
                
                this.onStartChallengeCallback(challengeParams);
            }
        });
        
        document.getElementById('cancel-challenge-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    /**
     * Définit le callback pour démarrer un défi
     * @param {Function} callback - Fonction à appeler pour démarrer un défi
     */
    setStartChallengeCallback(callback) {
        this.onStartChallengeCallback = callback;
    }
    
    /**
     * Définit le callback pour retourner au menu principal
     * @param {Function} callback - Fonction à appeler pour retourner au menu
     */
    setBackToMenuCallback(callback) {
        this.onBackToMenuCallback = callback;
    }
}
