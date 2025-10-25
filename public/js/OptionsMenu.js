// OptionsMenu.js - Menu des options du jeu Tetris

/**
 * Classe pour le menu d'options du jeu
 */
class OptionsMenu {
    /**
     * Crée une nouvelle instance du menu d'options
     * @param {HTMLElement} container - Conteneur où afficher les options
     */
    constructor(container) {
        this.container = container || document.getElementById('app');
        this.onBackToMenuCallback = null;
        
        // Définition des thèmes de couleurs
        this.baseThemes = [
            {
                id: 'classic',
                name: 'Classique',
                colors: {
                    primary: '#00ffe7',
                    secondary: '#ff00a2',
                    background: '#181825'
                }
            }
        ];
        
        // Les autres thèmes seront chargés dynamiquement en fonction des récompenses débloquées
        this.themes = [];
    }
    
    /**
     * Affiche le menu des options
     */
    render() {
        // Charge les thèmes disponibles avant de rendre le menu
        this.loadAvailableThemes();
        
        // Vide le conteneur
        this.container.innerHTML = '';
          // Crée le conteneur des options
        const optionsContainer = Utilities.createElement('div', { class: 'options-container' });
        
        // Ajoute le titre
        const title = Utilities.createElement('h1', { class: 'options-title' }, Utilities.translate('options'));
        optionsContainer.appendChild(title);
        
        // Section Langue
        const langSection = Utilities.createElement('div', { class: 'options-section' });
        langSection.appendChild(Utilities.createElement('h2', { class: 'options-section-title' }, Utilities.translate('language')));
        
        const langRow = Utilities.createElement('div', { class: 'option-row' });
        
        // Boutons de langue
        const langButtons = Utilities.createElement('div', { class: 'lang-buttons' });
        
        // Bouton Français
        const frButton = Utilities.createElement('button', { 
            class: `lang-button ${GameSettings.language === 'fr' ? 'active' : ''}`,
            id: 'lang-fr'
        }, 'FR');
          // Bouton Anglais
        const enButton = Utilities.createElement('button', { 
            class: `lang-button ${GameSettings.language === 'en' ? 'active' : ''}`,
            id: 'lang-en'
        }, 'US');
        
        frButton.addEventListener('click', () => {
            frButton.classList.add('active');
            enButton.classList.remove('active');
            GameSettings.language = 'fr';
            GameSettings.save();
            
            // Force le rafraichissement de l'interface pour appliquer la traduction
            if (this.onBackToMenuCallback) {
                setTimeout(() => {
                    this.onBackToMenuCallback();
                }, 100);
            }
        });
        
        enButton.addEventListener('click', () => {
            enButton.classList.add('active');
            frButton.classList.remove('active');
            GameSettings.language = 'en';
            GameSettings.save();
            
            // Force le rafraichissement de l'interface pour appliquer la traduction
            if (this.onBackToMenuCallback) {
                setTimeout(() => {
                    this.onBackToMenuCallback();
                }, 100);
            }
        });
        
        langButtons.appendChild(frButton);
        langButtons.appendChild(enButton);
        
        langRow.appendChild(langButtons);        langSection.appendChild(langRow);
        
        // Ajout de la section langue au conteneur des options
        optionsContainer.appendChild(langSection);
        
        // Section Audio
        const audioSection = Utilities.createElement('div', { class: 'options-section' });
        audioSection.appendChild(Utilities.createElement('h2', { class: 'options-section-title' }, 'Audio'));
        
        // Volume global
        const globalVolumeRow = Utilities.createElement('div', { class: 'option-row' });
        globalVolumeRow.appendChild(Utilities.createElement('div', { class: 'option-label' }, Utilities.translate('volume')));
        
        const globalVolumeSlider = Utilities.createElement('div', { class: 'slider-container' });
        
        // Get average of music and sound volume as initial global volume value
        const initialGlobalVolume = Math.round(((GameSettings.musicVolume + GameSettings.soundVolume) / 2) * 100);
        
        const globalVolume = Utilities.createElement('input', {
            type: 'range',
            min: '0',
            max: '100',
            value: initialGlobalVolume,
            class: 'slider',
            id: 'global-volume'
        });
        
        globalVolume.addEventListener('input', (e) => {
            const ratio = e.target.value / 100;
            
            // Keep the relative difference between music and sound volumes
            const musicRatio = GameSettings.musicVolume > 0 ? GameSettings.musicVolume / ((GameSettings.musicVolume + GameSettings.soundVolume) / 2) : 1;
            const soundRatio = GameSettings.soundVolume > 0 ? GameSettings.soundVolume / ((GameSettings.musicVolume + GameSettings.soundVolume) / 2) : 1;
            
            GameSettings.musicVolume = Math.min(1, Math.max(0, ratio * musicRatio));
            GameSettings.soundVolume = Math.min(1, Math.max(0, ratio * soundRatio));
            
            // Update the UI sliders to match the new values
            document.getElementById('music-volume').value = GameSettings.musicVolume * 100;
            document.getElementById('sound-volume').value = GameSettings.soundVolume * 100;
            
            GameSettings.save();
            
            // Update the current music volume
            const music = document.getElementById('theme-music');
            if (music) {
                music.volume = GameSettings.musicVolume;
            }
        });
        
        globalVolumeSlider.appendChild(globalVolume);
        globalVolumeRow.appendChild(globalVolumeSlider);
        audioSection.appendChild(globalVolumeRow);
        
        // Sélection de musique
        const musicSelectRow = Utilities.createElement('div', { class: 'option-row' });
        musicSelectRow.appendChild(Utilities.createElement('div', { class: 'option-label' }, 'Sélectionner une musique'));
        
        // Conteneur pour les boutons de musique
        const musicButtonsContainer = Utilities.createElement('div', { class: 'music-selector-container' });
        musicButtonsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 10px;
            width: 100%;
        `;
        
        // Récupère la liste des musiques disponibles
        if (window.audioManager) {
            const musicList = window.audioManager.getMusicList();
            const currentMusicId = window.audioManager.getCurrentMusicId();
            
            // Crée un bouton pour chaque musique
            musicList.forEach(music => {
                const musicButton = Utilities.createElement('button', {
                    class: `music-button${music.id === currentMusicId ? ' selected' : ''}`,
                    style: `
                        padding: 8px 15px;
                        background: ${music.id === currentMusicId ? '#0066cc' : '#444'};
                        color: white;
                        border: none;
                        border-radius: 4px;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 12px;
                        cursor: pointer;
                        transition: background 0.2s;
                    `
                }, music.name);
                
                // Ajoute l'icône play
                const playIcon = Utilities.createElement('span', {
                    style: 'font-size: 10px; margin-left: 5px;'
                }, ' ▶');
                
                musicButton.appendChild(playIcon);
                
                // Événement au clic
                musicButton.addEventListener('click', () => {
                    // Met à jour la musique sélectionnée
                    window.audioManager.changeMusic(music.id);
                    
                    // Met à jour l'apparence des boutons
                    musicButtonsContainer.querySelectorAll('button').forEach(btn => {
                        btn.classList.remove('selected');
                        btn.style.background = '#444';
                    });
                    musicButton.classList.add('selected');
                    musicButton.style.background = '#0066cc';
                });
                
                musicButtonsContainer.appendChild(musicButton);
            });
        }
        
        musicSelectRow.appendChild(musicButtonsContainer);
        audioSection.appendChild(musicSelectRow);
        
        // Musique On/Off
        const musicRow = Utilities.createElement('div', { class: 'option-row' });
        musicRow.appendChild(Utilities.createElement('div', { class: 'option-label' }, Utilities.translate('music')));
        
        const musicToggle = Utilities.createElement('div', { class: 'slider-container' });
        const musicCheckbox = Utilities.createElement('input', {
            type: 'checkbox',
            id: 'music-toggle',
            checked: GameSettings.musicEnabled
        });
        
        musicCheckbox.addEventListener('change', (e) => {
            GameSettings.musicEnabled = e.target.checked;
            GameSettings.save();
            
            if (GameSettings.musicEnabled) {
                Utilities.handleMusic('play');
            } else {
                Utilities.handleMusic('pause');
            }
        });
          musicToggle.appendChild(musicCheckbox);
        musicToggle.appendChild(Utilities.createElement('label', { for: 'music-toggle' }, ''));
        musicRow.appendChild(musicToggle);
        audioSection.appendChild(musicRow);
        
        // Volume musique
        const musicVolumeRow = Utilities.createElement('div', { class: 'option-row' });
        musicVolumeRow.appendChild(Utilities.createElement('div', { class: 'option-label' }, Utilities.translate('musicVolume')));
        
        const musicVolumeSlider = Utilities.createElement('div', { class: 'slider-container' });
        const musicVolume = Utilities.createElement('input', {
            type: 'range',
            min: '0',
            max: '100',
            value: GameSettings.musicVolume * 100,
            class: 'slider',
            id: 'music-volume'
        });
        
        musicVolume.addEventListener('input', (e) => {
            GameSettings.musicVolume = e.target.value / 100;
            GameSettings.save();
            
            // Met à jour le volume de la musique en cours
            const music = document.getElementById('theme-music');
            if (music) {
                music.volume = GameSettings.musicVolume;
            }
        });
        
        musicVolumeSlider.appendChild(musicVolume);
        musicVolumeRow.appendChild(musicVolumeSlider);
        audioSection.appendChild(musicVolumeRow);
        
        // Effets sonores On/Off
        const soundRow = Utilities.createElement('div', { class: 'option-row' });
        soundRow.appendChild(Utilities.createElement('div', { class: 'option-label' }, 'Effets sonores'));
        
        const soundToggle = Utilities.createElement('div', { class: 'slider-container' });
        const soundCheckbox = Utilities.createElement('input', {
            type: 'checkbox',
            id: 'sound-toggle',
            checked: GameSettings.soundEnabled
        });
        
        soundCheckbox.addEventListener('change', (e) => {
            GameSettings.soundEnabled = e.target.checked;
            GameSettings.save();
        });
        
        soundToggle.appendChild(soundCheckbox);
        soundToggle.appendChild(Utilities.createElement('label', { for: 'sound-toggle' }, ''));
        soundRow.appendChild(soundToggle);
        audioSection.appendChild(soundRow);
        
        // Volume effets sonores
        const soundVolumeRow = Utilities.createElement('div', { class: 'option-row' });
        soundVolumeRow.appendChild(Utilities.createElement('div', { class: 'option-label' }, 'Volume effets'));
        
        const soundVolumeSlider = Utilities.createElement('div', { class: 'slider-container' });
        const soundVolume = Utilities.createElement('input', {
            type: 'range',
            min: '0',
            max: '100',
            value: GameSettings.soundVolume * 100,
            class: 'slider',
            id: 'sound-volume'
        });
        
        soundVolume.addEventListener('input', (e) => {
            GameSettings.soundVolume = e.target.value / 100;
            GameSettings.save();
        });
        
        soundVolumeSlider.appendChild(soundVolume);
        soundVolumeRow.appendChild(soundVolumeSlider);
        audioSection.appendChild(soundVolumeRow);
          optionsContainer.appendChild(audioSection);
        
        // Section Graphismes
        const graphicsSection = Utilities.createElement('div', { class: 'options-section' });
        graphicsSection.appendChild(Utilities.createElement('h2', { class: 'options-section-title' }, 'Graphismes'));
        
        // Thèmes de couleurs
        const themeRow = Utilities.createElement('div', { class: 'option-row' });
        themeRow.appendChild(Utilities.createElement('div', { class: 'option-label' }, 'Thème'));
        
        const colorThemes = Utilities.createElement('div', { class: 'color-themes' });
        
        this.themes.forEach(theme => {
            // Create a wrapper to contain both the color swatch and the name
            const themeWrapper = Utilities.createElement('div', {
                class: `theme-wrapper ${theme.id === GameSettings.graphicsTheme ? 'selected' : ''}`,
                style: 'margin: 0.5rem; display: flex; flex-direction: column; align-items: center; cursor: pointer;'
            });
            
            // Create the color swatch
            const themeBox = Utilities.createElement('div', {
                class: `color-theme ${theme.id === GameSettings.graphicsTheme ? 'selected' : ''}`,
                dataset: { theme: theme.id },
                style: `
                    width: 60px; 
                    height: 60px; 
                    border-radius: 10px; 
                    background: linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary});
                    border: 3px solid ${theme.id === GameSettings.graphicsTheme ? 'var(--secondary)' : 'transparent'};
                    margin-bottom: 8px;
                    transition: all 0.3s ease;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                `
            });
            
            // Create theme name label
            const themeLabel = Utilities.createElement('div', {
                style: `
                    font-size: 0.7rem;
                    text-align: center;
                    color: ${theme.id === GameSettings.graphicsTheme ? 'var(--primary)' : 'var(--light)'};
                    transition: color 0.3s ease;
                `
            }, theme.name || theme.id);
            
            // Add event listener to the entire wrapper
            themeWrapper.addEventListener('click', () => {
                GameSettings.graphicsTheme = theme.id;
                GameSettings.save();
                this.applyTheme(theme);
                
                // Update the visual selection for all wrappers
                document.querySelectorAll('.theme-wrapper').forEach(el => {
                    el.classList.remove('selected');
                    // Update child color-theme borders
                    const colorBox = el.querySelector('.color-theme');
                    if (colorBox) colorBox.style.border = '3px solid transparent';
                    // Update label color
                    const label = el.querySelector('div:not(.color-theme)');
                    if (label) label.style.color = 'var(--light)';
                });
                
                // Highlight the selected theme
                themeWrapper.classList.add('selected');
                themeBox.style.border = '3px solid var(--secondary)';
                themeLabel.style.color = 'var(--primary)';
            });
            
            // Hover effects
            themeWrapper.addEventListener('mouseenter', () => {
                if (theme.id !== GameSettings.graphicsTheme) {
                    themeBox.style.transform = 'scale(1.05)';
                    themeBox.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.7)';
                }
            });
            
            themeWrapper.addEventListener('mouseleave', () => {
                if (theme.id !== GameSettings.graphicsTheme) {
                    themeBox.style.transform = 'scale(1)';
                    themeBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                }
            });
            
            // Add the components to the wrapper and then to the container
            themeWrapper.appendChild(themeBox);
            themeWrapper.appendChild(themeLabel);
            colorThemes.appendChild(themeWrapper);
        });
          themeRow.appendChild(colorThemes);
        graphicsSection.appendChild(themeRow);
        
        // Styles de tétrominos
        const tetrominoStyleRow = Utilities.createElement('div', { class: 'option-row' });
        tetrominoStyleRow.appendChild(Utilities.createElement('div', { class: 'option-label' }, 'Style des tétrominos'));
        
        const tetrominoStyles = [
            { id: 'classic', name: 'Classique' },
            { id: 'neon', name: 'Néon' },
            { id: 'crystal', name: 'Cristal' },
            { id: 'pixel', name: 'Pixélisé' },
            { id: 'metallic', name: 'Métallique' }
        ];
        
        const tetrominoStylesContainer = Utilities.createElement('div', {
            style: 'display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 1rem;'
        });
        
        tetrominoStyles.forEach(style => {
            const styleBtn = Utilities.createElement('button', {
                class: `tetromino-style-btn ${GameSettings.tetrominoStyle === style.id ? 'active' : ''}`,
                dataset: { styleId: style.id },
                style: `
                    padding: 8px 15px;
                    background: ${GameSettings.tetrominoStyle === style.id ? 'var(--primary)' : '#333'};
                    color: ${GameSettings.tetrominoStyle === style.id ? 'var(--dark)' : '#fff'};
                    border: 2px solid ${GameSettings.tetrominoStyle === style.id ? 'var(--secondary)' : '#555'};
                    border-radius: 8px;
                    font-family: 'Press Start 2P', monospace;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin: 5px;
                    min-width: 110px;
                    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
                `
            }, style.name);
            
            styleBtn.addEventListener('click', () => {
                GameSettings.tetrominoStyle = style.id;
                GameSettings.save();
                
                // Update visual selection
                document.querySelectorAll('.tetromino-style-btn').forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.background = '#333';
                    btn.style.color = '#fff';
                    btn.style.border = '2px solid #555';
                });
                
                styleBtn.classList.add('active');
                styleBtn.style.background = 'var(--primary)';
                styleBtn.style.color = 'var(--dark)';
                styleBtn.style.border = '2px solid var(--secondary)';
                
                this.applyTetrominoStyles();
            });
            
            // Add hover effects
            styleBtn.addEventListener('mouseenter', () => {
                if (GameSettings.tetrominoStyle !== style.id) {
                    styleBtn.style.background = '#555';
                    styleBtn.style.transform = 'translateY(-2px)';
                    styleBtn.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.4)';
                }
            });
            
            styleBtn.addEventListener('mouseleave', () => {
                if (GameSettings.tetrominoStyle !== style.id) {
                    styleBtn.style.background = '#333';
                    styleBtn.style.transform = 'translateY(0)';
                    styleBtn.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.3)';
                }
            });
            
            tetrominoStylesContainer.appendChild(styleBtn);
        });
          tetrominoStyleRow.appendChild(tetrominoStylesContainer);
        graphicsSection.appendChild(tetrominoStyleRow);
        optionsContainer.appendChild(graphicsSection);
        
        // Section Contrôles
        const controlsSection = Utilities.createElement('div', { class: 'options-section' });
        controlsSection.appendChild(Utilities.createElement('h2', { class: 'options-section-title' }, Utilities.translate('controls')));
        
        const controlsInfo = Utilities.createElement('div', { class: 'controls-hint' });
        if (GameSettings.language === 'fr') {
            controlsInfo.innerHTML = `
                <p>← → : Déplacer pièce</p>
                <p>↑ ou Espace : Rotation</p>
                <p>↓ : Descente rapide</p>
                <p>Shift : Rotation inverse</p>
                <p>Échap : Pause</p>
            `;
        } else {
            controlsInfo.innerHTML = `
                <p>← → : Move piece</p>
                <p>↑ or Space : Rotate</p>
                <p>↓ : Fast drop</p>
                <p>Shift : Reverse rotation</p>
                <p>Esc : Pause</p>
            `;
        }
        
        controlsSection.appendChild(controlsInfo);
        optionsContainer.appendChild(controlsSection);
        
        // Section RGPD & Confidentialité
        if (window.apiService && window.apiService.isAuthenticated()) {
            const privacySection = Utilities.createElement('div', { class: 'options-section' });
            privacySection.appendChild(Utilities.createElement('h2', { class: 'options-section-title' }, GameSettings.language === 'fr' ? 'Confidentialité & RGPD' : 'Privacy & GDPR'));
            
            const privacyButtons = Utilities.createElement('div', { 
                style: 'display: flex; flex-direction: column; gap: 10px; margin-top: 1rem;' 
            });
            
            // Bouton Gérer les cookies
            const cookiesBtn = Utilities.createElement('button', {
                style: 'padding: 10px 20px; background: #333; color: #fff; border: 2px solid var(--primary); border-radius: 8px; cursor: pointer; font-family: "Press Start 2P", monospace; font-size: 10px;'
            }, GameSettings.language === 'fr' ? '🍪 Gérer les Cookies' : '🍪 Manage Cookies');
            
            cookiesBtn.addEventListener('click', () => {
                if (window.cookieConsent) {
                    window.cookieConsent.showSettings();
                }
            });
            
            // Bouton Télécharger mes données
            const exportBtn = Utilities.createElement('button', {
                style: 'padding: 10px 20px; background: #333; color: #fff; border: 2px solid var(--primary); border-radius: 8px; cursor: pointer; font-family: "Press Start 2P", monospace; font-size: 10px;'
            }, GameSettings.language === 'fr' ? '📄 Télécharger mes Données' : '📄 Download my Data');
            
            exportBtn.addEventListener('click', async () => {
                try {
                    exportBtn.textContent = GameSettings.language === 'fr' ? 'Chargement...' : 'Loading...';
                    exportBtn.disabled = true;
                    
                    const response = await fetch('/api/users/me/export', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('blockdrop_token')}`
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Télécharge en JSON
                        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `blockdrop-data-${new Date().toISOString().split('T')[0]}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        
                        alert(GameSettings.language === 'fr' ? 'Données téléchargées avec succès!' : 'Data downloaded successfully!');
                    } else {
                        alert(GameSettings.language === 'fr' ? 'Erreur lors de l\'export' : 'Export error');
                    }
                } catch (error) {
                    console.error('Export error:', error);
                    alert(GameSettings.language === 'fr' ? 'Erreur lors de l\'export' : 'Export error');
                } finally {
                    exportBtn.textContent = GameSettings.language === 'fr' ? '📄 Télécharger mes Données' : '📄 Download my Data';
                    exportBtn.disabled = false;
                }
            });
            
            // Bouton Supprimer mon compte
            const deleteBtn = Utilities.createElement('button', {
                style: 'padding: 10px 20px; background: #8b0000; color: #fff; border: 2px solid #ff0000; border-radius: 8px; cursor: pointer; font-family: "Press Start 2P", monospace; font-size: 10px;'
            }, GameSettings.language === 'fr' ? '🗑️ Supprimer mon Compte' : '🗑️ Delete my Account');
            
            deleteBtn.addEventListener('click', async () => {
                const confirmMsg = GameSettings.language === 'fr' 
                    ? 'ATTENTION: Cette action est IRRÉVERSIBLE!\n\nToutes vos données (scores, récompenses, paramètres) seront définitivement supprimées.\n\nTapez "SUPPRIMER" pour confirmer:'
                    : 'WARNING: This action is PERMANENT!\n\nAll your data (scores, rewards, settings) will be permanently deleted.\n\nType "DELETE" to confirm:';
                
                const confirmKeyword = GameSettings.language === 'fr' ? 'SUPPRIMER' : 'DELETE';
                const userInput = prompt(confirmMsg);
                
                if (userInput === confirmKeyword) {
                    try {
                        const response = await fetch('/api/users/me', {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('blockdrop_token')}`
                            }
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                            alert(GameSettings.language === 'fr' ? 'Compte supprimé avec succès. Vous allez être redirigé...' : 'Account deleted successfully. Redirecting...');
                            
                            // Déconnexion
                            localStorage.removeItem('blockdrop_token');
                            localStorage.removeItem('blockdrop_user');
                            
                            // Retour au menu
                            if (this.onBackToMenuCallback) {
                                this.onBackToMenuCallback();
                            }
                        } else {
                            alert(GameSettings.language === 'fr' ? 'Erreur lors de la suppression' : 'Deletion error');
                        }
                    } catch (error) {
                        console.error('Delete error:', error);
                        alert(GameSettings.language === 'fr' ? 'Erreur lors de la suppression' : 'Deletion error');
                    }
                } else if (userInput !== null) {
                    alert(GameSettings.language === 'fr' ? 'Suppression annulée' : 'Deletion cancelled');
                }
            });
            
            privacyButtons.appendChild(cookiesBtn);
            privacyButtons.appendChild(exportBtn);
            privacyButtons.appendChild(deleteBtn);
            
            privacySection.appendChild(privacyButtons);
            optionsContainer.appendChild(privacySection);
        }
        
        // Ajoute le bouton retour
        const backButton = Utilities.createElement('button', {
            style: 'margin-top: 2rem;'
        }, 'Appliquer et retourner au menu');
        
        backButton.addEventListener('click', () => {
            // Applique les styles des tétrominos avant de revenir au menu principal
            this.applyTetrominoStyles();
            
            if (this.onBackToMenuCallback) {
                this.onBackToMenuCallback();
            }
        });
        
        optionsContainer.appendChild(backButton);
        this.container.appendChild(optionsContainer);
        
        // Applique le thème actuel
        const currentTheme = this.themes.find(t => t.id === GameSettings.graphicsTheme) || this.themes[0];
        this.applyTheme(currentTheme);
    }
    
    /**
     * Applique un thème de couleurs à l'interface
     * @param {Object} theme - Thème à appliquer
     */
    applyTheme(theme) {
        const root = document.documentElement;
        
        root.style.setProperty('--primary', theme.colors.primary);
        root.style.setProperty('--secondary', theme.colors.secondary);
        root.style.setProperty('--background', theme.colors.background);
        
        // Force le rafraîchissement des styles CSS
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        document.head.removeChild(styleElement);
    }
    
    /**
     * Définit le callback pour retourner au menu principal
     * @param {Function} callback - Fonction à appeler pour retourner au menu
     */
    setBackToMenuCallback(callback) {
        this.onBackToMenuCallback = callback;
    }

    /**
     * Charge tous les thèmes disponibles en fonction des récompenses débloquées
     */
    loadAvailableThemes() {
        // Commencer par les thèmes de base (toujours disponibles)
        this.themes = [...this.baseThemes];
        
        // Défini les correspondances entre les palettes et leurs couleurs
        const allThemes = {
            'neon': {
                id: 'neon',
                name: 'Néon',
                colors: {
                    primary: '#00ff41',
                    secondary: '#ff00ff',
                    background: '#000000'
                }
            },
            'pastel': {
                id: 'pastel',
                name: 'Pastel',
                colors: {
                    primary: '#a5d8ff',
                    secondary: '#ffc7c7',
                    background: '#343a40'
                }
            },
            'monochrome': {
                id: 'monochrome',
                name: 'Monochrome',
                colors: {
                    primary: '#ffffff',
                    secondary: '#aaaaaa',
                    background: '#111111'
                }
            },
            'sunset': {
                id: 'sunset',
                name: 'Coucher de Soleil',
                colors: {
                    primary: '#ff9e00',
                    secondary: '#ff0058',
                    background: '#2c0735'
                }
            },
            'aqua': {
                id: 'aqua',
                name: 'Aqua',
                colors: {
                    primary: '#00ffcc',
                    secondary: '#0088ff',
                    background: '#001f3f'
                }
            },
            'retro': {
                id: 'retro',
                name: 'Rétro Gaming',
                colors: {
                    primary: '#ffcc00',
                    secondary: '#cc3300',
                    background: '#006666'
                }
            }
        };
        
        // La palette classique est toujours disponible
        // Vérifions quelles autres palettes sont débloquées
        const unlockedIds = [
            'neon-palette',
            'pastel-palette',
            'monochrome-palette',
            'sunset-palette',
            'aqua-palette',
            'retro-palette'
        ];
        
        // Fonction pour vérifier si une palette est débloquée
        const isPaletteUnlocked = (paletteId) => {
            // La version locale débloque automatiquement toutes les palettes
            if (this.isLocalMode()) {
                return true;
            }
            
            return GameSettings.unlockedRewards.includes(paletteId);
        };
        
        // Ajouter les thèmes débloqués
        if (isPaletteUnlocked('neon-palette')) this.themes.push(allThemes.neon);
        if (isPaletteUnlocked('pastel-palette')) this.themes.push(allThemes.pastel);
        if (isPaletteUnlocked('monochrome-palette')) this.themes.push(allThemes.monochrome);
        if (isPaletteUnlocked('sunset-palette')) this.themes.push(allThemes.sunset);
        if (isPaletteUnlocked('aqua-palette')) this.themes.push(allThemes.aqua);
        if (isPaletteUnlocked('retro-palette')) this.themes.push(allThemes.retro);
    }
    
    /**
     * Vérifie si le jeu est en mode local (hors itch.io)
     * @returns {boolean} - True si en mode local
     */
    isLocalMode() {
        // Utilise la même logique que AdManager.js pour détecter si on est en mode local
        const isLocalFile = window.location.protocol === 'file:';
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.startsWith('192.168.') ||
                           window.location.hostname.startsWith('10.') ||
                           window.location.hostname.indexOf('.local') !== -1;
                           
        const isItchIo = window.location.hostname.indexOf('itch.io') !== -1;
        
        return isLocalFile || (isLocalhost && !isItchIo);
    }
      /**
     * Applique le style des tétrominos selon les paramètres
     */
    applyTetrominoStyles() {
        // Supprime tous les styles de tetrominos existants
        document.documentElement.classList.remove(
            'tetromino-style-classic',
            'tetromino-style-neon',
            'tetromino-style-crystal',
            'tetromino-style-pixel',
            'tetromino-style-metallic',
            'tetromino-style-futuristic'
        );
        
        // Applique le style actuel
        document.documentElement.classList.add(`tetromino-style-${GameSettings.tetrominoStyle}`);
        
        console.log(`Style de tetromino appliqué: ${GameSettings.tetrominoStyle}`);
    }
}
