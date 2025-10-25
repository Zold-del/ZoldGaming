# 🎮 BlockDrop - Guide du Système Serveur

Bienvenue dans le guide complet du système serveur de BlockDrop ! Ce document vous explique comment mettre en place et utiliser toutes les fonctionnalités en ligne.

## 📚 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Installation rapide](#installation-rapide)
3. [Configuration détaillée](#configuration-détaillée)
4. [Utilisation](#utilisation)
5. [Déploiement en production](#déploiement-en-production)
6. [Dépannage](#dépannage)

## 🌟 Vue d'ensemble

Le système serveur de BlockDrop ajoute les fonctionnalités suivantes au jeu :

### Fonctionnalités Principales

- **👤 Authentification** : Système de compte utilisateur complet
- **📊 Classement Global** : Comparez vos performances avec d'autres joueurs
- **💾 Sauvegarde Cloud** : Vos scores sont sauvegardés en ligne
- **📈 Statistiques** : Suivez votre progression dans le temps
- **🏆 Système de Rang** : Découvrez votre position mondiale

### Mode Hors Ligne

**Important** : Le jeu fonctionne toujours sans serveur ! Les fonctionnalités en ligne sont optionnelles.

## ⚡ Installation Rapide

### Prérequis

- **Node.js 16+** : [Télécharger](https://nodejs.org/)
- **MongoDB** : Voir [options d'installation](#mongodb)

### 3 Étapes Simples

#### Windows

```batch
start-server.bat
```

#### Linux/Mac

```bash
chmod +x start-server.sh
./start-server.sh
```

Le script :
1. ✅ Vérifie Node.js
2. ✅ Installe les dépendances
3. ✅ Configure l'environnement
4. ✅ Démarre le serveur

### Vérification de la Configuration

```bash
cd server
npm run test-config
```

Ce script vérifie :
- Configuration `.env`
- Dépendances installées
- Connexion MongoDB

## 🔧 Configuration Détaillée

### 1. MongoDB

Choisissez une option :

#### Option A : MongoDB Local (Développement)

**Installation**

- **Windows** : [MongoDB Installer](https://www.mongodb.com/try/download/community)
- **Mac** : `brew install mongodb-community`
- **Linux** : Suivez le [guide officiel](https://docs.mongodb.com/manual/administration/install-on-linux/)

**Configuration dans .env**

```env
MONGODB_URI=mongodb://localhost:27017/blockdrop
```

#### Option B : MongoDB Atlas (Production - Gratuit)

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit
3. Configurez l'accès réseau (IP: `0.0.0.0/0` pour test)
4. Créez un utilisateur
5. Récupérez l'URI de connexion

**Configuration dans .env**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blockdrop
```

### 2. Variables d'Environnement

Éditez `server/.env` :

```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/blockdrop

# Sécurité JWT
JWT_SECRET=générez_une_clé_aléatoire_complexe_ici
JWT_EXPIRE=7d

# Configuration serveur
PORT=3000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:8080
```

#### Générer un JWT Secret sécurisé

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Installation des Dépendances

```bash
cd server
npm install
```

Packages installés :
- `express` - Framework web
- `mongoose` - ORM MongoDB
- `jsonwebtoken` - Authentification
- `bcryptjs` - Hash des mots de passe
- `cors` - Cross-origin requests
- `helmet` - Sécurité HTTP
- Et plus...

## 🎮 Utilisation

### Démarrage du Serveur

#### Mode Développement (avec auto-reload)

```bash
cd server
npm run dev
```

#### Mode Production

```bash
cd server
npm start
```

Le serveur démarre sur `http://localhost:3000`

### Dans le Jeu

1. **Lancez le jeu** : Ouvrez `index.html` dans un navigateur
2. **Menu Principal** : Cliquez sur "Connexion"
3. **Créez un compte** :
   - Nom d'utilisateur (3-30 caractères)
   - Email valide
   - Mot de passe (6+ caractères)
4. **Jouez** : Vos scores sont automatiquement sauvegardés
5. **Classement** : Consultez votre rang global

### Endpoints API Disponibles

#### Authentification

- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/update-profile` - Modifier le profil
- `POST /api/auth/logout` - Se déconnecter

#### Scores

- `POST /api/scores` - Enregistrer un score
- `GET /api/scores/leaderboard` - Classement global
- `GET /api/scores/user/:userId` - Scores d'un utilisateur
- `GET /api/scores/my-rank` - Mon rang

#### Santé

- `GET /health` - État du serveur

### Exemples de Requêtes

#### Inscription

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "joueur123",
    "email": "joueur@example.com",
    "password": "motdepasse"
  }'
```

#### Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "joueur123",
    "password": "motdepasse"
  }'
```

#### Classement

```bash
curl http://localhost:3000/api/scores/leaderboard?mode=classic&limit=10
```

## 🌐 Déploiement en Production

Pour héberger le serveur en ligne, consultez le guide complet :

**📖 [DEPLOIEMENT-SERVEUR.md](DEPLOIEMENT-SERVEUR.md)**

### Plateformes Recommandées

- **Railway.app** - Simple et gratuit ⭐
- **Render.com** - Gratuit avec auto-deploy
- **Heroku** - Payant mais puissant
- **VPS** - Contrôle total (DigitalOcean, Linode)

### Configuration Client en Production

Modifiez `js/ApiService.js` ligne 9 :

```javascript
this.baseUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://votre-domaine.com/api'; // URL de production
```

## 🐛 Dépannage

### Le serveur ne démarre pas

**Symptôme** : Erreur au lancement

**Solutions** :
1. Vérifiez que MongoDB est lancé
2. Vérifiez le port 3000 (pas utilisé par autre chose)
3. Vérifiez le fichier `.env`
4. Lancez `npm run test-config`

### Erreur de connexion MongoDB

**Symptôme** : `MongooseServerSelectionError`

**Solutions** :
1. MongoDB est-il installé et démarré ?
2. L'URI dans `.env` est-elle correcte ?
3. Les permissions réseau (Atlas) ?

### Le jeu ne se connecte pas au serveur

**Symptôme** : "Serveur hors ligne"

**Solutions** :
1. Le serveur est-il démarré ?
2. L'URL dans `ApiService.js` est-elle correcte ?
3. CORS configuré ? (vérifiez `CLIENT_URL` dans `.env`)
4. Ouvrez la console du navigateur (F12)

### Erreur JWT

**Symptôme** : "Token invalide"

**Solutions** :
1. Reconnectez-vous
2. Vérifiez `JWT_SECRET` dans `.env`
3. Videz le localStorage du navigateur

### Problèmes de performances

**Solutions** :
1. Ajoutez des index MongoDB
2. Utilisez un CDN pour les assets
3. Activez la compression gzip
4. Optimisez les requêtes

## 📊 Structure du Projet

```
tetris/
├── index.html              # Point d'entrée du jeu
├── js/
│   ├── ApiService.js       # Client API
│   ├── LoginMenu.js        # UI connexion
│   ├── LeaderboardMenu.js  # UI classement
│   ├── main.js             # Application principale
│   └── ...                 # Autres modules
├── server/
│   ├── server.js           # Point d'entrée serveur
│   ├── package.json        # Dépendances
│   ├── .env                # Configuration (ne pas committer!)
│   ├── config/
│   │   └── database.js     # Connexion MongoDB
│   ├── models/
│   │   ├── User.js         # Schéma utilisateur
│   │   └── Score.js        # Schéma score
│   ├── routes/
│   │   ├── auth.js         # Routes auth
│   │   ├── scores.js       # Routes scores
│   │   └── users.js        # Routes utilisateurs
│   └── middleware/
│       ├── auth.js         # Middleware JWT
│       └── rateLimiter.js  # Limitation requêtes
├── start-server.bat        # Script démarrage (Windows)
├── start-server.sh         # Script démarrage (Linux/Mac)
└── DEPLOIEMENT-SERVEUR.md  # Guide déploiement
```

## 🔒 Sécurité

### Bonnes Pratiques

✅ **Utilisez HTTPS en production**
✅ **JWT Secret fort et unique**
✅ **Rate limiting activé**
✅ **Mots de passe hashés avec bcrypt**
✅ **Validation des entrées**
✅ **Headers de sécurité (Helmet)**
✅ **CORS restreint au domaine**

### Checklist Sécurité Production

- [ ] JWT_SECRET aléatoire (64+ caractères)
- [ ] HTTPS activé
- [ ] CLIENT_URL restreint au domaine exact
- [ ] MongoDB protégé par mot de passe
- [ ] Rate limiting configuré
- [ ] Logs de sécurité activés
- [ ] Backups automatiques
- [ ] Variables d'environnement sécurisées

## 📈 Monitoring et Maintenance

### Logs

Le serveur affiche :
- Connexions MongoDB
- Requêtes API
- Erreurs

### Monitoring Recommandé

- **UptimeRobot** - Surveillance gratuite
- **PM2** - Gestion de processus
- **MongoDB Atlas** - Monitoring intégré

### Backups

#### MongoDB Local

```bash
mongodump --db blockdrop --out ./backups/
```

#### MongoDB Atlas

Backups automatiques inclus !

## 🎯 Prochaines Étapes

1. ✅ Installer et tester localement
2. ✅ Créer un compte de test
3. ✅ Jouer et vérifier l'enregistrement des scores
4. 📦 Déployer en production (optionnel)
5. 🚀 Partager avec vos amis !

## 💡 Astuces

- Utilisez **nodemon** pour le développement (auto-reload)
- Testez avec **Postman** ou **curl**
- Consultez les logs en cas de problème
- Gardez MongoDB à jour
- Sauvegardez régulièrement la base de données

## 🆘 Support

En cas de problème :

1. Consultez ce guide
2. Vérifiez [DEPLOIEMENT-SERVEUR.md](DEPLOIEMENT-SERVEUR.md)
3. Lancez `npm run test-config`
4. Vérifiez les logs du serveur
5. Ouvrez la console du navigateur (F12)

## 📝 Changelog

### Version 1.0.0
- ✨ Système serveur complet
- 🔐 Authentification JWT
- 📊 Classement en ligne
- 💾 Sauvegarde des scores
- 🏆 Système de rang

---

**Bon jeu et bon développement ! 🎮🚀**
