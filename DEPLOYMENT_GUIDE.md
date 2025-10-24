# 🚀 Guide de Déploiement - BlockDrop Tetris

## Prérequis

1. **Compte MongoDB Atlas** (base de données gratuite)
   - Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Créez un cluster gratuit
   - Récupérez votre URI de connexion

2. **Compte GitHub** (pour le code source)
   - Poussez votre code sur GitHub

3. **Nom de domaine** (que vous avez déjà acheté)

## Option 1: Déploiement sur Vercel (Recommandé - Gratuit)

### Étapes:

1. **Créer un compte sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec GitHub

2. **Importer votre projet**
   - Cliquez sur "New Project"
   - Sélectionnez votre repository GitHub
   - Vercel détectera automatiquement la configuration

3. **Configurer les variables d'environnement**
   - Dans les paramètres du projet, ajoutez:
     ```
     NODE_ENV=production
     MONGODB_URI=votre_uri_mongodb_atlas
     JWT_SECRET=votre_secret_tres_securise
     CLIENT_URL=https://votre-domaine.com
     ```

4. **Configurer votre domaine**
   - Dans Settings > Domains
   - Ajoutez votre nom de domaine
   - Suivez les instructions pour configurer les DNS

5. **Déployer**
   - Vercel déploie automatiquement à chaque push sur GitHub

## Option 2: Déploiement sur Railway

### Étapes:

1. **Créer un compte sur Railway**
   - Allez sur [railway.app](https://railway.app)
   - Connectez-vous avec GitHub

2. **Créer un nouveau projet**
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repository

3. **Ajouter MongoDB**
   - Dans le projet, cliquez sur "+ New"
   - Sélectionnez "Database" > "Add MongoDB"
   - Railway créera automatiquement la variable MONGO_URL

4. **Configurer les variables d'environnement**
   ```
   NODE_ENV=production
   JWT_SECRET=votre_secret_securise
   CLIENT_URL=https://votre-domaine.com
   PORT=3000
   ```

5. **Configurer votre domaine**
   - Dans Settings > Domains
   - Ajoutez votre domaine personnalisé

## Option 3: Déploiement sur Heroku

### Étapes:

1. **Installer Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Se connecter à Heroku**
   ```bash
   heroku login
   ```

3. **Créer une application**
   ```bash
   heroku create votre-app-name
   ```

4. **Ajouter MongoDB**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

5. **Configurer les variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=votre_secret
   heroku config:set CLIENT_URL=https://votre-domaine.com
   ```

6. **Déployer**
   ```bash
   git push heroku main
   ```

7. **Configurer le domaine**
   ```bash
   heroku domains:add votre-domaine.com
   ```

## Configuration DNS pour votre domaine

Une fois que vous avez déployé, configurez votre DNS:

### Pour Vercel:
```
Type: CNAME
Name: www (ou @)
Value: cname.vercel-dns.com
```

### Pour Railway:
```
Type: CNAME
Name: www
Value: [fourni par Railway]
```

### Pour Heroku:
```
Type: CNAME
Name: www
Value: [votre-app].herokuapp.com
```

## Configurer MongoDB Atlas

1. **Créer un cluster**
   - Choisissez le plan gratuit (M0)
   - Sélectionnez une région proche de vos utilisateurs

2. **Créer un utilisateur**
   - Database Access > Add New Database User
   - Notez le nom d'utilisateur et mot de passe

3. **Autoriser les connexions**
   - Network Access > Add IP Address
   - Autorisez "0.0.0.0/0" (toutes les IPs) pour la production

4. **Récupérer l'URI**
   - Clusters > Connect > Connect your application
   - Copiez l'URI et remplacez `<password>` par votre mot de passe

## Sécurité - Générer un JWT Secret sécurisé

Utilisez cette commande pour générer un secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Vérification après déploiement

1. **Testez l'API**
   - Visitez: `https://votre-domaine.com/health`
   - Vous devriez voir: `{"success": true, "message": "Server is running"}`

2. **Testez le jeu**
   - Visitez: `https://votre-domaine.com`
   - Le jeu devrait se charger

3. **Testez l'authentification**
   - Essayez de créer un compte
   - Essayez de vous connecter

## Surveillance et Logs

- **Vercel**: Dashboard > Logs
- **Railway**: Dashboard > Deployments
- **Heroku**: `heroku logs --tail`

## Mise à jour du code

Après un déploiement initial:

1. Modifiez votre code localement
2. Commitez les changements
   ```bash
   git add .
   git commit -m "Update game"
   git push
   ```
3. Le déploiement se fait automatiquement!

## Problèmes courants

### Le jeu ne se charge pas
- Vérifiez que CLIENT_URL correspond à votre domaine
- Vérifiez les CORS dans server.js

### Erreurs de base de données
- Vérifiez MONGODB_URI
- Vérifiez que l'IP est autorisée sur MongoDB Atlas

### Erreurs 404
- Vérifiez que les routes statiques sont bien configurées
- Vérifiez le fichier vercel.json ou Procfile

## Support

Si vous rencontrez des problèmes, vérifiez:
1. Les logs de votre plateforme
2. La console du navigateur (F12)
3. Les variables d'environnement

---

**Bon déploiement! 🚀**
