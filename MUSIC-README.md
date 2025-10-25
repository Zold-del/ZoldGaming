# Guide d'ajout de musique à BlockDrop

Ce document explique comment ajouter ou modifier de la musique et des effets sonores dans le jeu BlockDrop.

## Structure des fichiers audio

Les fichiers audio sont stockés dans le dossier `assets/audio/` avec la structure suivante :

```plaintext
assets/
  audio/
    theme.mp3             - Musique principale du jeu
    theme-remix.mp3       - Version alternative de la musique
    theme-chill.mp3       - Version calme de la musique
    rotate.mp3            - Son de rotation d'une pièce
    drop.mp3              - Son de chute rapide d'une pièce
    line.mp3              - Son de ligne complétée
    gameover.mp3          - Son de fin de partie
```

## Ajouter une nouvelle musique

Pour ajouter une nouvelle musique de fond à votre jeu :

1. Placez le fichier MP3 dans le dossier `assets/audio/`
2. Ouvrez le fichier `js/AudioManager.js`
3. Trouvez la liste `musicList` dans le constructeur
4. Ajoutez votre nouvelle musique au format suivant :

   ```javascript
   { id: 'votre-id-unique', src: 'assets/audio/votre-fichier.mp3', name: 'Nom à afficher' }
   ```

5. Sauvegardez le fichier

## Format des fichiers

Pour une compatibilité optimale :

- Utilisez des fichiers MP3 (format le plus compatible)
- Encodage recommandé : 192 kbps pour la musique, 128 kbps pour les effets sonores
- Durée recommandée pour la musique de fond : 2-3 minutes en boucle

## Personnalisation du comportement audio

### Modification du volume par défaut

Dans `js/Utilities.js`, dans la fonction `GameSettings.getDefaults()`, modifiez :

```javascript
musicVolume: 50,    // Volume de la musique (0-100)
soundVolume: 70,    // Volume des effets sonores (0-100)
```

### Changement de la musique par défaut

Dans `js/AudioManager.js`, modifiez la ligne :

```javascript
this.currentMusicId = GameSettings.selectedMusic || 'theme';
```

Remplacez `'theme'` par l'ID de la musique que vous souhaitez utiliser par défaut.

## Ressources pour la musique

Voici quelques sites où vous pouvez trouver de la musique libre de droits pour votre jeu :

- [FreeSound](https://freesound.org/) - Effets sonores gratuits
- [incompetech.com](https://incompetech.com/) - Musique gratuite (attribution requise)
- [OpenGameArt.org](https://opengameart.org/) - Ressources audio pour jeux vidéo
- [Free Music Archive](https://freemusicarchive.org/) - Musique sous licence Creative Commons

## Considérations juridiques

Assurez-vous d'utiliser uniquement de la musique pour laquelle vous avez les droits :

- Musique du domaine public
- Musique sous licence Creative Commons appropriée
- Musique que vous avez achetée avec licence commerciale
- Musique que vous avez créée vous-même

Certaines licences Creative Commons nécessitent une attribution. Dans ce cas, ajoutez les crédits dans le menu "À propos" du jeu.
