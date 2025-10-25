// PauseMenu.js - Menu de pause du jeu Tetris

/**
 * Classe pour le menu de pause
 */
class PauseMenu {
    /**
     * Crée une nouvelle instance du menu de pause
     * @param {HTMLElement} container - Conteneur où afficher le menu de pause
     */
    constructor(container) {
        this.container = container || document.getElementById('app');
        this.pauseContainer = null;
        this.onResumeCallback = null;
        this.onRestartCallback = null;
        this.onSettingsCallback = null;
        this.onQuitCallback = null;
    }
    
    /**
     * Affiche le menu de pause
     */
    show() {
        // Crée le conteneur du menu pause s'il n'existe pas déjà
        if (!this.pauseContainer) {
            this.pauseContainer = Utilities.createElement('div', { class: 'pause-menu hidden' });
            this.container.appendChild(this.pauseContainer);
        }
          // Remplit le menu de pause
        this.pauseContainer.innerHTML = '';
          // Ajoute le titre du jeu
        this.pauseContainer.appendChild(Utilities.createElement('h2', { 
            class: 'game-title',
            style: 'color: var(--primary); font-size: 1.2rem; margin-bottom: 1rem;'
        }, 'BLOCKDROP'));
          this.pauseContainer.appendChild(Utilities.createElement('h2', { class: 'pause-title' }, Utilities.translate('pause')));
        
        // Boutons du menu pause
        const resumeButton = Utilities.createElement('button', {}, Utilities.translate('resume'));
        resumeButton.addEventListener('click', () => {
            if (this.onResumeCallback) {
                this.onResumeCallback();
            }
        });
        this.pauseContainer.appendChild(resumeButton);
        
        const restartButton = Utilities.createElement('button', { style: 'margin-top: 1rem;' }, Utilities.translate('restart'));
        restartButton.addEventListener('click', () => {
            if (this.onRestartCallback) {
                this.onRestartCallback();
            }
        });
        this.pauseContainer.appendChild(restartButton);
        
        const settingsButton = Utilities.createElement('button', { style: 'margin-top: 1rem;' }, Utilities.translate('options'));
        settingsButton.addEventListener('click', () => {
            if (this.onSettingsCallback) {
                this.onSettingsCallback();
            }
        });
        this.pauseContainer.appendChild(settingsButton);
          const quitButton = Utilities.createElement('button', { style: 'margin-top: 1rem;' }, Utilities.translate('quit'));
        quitButton.addEventListener('click', () => {
            this.confirmQuit();
        });
        this.pauseContainer.appendChild(quitButton);
        
        // Affiche le menu
        this.pauseContainer.classList.remove('hidden');
    }
    
    /**
     * Cache le menu de pause
     */
    hide() {
        if (this.pauseContainer) {
            this.pauseContainer.classList.add('hidden');
        }
    }
    
    /**
     * Affiche une confirmation avant de quitter la partie
     */    confirmQuit() {
        // Crée l'élément modal
        const modal = Utilities.createElement('div', { class: 'modal' }, [
            Utilities.createElement('div', { class: 'modal-content' }, [
                Utilities.createElement('h2', {}, Utilities.translate('quitGame')),
                Utilities.createElement('p', {}, Utilities.translate('quitConfirm')),
                Utilities.createElement('div', { class: 'modal-buttons' }, [
                    Utilities.createElement('button', { id: 'confirm-quit-btn' }, Utilities.translate('quit')),
                    Utilities.createElement('button', { id: 'cancel-quit-btn' }, Utilities.translate('cancel'))
                ])
            ])
        ]);
        
        // Ajoute le modal au DOM
        document.body.appendChild(modal);
        
        // Ajoute les écouteurs d'événements
        document.getElementById('confirm-quit-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            
            if (this.onQuitCallback) {
                this.onQuitCallback();
            }
        });
        
        document.getElementById('cancel-quit-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    /**
     * Définit le callback pour reprendre le jeu
     * @param {Function} callback - Fonction à appeler pour reprendre le jeu
     */
    setResumeCallback(callback) {
        this.onResumeCallback = callback;
    }
    
    /**
     * Définit le callback pour recommencer le jeu
     * @param {Function} callback - Fonction à appeler pour recommencer le jeu
     */
    setRestartCallback(callback) {
        this.onRestartCallback = callback;
    }
    
    /**
     * Définit le callback pour afficher les options
     * @param {Function} callback - Fonction à appeler pour afficher les options
     */
    setSettingsCallback(callback) {
        this.onSettingsCallback = callback;
    }
    
    /**
     * Définit le callback pour quitter le jeu
     * @param {Function} callback - Fonction à appeler pour quitter le jeu
     */    setQuitCallback(callback) {
        this.onQuitCallback = callback;
    }
    
    /**
     * Met à jour les labels des boutons selon la langue sélectionnée
     */
    updateTranslations() {
        const pauseTitle = document.querySelector('.pause-title');
        if (pauseTitle) {
            pauseTitle.textContent = Utilities.translate('pause');
        }
        
        const resumeButton = this.pauseContainer.querySelector('button:nth-child(2)');
        if (resumeButton) {
            resumeButton.textContent = Utilities.translate('resume');
        }
        
        const restartButton = this.pauseContainer.querySelector('button:nth-child(3)');
        if (restartButton) {
            restartButton.textContent = Utilities.translate('restart');
        }
        
        const settingsButton = this.pauseContainer.querySelector('button:nth-child(4)');
        if (settingsButton) {
            settingsButton.textContent = Utilities.translate('options');
        }
        
        const quitButton = this.pauseContainer.querySelector('button:nth-child(5)');
        if (quitButton) {
            quitButton.textContent = Utilities.translate('quit');
        }
    }
}
