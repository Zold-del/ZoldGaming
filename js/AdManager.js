// AdManager.js - Gestion des publicités dans le jeu BlockDrop

/**
 * Classe pour gérer les publicités AdSense dans le jeu
 */
class AdManager {    
    /**
     * Initialise le gestionnaire de publicités
     */
    constructor() {
        this.adsEnabled = GameSettings.adsEnabled;
        this.interstitialShown = false;
        this.lastAdTime = 0;
        this.adCooldown = 60000; // 60 secondes entre les publicités interstitielles
        
        // Détection automatique du mode de développement vs production
        this.isDevelopmentMode = this.checkIsDevelopmentMode();
        
        console.log("Mode publicité:", this.isDevelopmentMode ? "Développement (placeholders)" : "Production (AdSense)");
    }
    
    /**
     * Vérifie si le jeu est en mode développement
     * @returns {boolean} true si en mode dev, false si en production
     */    checkIsDevelopmentMode() {
        // Vérifie si le mode dev est forcé via l'URL (pour le testing)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('admode') && urlParams.get('admode') === 'dev') {
            console.log("Mode publicité forcé: développement (via URL)");
            return true;
        }
        
        // En mode dev si:
        // - Protocole file:// (fichier local)
        // - Localhost ou 127.0.0.1
        // - URL qui contient "localhost" ou une IP locale
        const isLocalFile = window.location.protocol === 'file:';
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.startsWith('192.168.') ||
                           window.location.hostname.startsWith('10.') ||
                           window.location.hostname.indexOf('.local') !== -1;
        
