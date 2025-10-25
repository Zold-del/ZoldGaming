# 🚀 Guide Rapide de Publication - BlockDrop Tetris

## 📋 Résumé en 5 étapes

### Étape 1️⃣ : Préparer MongoDB (Base de données - GRATUIT)
1. Allez sur **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
2. Créez un compte gratuit
3. Créez un cluster gratuit (M0)
4. Créez un utilisateur de base de données
5. Autorisez toutes les IPs (0.0.0.0/0) dans Network Access
6. Récupérez votre **URI de connexion** (ressemble à: `mongodb+srv://...`)

### Étape 2️⃣ : Préparer votre code
1. Ouvrez PowerShell dans le dossier du projet
2. Exécutez le script de préparation:
   ```powershell
   .\deploy-setup.bat
   ```
3. Éditez `server\.env` avec vos valeurs réelles

### Étape 3️⃣ : Mettre le code sur GitHub
```powershell
# Initialiser Git
git init
git add .
git commit -m "Premier commit - BlockDrop Tetris"

# Créez un nouveau repository sur GitHub.com, puis:
git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
git branch -M main
git push -u origin main
```

### Étape 4️⃣ : Déployer sur Vercel (GRATUIT et FACILE)
1. Allez sur **[vercel.com](https://vercel.com)**
2. Cliquez sur **"Sign Up"** et connectez-vous avec GitHub
3. Cliquez sur **"Add New..."** → **"Project"**
4. Sélectionnez votre repository
5. Dans **"Configure Project"**, ajoutez ces variables d'environnement:
   
   | Variable | Valeur |
   |----------|--------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Votre URI MongoDB Atlas |
   | `JWT_SECRET` | (Voir ci-dessous pour générer) |
   | `CLIENT_URL` | `https://votre-domaine.com` |

6. Cliquez sur **"Deploy"**

**Pour générer JWT_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copiez le résultat dans la variable JWT_SECRET

### Étape 5️⃣ : Configurer votre nom de domaine
1. Dans Vercel, allez dans **Settings** → **Domains**
2. Cliquez sur **"Add"**
3. Entrez votre nom de domaine (ex: `montetris.com`)
4. Vercel vous donnera des instructions DNS

**Configuration DNS chez votre registrar (où vous avez acheté le domaine):**

Si vous utilisez le domaine principal (ex: `montetris.com`):
```
Type: A
Name: @
Value: 76.76.21.21
```

Si vous utilisez www (ex: `www.montetris.com`):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## ⏱️ Temps d'attente
- **DNS**: 5 minutes à 48 heures (généralement 1-2 heures)
- **Déploiement Vercel**: 2-5 minutes

## ✅ Vérification

Une fois déployé, testez:

1. **API Health Check**: `https://votre-domaine.com/health`
   - Devrait afficher: `{"success": true, "message": "Server is running"}`

2. **Le jeu**: `https://votre-domaine.com`
   - Devrait charger le jeu

3. **Création de compte**: Testez l'inscription et la connexion

## 🆘 Problèmes courants

### Le site ne se charge pas
- ✅ Vérifiez que le DNS est bien configuré (utilisez [whatsmydns.net](https://whatsmydns.net))
- ✅ Attendez quelques heures pour la propagation DNS
- ✅ Vérifiez les logs dans Vercel Dashboard

### Erreur de base de données
- ✅ Vérifiez MONGODB_URI dans les variables d'environnement Vercel
- ✅ Vérifiez que 0.0.0.0/0 est autorisé dans MongoDB Atlas
- ✅ Vérifiez que l'utilisateur MongoDB a les bons accès

### Erreur CORS
- ✅ Vérifiez que CLIENT_URL correspond exactement à votre domaine
- ✅ Redéployez après avoir modifié les variables d'environnement

## 🔄 Mettre à jour votre site

Après le déploiement initial, pour mettre à jour:

```powershell
# Modifiez vos fichiers, puis:
git add .
git commit -m "Description des changements"
git push
```

Vercel redéploiera automatiquement! 🎉

## 📱 Autres options de déploiement

### Railway (Alternative à Vercel)
1. [railway.app](https://railway.app)
2. Connectez GitHub
3. Déployez le projet
4. Railway crée automatiquement MongoDB
5. Ajoutez votre domaine

### Netlify (Alternative à Vercel)
1. [netlify.com](https://netlify.com)
2. Importez depuis GitHub
3. Configurez les variables
4. Ajoutez votre domaine

## 💰 Coûts

- **MongoDB Atlas M0**: GRATUIT (512 MB)
- **Vercel Hobby**: GRATUIT
- **Nom de domaine**: 10-15€/an (déjà acheté ✅)

Total: **GRATUIT** (sauf le nom de domaine)

## 📞 Besoin d'aide?

1. Consultez les logs dans Vercel Dashboard
2. Vérifiez la console navigateur (F12)
3. Consultez [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) pour plus de détails

---

**Bon déploiement! 🚀🎮**

*N'oubliez pas: La première fois peut prendre du temps, mais ensuite c'est automatique!*
