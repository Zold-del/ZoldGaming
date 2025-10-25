# ⚠️ CONFIGURATION URGENTE - Variables d'Environnement Vercel

## 🔴 ERREUR ACTUELLE

**Symptôme :** "Unexpected token '@': "server_env" is not valid JSON"  
**Cause :** Les variables d'environnement ne sont pas configurées sur Vercel  
**Impact :** Le serveur ne peut pas se connecter à MongoDB

---

## 🚀 SOLUTION - Configurer les Variables sur Vercel

### Étape 1 : Accéder aux Settings

1. Aller sur https://vercel.com/game-zolds-projects/zold-gaming
2. Cliquer sur **Settings** (en haut)
3. Cliquer sur **Environment Variables** (menu gauche)

---

### Étape 2 : Ajouter les Variables Suivantes

**Copier-coller ces variables une par une :**

#### 1. MONGODB_URI (CRITIQUE)
```
Nom: MONGODB_URI
Valeur: mongodb+srv://votre-username:votre-password@cluster.mongodb.net/blockdrop?retryWrites=true&w=majority
Environnements: ✅ Production ✅ Preview ✅ Development
```
⚠️ **IMPORTANT :** Remplacer par votre vraie URI MongoDB Atlas !

#### 2. JWT_SECRET
```
Nom: JWT_SECRET
Valeur: votre_super_secret_key_tres_complexe_a_changer_en_production_123456789
Environnements: ✅ Production ✅ Preview ✅ Development
```

#### 3. JWT_REFRESH_SECRET (NOUVEAU)
```
Nom: JWT_REFRESH_SECRET
Valeur: SBkj+1Q7yvgNktIzZRrXKRIfg9HCj/9y4yRXbE6Erp7/YQrnpsPMXyAyCWd4qsv0K94PDC5oihN+2dPWnxw03w==
Environnements: ✅ Production ✅ Preview ✅ Development
```

#### 4. ENCRYPTION_KEY (NOUVEAU)
```
Nom: ENCRYPTION_KEY
Valeur: 12376be753a34b29c7b9d570f626c3702373de0d7fe9fd7ef00df6392c8ef188
Environnements: ✅ Production ✅ Preview ✅ Development
```

#### 5. NODE_ENV
```
Nom: NODE_ENV
Valeur: production
Environnements: ✅ Production
```

#### 6. CLIENT_URL
```
Nom: CLIENT_URL
Valeur: https://zoldgaming.fr
Environnements: ✅ Production

(Pour Preview/Dev, utilisez l'URL Vercel temporaire)
```

#### 7. JWT_EXPIRE
```
Nom: JWT_EXPIRE
Valeur: 7d
Environnements: ✅ Production ✅ Preview ✅ Development
```

#### 8. JWT_REFRESH_EXPIRE
```
Nom: JWT_REFRESH_EXPIRE
Valeur: 30d
Environnements: ✅ Production ✅ Preview ✅ Development
```

---

### Étape 3 : Redéployer

Après avoir ajouté TOUTES les variables :

**Option A - Via Dashboard Vercel :**
1. Aller dans **Deployments**
2. Cliquer sur **⋮** (trois points) du dernier déploiement
3. Cliquer sur **Redeploy**
4. Confirmer

**Option B - Via CLI (PowerShell) :**
```powershell
cd "C:\Users\antho\Downloads\ZoldDev\tetris (3)\tetris"
vercel --prod
```

---

## 📋 CHECKLIST DE VÉRIFICATION

Avant de cliquer "Save" sur Vercel, vérifier :

- [ ] MONGODB_URI contient votre vraie URI MongoDB Atlas (avec username et password)
- [ ] JWT_SECRET est une chaîne aléatoire longue et complexe
- [ ] JWT_REFRESH_SECRET est DIFFÉRENT de JWT_SECRET
- [ ] ENCRYPTION_KEY fait exactement 64 caractères hexadécimaux
- [ ] NODE_ENV = "production" (pour Production seulement)
- [ ] CLIENT_URL = URL de votre site
- [ ] Tous cochés sur les 3 environnements (Production, Preview, Development)

---

## 🔍 COMMENT OBTENIR MONGODB_URI

### Si vous n'avez pas de MongoDB Atlas :

1. Aller sur https://cloud.mongodb.com
2. Se connecter ou créer un compte GRATUIT
3. Créer un nouveau cluster (gratuit M0)
4. Attendre 3-5 minutes que le cluster soit créé
5. Cliquer sur **Connect**
6. Choisir **Connect your application**
7. Copier l'URI qui ressemble à :
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Remplacer `<password>` par votre vrai mot de passe
9. Ajouter `/blockdrop` après `.net` :
   ```
   mongodb+srv://username:motdepasse@cluster0.xxxxx.mongodb.net/blockdrop?retryWrites=true&w=majority
   ```

### Si vous avez déjà MongoDB Atlas :

1. Trouver votre URI dans MongoDB Atlas
2. Format attendu : `mongodb+srv://username:password@cluster.mongodb.net/blockdrop?retryWrites=true&w=majority`
3. Vérifier que le mot de passe est correct
4. Vérifier que l'IP de Vercel est autorisée (0.0.0.0/0 pour autoriser tout)

---

## 🧪 TESTER APRÈS REDÉPLOIEMENT

1. Attendre 30 secondes après le redéploiement
2. Ouvrir https://zold-gaming-15fe32m31-game-zolds-projects.vercel.app
3. Le site devrait charger normalement
4. Tester : https://zold-gaming-15fe32m31-game-zolds-projects.vercel.app/api/health
   - Devrait retourner : `{"success":true,"message":"Server is running",...}`

---

## ⚡ COMMANDES RAPIDES

**Tester la connexion API :**
```powershell
Invoke-RestMethod -Uri "https://zold-gaming-15fe32m31-game-zolds-projects.vercel.app/api/health"
```

**Tester DB Status :**
```powershell
Invoke-RestMethod -Uri "https://zold-gaming-15fe32m31-game-zolds-projects.vercel.app/api/db-status"
```

**Générer de nouvelles clés (si besoin) :**
```powershell
# ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## 🆘 DÉPANNAGE

### Erreur persiste après redéploiement

1. Vérifier que MONGODB_URI est bien configuré (sans espaces)
2. Tester la connexion MongoDB depuis MongoDB Compass
3. Vérifier que l'IP 0.0.0.0/0 est autorisée dans MongoDB Atlas Network Access
4. Vider le cache Vercel : Settings → General → Clear Cache

### "Invalid connection string"

- Format incorrect : doit commencer par `mongodb+srv://`
- Caractères spéciaux dans le mot de passe : encoder avec encodeURIComponent
- Nom de base manquant : ajouter `/blockdrop` après `.net`

---

**🎯 Une fois les variables configurées et redéployé, le site fonctionnera !**
