/**
 * CORRECTIFS pour OptionsMenu.js - Paramètres Audio
 * 
 * Instructions : Remplacer la section Audio (lignes ~105-200) par ce code
 */

// Section Audio - VERSION CORRIGÉE
const audioSection = Utilities.createElement('div', { class: 'options-section' });
audioSection.appendChild(Utilities.createElement('h2', { class: 'options-section-title' }, 'Audio'));

// Volume Musique
const musicVolumeRow = Utilities.createElement('div', { class: 'option-row' });
musicVolumeRow.appendChild(Utilities.createElement('div', { class: 'option-label' }, 'Volume Musique'));

const musicVolumeContainer = Utilities.createElement('div', { 
    class: 'slider-container',
    style: 'display: flex; align-items: center; gap: 10px; width: 100%;'
});

const musicVolumeSlider = Utilities.createElement('input', {
    type: 'range',
    min: '0',
    max: '100',
    value: Math.round(GameSettings.musicVolume * 100),
    class: 'slider volume-slider',
    id: 'music-volume',
    style: 'flex: 1;'
});

const musicVolumeValue = Utilities.createElement('span', {
    class: 'volume-value',
    style: 'min-width: 50px; text-align: right; font-size: 14px; color: var(--primary);'
}, Math.round(GameSettings.musicVolume * 100) + '%');

// Événement temps réel pour le slider musique
musicVolumeSlider.addEventListener('input', (e) => {
    const volume = parseInt(e.target.value);
    const volumeDecimal = volume / 100;
    
    // Met à jour l'affichage
    musicVolumeValue.textContent = volume + '%';
    
    // Met à jour GameSettings
    GameSettings.musicVolume = volumeDecimal;
    
    // Applique le volume via audioManager
    if (window.audioManager) {
        window.audioManager.setMusicVolume(volumeDecimal);
    }
    
    // Sauvegarde immédiate
    GameSettings.save();
});

musicVolumeContainer.appendChild(musicVolumeSlider);
musicVolumeContainer.appendChild(musicVolumeValue);
musicVolumeRow.appendChild(musicVolumeContainer);
audioSection.appendChild(musicVolumeRow);

// Volume Sons
const soundVolumeRow = Utilities.createElement('div', { class: 'option-row' });
soundVolumeRow.appendChild(Utilities.createElement('div', { class: 'option-label' }, 'Volume Effets Sonores'));

const soundVolumeContainer = Utilities.createElement('div', { 
    class: 'slider-container',
    style: 'display: flex; align-items: center; gap: 10px; width: 100%;'
});

const soundVolumeSlider = Utilities.createElement('input', {
    type: 'range',
    min: '0',
    max: '100',
    value: Math.round(GameSettings.soundVolume * 100),
    class: 'slider volume-slider',
    id: 'sound-volume',
    style: 'flex: 1;'
});

const soundVolumeValue = Utilities.createElement('span', {
    class: 'volume-value',
    style: 'min-width: 50px; text-align: right; font-size: 14px; color: var(--primary);'
}, Math.round(GameSettings.soundVolume * 100) + '%');

// Événement temps réel pour le slider sons
soundVolumeSlider.addEventListener('input', (e) => {
    const volume = parseInt(e.target.value);
    const volumeDecimal = volume / 100;
    
    // Met à jour l'affichage
    soundVolumeValue.textContent = volume + '%';
    
    // Met à jour GameSettings
    GameSettings.soundVolume = volumeDecimal;
    
    // Applique le volume via audioManager
    if (window.audioManager) {
        window.audioManager.setSoundVolume(volumeDecimal);
    }
    
    // Test du son à chaque changement
    if (window.audioManager) {
        window.audioManager.playSound('rotate');
    }
    
    // Sauvegarde immédiate
    GameSettings.save();
});

soundVolumeContainer.appendChild(soundVolumeSlider);
soundVolumeContainer.appendChild(soundVolumeValue);
soundVolumeRow.appendChild(soundVolumeContainer);
audioSection.appendChild(soundVolumeRow);

/**
 * NOTES :
 * - Les sliders vont maintenant de 0 à 100 (plus intuitif)
 * - L'affichage en % se met à jour en temps réel
 * - audioManager.setMusicVolume() et setSoundVolume() sont appelés immédiatement
 * - Un son de test joue à chaque changement du volume des effets
 * - GameSettings.save() sauvegarde la persistance immédiatement
 */
