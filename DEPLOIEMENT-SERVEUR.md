# 🎮 Guide de Déploiement du Serveur BlockDrop

Ce guide vous explique comment mettre en place et héberger le serveur BlockDrop pour activer les fonctionnalités en ligne : authentification, classements et sauvegarde des scores.

## 📋 Prérequis

- **Node.js** (version 16 ou supérieure) : [Télécharger Node.js](https://nodejs.org/)
- **MongoDB** (base de données) :
  - Option 1 : MongoDB local ([Installer MongoDB](https://www.mongodb.com/try/download/community))
  - Option 2 : MongoDB Atlas (cloud gratuit) ([S'inscrire à MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register))

## 🚀 Installation

### 1. Installation des dépendances

Ouvrez un terminal dans le dossier `server/` et exécutez :

```bash
cd server
npm install
```

### 2. Configuration de l'environnement

Créez un fichier `.env` dans le dossier `server/` en copiant `.env.example` :

```bash
cp .env.example .env
```

Éditez le fichier `.env` et configurez les variables :

```env
# MongoDB - Local
MONGODB_URI=mongodb://localhost:27017/blockdrop

# OU MongoDB Atlas (cloud) - Remplacez avec vos identifiants
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blockdrop

# JWT Secret - IMPORTANT : Utilisez une clé aléatoire complexe !
JWT_SECRET=votre_cle_secrete_tres_complexe_a_changer_123456789

# JWT Expiration
JWT_EXPIRE=7d

# Port du serveur
PORT=3000

# Environnement
NODE_ENV=development

# URL du client (pour CORS)
CLIENT_URL=http://localhost:8080
```

### 3. Configuration de MongoDB

#### Option A : MongoDB Local

1. Installez MongoDB sur votre machine
2. Démarrez le service MongoDB
3. L'URI par défaut est : `mongodb://localhost:27017/blockdrop`

#### Option B : MongoDB Atlas (Recommandé pour la production)

1. Créez un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Créez un nouveau cluster (gratuit)
3. Créez un utilisateur de base de données
4. Autorisez votre IP (ou `0.0.0.0/0` pour tous)
5. Récupérez votre URI de connexion
6. Remplacez `MONGODB_URI` dans `.env`

## 🏃 Démarrage du serveur

### Mode développement (avec auto-reload)

```bash
npm run dev
```

### Mode production

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 🌐 Hébergement en Production

### Option 1 : Heroku (Gratuit/Payant)

1. Créez un compte sur [Heroku](https://heroku.com)
2. Installez [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Connectez-vous :
   ```bash
   heroku login
   ```
4. Créez une app :
   ```bash
   heroku create blockdrop-server
   ```
5. Ajoutez MongoDB :
   ```bash
   heroku addons:create mongolab:sandbox
   ```
6. Configurez les variables d'environnement :
   ```bash
   heroku config:set JWT_SECRET=votre_cle_secrete
   heroku config:set NODE_ENV=production
   ```
7. Déployez :
   ```bash
   git push heroku main
   ```

### Option 2 : Railway (Simple et Gratuit)

1. Créez un compte sur [Railway.app](https://railway.app)
2. Cliquez sur "New Project" → "Deploy from GitHub repo"
3. Sélectionnez votre repository
4. Ajoutez les variables d'environnement dans les Settings
5. Railway déploie automatiquement !

### Option 3 : Render (Gratuit)

1. Créez un compte sur [Render](https://render.com)
2. Créez un nouveau "Web Service"
3. Connectez votre repository GitHub
4. Configurez :
   - **Build Command** : `cd server && npm install`
   - **Start Command** : `cd server && npm start`
5. Ajoutez les variables d'environnement
6. Déployez !

### Option 4 : VPS (DigitalOcean, Linode, etc.)

Pour un contrôle total :

1. Louez un VPS
2. Installez Node.js et MongoDB
3. Clonez votre repository
4. Installez les dépendances
5. Utilisez PM2 pour gérer le processus :
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name blockdrop
   pm2 save
   pm2 startup
   ```
6. Configurez un reverse proxy (Nginx) :
   ```nginx
   server {
       listen 80;
       server_name votredomaine.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Configuration du Client

Une fois le serveur déployé, modifiez `js/ApiService.js` ligne 9 :

```javascript
this.baseUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://votre-serveur.com/api'; // ← Votre URL de production
```

## 📊 Fonctionnalités Activées

Avec le serveur en ligne, les joueurs peuvent :

- ✅ Créer un compte et se connecter
- ✅ Sauvegarder leurs scores en ligne
- ✅ Voir le classement global
- ✅ Comparer leurs performances
- ✅ Suivre leurs statistiques

## 🔒 Sécurité

### Important pour la production :

1. **JWT Secret** : Utilisez une clé aléatoire forte
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **CORS** : Limitez `CLIENT_URL` à votre domaine exact

3. **Rate Limiting** : Déjà configuré pour limiter les abus

4. **HTTPS** : Utilisez toujours HTTPS en production

5. **Variables d'environnement** : Ne commitez JAMAIS le fichier `.env`

## 🧪 Tests

Testez l'API avec des outils comme :

- **Postman** : Interface graphique pour tester les endpoints
- **curl** : En ligne de commande
  ```bash
  curl http://localhost:3000/health
  ```

## 📞 Support

En cas de problème :

1. Vérifiez les logs du serveur
2. Testez la connexion MongoDB
3. Vérifiez le pare-feu (port 3000)
4. Consultez la documentation Express.js

## 🎯 Prochaines étapes

- Ajoutez des sauvegardes automatiques de la base de données
- Configurez un monitoring (UptimeRobot, etc.)
- Mettez en place des logs avancés
- Ajoutez des tests automatisés

---

**Bon hébergement ! 🚀**