        // On ne considère plus automatiquement itch.io comme production
        // pour faciliter le débogage
        return isLocalFile || isLocalhost;
    }

    /**
     * Initialise les conteneurs de publicités
     */
    init() {
        // Création du conteneur pour la bannière
        this.createBannerContainer();
        
        // Chargement initial de la bannière
        this.loadBannerAd();
        
        // Log pour le debug
        console.log("AdManager initialized");
    }

    /**
     * Crée un conteneur pour la bannière publicitaire
     */
    createBannerContainer() {
        // Crée le conteneur pour l'annonce bannière en bas de l'écran
        const adContainer = document.createElement('div');
        adContainer.id = 'ad-container';
        adContainer.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 90px;
            z-index: 9999;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        // Ajoute le conteneur au body
        document.body.appendChild(adContainer);
    }    /**
     * Charge une publicité bannière
     */    loadBannerAd() {
        if (!this.adsEnabled) return;
        
        const adContainer = document.getElementById('ad-container');
        if (!adContainer) return;

        // Vide le conteneur d'abord
        adContainer.innerHTML = '';
        
        // En mode développement, on utilise des placeholders
        if (this.isDevelopmentMode) {
            // Crée un placeholder pour simuler la pub
            adContainer.appendChild(this.createDevPlaceholder(728, 90, 'Bannière'));
            return;
        }
        
        // MODE PRODUCTION: Crée l'élément ins pour AdSense
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.cssText = 'display:inline-block;width:728px;height:90px';
        adElement.setAttribute('data-ad-client', 'ca-pub-7892383510036313');
        adElement.setAttribute('data-ad-slot', '3750170567');
        
        // Ajoute l'élément au conteneur
        adContainer.appendChild(adElement);
        
        // Exécute le code AdSense pour charger la publicité
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
            // Vérifie si la pub a bien été chargée
            this.checkAdLoaded('ad-container', 728, 90);
        } catch (error) {
            console.error('Error loading banner ad:', error);
            if (error.toString().includes('connect') || navigator.onLine === false) {
                adContainer.appendChild(this.createAdPlaceholder(728, 90, 'connection'));
            } else if (window.location.protocol === 'file:' || window.location.hostname === 'localhost') {
                adContainer.appendChild(this.createAdPlaceholder(728, 90, 'notApproved'));
            } else {
                adContainer.appendChild(this.createAdPlaceholder(728, 90));
            }
        }

        // Vérifie si la publicité a été chargée et affiche un placeholder si nécessaire
        this.checkAdLoaded('ad-container', 728, 90);
    }
    
    /**
     * Affiche une publicité interstitielle (plein écran)
     * @param {Function} onClose - Fonction à appeler quand la pub est fermée
     * @returns {boolean} - True si la pub est affichée, false sinon
     */
    showInterstitial(onClose) {
        // Vérifie si les pubs sont activées et si le cooldown est passé
        if (!this.adsEnabled) {
            if (onClose) onClose();
            return false;
        }
        
        const now = Date.now();
        if (now - this.lastAdTime < this.adCooldown) {
            if (onClose) onClose();
            return false;
        }
        
        this.lastAdTime = now;
        
        // Crée un overlay pour la pub interstitielle
        const overlay = document.createElement('div');
        overlay.id = 'ad-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        `;
          // Ajoute un message "Publicité"
        const adTitle = document.createElement('div');
        adTitle.textContent = Utilities.translate('advertisement');
        adTitle.style.cssText = `
            color: white;
            font-family: 'Press Start 2P', monospace;
            font-size: 18px;
            margin-bottom: 20px;
        `;
        
        // Ajoute un conteneur pour la pub
        const adContainer = document.createElement('div');
        adContainer.id = 'interstitial-ad';
        adContainer.style.cssText = `
            width: 336px;
            height: 280px;
            background-color: #222;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
          // Ajoute un bouton pour fermer la pub après un délai
        const closeButton = document.createElement('button');
        closeButton.textContent = Utilities.translate('closeInSeconds').replace('{seconds}', '5');
        closeButton.style.cssText = `
            margin-top: 20px;
            padding: 10px 20px;
            background: #444;
            color: white;
            border: none;
            font-family: 'Press Start 2P', monospace;
            cursor: not-allowed;
            opacity: 0.5;
        `;
        
        overlay.appendChild(adTitle);
        overlay.appendChild(adContainer);
        overlay.appendChild(closeButton);
          document.body.appendChild(overlay);
          
        // En mode développement, on utilise des placeholders
        if (this.isDevelopmentMode) {
            // Crée un placeholder pour simuler la pub
            adContainer.appendChild(this.createDevPlaceholder(336, 280, 'Interstitielle'));
        } else {
            // MODE PRODUCTION: Crée l'élément ins pour AdSense
            const adElement = document.createElement('ins');
            adElement.className = 'adsbygoogle';
            adElement.style.cssText = 'display:inline-block;width:336px;height:280px';
            adElement.setAttribute('data-ad-client', 'ca-pub-7892383510036313');
            adElement.setAttribute('data-ad-slot', '3750170567');
            
            adContainer.appendChild(adElement);
              
            // Charge la publicité
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
                
                // Vérifie si la pub interstitielle a bien été chargée
                this.checkAdLoaded('interstitial-ad', 336, 280);
            } catch (error) {
                console.error('Error loading interstitial ad:', error);
                if (error.toString().includes('connect') || navigator.onLine === false) {
                    adContainer.appendChild(this.createAdPlaceholder(336, 280, 'connection'));
                } else if (window.location.protocol === 'file:' || window.location.hostname === 'localhost') {
                    adContainer.appendChild(this.createAdPlaceholder(336, 280, 'notApproved'));
                } else {
                    adContainer.appendChild(this.createAdPlaceholder(336, 280));
                }
            }
        }
          // Gestion du délai avant de pouvoir fermer
        let secondsLeft = 5;
        const countdownInterval = setInterval(() => {
            secondsLeft--;
            closeButton.textContent = Utilities.translate('closeInSeconds').replace('{seconds}', secondsLeft);
            
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                closeButton.textContent = Utilities.translate('close');
                closeButton.style.cursor = 'pointer';
                closeButton.style.opacity = '1';
                closeButton.style.background = '#f00';
                
                closeButton.addEventListener('click', () => {
                    document.body.removeChild(overlay);
                    if (onClose) onClose();
                });
            }
        }, 1000);
        
        // Fallback si la publicité n'est pas chargée correctement
        setTimeout(() => {
            if (document.getElementById('ad-overlay') && onClose) {
                if (secondsLeft <= 0) return;
                clearInterval(countdownInterval);
                closeButton.textContent = Utilities.translate('close');
                closeButton.style.cursor = 'pointer';
                closeButton.style.opacity = '1';
                closeButton.style.background = '#f00';
                
                closeButton.addEventListener('click', () => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                        if (onClose) onClose();
                    }
                });
            }
        }, 8000);
        
        return true;
    }
    
    /**
     * Cache ou affiche la bannière publicitaire
     * @param {boolean} show - True pour afficher, false pour cacher
     */
    toggleBanner(show) {
        const adContainer = document.getElementById('ad-container');
        if (!adContainer) return;
        
        adContainer.style.display = show ? 'flex' : 'none';
    }
    
    /**
     * Active ou désactive les publicités
     * @param {boolean} enabled - True pour activer, false pour désactiver
     */
    setAdsEnabled(enabled) {
        this.adsEnabled = enabled;
        GameSettings.adsEnabled = enabled;
        GameSettings.save();
        
        if (!enabled) {
            this.toggleBanner(false);
        } else {
            this.toggleBanner(true);
            this.loadBannerAd();
        }
    }

    /**
     * Crée un élément placeholder pour les publicités bloquées
     * @param {number} width - Largeur du placeholder
     * @param {number} height - Hauteur du placeholder
     * @returns {HTMLDivElement} - Élément placeholder
     */    createAdPlaceholder(width, height, errorType = 'blocked') {
        const placeholder = document.createElement('div');
        placeholder.className = 'ad-placeholder';
        placeholder.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            background: rgba(50, 50, 50, 0.8);
            color: #ccc;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px dashed #555;
            font-family: 'Press Start 2P', monospace;
            font-size: 12px;
            text-align: center;
            padding: 10px;
            box-sizing: border-box;
        `;
        
        const icon = document.createElement('div');
        icon.textContent = errorType === 'connection' ? '🌐❌' : '🛑';
        icon.style.cssText = 'font-size: 24px; margin-bottom: 10px;';
        placeholder.appendChild(icon);
        
        const text = document.createElement('div');
        
        // Différents messages selon le type d'erreur
        if (errorType === 'connection') {
            text.textContent = Utilities.translate('adConnectionError');
        } else if (errorType === 'notApproved') {
            text.textContent = Utilities.translate('adNotApproved'); 
        } else {
            text.textContent = Utilities.translate('adBlockerDetected');
        }
        
        placeholder.appendChild(text);
        
        return placeholder;
    }
    
    /**
     * Vérifie si une publicité a été chargée et affiche un placeholder si nécessaire
     * @param {string} containerId - ID du conteneur de la publicité
     * @param {number} width - Largeur de la publicité
     * @param {number} height - Hauteur de la publicité
     */
    checkAdLoaded(containerId, width, height) {
        setTimeout(() => {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            // Vérifie si la pub a été chargée (détection simplifiée)
            const adElements = container.querySelectorAll('iframe, ins');
            const hasAdContent = Array.from(adElements).some(el => 
                el.offsetHeight > 0 && window.getComputedStyle(el).display !== 'none'
            );
            
            if (!hasAdContent) {
                container.innerHTML = '';
                container.appendChild(this.createAdPlaceholder(width, height));
            }
        }, 2000); // Délai pour laisser AdSense charger
    }

    /**
     * Charge une publicité au format autorelaxed (adaptatif)
     * @param {string} containerId - ID du conteneur où afficher la publicité
     */    loadAutoRelaxedAd(containerId) {
        if (!this.adsEnabled) return;
        
        const adContainer = document.getElementById(containerId);
        if (!adContainer) return;
        
        // Vide le conteneur d'abord
        adContainer.innerHTML = '';
        
        // En mode développement, on utilise des placeholders
        if (this.isDevelopmentMode) {
            // Crée un placeholder pour simuler la pub
            adContainer.appendChild(this.createDevPlaceholder(300, 250, 'Auto Relaxed'));
            return;
        }
        
        // MODE PRODUCTION: Crée l'élément ins pour AdSense format autorelaxed
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.cssText = 'display:block;';
        adElement.setAttribute('data-ad-format', 'autorelaxed');
        adElement.setAttribute('data-ad-client', 'ca-pub-7892383510036313');
        adElement.setAttribute('data-ad-slot', '3750170567');
        
        // Ajoute l'élément au conteneur
        adContainer.appendChild(adElement);
        
        // Exécute le code AdSense pour charger la publicité
        try {
            // Utilisation du code recommandé par Google pour pousser l'annonce
            (adsbygoogle = window.adsbygoogle || []).push({});
            
            // Vérifie si la pub a bien été chargée
            this.checkAdLoaded(containerId, adContainer.clientWidth, adContainer.clientHeight);
        } catch (error) {
            console.error('Error loading autorelaxed ad:', error);
            if (error.toString().includes('connect') || navigator.onLine === false) {
                adContainer.appendChild(this.createAdPlaceholder(300, 250, 'connection'));
            } else {
                adContainer.appendChild(this.createAdPlaceholder(300, 250));
            }
        }
    }

    /**
     * Crée un placeholder développeur pour les publicités en mode local
     * @param {number} width - Largeur du placeholder
     * @param {number} height - Hauteur du placeholder
     * @param {string} adType - Type de publicité (Bannière, Interstitielle, etc)
     * @returns {HTMLDivElement} - Élément placeholder dev
     */
    createDevPlaceholder(width, height, adType = 'Ad') {
        const colors = ['#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#f39c12'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const placeholder = document.createElement('div');
        placeholder.className = 'dev-ad-placeholder';
        placeholder.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            background: ${randomColor};
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 2px solid white;
            font-family: 'Press Start 2P', monospace;
            font-size: ${Math.max(12, Math.min(18, Math.floor(width/20)))}px;
            text-align: center;
            padding: 10px;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
        `;
        
        // Ajouter un effet de diagonales en arrière-plan
        const stripes = document.createElement('div');
        stripes.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 200%;
            background-image: repeating-linear-gradient(
                45deg,
                rgba(255, 255, 255, 0.1),
                rgba(255, 255, 255, 0.1) 10px,
                rgba(255, 255, 255, 0.2) 10px,
                rgba(255, 255, 255, 0.2) 20px
            );
            z-index: 1;
        `;
        placeholder.appendChild(stripes);
        
        // Contenu principal
        const content = document.createElement('div');
        content.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 2;
        `;
        
        // Icône de développement
        const devIcon = document.createElement('div');
        devIcon.textContent = '🛠️';
        devIcon.style.cssText = 'font-size: 24px; margin-bottom: 10px;';
        content.appendChild(devIcon);
        
        // Titre du placeholder
        const adTypeText = document.createElement('div');
        adTypeText.textContent = adType;
        adTypeText.style.cssText = 'font-weight: bold; margin-bottom: 5px;';
        content.appendChild(adTypeText);
        
        // Dimensions
        const dimensionsText = document.createElement('div');
        dimensionsText.textContent = `${width}×${height}`;
        dimensionsText.style.cssText = 'opacity: 0.8;';
        content.appendChild(dimensionsText);
        
        // Mode développement
        const devModeText = document.createElement('div');
        devModeText.textContent = 'Mode développement';
        devModeText.style.cssText = 'margin-top: 10px; font-size: 10px; background: rgba(0,0,0,0.2); padding: 3px 6px; border-radius: 3px;';
        content.appendChild(devModeText);
        
        placeholder.appendChild(content);
        
        return placeholder;
    }
}
