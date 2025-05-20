# Guide pour ajouter de nouveaux jeux à ZoldGaming

Ce document explique comment ajouter de nouveaux jeux à la plateforme ZoldGaming. Il est destiné aux développeurs qui souhaitent contribuer au projet en ajoutant leurs propres jeux.

## Structure d'un jeu

Chaque jeu doit suivre une structure similaire pour s'intégrer correctement dans la plateforme ZoldGaming. Voici les éléments essentiels :

1. **Dossier du jeu** : Créez un dossier dans le répertoire `jeux/` avec le nom de votre jeu (en minuscules, sans espaces).
2. **Fichier HTML principal** : Créez un fichier HTML principal à la racine du dossier `jeux/` (ex: `snake.html`).
3. **Assets du jeu** : Placez les assets spécifiques dans le dossier du jeu (ex: `jeux/votre-jeu/`).
4. **Intégration AdSense** : Incluez les emplacements pour les publicités AdSense.
5. **Intégration du système de score** : Utilisez l'API de score de ZoldGaming pour enregistrer et afficher les scores des joueurs.

## Exemple de structure de fichiers

```
jeux/
│
├── votre-jeu.html         # Page principale du jeu
├── votre-jeu/             # Dossier des assets du jeu
│   ├── script.js          # Script spécifique du jeu
│   ├── style.css          # Style spécifique du jeu
│   └── assets/            # Images, sons, etc.
```

## Template HTML de base

Voici un template HTML que vous pouvez utiliser comme point de départ pour votre jeu :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nom du Jeu - ZoldGaming</title>
    <meta name="description" content="Description de votre jeu sur ZoldGaming.">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/retro.css">
    <!-- Styles spécifiques au jeu -->
    <link rel="stylesheet" href="votre-jeu/style.css">
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-VOTRE-ID-ADSENSE" crossorigin="anonymous"></script>
</head>
<body>
    <div class="container">
        <header class="main-header">
            <div class="logo-container">
                <h1 class="logo">ZoldGaming</h1>
                <span class="logo-blink">_</span>
            </div>
            <nav class="main-nav">
                <ul>
                    <li><a href="../index.html">Accueil</a></li>
                    <li><a href="../jeux/index.html" class="active">Jeux</a></li>
                    <li><a href="../boutique.html">Boutique</a></li>
                    <li><a href="../profil.html" id="nav-profil">Profil</a></li>
                    <li><a href="../connexion.html" id="nav-connexion">Connexion</a></li>
                </ul>
            </nav>
            <button class="hamburger" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </header>

        <main>
            <!-- Bannière AdSense Supérieure -->
            <div class="ad-container">
                <!-- Remplacer par votre code AdSense réel -->
                <div class="ad-placeholder">
                    <p>Publicité Google AdSense</p>
                </div>
            </div>
            
            <section class="game-section">
                <div class="game-container">
                    <div class="game-header">
                        <h2 class="game-title">Titre de votre jeu</h2>
                        <div class="game-score">Score: <span id="score">0</span></div>
                    </div>
                    
                    <div style="position: relative;">
                        <!-- Votre canvas de jeu ou conteneur principal -->
                        <div id="game-area">
                            <!-- Le contenu de votre jeu sera ici -->
                        </div>
                        
                        <!-- Écran de Game Over -->
                        <div id="game-over" class="game-over" style="display: none;">
                            <h2>Game Over</h2>
                            <p>Score final: <span id="final-score">0</span></p>
                            <button id="restart-btn" class="btn btn-primary">Rejouer</button>
                        </div>
                    </div>
                    
                    <!-- Contrôles du jeu -->
                    <div class="game-controls">
                        <!-- Vos boutons de contrôle -->
                    </div>
                    
                    <!-- Instructions du jeu -->
                    <div class="game-info">
                        <h3>Comment jouer</h3>
                        <p>Instruction 1</p>
                        <p>Instruction 2</p>
                        <!-- Autres instructions -->
                    </div>
                </div>
            </section>
            
            <!-- Bannière AdSense Inférieure -->
            <div class="ad-container">
                <!-- Remplacer par votre code AdSense réel -->
                <div class="ad-placeholder">
                    <p>Publicité Google AdSense</p>
                </div>
            </div>
        </main>

        <footer>
            <div class="footer-content">
                <div class="footer-logo">
                    <h2>ZoldGaming</h2>
                    <p>© 2025 ZoldGaming. Tous droits réservés.</p>
                </div>
                <div class="footer-links">
                    <h3>Liens utiles</h3>
                    <ul>
                        <li><a href="../index.html">Accueil</a></li>
                        <li><a href="../jeux/index.html">Jeux</a></li>
                        <li><a href="../boutique.html">Boutique</a></li>
                        <li><a href="../mentions-legales.html">Mentions légales</a></li>
                    </ul>
                </div>
                <div class="footer-social">
                    <h3>Nous suivre</h3>
                    <div class="social-icons">
                        <a href="#" class="social-icon">📱</a>
                        <a href="#" class="social-icon">📘</a>
                        <a href="#" class="social-icon">📸</a>
                        <a href="#" class="social-icon">🐦</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>

    <script src="../js/main.js"></script>
    <script src="../js/auth.js"></script>
    <!-- Script de votre jeu -->
    <script src="votre-jeu/script.js"></script>
