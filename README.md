# 🎮 BlockDrop Tetris

Un jeu Tetris moderne avec système d'authentification, classement et récompenses.

## 🚀 Déploiement Rapide

### Option la plus simple: Vercel (Gratuit)

1. **Créez un compte MongoDB Atlas** (gratuit)
   - https://www.mongodb.com/cloud/atlas
   - Créez un cluster et notez l'URI de connexion

2. **Poussez votre code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/votre-username/votre-repo.git
   git push -u origin main
   ```

3. **Déployez sur Vercel**
   - Allez sur https://vercel.com
   - Cliquez sur "New Project"
   - Importez votre repository GitHub
   - Ajoutez les variables d'environnement:
     - `NODE_ENV=production`
     - `MONGODB_URI=votre_uri_mongodb`
     - `JWT_SECRET=un_secret_securise`
     - `CLIENT_URL=https://votre-domaine.com`
   
4. **Configurez votre domaine**
   - Settings > Domains
   - Ajoutez votre nom de domaine
   - Suivez les instructions DNS

## 📖 Documentation complète

Consultez [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) pour:
- Instructions détaillées pour Vercel, Railway, et Heroku
- Configuration MongoDB Atlas
- Configuration DNS
- Résolution de problèmes

## ⚙️ Configuration locale

1. Installez les dépendances:
   ```bash
   npm run install-server
   ```

2. Créez un fichier `.env` dans le dossier `server/`:
   ```
   NODE_ENV=development
   MONGODB_URI=votre_uri_mongodb
   JWT_SECRET=votre_secret
   CLIENT_URL=http://localhost:5500
   PORT=3000
   ```

3. Démarrez le serveur:
   ```bash
   npm run dev
   ```

4. Ouvrez `index.html` dans votre navigateur

## 📁 Structure du projet

```
tetris/
├── index.html              # Page principale du jeu
├── admin.html             # Panel d'administration
├── css/                   # Styles
├── js/                    # Code JavaScript du jeu
├── server/                # Backend API
│   ├── server.js          # Serveur Express
│   ├── routes/            # Routes API
│   ├── models/            # Modèles MongoDB
│   └── middleware/        # Authentification, etc.
├── vercel.json            # Config Vercel
├── Procfile               # Config Heroku
└── railway.json           # Config Railway
```

## 🔐 Sécurité

- Générez un JWT secret sécurisé:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- Ne commitez JAMAIS votre fichier `.env`
- Utilisez HTTPS en production

## 🎯 Fonctionnalités

- 🎮 Jeu Tetris classique avec contrôles modernes
- 👤 Système d'authentification
- 🏆 Classement mondial
- 🎁 Système de récompenses
- 🎵 Sélecteur de musique
- 📱 Support mobile
- 👨‍💼 Panel d'administration

## 📞 Support

Pour toute question, consultez:
- [Guide de déploiement](./DEPLOYMENT_GUIDE.md)
- Documentation Vercel: https://vercel.com/docs
- Documentation Railway: https://docs.railway.app

---

Développé par ZoldDev 🚀
