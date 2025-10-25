# 🔧 GUIDE D'APPLICATION - CORRECTIF AUDIO

## ⚠️ ACTION MANUELLE REQUISE

Le fichier `CORRECTIF-AUDIO-OPTIONS.js` contient le code corrigé pour les sliders audio.
Ce code doit être appliqué manuellement dans `js/OptionsMenu.js`.

---

## 📍 LOCALISATION

**Fichier à modifier :** `js/OptionsMenu.js`

**Section à remplacer :** Lignes approximatives 105-200 (section "PARAMÈTRES AUDIO")

**Fichier de référence :** `CORRECTIF-AUDIO-OPTIONS.js`

---

## 🔍 CODE À CHERCHER

Cherchez cette section dans `js/OptionsMenu.js` :

```javascript
// === SECTION AUDIO ===
const audioSection = this.createSection('Musique et Sons');

const musicVolumeLabel = document.createElement('div');
musicVolumeLabel.className = 'setting-label';
musicVolumeLabel.textContent = 'Volume Musique';

const musicVolumeSlider = document.createElement('input');
musicVolumeSlider.type = 'range';
musicVolumeSlider.min = '0';
musicVolumeSlider.max = '1';
musicVolumeSlider.step = '0.1';
// ...
```

---

## ✅ CODE CORRIGÉ À APPLIQUER

### Remplacement complet de la section Audio

```javascript
// === SECTION AUDIO ===
const audioSection = this.createSection('Musique et Sons');

// Volume Musique avec affichage %
const musicVolumeContainer = document.createElement('div');
musicVolumeContainer.className = 'setting-row';

const musicVolumeLabel = document.createElement('div');
musicVolumeLabel.className = 'setting-label';
musicVolumeLabel.textContent = 'Volume Musique';

const musicVolumeControl = document.createElement('div');
musicVolumeControl.className = 'volume-control';

const musicVolumeSlider = document.createElement('input');
musicVolumeSlider.type = 'range';
musicVolumeSlider.min = '0';
musicVolumeSlider.max = '100';
musicVolumeSlider.step = '1';
musicVolumeSlider.value = Math.round(GameSettings.musicVolume * 100);
musicVolumeSlider.className = 'slider volume-slider';

const musicVolumeValue = document.createElement('span');
musicVolumeValue.className = 'volume-value';
musicVolumeValue.textContent = Math.round(GameSettings.musicVolume * 100) + '%';

// Événement temps réel pour musique
musicVolumeSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    const volumeDecimal = value / 100;
    
    // Mise à jour visuelle immédiate
    musicVolumeValue.textContent = value + '%';
    
    // Mise à jour du GameSettings
    GameSettings.musicVolume = volumeDecimal;
    
    // Application immédiate au AudioManager
    if (window.audioManager) {
        window.audioManager.setMusicVolume(volumeDecimal);
    }
    
    // Sauvegarde automatique
    GameSettings.save();
});

musicVolumeControl.appendChild(musicVolumeSlider);
musicVolumeControl.appendChild(musicVolumeValue);
musicVolumeContainer.appendChild(musicVolumeLabel);
musicVolumeContainer.appendChild(musicVolumeControl);
audioSection.appendChild(musicVolumeContainer);

// Volume Sons avec affichage %
const soundVolumeContainer = document.createElement('div');
soundVolumeContainer.className = 'setting-row';

const soundVolumeLabel = document.createElement('div');
soundVolumeLabel.className = 'setting-label';
soundVolumeLabel.textContent = 'Volume Sons';

const soundVolumeControl = document.createElement('div');
soundVolumeControl.className = 'volume-control';

const soundVolumeSlider = document.createElement('input');
soundVolumeSlider.type = 'range';
soundVolumeSlider.min = '0';
soundVolumeSlider.max = '100';
soundVolumeSlider.step = '1';
soundVolumeSlider.value = Math.round(GameSettings.soundVolume * 100);
soundVolumeSlider.className = 'slider volume-slider';

const soundVolumeValue = document.createElement('span');
soundVolumeValue.className = 'volume-value';
soundVolumeValue.textContent = Math.round(GameSettings.soundVolume * 100) + '%';

// Événement temps réel pour sons
soundVolumeSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    const volumeDecimal = value / 100;
    
    // Mise à jour visuelle immédiate
    soundVolumeValue.textContent = value + '%';
    
    // Mise à jour du GameSettings
    GameSettings.soundVolume = volumeDecimal;
    
    // Application immédiate au AudioManager
    if (window.audioManager) {
        window.audioManager.setSoundVolume(volumeDecimal);
        // Jouer un son de test pour feedback
        window.audioManager.playSound('rotate');
    }
    
    // Sauvegarde automatique
    GameSettings.save();
});

soundVolumeControl.appendChild(soundVolumeSlider);
soundVolumeControl.appendChild(soundVolumeValue);
soundVolumeContainer.appendChild(soundVolumeLabel);
soundVolumeContainer.appendChild(soundVolumeControl);
audioSection.appendChild(soundVolumeContainer);

contentDiv.appendChild(audioSection);
```

