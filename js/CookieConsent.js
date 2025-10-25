/**
 * CookieConsent - Consent Management Platform (CMP) pour RGPD
 * Gestion des consentements cookies et données personnelles
 */
class CookieConsent {
    constructor() {
        this.consent = this.loadConsent();
        this.bannerShown = false;
        
        // Catégories de cookies
        this.categories = {
            necessary: { id: 'necessary', name: 'Nécessaires', required: true, enabled: true },
            functional: { id: 'functional', name: 'Fonctionnels', required: false, enabled: false },
            analytics: { id: 'analytics', name: 'Analytiques', required: false, enabled: false },
            marketing: { id: 'marketing', name: 'Marketing', required: false, enabled: false }
        };
    }
    
    /**
     * Initialise le système de consentement
     */
    init() {
        // Si pas de consentement enregistré, affiche la bannière
        if (!this.consent.timestamp) {
            this.showBanner();
        } else {
            // Applique les préférences sauvegardées
            this.applyConsent();
        }
    }
    
    /**
     * Charge le consentement depuis localStorage
     */
    loadConsent() {
        try {
            const saved = localStorage.getItem('cookieConsent');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Erreur chargement consentement:', e);
        }
        
        return {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false,
            timestamp: null
        };
    }
    
    /**
     * Sauvegarde le consentement
     */
    saveConsent() {
        this.consent.timestamp = new Date().toISOString();
        localStorage.setItem('cookieConsent', JSON.stringify(this.consent));
    }
    
    /**
     * Applique les préférences de consentement
     */
    applyConsent() {
        // Cookies nécessaires (toujours actifs)
        // Contient: auth token, settings du jeu
        
        // Cookies fonctionnels
        if (!this.consent.functional) {
            // Désactive les fonctionnalités optionnelles
            this.disableFunctionalCookies();
        }
        
        // Cookies analytiques
        if (!this.consent.analytics) {
            this.disableAnalytics();
        } else {
            this.enableAnalytics();
        }
        
        // Cookies marketing
        if (!this.consent.marketing) {
            this.disableMarketing();
        }
    }
    
    /**
     * Affiche la bannière de consentement
     */
    showBanner() {
        if (this.bannerShown) return;
        this.bannerShown = true;
        
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <h3>🍪 Cookies et confidentialité</h3>
                    <p>Nous utilisons des cookies pour améliorer votre expérience de jeu. 
                    Vous pouvez personnaliser vos préférences ou accepter tous les cookies.</p>
                </div>
                <div class="cookie-consent-buttons">
                    <button class="btn-consent btn-settings" id="cookie-settings">
                        ⚙️ Paramètres
                    </button>
                    <button class="btn-consent btn-reject" id="cookie-reject">
                        ❌ Refuser
                    </button>
                    <button class="btn-consent btn-accept" id="cookie-accept">
                        ✅ Tout accepter
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Événements
        document.getElementById('cookie-accept').addEventListener('click', () => this.acceptAll());
        document.getElementById('cookie-reject').addEventListener('click', () => this.rejectAll());
        document.getElementById('cookie-settings').addEventListener('click', () => this.showSettings());
    }
    