</body>
</html>
```

## Intégration du système de score

Pour intégrer votre jeu avec le système de score de ZoldGaming, vous devez appeler la fonction `updateGameScore()` lorsqu'une partie se termine. Cette fonction est définie dans `js/auth.js`.

Exemple d'intégration :

```javascript
// Dans le script de votre jeu
function gameOver() {
    const finalScore = calculateScore(); // Votre fonction pour calculer le score final
    
    // Mettre à jour le score dans l'interface
    document.getElementById('final-score').textContent = finalScore;
    document.getElementById('game-over').style.display = 'block';
    
    // Enregistrer le score si l'utilisateur est connecté
    if (typeof getCurrentUser === 'function' && getCurrentUser()) {
        updateGameScore('votre-jeu-id', finalScore);
    }
}
```

## Ajout de votre jeu à la page d'index

Une fois votre jeu créé, vous devez l'ajouter à la page d'index des jeux (`jeux/index.html`) :

1. Ouvrez le fichier `jeux/index.html`
2. Localisez la section `<div class="games-list" id="games-list">`
3. Ajoutez votre jeu sous forme de carte en suivant ce modèle :

```html
<div class="game-card" data-categories="catégorie1,catégorie2">
    <div class="game-thumbnail">
        <img src="../images/thumbnail-votre-jeu.png" alt="Nom de votre jeu">
    </div>
    <div class="game-info">
        <h3>Nom de votre jeu</h3>
        <div>
            <span class="badge new">Nouveau</span>
            <span class="badge">Catégorie</span>
        </div>
        <p>Description courte de votre jeu.</p>
        <a href="votre-jeu.html" class="btn btn-primary">Jouer</a>
    </div>
</div>
```

4. Ajoutez votre jeu au fichier `js/auth.js` dans l'objet `gamesData` pour qu'il apparaisse dans le profil des utilisateurs :

```javascript
const gamesData = {
    // Jeux existants
    'votre-jeu-id': {
        name: 'Nom de votre jeu',
        image: 'images/thumbnail-votre-jeu.png',
        url: 'jeux/votre-jeu.html'
    }
};
```

## Bonnes pratiques

1. **Performance** : Optimisez votre jeu pour qu'il soit fluide sur tous les appareils.
2. **Responsive** : Adaptez votre jeu pour qu'il soit jouable sur mobile et desktop.
3. **Style cohérent** : Suivez le style rétro de ZoldGaming pour une expérience utilisateur cohérente.
4. **Code propre** : Commentez votre code et organisez-le de manière claire.
5. **Assets optimisés** : Compressez vos images et autres assets pour réduire le temps de chargement.
6. **Attribution** : Si vous utilisez des ressources externes (images, sons, etc.), assurez-vous d'avoir les droits nécessaires et d'attribuer correctement les auteurs.

## Processus de soumission

1. Créez une branche pour votre jeu : `git checkout -b nouveau-jeu/votre-jeu`
2. Développez et testez votre jeu localement
3. Soumettez une Pull Request vers la branche principale
4. Attendez la revue et l'approbation de votre Pull Request

## Besoin d'aide ?

Si vous avez des questions ou besoin d'aide pour développer votre jeu, consultez la documentation ou contactez l'équipe de ZoldGaming.

Bon développement ! 🎮