---

## 🎨 CSS REQUIS

**Vérifiez que ces styles sont présents dans `css/style.css` :**

```css
.volume-control {
    display: flex;
    align-items: center;
    gap: 10px;
}

.volume-slider {
    flex: 1;
    min-width: 150px;
}

.volume-value {
    min-width: 45px;
    text-align: right;
    font-weight: bold;
    color: var(--primary, #00f0ff);
}

.setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
}

.setting-label {
    font-size: 1rem;
    color: white;
    flex: 1;
}
```

---

## 📋 CHECKLIST D'APPLICATION

### Avant modification :

- [ ] Faire une sauvegarde de `js/OptionsMenu.js`
- [ ] Ouvrir `CORRECTIF-AUDIO-OPTIONS.js` pour référence
- [ ] Ouvrir `js/OptionsMenu.js` dans l'éditeur

### Modification :

- [ ] Localiser la section "// === SECTION AUDIO ===" (ligne ~105)
- [ ] Sélectionner tout le code jusqu'à `contentDiv.appendChild(audioSection);`
- [ ] Remplacer par le code du CORRECTIF
- [ ] Vérifier l'indentation
- [ ] Sauvegarder le fichier

### Après modification :

- [ ] Copier le fichier modifié vers `public/js/OptionsMenu.js`
- [ ] Tester en local :
  - [ ] Ouvrir `index.html` dans le navigateur
  - [ ] Aller dans Options → Paramètres Audio
  - [ ] Bouger le slider musique → le % s'affiche
  - [ ] Bouger le slider sons → le % s'affiche + son de test
  - [ ] Recharger la page → les valeurs persistent

---

## 🐛 DÉPANNAGE

### Le % ne s'affiche pas

**Vérifier :**
- CSS `.volume-value` est présent
- `musicVolumeValue` et `soundVolumeValue` sont bien créés
- `appendChild(musicVolumeValue)` est présent

### Le volume ne change pas en temps réel

**Vérifier :**
- Événement est `input` et non `change`
- `window.audioManager` existe (console.log)
- Méthodes `setMusicVolume()` et `setSoundVolume()` existent

### Les valeurs ne persistent pas

**Vérifier :**
- `GameSettings.save()` est appelé dans chaque événement
- `localStorage` est autorisé dans le navigateur
- `GameSettings.load()` est appelé au démarrage

### Le son de test ne joue pas

**Vérifier :**
- `window.audioManager.playSound('rotate')` existe
- Le fichier audio `rotate.ogg` ou `rotate.mp3` existe dans `/assets/audio/`
- Les permissions autoplay du navigateur

---

## 📝 NOTES

**Différences principales :**

| Ancien | Nouveau | Pourquoi |
|--------|---------|----------|
| Range 0-1 step 0.1 | Range 0-100 step 1 | Plus intuitif pour l'utilisateur |
| Événement `change` | Événement `input` | Temps réel pendant le glissement |
| Pas d'affichage | Affichage % | Feedback visuel |
| Pas de son test | Son joué sur changement | Feedback audio |
| Sauvegarde manuelle | Sauvegarde auto | Aucune perte de paramètres |

---

## ✅ VALIDATION

**Après application, les sliders doivent :**

1. ✅ Afficher une valeur de 0 à 100%
2. ✅ Se mettre à jour visuellement en temps réel pendant le glissement
3. ✅ Modifier le volume immédiatement (musique continue à jouer)
4. ✅ Jouer un son de test lors du changement (slider sons)
5. ✅ Persister les valeurs après rechargement de page
6. ✅ Fonctionner sur mobile et desktop
7. ✅ Être responsive (voir media queries dans style.css)

---

**Si tout fonctionne, vous pouvez supprimer `CORRECTIF-AUDIO-OPTIONS.js` après application.**