    /**
     * Masque la bannière
     */
    hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.remove();
        }
        this.bannerShown = false;
    }
    
    /**
     * Affiche les paramètres détaillés
     */
    showSettings() {
        this.hideBanner();
        
        const modal = document.createElement('div');
        modal.id = 'cookie-settings-modal';
        modal.className = 'cookie-settings-modal';
        modal.innerHTML = `
            <div class="cookie-settings-content">
                <div class="cookie-settings-header">
                    <h2>Paramètres des cookies</h2>
                    <button class="modal-close" id="close-cookie-settings">×</button>
                </div>
                
                <div class="cookie-settings-body">
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <label class="cookie-category-label">
                                <input type="checkbox" checked disabled>
                                <span>🔒 Cookies nécessaires</span>
                            </label>
                        </div>
                        <p class="cookie-category-desc">
                            Ces cookies sont essentiels au fonctionnement du jeu. 
                            Ils permettent l'authentification et la sauvegarde de vos paramètres.
                        </p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <label class="cookie-category-label">
                                <input type="checkbox" id="consent-functional" ${this.consent.functional ? 'checked' : ''}>
                                <span>⚡ Cookies fonctionnels</span>
                            </label>
                        </div>
                        <p class="cookie-category-desc">
                            Améliorent votre expérience avec des fonctionnalités avancées 
                            (sauvegarde locale étendue, préférences de jeu).
                        </p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <label class="cookie-category-label">
                                <input type="checkbox" id="consent-analytics" ${this.consent.analytics ? 'checked' : ''}>
                                <span>📊 Cookies analytiques</span>
                            </label>
                        </div>
                        <p class="cookie-category-desc">
                            Nous aident à comprendre comment vous utilisez le jeu 
                            pour l'améliorer (statistiques anonymes).
                        </p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <label class="cookie-category-label">
                                <input type="checkbox" id="consent-marketing" ${this.consent.marketing ? 'checked' : ''}>
                                <span>🎯 Cookies marketing</span>
                            </label>
                        </div>
                        <p class="cookie-category-desc">
                            Permettent de personnaliser les publicités et contenus 
                            selon vos préférences.
                        </p>
                    </div>
                </div>
                
                <div class="cookie-settings-footer">
                    <button class="btn-consent btn-secondary" id="cookie-cancel">Annuler</button>
                    <button class="btn-consent btn-primary" id="cookie-save">Sauvegarder</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Événements
        document.getElementById('close-cookie-settings').addEventListener('click', () => this.closeSettings());
        document.getElementById('cookie-cancel').addEventListener('click', () => this.closeSettings());
        document.getElementById('cookie-save').addEventListener('click', () => this.saveSettings());
    }
    
    /**
     * Ferme les paramètres
     */
    closeSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) modal.remove();
        
        // Réaffiche la bannière si pas encore de consentement
        if (!this.consent.timestamp) {
            this.bannerShown = false;
            this.showBanner();
        }
    }
    
    /**
     * Sauvegarde les paramètres personnalisés
     */
    saveSettings() {
        this.consent.functional = document.getElementById('consent-functional').checked;
        this.consent.analytics = document.getElementById('consent-analytics').checked;
        this.consent.marketing = document.getElementById('consent-marketing').checked;
        
        this.saveConsent();
        this.applyConsent();
        this.closeSettings();
    }
    
    /**
     * Accepte tous les cookies
     */
    acceptAll() {
        this.consent.necessary = true;
        this.consent.functional = true;
        this.consent.analytics = true;
        this.consent.marketing = true;
        
        this.saveConsent();
        this.applyConsent();
        this.hideBanner();
    }
    
    /**
     * Rejette tous les cookies optionnels
     */
    rejectAll() {
        this.consent.necessary = true;
        this.consent.functional = false;
        this.consent.analytics = false;
        this.consent.marketing = false;
        
        this.saveConsent();
        this.applyConsent();
        this.hideBanner();
    }
    
    /**
     * Vérifie si une catégorie est autorisée
     */
    isAllowed(category) {
        return this.consent[category] === true;
    }
    
    /**
     * Désactive les cookies fonctionnels
     */
    disableFunctionalCookies() {
        // Supprime les cookies fonctionnels non essentiels
        const functionalKeys = ['game_preferences', 'ui_state'];
        functionalKeys.forEach(key => localStorage.removeItem(key));
    }
    
    /**
     * Désactive les analytics
     */
    disableAnalytics() {
        // Désactive Google Analytics ou autres
        if (window.gtag) {
            window.gtag('consent', 'update', {
                analytics_storage: 'denied'
            });
        }
    }
    
    /**
     * Active les analytics
     */
    enableAnalytics() {
        if (window.gtag) {
            window.gtag('consent', 'update', {
                analytics_storage: 'granted'
            });
        }
    }
    
    /**
     * Désactive le marketing
     */
    disableMarketing() {
        if (window.gtag) {
            window.gtag('consent', 'update', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
            });
        }
    }
    
    /**
     * Réinitialise tous les consentements
     */
    reset() {
        localStorage.removeItem('cookieConsent');
        this.consent = this.loadConsent();
        this.bannerShown = false;
        this.showBanner();
    }
}
