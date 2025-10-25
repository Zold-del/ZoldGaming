# 🚀 GUIDE DE DÉPLOIEMENT - BLOCKDROP TETRIS

## ✅ PRÉ-REQUIS

- [x] Compte Vercel
- [x] Compte MongoDB Atlas
- [x] Git configuré
- [x] Node.js 18+ installé
- [x] Toutes les améliorations implémentées

---

## 📋 CHECKLIST AVANT DÉPLOIEMENT

### 1. Vérifications Locales

```powershell
# Test local du serveur
cd server
npm install
npm start

# Vérifier dans un autre terminal
curl http://localhost:3000/api/health
```

### 2. Variables d'Environnement

**Générer les clés de sécurité :**

```powershell
# Générer ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Générer JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

**Fichier `.env` local (NE PAS COMMITTER) :**

Copier `.env.example` vers `.env` et remplir les valeurs.

---

## 🔐 CONFIGURATION VERCEL

### Étape 1 : Variables d'Environnement

**Dans Vercel Dashboard → Settings → Environment Variables, ajouter :**

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `MONGODB_URI` | `mongodb+srv://...` | Production, Preview |
| `JWT_SECRET` | (votre secret existant) | Production, Preview |
| `JWT_REFRESH_SECRET` | (nouveau secret généré) | Production, Preview |
| `ENCRYPTION_KEY` | (clé hex 64 chars) | Production, Preview |
| `ALLOWED_ORIGINS` | `https://votre-app.vercel.app` | Production |
| `NODE_ENV` | `production` | Production |

⚠️ **IMPORTANT** : 
- `ENCRYPTION_KEY` DOIT faire exactement 64 caractères hexadécimaux
- `JWT_REFRESH_SECRET` DOIT être différent de `JWT_SECRET`
- Ne jamais partager ces clés

---

## 🛠️ DÉPLOIEMENT ÉTAPE PAR ÉTAPE

### Étape 1 : Commit des Changements

```powershell
cd c:\Users\antho\Downloads\ZoldDev\tetris (3)\tetris

# Vérifier les fichiers modifiés
git status

# Ajouter tous les fichiers
git add .

# Commit avec message descriptif
git commit -m "🎉 feat: Améliorations majeures - RGPD, Sécurité JWT, Responsive, Audio fixes

- ✅ Système musique corrigé (AudioManager-fixed.js)
- ✅ RGPD complet (CookieConsent + export/suppression données)
- ✅ Section RGPD dans OptionsMenu
- ✅ UI responsive (mobile/tablet/touch)
- ✅ JWT avec refresh tokens cryptés AES-256
- ✅ TokenBlacklist avec TTL MongoDB
- ✅ Protection XSS/CSRF/NoSQL (Helmet + mongo-sanitize + xss-clean + hpp)
- ✅ CORRECTIF sliders audio temps réel
- ✅ Routes admin complètes"

# Push vers GitHub
git push origin cleanup/archive-20251025
```

### Étape 2 : Merge vers main (optionnel)

```powershell
# Si vous voulez merger dans main
git checkout main
git merge cleanup/archive-20251025
git push origin main
```

### Étape 3 : Déploiement Vercel

**Option A : Via Dashboard Vercel**
1. Aller sur vercel.com
2. Sélectionner le projet BlockDrop
3. Onglet "Deployments"
4. Cliquer "Deploy" sur la dernière branche
5. Attendre le build (~2-3 min)

**Option B : Via CLI**

```powershell
# Installer Vercel CLI si nécessaire
npm install -g vercel

# Se connecter
vercel login

# Déployer en production
vercel --prod

# Suivre les instructions interactives
```

---

## 🧪 TESTS POST-DÉPLOIEMENT

### 1. Tests Fonctionnels

**Page d'accueil :**
- [ ] La page charge correctement
- [ ] Bannière RGPD s'affiche au premier chargement
- [ ] Menu principal responsive
- [ ] Boutons accessibles (≥ 48px sur mobile)

**Authentification :**
- [ ] Inscription fonctionne
- [ ] Login fonctionne
- [ ] Token stocké dans localStorage
- [ ] Refresh token fonctionnel (tester après 15 min)

**RGPD :**
- [ ] Bannière cookies s'affiche
- [ ] Modal paramètres cookies fonctionne
- [ ] Export données télécharge un JSON
- [ ] Suppression compte demande confirmation "SUPPRIMER"
- [ ] Compte supprimé = déconnexion automatique

**Audio :**
- [ ] Musique se lance sans boucle infinie
- [ ] Sliders volume fonctionnent en temps réel
- [ ] Affichage % se met à jour
- [ ] Son test joue lors du changement

**Responsive :**
- [ ] Mobile 375px : menu adapté
- [ ] Tablet 768px : grille responsive
- [ ] Touch : zones tactiles ≥ 48px
- [ ] Landscape : layout horizontal

**Admin Panel :**
- [ ] Login admin fonctionne
- [ ] Dashboard affiche les stats
- [ ] Liste utilisateurs avec pagination
- [ ] Modification/suppression utilisateur
- [ ] Stats avancées visibles

