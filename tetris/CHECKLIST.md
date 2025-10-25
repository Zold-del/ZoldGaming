# ✅ Checklist de Déploiement - BlockDrop Tetris

Utilisez cette checklist pour déployer votre jeu étape par étape.

---

## 📝 AVANT DE COMMENCER

- [ ] J'ai acheté un nom de domaine ✅ (Déjà fait!)
- [ ] J'ai accès aux paramètres DNS de mon domaine
- [ ] Node.js est installé sur mon ordinateur
- [ ] Git est installé sur mon ordinateur
- [ ] J'ai un compte GitHub (ou je vais en créer un)

---

## 1️⃣ MONGODB ATLAS (Base de données)

- [ ] Créer un compte sur https://www.mongodb.com/cloud/atlas
- [ ] Créer un nouveau cluster (choisir M0 - GRATUIT)
- [ ] Cliquer sur "Database Access" et créer un utilisateur
  - Username: ________________
  - Password: ________________ (Notez-le bien!)
- [ ] Cliquer sur "Network Access" → "Add IP Address"
- [ ] Sélectionner "Allow access from anywhere" (0.0.0.0/0)
- [ ] Cliquer sur "Connect" → "Connect your application"
- [ ] Copier l'URI de connexion
- [ ] URI MongoDB: _______________________________________________

---

## 2️⃣ PRÉPARER LE CODE

- [ ] Ouvrir PowerShell dans le dossier du projet
- [ ] Exécuter: `.\deploy-setup.bat`
- [ ] Générer un JWT Secret:
  ```
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- [ ] JWT Secret: _______________________________________________
- [ ] Ouvrir `server\.env` et remplir:
  - ✅ MONGODB_URI
  - ✅ JWT_SECRET
  - ✅ CLIENT_URL (votre domaine: https://__________________)

---

## 3️⃣ GITHUB

- [ ] Créer un compte sur https://github.com (si pas déjà fait)
- [ ] Créer un nouveau repository (Public ou Private)
- [ ] Nom du repository: ________________
- [ ] Dans PowerShell, exécuter:
  ```
  git init
  git add .
  git commit -m "Initial commit - BlockDrop Tetris"
  git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
  git branch -M main
  git push -u origin main
  ```
- [ ] Vérifier que le code est bien sur GitHub

---

## 4️⃣ VERCEL (Hébergement)

- [ ] Aller sur https://vercel.com
- [ ] Cliquer sur "Sign Up" et se connecter avec GitHub
- [ ] Autoriser Vercel à accéder à vos repositories
- [ ] Cliquer sur "Add New..." → "Project"
- [ ] Sélectionner votre repository BlockDrop
- [ ] Dans "Environment Variables", ajouter:
  
  | Variable | Valeur | ✅ |
  |----------|--------|---|
  | NODE_ENV | production | [ ] |
  | MONGODB_URI | (Votre URI MongoDB) | [ ] |
  | JWT_SECRET | (Votre secret généré) | [ ] |
  | CLIENT_URL | https://votre-domaine.com | [ ] |

- [ ] Cliquer sur "Deploy"
- [ ] Attendre la fin du déploiement (2-5 minutes)
- [ ] Tester l'URL Vercel temporaire: __________________.vercel.app

---

## 5️⃣ CONFIGURER LE DOMAINE

### Dans Vercel:
- [ ] Aller dans Settings → Domains
- [ ] Cliquer sur "Add"
- [ ] Entrer votre domaine: ________________
- [ ] Noter les instructions DNS fournies

### Chez votre registrar de domaine:

**Option A - Domaine racine (monsite.com):**
- [ ] Ajouter un enregistrement A:
  - Type: `A`
  - Name: `@`
  - Value: `76.76.21.21`
  - TTL: `3600` (ou Auto)

**Option B - Sous-domaine www (www.monsite.com):**
- [ ] Ajouter un enregistrement CNAME:
  - Type: `CNAME`
  - Name: `www`
  - Value: `cname.vercel-dns.com`
  - TTL: `3600` (ou Auto)

**Pour les deux (recommandé):**
- [ ] Faire l'Option A ET l'Option B

- [ ] Sauvegarder les changements DNS
- [ ] Attendre la propagation DNS (30 min à 48h, généralement 1-2h)

---

## 6️⃣ VÉRIFICATION FINALE

Après la propagation DNS (vérifier sur https://whatsmydns.net):

- [ ] Tester: https://votre-domaine.com
  - [ ] Le jeu se charge correctement
  - [ ] Les images et styles s'affichent
  - [ ] Le son fonctionne

- [ ] Tester: https://votre-domaine.com/health
  - [ ] Devrait afficher: `{"success": true, "message": "Server is running"}`

- [ ] Créer un compte test
  - [ ] L'inscription fonctionne
  - [ ] La connexion fonctionne
  - [ ] Le profil s'affiche

- [ ] Jouer une partie
  - [ ] Le jeu fonctionne
  - [ ] Le score est enregistré
  - [ ] Le classement s'affiche

- [ ] Tester sur mobile
  - [ ] Le jeu est responsive
  - [ ] Les contrôles tactiles fonctionnent

---

## 🎉 DÉPLOIEMENT RÉUSSI!

- [ ] Le site est en ligne: https://________________
- [ ] Tout fonctionne correctement
- [ ] J'ai noté mes identifiants et informations importantes
- [ ] J'ai partagé le lien avec des amis pour tester

---

## 📝 INFORMATIONS À CONSERVER

**Domaine:** ________________

**Vercel:**
- URL: ________________
- Email: ________________

**MongoDB Atlas:**
- Email: ________________
- Cluster: ________________

**GitHub:**
- Repository: https://github.com/________________/________________

**JWT Secret:** (Gardez-le secret!)
```
________________
```

---

## 🔄 POUR LES FUTURES MISES À JOUR

Quand vous voulez modifier votre jeu:

1. [ ] Modifier les fichiers localement
2. [ ] Tester localement
3. [ ] Commiter et pousser:
   ```
   git add .
   git commit -m "Description des changements"
   git push
   ```
4. [ ] Vercel redéploie automatiquement!
5. [ ] Vérifier que tout fonctionne sur le site

---

## 🆘 EN CAS DE PROBLÈME

### Le site ne se charge pas
- [ ] Vérifier les DNS sur https://whatsmydns.net
- [ ] Attendre 2-4 heures
- [ ] Vérifier les logs dans Vercel Dashboard
- [ ] Vider le cache du navigateur (Ctrl+Shift+Delete)

### Erreur de base de données
- [ ] Vérifier MONGODB_URI dans Vercel
- [ ] Vérifier Network Access dans MongoDB Atlas
- [ ] Vérifier que le mot de passe MongoDB est correct

### Erreur 404
- [ ] Vérifier que vercel.json est bien commité
- [ ] Redéployer depuis Vercel Dashboard

### Autres problèmes
- [ ] Consulter GUIDE-RAPIDE.md
- [ ] Consulter DEPLOYMENT_GUIDE.md
- [ ] Vérifier la console du navigateur (F12)

---

**Bonne chance! 🚀**
