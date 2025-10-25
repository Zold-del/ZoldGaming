/**
 * AudioManager - Gestionnaire de musique et d'effets sonores pour BlockDrop
 * Permet de gérer facilement les différentes musiques et sons du jeu
 */
class AudioManager {
    /**
     * Initialise le gestionnaire audio
     */
    constructor() {
        // État
        this.isMusicEnabled = GameSettings.musicEnabled;
        this.isSoundEnabled = GameSettings.soundEnabled;
        this.musicVolume = GameSettings.musicVolume;
        this.soundVolume = GameSettings.soundVolume;
          // Éléments audio principaux
        this.themeMusic = document.getElementById('theme-music');
        this.rotateSound = document.getElementById('rotate-sound');
        this.dropSound = document.getElementById('drop-sound');
        this.lineSound = document.getElementById('line-sound');
        this.gameoverSound = document.getElementById('gameover-sound');
        
        // Liste des musiques disponibles
        this.musicList = [
            { id: 'theme1', src: 'assets/audio/Untitled.mp3', name: 'Musique 1' },
            { id: 'theme2', src: 'assets/audio/Untitled (1).mp3', name: 'Musique 2' }
        ];
          // Musique actuelle
        this.currentMusicId = GameSettings.selectedMusic || 'theme1';
        
        // Applique les réglages initiaux
        this.applySettings();
    }
    
    /**
     * Applique les paramètres audio sauvegardés
     */
    applySettings() {
        // Applique le volume
        if (this.themeMusic) {
            this.themeMusic.volume = this.musicVolume / 100;
        }
        
        const soundElements = [this.rotateSound, this.dropSound, this.lineSound, this.gameoverSound];
        soundElements.forEach(sound => {
            if (sound) {
                sound.volume = this.soundVolume / 100;
            }
        });
        
        // Active/désactive la musique selon les paramètres
        if (this.isMusicEnabled) {
            this.enableMusic();
        } else {
            this.disableMusic();
        }
    }
    
    /**
     * Change la piste musicale actuelle
     * @param {string} musicId - Identifiant de la musique à jouer
     */
    changeMusic(musicId) {
        if (this.currentMusicId === musicId) return;
        
        const wasPlaying = !this.themeMusic.paused;
        
        // Sauvegarde l'ID de la musique actuelle
        this.currentMusicId = musicId;
        GameSettings.selectedMusic = musicId;
        GameSettings.save();
        
        // Recherche la musique dans la liste
        const music = this.musicList.find(m => m.id === musicId);
        if (!music) return;
        
        // Change la source et charge la nouvelle musique
        this.themeMusic.src = music.src;
        this.themeMusic.load();
        
        // Si la musique était en cours de lecture, lance la nouvelle
        if (wasPlaying && this.isMusicEnabled) {
            this.themeMusic.play().catch(error => {
                console.error('Erreur lors de la lecture de la musique:', error);
            });
        }
    }
    
    /**
     * Joue un effet sonore
     * @param {string} soundId - Identifiant du son à jouer (rotate, drop, line, gameover)
     */
    playSound(soundId) {
        if (!this.isSoundEnabled) return;
        
        let sound;
        switch (soundId) {
            case 'rotate':
                sound = this.rotateSound;
                break;
            case 'drop':
                sound = this.dropSound;
                break;
            case 'line':
                sound = this.lineSound;
                break;
            case 'gameover':
                sound = this.gameoverSound;
                break;
            default:
                return;
        }
        
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.error(`Erreur lors de la lecture du son ${soundId}:`, error);
            });
        }
    }
    
    /**
     * Active la musique
     */
    enableMusic() {
        this.isMusicEnabled = true;
        GameSettings.musicEnabled = true;
        GameSettings.save();
        
        if (this.themeMusic) {
            this.themeMusic.play().catch(error => {
                console.error('Erreur lors de la lecture de la musique:', error);
            });
        }
    }
    
    /**
     * Désactive la musique
     */
    disableMusic() {
        this.isMusicEnabled = false;
        GameSettings.musicEnabled = false;
        GameSettings.save();
        
        if (this.themeMusic) {
            this.themeMusic.pause();
            this.themeMusic.currentTime = 0;
        }
    }
    
    /**
     * Active les effets sonores
     */
    enableSound() {
        this.isSoundEnabled = true;
        GameSettings.soundEnabled = true;
        GameSettings.save();
    }
    
    /**
     * Désactive les effets sonores
     */
    disableSound() {
        this.isSoundEnabled = false;
        GameSettings.soundEnabled = false;
        GameSettings.save();
    }
    
    /**
     * Change le volume de la musique
     * @param {number} volume - Volume entre 0 et 100
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(100, volume));
        GameSettings.musicVolume = this.musicVolume;
        GameSettings.save();
        
        if (this.themeMusic) {
            this.themeMusic.volume = this.musicVolume / 100;
        }
    }
    
    /**
     * Change le volume des effets sonores
     * @param {number} volume - Volume entre 0 et 100
     */
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(100, volume));
        GameSettings.soundVolume = this.soundVolume;
        GameSettings.save();
        
        const soundElements = [this.rotateSound, this.dropSound, this.lineSound, this.gameoverSound];
        soundElements.forEach(sound => {
            if (sound) {
                sound.volume = this.soundVolume / 100;
            }
        });
    }
    
    /**
     * Retourne la liste des musiques disponibles
     * @returns {Array} Liste des musiques
     */
    getMusicList() {
        return this.musicList;
    }
    
    /**
     * Retourne l'identifiant de la musique actuelle
     * @returns {string} ID de la musique
     */
    getCurrentMusicId() {
        return this.currentMusicId;
    }
}