### 2. Tests Sécurité

**Helmet CSP :**
```powershell
# Vérifier les headers
curl -I https://votre-app.vercel.app

# Devrait contenir :
# Content-Security-Policy: ...
# Strict-Transport-Security: max-age=31536000
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
```

**Protection XSS :**
```powershell
# Tenter injection dans login
curl -X POST https://votre-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"<script>alert(1)</script>","password":"test"}'

# Devrait être sanitizé
```

**Token Refresh :**
```powershell
# 1. Login
$response = Invoke-RestMethod -Method POST -Uri "https://votre-app.vercel.app/api/auth/login" -Body (@{username="test";password="test123"} | ConvertTo-Json) -ContentType "application/json"

# 2. Refresh après 15 min
$refresh = Invoke-RestMethod -Method POST -Uri "https://votre-app.vercel.app/api/auth/refresh" -Body (@{refreshToken=$response.refreshToken} | ConvertTo-Json) -ContentType "application/json"

# Devrait retourner nouveau accessToken + refreshToken
```

### 3. Tests Performance

**Lighthouse (Chrome DevTools) :**
- [ ] Performance : ≥ 90
- [ ] Accessibility : ≥ 90
- [ ] Best Practices : ≥ 90
- [ ] SEO : ≥ 80

**Mobile :**
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 3s
- [ ] Time to Interactive < 4s

---

## 🔧 DÉPANNAGE

### Erreur : "ENCRYPTION_KEY must be 64 characters"

**Solution :**
```powershell
# Générer nouvelle clé
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ajouter dans Vercel Environment Variables
# Redéployer
```

### Erreur : "Token expired"

**Cause :** Access token expiré (15 min)

**Solution :** 
- Frontend devrait appeler `/api/auth/refresh` automatiquement
- Vérifier que `refreshToken` est stocké dans localStorage

### Erreur CORS

**Vérifier :**
```javascript
// server/server.js et api/index.js
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'https://votre-app.vercel.app'
];
```

### Bannière RGPD ne s'affiche pas

**Vérifier :**
1. `cookie-consent.css` chargé dans `index.html`
2. `CookieConsent.js` chargé dans `index.html`
3. Initialisé dans `main.js` :
   ```javascript
   window.cookieConsent = new CookieConsent();
   ```

### Audio ne fonctionne pas

**Vérifier :**
1. `AudioManager-fixed.js` remplace bien `AudioManager.js`
2. Fichiers audio présents dans `/assets/audio/`
3. Permissions navigateur pour autoplay

---

## 📊 MONITORING

### Logs Vercel

```powershell
# Via CLI
vercel logs --follow

# Via Dashboard
# Vercel → Projet → Deployments → Logs
```

### MongoDB Atlas

1. Aller sur cloud.mongodb.com
2. Clusters → Browse Collections
3. Vérifier collections :
   - `users`
   - `scores`
   - `tokenblacklists` (avec TTL)

### Vérifier TTL Index

```javascript
// Dans MongoDB Atlas → Collections → tokenblacklists → Indexes
// Devrait voir :
// { "expiresAt": 1 } avec expireAfterSeconds: 0
```

---

## 🎯 RÉSUMÉ DES URLS

| Environnement | URL | Utilisation |
|---------------|-----|-------------|
| Production | `https://blockdrop.vercel.app` | Joueurs |
| Admin Panel | `https://blockdrop.vercel.app/admin.html` | Administration |
| API Health | `https://blockdrop.vercel.app/api/health` | Monitoring |
| API Docs | `https://blockdrop.vercel.app/api` | Documentation |

---

## ✅ VALIDATION FINALE

**Cocher chaque élément :**

- [ ] Variables environnement configurées sur Vercel
- [ ] Commit et push vers GitHub
- [ ] Déploiement Vercel réussi (build vert)
- [ ] Tests RGPD passés (bannière + export + suppression)
- [ ] Tests sécurité passés (CSP headers visibles)
- [ ] Tests responsive passés (mobile + tablet + touch)
- [ ] Tests audio passés (musique + sliders)
- [ ] Admin panel accessible et fonctionnel
- [ ] Lighthouse score ≥ 90 en moyenne
- [ ] MongoDB TokenBlacklist avec TTL actif

---

## 📞 SUPPORT

**En cas de problème :**

1. Vérifier logs Vercel
2. Vérifier variables environnement
3. Tester en local d'abord
4. Consulter `RECAPITULATIF-AMELIORATIONS.md`
5. Vérifier `CORRECTIF-AUDIO-OPTIONS.js` pour les sliders

**Fichiers de référence :**
- `RECAPITULATIF-AMELIORATIONS.md` - Vue d'ensemble
- `CORRECTIF-AUDIO-OPTIONS.js` - Fix audio à appliquer
- `server/.env.example` - Variables environnement
- `DEPLOYMENT_GUIDE.md` - Ce fichier

---

**🎉 Déploiement terminé ! Bon jeu ! 🎮**
