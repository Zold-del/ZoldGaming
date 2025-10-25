# 🎮 BlockDrop - Backend API

API RESTful pour le jeu BlockDrop (Tetris moderne) avec système d'authentification, classements et gestion des récompenses.

## 🚀 Installation

### Prérequis
- Node.js 16+ 
- MongoDB (local ou MongoDB Atlas)

### Configuration

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer les variables d'environnement**
   
   Copier `.env.example` vers `.env` et modifier les valeurs :
```bash
cp .env.example .env
```

Variables importantes :
- `MONGODB_URI` : URL de connexion MongoDB
- `JWT_SECRET` : Clé secrète pour les tokens JWT (à changer absolument en production)
- `CLIENT_URL` : URL du frontend pour CORS
- `PORT` : Port du serveur (défaut: 3000)

3. **Lancer le serveur**

Mode développement (avec auto-reload) :
```bash
npm run dev
```

Mode production :
```bash
npm start
```

## 📚 Documentation API

### 🔐 Authentification

#### Créer un compte
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "joueur123",
  "email": "joueur@example.com",
  "password": "motdepasse123"
}
```

#### Se connecter
```http
POST /api/auth/login
Content-Type: application/json

{
  "login": "joueur123",  // username ou email
  "password": "motdepasse123"
}
```

Réponse :
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Obtenir le profil
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Mettre à jour le profil
```http
PUT /api/auth/update-profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "avatar": "avatar-url",
  "settings": {
    "language": "fr",
    "musicVolume": 0.7,
    "sfxVolume": 0.8
  }
}
```

#### Se déconnecter
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### 👤 Utilisateurs

#### Voir un profil public
```http
GET /api/users/:userId
```

#### Mettre à jour les paramètres
```http
PUT /api/users/settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "settings": {
    "language": "en",
    "musicVolume": 0.5,
    "sfxVolume": 0.6
  }
}
```

#### Changer l'avatar
```http
PUT /api/users/avatar
Authorization: Bearer {token}
Content-Type: application/json

{
  "avatar": "https://example.com/avatar.png"
}
```

#### Déverrouiller une récompense
```http
POST /api/users/rewards/unlock
Authorization: Bearer {token}
Content-Type: application/json

{
  "rewardId": "neon_palette"
}
```

#### Équiper une récompense
```http
PUT /api/users/rewards/equip
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "colorPalette",  // ou "tetrominoStyle"
  "itemId": "neon_palette"
}
```

#### Rechercher des utilisateurs
```http
GET /api/users/search?q=joueur&limit=10
```

#### Top joueurs par statistique
```http
GET /api/users/stats/top?stat=highScore&limit=10
```

Statistiques disponibles : `highScore`, `gamesPlayed`, `totalLines`, `maxLevel`

### 🏆 Scores

#### Enregistrer un score
```http
POST /api/scores
Authorization: Bearer {token}
Content-Type: application/json

{
  "score": 15420,
  "lines": 42,
  "level": 7,
  "duration": 345000,  // en millisecondes
  "mode": "classic"    // classic, challenge, endless
}
```

#### Classement global
```http
GET /api/scores/leaderboard?mode=classic&period=weekly&limit=100
```

Paramètres :
- `mode` : `classic`, `challenge`, `endless` (défaut: classic)
- `period` : `daily`, `weekly`, `monthly`, `all` (défaut: all)
- `limit` : nombre de résultats (défaut: 100)

#### Historique des scores d'un utilisateur
```http
GET /api/scores/user/:userId?mode=classic&limit=20&skip=0
```

#### Mon rang dans le classement
```http
GET /api/scores/my-rank?mode=classic
Authorization: Bearer {token}
```

#### Supprimer un score
```http
DELETE /api/scores/:scoreId
Authorization: Bearer {token}
```

### 🏥 Santé du serveur
```http
GET /health
```

## 🔒 Sécurité

- **Helmet** : Protection contre les vulnérabilités web courantes
- **CORS** : Contrôle d'accès cross-origin
- **Rate Limiting** : 
  - API générale : 100 req/15min
  - Authentification : 5 tentatives/15min
  - Inscription : 3 comptes/heure par IP
- **JWT** : Tokens d'authentification sécurisés
- **bcrypt** : Hashage des mots de passe (10 rounds)
- **express-validator** : Validation des entrées

## 📊 Modèles de données

### User
```javascript
{
  username: String (unique, 3-30 chars),
  email: String (unique),
  password: String (hashed),
  avatar: String (URL),
  stats: {
    gamesPlayed: Number,
    highScore: Number,
    totalLines: Number,
    maxLevel: Number,
    totalPlayTime: Number
  },
  rewards: {
    unlocked: [String],
    equippedColorPalette: String,
    equippedTetrominoStyle: String
  },
  settings: {
    language: String,
    musicVolume: Number,
    sfxVolume: Number
  },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Score
```javascript
{
  user: ObjectId (ref: User),
  score: Number,
  lines: Number,
  level: Number,
  duration: Number (ms),
  mode: String (classic|challenge|endless),
  createdAt: Date,
  expiresAt: Date (TTL 30 jours)
}
```

## 🛠️ Scripts NPM

- `npm start` : Lancer le serveur en production
- `npm run dev` : Lancer en mode développement (nodemon)

## 📁 Structure du projet

```
server/
├── config/
│   └── database.js          # Configuration MongoDB
├── middleware/
│   ├── auth.js             # Authentification JWT
│   └── rateLimiter.js      # Rate limiting
├── models/
│   ├── User.js             # Modèle utilisateur
│   └── Score.js            # Modèle score
├── routes/
│   ├── auth.js             # Routes d'authentification
│   ├── users.js            # Routes utilisateurs
│   └── scores.js           # Routes scores
├── .env                     # Variables d'environnement
├── .env.example            # Template des variables
├── .gitignore              # Fichiers ignorés par git
├── package.json            # Dépendances
└── server.js               # Point d'entrée
```

## 🚨 Erreurs courantes

### Erreur de connexion MongoDB
```
❌ Erreur de connexion MongoDB: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution** : Vérifier que MongoDB est lancé :
```bash
# Windows (MongoDB installé en tant que service)
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
# ou
mongod --dbpath /path/to/data
```

### Token expiré
```json
{
  "success": false,
  "message": "Token expiré"
}
```
**Solution** : Se reconnecter pour obtenir un nouveau token

### Rate limit dépassé
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```
**Solution** : Attendre 15 minutes ou ajuster les limites dans `.env`

## 📝 TODO / Améliorations futures

- [ ] Upload d'avatars (multer + stockage cloud)
- [ ] Système d'amis
- [ ] Chat en temps réel (Socket.io)
- [ ] Notifications push
- [ ] Achievements/trophées automatiques
- [ ] Mode multijoueur en temps réel
- [ ] Replay des parties
- [ ] Admin dashboard

## 📄 Licence

MIT

## 👨‍💻 Support

Pour toute question ou problème, ouvrir une issue sur GitHub.
