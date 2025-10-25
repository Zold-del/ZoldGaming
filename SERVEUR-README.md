# 🎮 BlockDrop - Système Serveur Intégré

## ✨ Nouvelles Fonctionnalités

Le jeu BlockDrop dispose maintenant d'un système serveur complet pour :

- 🔐 **Authentification** : Créez un compte et connectez-vous
- 📊 **Classement en ligne** : Comparez vos scores avec d'autres joueurs
- 💾 **Sauvegarde des scores** : Tous vos scores sont enregistrés
- 📈 **Statistiques** : Suivez votre progression
- 🏆 **Rang global** : Voyez votre position dans le classement

## 🚀 Démarrage Rapide

### 1. Avec le script automatique (Recommandé)

**Windows** :
```bash
start-server.bat
```

**Linux/Mac** :
```bash
chmod +x start-server.sh
./start-server.sh
```

### 2. Manuel

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

## 📋 Configuration Minimale

Éditez `server/.env` :

```env
MONGODB_URI=mongodb://localhost:27017/blockdrop
JWT_SECRET=changez_moi_par_une_cle_secrete_complexe
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:8080
```

## 🎯 Utilisation dans le Jeu

Une fois le serveur démarré :

1. Ouvrez `index.html` dans votre navigateur
2. Cliquez sur **"Connexion"** dans le menu principal
3. Créez un compte ou connectez-vous
4. Jouez et vos scores seront automatiquement enregistrés !
5. Consultez le **"Classement"** pour voir votre position

## 🌐 Hébergement en Production

Pour héberger le serveur en ligne, consultez le guide complet :

📖 **[DEPLOIEMENT-SERVEUR.md](DEPLOIEMENT-SERVEUR.md)**

## 🔧 Fonctionnement

### Architecture

```
Client (Jeu)    ←→    API Server    ←→    MongoDB
  (HTML/JS)          (Node.js/Express)     (Base de données)
```

### Endpoints API

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/scores` - Enregistrer un score
- `GET /api/scores/leaderboard` - Classement
- `GET /api/scores/my-rank` - Mon rang

## 🎮 Mode Hors Ligne

Le jeu fonctionne toujours sans serveur ! Si le serveur n'est pas disponible :

- ✅ Le jeu reste jouable
- ✅ Les scores locaux sont conservés
- ❌ Pas de connexion
- ❌ Pas de classement en ligne

## 🛠️ Structure des Fichiers

```
server/
├── server.js          # Point d'entrée
├── package.json       # Dépendances
├── .env.example       # Configuration exemple
├── config/
│   └── database.js    # Connexion MongoDB
├── models/
│   ├── User.js        # Modèle utilisateur
│   └── Score.js       # Modèle score
├── routes/
│   ├── auth.js        # Routes authentification
│   ├── scores.js      # Routes scores
│   └── users.js       # Routes utilisateurs
└── middleware/
    ├── auth.js        # Authentification JWT
    └── rateLimiter.js # Limitation de requêtes

js/
├── ApiService.js      # Communication avec l'API
├── LoginMenu.js       # Menu connexion/inscription
└── LeaderboardMenu.js # Menu classement
```

## 🔒 Sécurité

- 🔐 Mots de passe hashés avec bcrypt
- 🎫 Authentification JWT
- 🚦 Rate limiting pour éviter les abus
- 🛡️ Headers de sécurité avec Helmet
- ✅ Validation des données

## 📊 Base de Données

### Utilisateur
```javascript
{
  username: String,
  email: String,
  password: String (hashedé),
  stats: {
    gamesPlayed: Number,
    highScore: Number,
    totalLines: Number,
    maxLevel: Number
  },
  rewards: Array,
  settings: Object
}
```

### Score
```javascript
{
  user: ObjectId,
  score: Number,
  lines: Number,
  level: Number,
  duration: Number,
  mode: String,
  createdAt: Date
}
```

## 🐛 Dépannage

### Le serveur ne démarre pas

1. Vérifiez que MongoDB est lancé
2. Vérifiez le port 3000 (libre ?)
3. Vérifiez le fichier `.env`

### Erreur de connexion dans le jeu

1. Le serveur est-il démarré ?
2. L'URL dans `ApiService.js` est-elle correcte ?
3. CORS configuré correctement ?

### Erreur MongoDB

- MongoDB est-il installé et lancé ?
- L'URI est-elle correcte ?
- Permissions correctes ?

## 💡 Développement

### Ajouter de nouvelles routes

1. Créez une route dans `server/routes/`
2. Importez-la dans `server.js`
3. Utilisez-la : `app.use('/api/route', routeFile)`

### Modifier le modèle de données

1. Éditez `server/models/`
2. Relancez le serveur
3. MongoDB s'adapte automatiquement

## 🎉 Prêt à Jouer !

Le système serveur est maintenant intégré et prêt à l'emploi. Que vous jouiez en local ou en ligne, BlockDrop offre une expérience complète !

---

**Besoin d'aide ?** Consultez [DEPLOIEMENT-SERVEUR.md](DEPLOIEMENT-SERVEUR.md) pour plus de détails.
