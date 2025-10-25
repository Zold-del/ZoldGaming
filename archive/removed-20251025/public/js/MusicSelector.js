/**
 * Fonction pour ajouter le sélecteur de musique dans le menu des options
 * À intégrer dans OptionsMenu.js
 */
function createMusicSelector() {
    // Crée un conteneur pour la sélection de musique
    const musicSelectorContainer = document.createElement('div');
    musicSelectorContainer.className = 'option-item';
    
    // Titre de la section
    const musicSelectorTitle = document.createElement('div');
    musicSelectorTitle.className = 'option-label';
    musicSelectorTitle.textContent = Utilities.translate('selectMusic');
    musicSelectorContainer.appendChild(musicSelectorTitle);
    
    // Conteneur pour les boutons
    const musicButtonsContainer = document.createElement('div');
    musicButtonsContainer.className = 'music-buttons-container';
    musicButtonsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 10px;
        width: 100%;
    `;
    
    // Récupère la liste des musiques disponibles
    const musicList = audioManager.getMusicList();
    const currentMusicId = audioManager.getCurrentMusicId();
    
    // Crée un bouton pour chaque musique
    musicList.forEach(music => {
        const musicButton = document.createElement('button');
        musicButton.className = 'music-button' + (music.id === currentMusicId ? ' selected' : '');
        musicButton.textContent = music.name;
        musicButton.style.cssText = `
            padding: 8px 15px;
            background: ${music.id === currentMusicId ? '#0066cc' : '#444'};
            color: white;
            border: none;
            border-radius: 4px;
            font-family: 'Press Start 2P', monospace;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        
        // Ajoute l'icône play
        const playIcon = document.createElement('span');
        playIcon.innerHTML = ' ▶';
        playIcon.style.cssText = 'font-size: 10px; margin-left: 5px;';
        musicButton.appendChild(playIcon);
        
        // Événement au clic
        musicButton.addEventListener('click', () => {
            // Met à jour la musique sélectionnée
            audioManager.changeMusic(music.id);
            
            // Met à jour l'apparence des boutons
            const allButtons = musicButtonsContainer.querySelectorAll('.music-button');
            allButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.style.background = '#444';
            });
            musicButton.classList.add('selected');
            musicButton.style.background = '#0066cc';
        });
        
        musicButtonsContainer.appendChild(musicButton);
    });
    
    musicSelectorContainer.appendChild(musicButtonsContainer);
    return musicSelectorContainer;
}

/* 
INSTRUCTIONS D'INTÉGRATION:

Copiez et collez le contenu de cette fonction dans votre fichier OptionsMenu.js
et appelez-la depuis la méthode show() en ajoutant:

const musicSelector = createMusicSelector();
optionsContent.appendChild(musicSelector);

Assurez-vous également d'ajouter les traductions dans Utilities.js:

selectMusic: 'Sélectionner une musique',  // Français
selectMusic: 'Select music',              // Anglais

*/
