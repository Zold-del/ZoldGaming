# ZoldGaming 🎮

Une plateforme rétro de mini-jeux en ligne avec des profils utilisateurs, une boutique virtuelle et un style pixel art années 80-90.

## 📝 À propos du projet

ZoldGaming est un site web statique hébergé sur GitHub Pages qui propose une collection de mini-jeux rétro. Le site intègre des fonctionnalités comme des profils utilisateurs, un système de monnaie virtuelle, une boutique d'objets à débloquer, le tout dans une interface au style rétro inspiré des jeux des années 80-90.

## 🚀 Fonctionnalités

- 🕹️ **Mini-jeux** : Collection de jeux HTML5/JS avec pages dédiées
- 👤 **Profils utilisateurs** : Inscription, connexion, personnalisation (via localStorage)
- 🛒 **Boutique virtuelle** : Objets à débloquer, monnaie virtuelle
- 🎨 **Interface rétro** : Style pixel art, effets visuels rétro
- 📱 **Responsive** : Compatible PC, tablette et mobile
- 💰 **Monétisation** : Intégration de Google AdSense

## 🛠️ Technologies utilisées

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- LocalStorage pour la gestion des données
- GitHub Pages pour l'hébergement

## 📂 Structure du projet

```
/ (Racine)
├── index.html (Accueil)
├── sitemap.xml (Plan du site pour SEO)
├── robots.txt (Configuration pour les moteurs de recherche)
├── css/
│   ├── style.css (Styles principaux)
│   └── retro.css (Effets rétro)
├── js/
│   ├── main.js
│   ├── auth.js (Gestion des utilisateurs)
│   ├── thumbnail-generator.js (Génération d'images)
│   └── games/ (Scripts des jeux)
├── images/
│   ├── avatars/ (Images de profil)
│   ├── bg-grid.svg (Fond d'écran)
│   ├── placeholder-game1.svg (Thumbnail Snake)
│   ├── placeholder-game2.svg (Thumbnail Tetris)
│   ├── placeholder-game3.svg (Thumbnail Pong)
├── jeux/
│   ├── index.html (Liste des jeux)
│   ├── snake.html (Snake)
│   ├── tetris.html (Tetris)
│   ├── pong.html (Pong)
│   ├── tetris/ (Scripts pour Tetris)
│   └── pong/ (Scripts pour Pong)
├── profil.html
├── connexion.html
├── boutique.html
└── mentions-legales.html
```

## 🚀 Installation et déploiement

1. Clonez ce dépôt
2. Testez localement en ouvrant `index.html` dans votre navigateur
3. Déployez sur GitHub Pages (automatiquement depuis la branche principale)

Pour plus de détails sur le déploiement, consultez le fichier [DEPLOIEMENT.md](DEPLOIEMENT.md).

## 🎮 Ajouter un nouveau jeu

Pour ajouter un nouveau jeu à la plateforme, suivez les instructions dans le fichier [AJOUTER-UN-JEU.md](AJOUTER-UN-JEU.md).

## 📝 To-Do

- [x] Structure initiale du projet
- [x] Interface utilisateur avec style rétro
- [x] Système d'authentification (localStorage)
- [x] Intégration du jeu Snake
- [x] Intégration du jeu Tetris
- [x] Intégration du jeu Pong
- [x] Page profil utilisateur
- [x] Boutique virtuelle
- [x] Création d'images placeholder SVG
- [x] Optimisation SEO (meta tags, sitemap.xml)
- [ ] Intégration Google AdSense (code placeholder en place)
- [ ] Déploiement sur GitHub Pages

## 📜 Licence

Ce projet est sous licence [MIT](LICENSE).

## 📞 Contact

Pour toute question ou suggestion concernant ZoldGaming, n'hésitez pas à ouvrir une issue sur ce dépôt GitHub.
