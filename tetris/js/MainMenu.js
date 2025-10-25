// MainMenu.js - Menu principal du jeu BlockDrop

/**
 * Classe pour le menu principal du jeu
 */
class MainMenu {
    /**
     * Crée une nouvelle instance du menu principal
     * @param {HTMLElement} container - Conteneur où afficher le menu
     */
    constructor(container) {
        this.container = container || document.getElementById('app');
        this.onPlayCallback = null;
        this.onChallengeCallback = null;
        this.onRewardsCallback = null;
        this.onOptionsCallback = null;
        this.onLeaderboardCallback = null;
        this.onLoginCallback = null;
        this.onUserSettingsCallback = null; // Nouveau callback pour les paramètres utilisateur
        this.currentState = 'menu'; // État actuel du menu
        
        // Charge les paramètres du jeu
        GameSettings.load();
        
        // S'abonne aux changements d'état d'authentification
        if (window.apiService) {
            window.apiService.onAuthStateChange((isAuthenticated, user) => {
                // Re-render le menu seulement si on est actuellement sur le menu principal
                // et que le conteneur existe encore dans le DOM
                if (this.container && this.container.parentNode && 
                    this.container.id === 'app') {
                    this.render();
                }
            });
        }
    }
      /**
     * Affiche le menu principal
     */    render() {        // Vide le conteneur
        this.container.innerHTML = '';
        
        // Crée l'élément de titre
        const title = Utilities.createElement('h1', { class: 'titre-retro' }, 'BLOCKDROP');
        
        // Pas besoin de sous-titre car nous utilisons seulement BLOCKDROP
        
          // Crée les boutons sociaux
        const socialButtons = Utilities.createElement('div', { class: 'social-buttons' });
          // Discord
        const discordBtn = Utilities.createElement('a', { 
            class: 'social-button', 
            href: 'https://discord.gg/ruj8WM58', 
            target: '_blank',
            title: 'Discord'
        });
        const discordIcon = document.createElement('i');
        discordIcon.className = 'fab fa-discord';
        discordBtn.appendChild(discordIcon);        // Twitter
        const twitterBtn = Utilities.createElement('a', { 
            class: 'social-button', 
            href: 'https://x.com/GameZoldStudio', 
            target: '_blank',
            title: 'Twitter'
        });
        const twitterIcon = document.createElement('i');
        twitterIcon.className = 'fab fa-twitter';
        twitterBtn.appendChild(twitterIcon);        // Twitch
        const twitchBtn = Utilities.createElement('a', { 
            class: 'social-button', 
            href: 'https://www.twitch.tv/anthony_zold', 
            target: '_blank',
            title: 'Twitch'
        });
        const twitchIcon = document.createElement('i');
        twitchIcon.className = 'fab fa-twitch';
        twitchBtn.appendChild(twitchIcon);
        
        // Changelog
        const changelogBtn = Utilities.createElement('a', { 
            class: 'social-button', 
            href: '#', 
            id: 'changelog-btn',
            title: 'Changelog'
        });
        const changelogIcon = document.createElement('i');
        changelogIcon.className = 'fas fa-clipboard-list';
        changelogBtn.appendChild(changelogIcon);
        
        // Ajout des boutons au conteneur
        socialButtons.appendChild(discordBtn);
        socialButtons.appendChild(twitterBtn);
        socialButtons.appendChild(twitchBtn);
        socialButtons.appendChild(changelogBtn);
          // Affichage de l'utilisateur connecté avec menu profil
        let userProfileContainer = null;
        let isAdmin = false;
        
        if (window.apiService && window.apiService.isAuthenticated()) {
            const user = window.apiService.getCurrentUser();
            
            isAdmin = user?.role === 'admin' || user?.role === 'moderator';
            const roleBadge = isAdmin ? '<span class="user-badge">👑</span>' : '';
            
            // Créer le conteneur du profil utilisateur
            userProfileContainer = Utilities.createElement('div', { 
                class: 'user-profile-container',
                id: 'user-profile-container'
            });
            
            // Bouton du profil
            const profileButton = Utilities.createElement('div', { 
                class: 'user-profile-button',
                id: 'user-profile-button'
            });
            
            profileButton.innerHTML = `
                <div class="user-avatar">
                    ${user.avatar || '👤'}
                    <div class="user-status"></div>
                </div>
                <span class="user-name">${user.username}</span>
                ${roleBadge}
            `;
            
            // Menu déroulant
            const dropdown = Utilities.createElement('div', { 
                class: 'profile-dropdown',
                id: 'profile-dropdown'
            });
            
            dropdown.innerHTML = `
                <div class="profile-header">
                    <div class="user-avatar">${user.avatar || '👤'}</div>
                    <div class="profile-username">
                        ${user.username}
                        ${roleBadge}
                    </div>
                    <div class="profile-status">En ligne</div>
                </div>
                <div class="profile-menu">
                    <div class="profile-menu-item" id="profile-edit">
                        <i>👤</i>
                        <span>${GameSettings.language === 'fr' ? 'Modifier le profil' : 'Edit Profile'}</span>
                    </div>
                    <div class="profile-menu-item" id="profile-customization">
                        <i>🎨</i>
                        <span>${GameSettings.language === 'fr' ? 'Personnalisations' : 'Customization'}</span>
                    </div>
                    <div class="profile-menu-item" id="profile-settings">
                        <i>⚙️</i>
                        <span>${GameSettings.language === 'fr' ? 'Paramètres' : 'Settings'}</span>
                    </div>
                    <div class="profile-menu-item" id="profile-user-settings">
                        <i>🔒</i>
                        <span>${GameSettings.language === 'fr' ? 'Paramètres utilisateur' : 'User Settings'}</span>
                    </div>
                    ${isAdmin ? `
                    <div class="profile-menu-item" id="profile-admin">
                        <i>👑</i>
                        <span>Panel Admin</span>
                    </div>
                    ` : ''}
                    <div class="profile-menu-item danger" id="profile-logout">
                        <i>🚪</i>
                        <span>${GameSettings.language === 'fr' ? 'Déconnexion' : 'Logout'}</span>
                    </div>
                </div>
            `;
            
            userProfileContainer.appendChild(profileButton);
            userProfileContainer.appendChild(dropdown);
        }

        // Crée le menu avec les boutons avec traduction
        const menuButtons = [
            Utilities.createElement('button', { id: 'play-btn' }, Utilities.translate('play')),
            Utilities.createElement('button', { id: 'challenge-btn', disabled: true, style: 'opacity:0.6;cursor:not-allowed;' }, Utilities.translate('challengeMode') + ' (Prochainement)'),
            Utilities.createElement('button', { id: 'leaderboard-btn' }, GameSettings.language === 'fr' ? 'Classement' : 'Leaderboard'),
            Utilities.createElement('button', { id: 'rewards-btn' }, Utilities.translate('rewards')),
            Utilities.createElement('button', { id: 'options-btn' }, Utilities.translate('options'))
        ];

        // Ajouter le bouton Panel Admin si l'utilisateur est admin
        if (isAdmin) {
            menuButtons.push(
                Utilities.createElement('button', { 
                    id: 'admin-panel-btn',
                    style: 'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-weight: bold;'
                }, '👑 Panel Admin')
            );
        }

        // Bouton connexion si non connecté
        if (!window.apiService || !window.apiService.isAuthenticated()) {
            menuButtons.push(
                Utilities.createElement('button', { id: 'login-btn' }, GameSettings.language === 'fr' ? 'Connexion' : 'Login')
            );
        }

        menuButtons.push(Utilities.createElement('button', { id: 'quit-btn' }, Utilities.translate('quit')));

        const menu = Utilities.createElement('div', { class: 'menu' }, menuButtons);
        
        this.container.appendChild(title);
        this.container.appendChild(socialButtons);
        if (userProfileContainer) {
            this.container.appendChild(userProfileContainer);
        }
        this.container.appendChild(menu);
        
        // Ajoute les écouteurs d'événements aux boutons
        this.addEventListeners();
        
        // Démarre la musique du menu
        Utilities.handleMusic('play');
    }
    
