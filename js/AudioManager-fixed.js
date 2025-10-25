/**
 * AudioManager - Gestionnaire de musique et d'effets sonores pour BlockDrop
 * VERSION CORRIGÉE - Fix des boucles infinies et gestion d'état améliorée
 */
class AudioManager {
    constructor() {
        // État - Charge depuis GameSettings
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
        
        // Flag pour éviter les boucles infinies
        this.isChangingMusic = false;
        this.isMusicPlaying = false;
        
        // Initialisation
        this.init();
    }
    
    /**
     * Initialise le gestionnaire audio
     */
    init() {
        if (!this.themeMusic) {
            console.error('Élément audio theme-music non trouvé');
            return;
        }
        
        // Applique les volumes initiaux
        this.themeMusic.volume = this.musicVolume / 100;
        
        const soundElements = [this.rotateSound, this.dropSound, this.lineSound, this.gameoverSound];
        soundElements.forEach(sound => {
            if (sound) sound.volume = this.soundVolume / 100;
        });
        
        // Événements pour la musique
        this.themeMusic.addEventListener('ended', () => this.onMusicEnded());
        this.themeMusic.addEventListener('play', () => this.onMusicPlay());
        this.themeMusic.addEventListener('pause', () => this.onMusicPause());
        
        // Charge la musique sélectionnée
        this.loadMusic(this.currentMusicId, false);
        
        // Active la musique si nécessaire
        if (this.isMusicEnabled) {
            this.startMusic();
        }
    }
    
    /**
     * Événement: musique terminée
     */
    onMusicEnded() {
        // La musique est en boucle normalement, mais au cas où
        if (this.isMusicEnabled && !this.isChangingMusic) {
            this.themeMusic.currentTime = 0;
            this.themeMusic.play().catch(e => console.error('Erreur replay:', e));
        }
    }
    
    /**
     * Événement: musique lancée
     */
    onMusicPlay() {
        this.isMusicPlaying = true;
    }
    
    /**
     * Événement: musique en pause
     */
    onMusicPause() {
        if (!this.isChangingMusic) {
            this.isMusicPlaying = false;
        }
    }
    
    /**
     * Charge une musique sans la jouer
     */
    loadMusic(musicId, autoPlay = false) {
        const music = this.musicList.find(m => m.id === musicId);
        if (!music) {
            console.error(`Musique ${musicId} non trouvée`);
            return false;
        }
        
        this.isChangingMusic = true;
        
        // Stop la musique actuelle proprement
        this.stopMusic();
        
        // Change la source
        this.themeMusic.src = music.src;
        this.currentMusicId = musicId;
        
        // Sauvegarde dans les settings
        GameSettings.selectedMusic = musicId;
        GameSettings.save();
        
        // Charge la nouvelle musique
        this.themeMusic.load();
        
        this.isChangingMusic = false;
        
        // Joue automatiquement si demandé et autorisé
        if (autoPlay && this.isMusicEnabled) {
            this.startMusic();
        }
        
        return true;
    }
    
    /**
     * Change la piste musicale actuelle
     */
    changeMusic(musicId) {
        if (this.currentMusicId === musicId) return;
        
        const wasPlaying = this.isMusicPlaying;
        this.loadMusic(musicId, wasPlaying);
    }
    
    /**
     * Lance la musique
     */
    startMusic() {
        if (!this.themeMusic || this.isChangingMusic) return;
        
        this.themeMusic.play()
            .then(() => {
                this.isMusicPlaying = true;
            })
            .catch(error => {
                console.error('Erreur lecture musique:', error);
                this.isMusicPlaying = false;
            });
    }
    
    /**
     * Arrête la musique
     */
    stopMusic() {
        if (!this.themeMusic) return;
        
        this.themeMusic.pause();
        this.themeMusic.currentTime = 0;
        this.isMusicPlaying = false;
    }
    
    /**
     * Joue un effet sonore
     */
    playSound(soundId) {
        if (!this.isSoundEnabled) return;
        
        let sound;
        switch (soundId) {
            case 'rotate': sound = this.rotateSound; break;
            case 'drop': sound = this.dropSound; break;
            case 'line': sound = this.lineSound; break;
            case 'gameover': sound = this.gameoverSound; break;
            default: return;
        }
        
        if (sound) {
            // Clone le son pour permettre les sons simultanés
            const soundClone = sound.cloneNode();
            soundClone.volume = this.soundVolume / 100;
            soundClone.play().catch(e => console.error(`Erreur son ${soundId}:`, e));
        }
    }
    
    /**
     * Active la musique
     */
    enableMusic() {
        this.isMusicEnabled = true;
        GameSettings.musicEnabled = true;
        GameSettings.save();
        this.startMusic();
    }
    
    /**
     * Désactive la musique
     */
    disableMusic() {
        this.isMusicEnabled = false;
        GameSettings.musicEnabled = false;
        GameSettings.save();
        this.stopMusic();
    }
    
    /**
     * Toggle musique
     */
    toggleMusic() {
        if (this.isMusicEnabled) {
            this.disableMusic();
        } else {
            this.enableMusic();
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
     * Toggle sons
     */
    toggleSound() {
        if (this.isSoundEnabled) {
            this.disableSound();
        } else {
            this.enableSound();
        }
    }
    
    /**
     * Change le volume de la musique
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
     */
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(100, volume));
        GameSettings.soundVolume = this.soundVolume;
        GameSettings.save();
        
        const soundElements = [this.rotateSound, this.dropSound, this.lineSound, this.gameoverSound];
        soundElements.forEach(sound => {
            if (sound) sound.volume = this.soundVolume / 100;
        });
    }
    
    /**
     * Retourne la liste des musiques disponibles
     */
    getMusicList() {
        return this.musicList;
    }
    
    /**
     * Retourne l'identifiant de la musique actuelle
     */
    getCurrentMusicId() {
        return this.currentMusicId;
    }
    
    /**
     * Nettoie les événements
     */
    destroy() {
        this.stopMusic();
        if (this.themeMusic) {
            this.themeMusic.removeEventListener('ended', this.onMusicEnded);
            this.themeMusic.removeEventListener('play', this.onMusicPlay);
            this.themeMusic.removeEventListener('pause', this.onMusicPause);
        }
    }
}
