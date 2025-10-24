# BlockDrop - Documentation des Publicités

Ce document explique comment configurer et tester le système de publicités Google AdSense dans le jeu BlockDrop.

## Configuration

### 1. Remplacez les identifiants AdSense

Vous devez remplacer les identifiants de test par vos identifiants AdSense réels :

#### Dans `index.html`

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-VOTRE-ID-ADSENSE"
     crossorigin="anonymous"></script>
```

#### Dans `js/AdManager.js`

Les identifiants doivent être remplacés aux endroits suivants :

```javascript
adElement.setAttribute('data-ad-client', 'ca-pub-VOTRE-ID-ADSENSE');
adElement.setAttribute('data-ad-slot', 'VOTRE-ID-AD-SLOT');
```

### 2. Vérification du code

- Assurez-vous que les balises `<ins>` sont correctement implémentées
- Le code est conçu pour supporter les traductions (français et anglais)
- Des placeholders sont affichés si les publicités sont bloquées

## Modes de développement et production

Le système de publicités détecte automatiquement si le jeu est en mode développement (local) ou en production (itch.io).

### Mode Développement

- Détecté automatiquement lorsque le jeu est exécuté depuis :
  - Fichier local (protocol file://)
  - Localhost ou 127.0.0.1
  - Serveur local (192.168.x.x ou 10.x.x.x)

- Fonctionnalités en mode développement :
  - Affichage de placeholders colorés à la place des vraies publicités
  - Les placeholders indiquent les dimensions et le type de publicité
  - Permet de tester la mise en page sans connexion à AdSense

### Mode Production

- Détecté automatiquement sur itch.io ou tout autre hébergement web
- Tente de charger les vraies publicités AdSense
- Affiche des placeholders d'erreur si les publicités ne peuvent pas être chargées

## Types de publicités

1. **Publicités bannière :**
   - Visibles dans les menus principaux
   - Masquées pendant le jeu
   - Dimensions: 728×90px

2. **Publicités interstitielles :**
   - Apparaissent après la fin d'une partie
   - Ont un délai de 60 secondes entre chaque affichage
   - Peuvent être fermées après un compte à rebours de 5 secondes
   - Dimensions: 336×280px

3. **Format autorelaxed :**
   - Format adaptatif qui s'adapte à l'espace disponible
   - Utilisation : `adManager.loadAutoRelaxedAd('id-du-conteneur')`

4. **Paramètres de publicité :**
   - Dans le menu Options, les utilisateurs peuvent activer/désactiver les publicités
   - Le paramètre est sauvegardé entre les sessions

## Dépannage

Si les publicités ne s'affichent pas :

1. Vérifiez que vous avez remplacé les identifiants par vos identifiants AdSense réels
2. Vérifiez que votre compte AdSense est approuvé pour ce domaine
3. Assurez-vous que le jeu est hébergé sur HTTPS (requis pour AdSense)
4. Consultez la console du navigateur pour les erreurs éventuelles

### Solutions pour itch.io

Si vous rencontrez des problèmes avec l'approbation de domaine sur itch.io :

1. **Domaine personnalisé** : Envisagez d'acheter un domaine et de le configurer comme domaine personnalisé sur itch.io, puis de faire approuver ce domaine par AdSense.

2. **Alternative à AdSense** : Utilisez les publicités natives d'itch.io ou envisagez d'autres réseaux publicitaires qui fonctionnent mieux avec les sites hébergés.

3. **Version Premium** : Proposez une version sans publicité que les utilisateurs peuvent acheter directement sur itch.io.

## Détection des bloqueurs de publicités

Le jeu détecte les bloqueurs de publicités et affiche un message alternatif. Vous pouvez personnaliser ce message de deux façons :

- Modifiez les traductions dans `js/Utilities.js` :

```javascript
adBlockerDetected: 'Bloqueur de publicités détecté'
```

- Modifiez l'apparence du placeholder dans la fonction `createAdPlaceholder()` dans `js/AdManager.js`

## Gestion des erreurs

Le système gère plusieurs types d'erreurs :

1. **Blocage par adblocker** : Affiche un message en cas de détection d'un bloqueur de publicités
2. **Erreur de connexion** : Message spécifique en cas de problème de connexion au serveur AdSense
3. **Mode développement** : Message indiquant que les publicités ne sont pas disponibles en mode développement

## Pour aller plus loin

Pour améliorer davantage l'intégration d'AdSense :

1. **Tests A/B** : Testez différents emplacements et formats de publicités
2. **Ajout de publicités in-game** : Placez des publicités entre les niveaux ou pendant les pauses
3. **Personnalisation avancée** : Adaptez les couleurs et styles des publicités pour qu'elles s'intègrent au design du jeu
4. **Publicités vidéo** : Envisagez d'implémenter des publicités vidéo récompensées qui donnent des bonus aux joueurs
