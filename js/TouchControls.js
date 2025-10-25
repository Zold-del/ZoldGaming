/**
 * TouchControls.js - Contrôles tactiles pour BlockDrop Tetris
 * Gère les interactions tactiles sur mobile
 */
class TouchControls {
    /**
     * Initialise les contrôles tactiles
     * @param {Object} gameEngine - Instance du moteur de jeu
     */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.container = null;
        this.isEnabled = false;
        this.isMobile = this.detectMobile();
        
        // Prévention du double-tap
        this.lastTap = 0;
        this.tapDelay = 300;
        
        if (this.isMobile) {
            this.init();
        }
    }
    
    /**
     * Détecte si l'appareil est mobile
     * @returns {boolean} - True si mobile
     */
    detectMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Détection améliorée
        const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        
        return (isMobileUA || isTouchDevice) && isSmallScreen;
    }
    
    /**
     * Initialise les contrôles tactiles
     */
    init() {
        console.log('Initialisation des contrôles tactiles');
        
        // Crée le conteneur des contrôles
        this.createControls();
        
        // Empêche le zoom au double-tap
        this.preventDoubleTapZoom();
        
        // Gère l'orientation
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.adjustLayout(), 100);
        });
        
        this.isEnabled = true;
    }
    
    /**
     * Crée l'interface des contrôles tactiles
     */
    createControls() {
        // Vérifie si les contrôles existent déjà
        if (document.getElementById('touch-controls')) {
            this.container = document.getElementById('touch-controls');
            this.attachEventListeners();
            return;
        }
        
        // Crée le conteneur
        this.container = document.createElement('div');
        this.container.id = 'touch-controls';
        this.container.className = 'touch-controls';
        
        // Boutons de contrôle
        const buttons = [
            { id: 'touch-left', class: 'touch-btn left', icon: '⬅️', label: 'Gauche', action: 'moveLeft' },
            { id: 'touch-right', class: 'touch-btn right', icon: '➡️', label: 'Droite', action: 'moveRight' },
            { id: 'touch-rotate', class: 'touch-btn rotate', icon: '🔄', label: 'Tourner', action: 'rotate' },
            { id: 'touch-rotate-reverse', class: 'touch-btn rotate-reverse', icon: '🔃', label: 'Inverse', action: 'rotateReverse' },
            { id: 'touch-down', class: 'touch-btn down', icon: '⬇️', label: 'Descendre', action: 'moveDown' },
            { id: 'touch-drop', class: 'touch-btn drop', icon: '⚡', label: 'Drop', action: 'hardDrop' }
        ];
        
        buttons.forEach(btnConfig => {
            const button = document.createElement('button');
            button.id = btnConfig.id;
            button.className = btnConfig.class;
            button.innerHTML = `
                <div class="icon">${btnConfig.icon}</div>
                <div class="label">${btnConfig.label}</div>
            `;
            button.dataset.action = btnConfig.action;
            this.container.appendChild(button);
        });
        
        document.body.appendChild(this.container);
        
        // Attache les événements
        this.attachEventListeners();
    }
    
    /**
     * Attache les écouteurs d'événements
     */
    attachEventListeners() {
        const buttons = this.container.querySelectorAll('.touch-btn');
        
        buttons.forEach(button => {
            const action = button.dataset.action;
            
            // Support touch
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleAction(action, 'start');
            }, { passive: false });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleAction(action, 'end');
            }, { passive: false });
            
            // Support souris (pour tests)
            button.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.handleAction(action, 'start');
            });
            
            button.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.handleAction(action, 'end');
            });
        });
    }
    
    /**
     * Gère les actions des boutons
     * @param {string} action - Action à effectuer
     * @param {string} phase - Phase de l'action (start/end)
     */
    handleAction(action, phase) {
        if (!this.gameEngine || !this.gameEngine.isRunning) return;
        
        // Vibration haptique (si disponible)
        if (navigator.vibrate && phase === 'start') {
            navigator.vibrate(10);
        }
        
        // Joue un son si activé
        if (window.audioManager && phase === 'start') {
            switch (action) {
                case 'rotate':
                case 'rotateReverse':
                    window.audioManager.playSound('rotate');
                    break;
                case 'hardDrop':
                    window.audioManager.playSound('drop');
                    break;
            }
        }
        
        // Exécute l'action
        switch (action) {
            case 'moveLeft':
                if (phase === 'start') {
                    this.gameEngine.movePiece(-1, 0);
                }
                break;
                
            case 'moveRight':
                if (phase === 'start') {
                    this.gameEngine.movePiece(1, 0);
                }
                break;
                
            case 'moveDown':
                if (phase === 'start') {
                    this.gameEngine.movePiece(0, 1);
                }
                break;
                
            case 'rotate':
                if (phase === 'start') {
                    this.gameEngine.rotatePiece(1);
                }
                break;
                
            case 'rotateReverse':
                if (phase === 'start') {
                    this.gameEngine.rotatePiece(-1);
                }
                break;
                
            case 'hardDrop':
                if (phase === 'start') {
                    this.gameEngine.hardDrop();
                }
                break;
        }
    }
    
    /**
     * Empêche le zoom au double-tap
     */
    preventDoubleTapZoom() {
        document.addEventListener('touchstart', (e) => {
            const now = Date.now();
            if (now - this.lastTap < this.tapDelay) {
                e.preventDefault();
            }
            this.lastTap = now;
        }, { passive: false });
        
        // Empêche le zoom par pincement
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Désactive le pull-to-refresh
        document.body.style.overscrollBehavior = 'none';
    }
    
    /**
     * Ajuste la disposition selon l'orientation
     */
    adjustLayout() {
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (isLandscape) {
            // Mode paysage - contrôles plus compacts
            this.container.style.padding = '10px';
            this.container.style.gap = '8px';
        } else {
            // Mode portrait - contrôles normaux
            this.container.style.padding = '15px';
            this.container.style.gap = '10px';
        }
    }
    
    /**
     * Affiche les contrôles
     */
    show() {
        if (this.container) {
            this.container.style.display = 'grid';
        }
    }
    
    /**
     * Cache les contrôles
     */
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }
    
    /**
     * Active les contrôles
     */
    enable() {
        this.isEnabled = true;
        this.show();
    }
    
    /**
     * Désactive les contrôles
     */
    disable() {
        this.isEnabled = false;
        this.hide();
    }
    
    /**
     * Nettoie les ressources
     */
    dispose() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.isEnabled = false;
    }
}