    /**
     * Ajoute les écouteurs d'événements aux boutons du menu
     */
    addEventListeners() {
        // Bouton Jouer
        const playButton = document.getElementById('play-btn');
        if (playButton) {
            playButton.addEventListener('click', () => {
                if (this.onPlayCallback) {
                    this.onPlayCallback();
                }
            });
        }
        
        // Bouton Mode Défi
        const challengeButton = document.getElementById('challenge-btn');
        if (challengeButton) {
            challengeButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Affiche une notification ou rien
                Utilities.showNotification('Le mode Défi arrive prochainement !', 'info');
            });
        }
        
        // Bouton Récompenses
        const rewardsButton = document.getElementById('rewards-btn');
        if (rewardsButton) {
            rewardsButton.addEventListener('click', () => {
                if (this.onRewardsCallback) {
                    this.onRewardsCallback();
                }
            });
        }
        
        // Bouton Options
        const optionsButton = document.getElementById('options-btn');
        if (optionsButton) {
            optionsButton.addEventListener('click', () => {
                if (this.onOptionsCallback) {
                    this.onOptionsCallback();
                }
            });
        }
        
        // Bouton Quitter
        const quitButton = document.getElementById('quit-btn');
        if (quitButton) {
            quitButton.addEventListener('click', () => {
                this.showQuitConfirmation();
            });
        }

        // Bouton Changelog
        const changelogButton = document.getElementById('changelog-btn');
        if (changelogButton) {
            changelogButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.showChangelog();
            });
        }

        // Bouton Classement
        const leaderboardButton = document.getElementById('leaderboard-btn');
        if (leaderboardButton) {
            leaderboardButton.addEventListener('click', () => {
                if (this.onLeaderboardCallback) {
                    this.onLeaderboardCallback();
                }
            });
        }

        // Bouton Connexion/Déconnexion
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                if (this.onLoginCallback) {
                    this.onLoginCallback();
                }
            });
        }

        // Menu profil utilisateur
        const profileButton = document.getElementById('user-profile-button');
        const profileDropdown = document.getElementById('profile-dropdown');
        
        if (profileButton && profileDropdown) {
            // Toggle du menu au clic
            profileButton.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
            });
            
            // Fermer le menu en cliquant ailleurs
            document.addEventListener('click', (e) => {
                if (!profileDropdown.contains(e.target) && !profileButton.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            });
            
            // Modifier le profil
            const editProfile = document.getElementById('profile-edit');
            if (editProfile) {
                editProfile.addEventListener('click', () => {
                    profileDropdown.classList.remove('active');
                    // TODO: Ouvrir le menu de modification du profil
                    alert('Fonctionnalité à venir : Modification du profil');
                });
            }
            
            // Personnalisations (Récompenses)
            const customization = document.getElementById('profile-customization');
            if (customization) {
                customization.addEventListener('click', () => {
                    profileDropdown.classList.remove('active');
                    if (this.onRewardsCallback) {
                        this.onRewardsCallback();
                    }
                });
            }
            
            // Paramètres utilisateur (RGPD)
            const userSettings = document.getElementById('profile-user-settings');
            if (userSettings) {
                userSettings.addEventListener('click', () => {
                    profileDropdown.classList.remove('active');
                    if (this.onUserSettingsCallback) {
                        this.onUserSettingsCallback();
                    }
                });
            }
            
            // Panel Admin
            const adminPanel = document.getElementById('profile-admin');
            if (adminPanel) {
                adminPanel.addEventListener('click', () => {
                    profileDropdown.classList.remove('active');
                    window.open('admin.html', '_blank');
                });
            }
            
            // Déconnexion
            const logout = document.getElementById('profile-logout');
            if (logout) {
                logout.addEventListener('click', async () => {
                    profileDropdown.classList.remove('active');
                    if (window.apiService) {
                        await window.apiService.logout();
                        // Le menu se mettra à jour automatiquement via le callback
                    }
                });
            }
        }

        // Bouton Panel Admin
        const adminPanelButton = document.getElementById('admin-panel-btn');
        if (adminPanelButton) {
            adminPanelButton.addEventListener('click', () => {
                window.open('admin.html', '_blank');
            });
        }
    }
    
    /**
     * Affiche une confirmation avant de quitter le jeu
     */
    showQuitConfirmation() {
        // Crée l'élément modal
        const modal = Utilities.createElement('div', { class: 'modal' }, [
            Utilities.createElement('div', { class: 'modal-content' }, [                Utilities.createElement('h2', {}, Utilities.translate('quitGame')),
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
            // Ferme la fenêtre (uniquement possible si le jeu est en iframe ou autre)
            if (window.close) {
                window.close();            } else {
                // Sinon, affiche simplement un message
                alert(Utilities.translate('thanksForPlaying'));
                document.body.removeChild(modal);
            }
        });
        
        document.getElementById('cancel-quit-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }    /**
     * Affiche la fenêtre du Changelog
     */    showChangelog() {
        // Crée l'élément modal
        const modal = Utilities.createElement('div', { class: 'modal' }, [
            Utilities.createElement('div', { class: 'modal-content modal-changelog' }, [                Utilities.createElement('h2', {}, 'Changelog'),
                Utilities.createElement('div', { class: 'changelog-content' }, [
                    // Version 0.0.3 Beta (nouvelle version)
                    Utilities.createElement('h3', {}, `${Utilities.translate('version')} 0.0.3 Beta - 17 ${GameSettings.language === 'fr' ? 'Mai' : 'May'} 2025`),                    Utilities.createElement('ul', {}, [
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Corrections : Le bouton quitter ne fonctionnait pas sur itch.io' : 'Fixed: Quit button not working on itch.io'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Corrections : La langue anglaise n\'était pas traduite dans tout le jeu [il manque encore des textes]' : 'Fixed: English language not fully translated throughout the game [some text still missing]'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Corrections : Des bugs dans les options quand on changeait certains paramètres' : 'Fixed: Bugs in the options when changing certain settings'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Améliorations : Dans Graphisme, améliorations des boutons pour changer les palettes' : 'Improvements: In Graphics, improved buttons for changing palettes'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Améliorations : Dans Récompenses, les boutons Appliquer sont maintenant alignés' : 'Improvements: In Rewards, Apply buttons are now aligned'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Ajout : Dans Options / Audio, ajout du volume global' : 'Added: In Options / Audio, added global volume control'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Ajout de 3 nouvelles formes de Tetrominos (P, Étoile, U)' : 'Added 3 new Tetromino shapes (P, Star, U)'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Ajout d\'un nouveau logo sur itch.io' : 'Added new logo on itch.io'),
                    ]),
                    // Version 0.0.2 Beta
                    Utilities.createElement('h3', {}, `${Utilities.translate('version')} 0.0.2 Beta - 16 ${GameSettings.language === 'fr' ? 'Mai' : 'May'} 2025`),
                    Utilities.createElement('ul', {}, [
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Corrections de plusieurs lignes qui ne se supprimaient pas tous' : 'Fixed lines not being fully cleared'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Corrections que dans certaines parties les tetrominos ne se tournaient plus' : 'Fixed tetrominos not rotating in certain game areas'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Optimisations des interfaces et animations' : 'Optimized interfaces and animations'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Ajout d\'une nouvelle catégorie dans rewards: Tetromino avec 5 éléments à découvrir ingame' : 'Added a new reward category: Tetromino with 5 elements to discover in-game'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Ajout d\'une nouvelle palette' : 'Added a new palette'),
                    ]),
                    // Version précédente
                    Utilities.createElement('h3', {}, `${Utilities.translate('version')} 0.0.1 Beta - 15 ${GameSettings.language === 'fr' ? 'Mai' : 'May'} 2025`),
                    Utilities.createElement('ul', {}, [
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Modification du système de récompenses' : 'Rewards system modifications'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? '3 nouveaux badges ajoutés' : '3 new badges added'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? '3 nouvelles palettes de couleurs (Sunset, Aqua, Retro Gaming)' : '3 new color palettes (Sunset, Aqua, Retro Gaming)'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Ajout de nouvelles musiques' : 'New music added'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Désactivation temporaire des publicités' : 'Ads temporarily disabled'),
                        Utilities.createElement('li', {}, GameSettings.language === 'fr' ? 'Mode Défi : Prochainement (bouton désactivé)' : 'Challenge mode: Coming soon (button disabled)'),
                    ]),
                ]),
                Utilities.createElement('div', { class: 'modal-buttons' }, [
                    Utilities.createElement('button', { id: 'close-changelog-btn' }, Utilities.translate('close'))
                ])
            ])
        ]);
        
        // Ajoute le modal au DOM
        document.body.appendChild(modal);
        
        // Ajoute l'écouteur d'événement pour fermer
        document.getElementById('close-changelog-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    /**
     * Définit le callback pour le bouton Jouer
     * @param {Function} callback - Fonction à appeler quand le bouton est cliqué
     */
    setPlayCallback(callback) {
        this.onPlayCallback = callback;
    }
    
    /**
     * Définit le callback pour le bouton Mode Défi
     * @param {Function} callback - Fonction à appeler quand le bouton est cliqué
     */
    setChallengeCallback(callback) {
        this.onChallengeCallback = callback;
    }
    
    /**
     * Définit le callback pour le bouton Récompenses
     * @param {Function} callback - Fonction à appeler quand le bouton est cliqué
     */
    setRewardsCallback(callback) {
        this.onRewardsCallback = callback;
    }
    
    /**
     * Définit le callback pour le bouton Options
     * @param {Function} callback - Fonction à appeler quand le bouton est cliqué
     */
    setOptionsCallback(callback) {
        this.onOptionsCallback = callback;
    }

    /**
     * Définit le callback pour le bouton Classement
     * @param {Function} callback - Fonction à appeler quand le bouton est cliqué
     */
    setLeaderboardCallback(callback) {
        this.onLeaderboardCallback = callback;
    }

    /**
     * Définit le callback pour le bouton Connexion
     * @param {Function} callback - Fonction à appeler quand le bouton est cliqué
     */
    setLoginCallback(callback) {
        this.onLoginCallback = callback;
    }

    /**
     * Définit le callback pour les paramètres utilisateur (RGPD)
     * @param {Function} callback - Fonction à appeler quand le bouton est cliqué
     */
    setUserSettingsCallback(callback) {
        this.onUserSettingsCallback = callback;
    }
}
