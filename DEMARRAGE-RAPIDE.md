# 🚀 DÉMARRAGE RAPIDE - Système Serveur BlockDrop

## ⚡ En 5 Minutes

### 1️⃣ Prérequis (à installer si pas déjà fait)

- **Node.js** : https://nodejs.org/ (version 16+)
- **MongoDB** : https://www.mongodb.com/try/download/community

### 2️⃣ Installation Automatique

**Windows** :
```cmd
start-server.bat
```

**Linux/Mac** :
```bash
chmod +x start-server.sh
./start-server.sh
```

### 3️⃣ C'est Tout ! 🎉

Le serveur démarre sur `http://localhost:3000`

---

## 📋 Ce que le script fait automatiquement

✅ Vérifie Node.js
✅ Crée le fichier `.env` (si absent)
✅ Installe les dépendances
✅ Démarre le serveur

---

## 🎮 Utilisation dans le Jeu

1. Ouvrez `index.html` dans votre navigateur
2. Cliquez sur **"Connexion"**
3. Créez un compte
4. Jouez ! Vos scores sont sauvegardés automatiquement

---

## 🔧 Configuration Manuelle (optionnel)

Si vous préférez tout faire manuellement :

```bash
# 1. Aller dans le dossier serveur
cd server

# 2. Installer les dépendances
npm install

# 3. Créer le fichier de configuration
cp .env.example .env

# 4. Éditer .env (important : JWT_SECRET)
# Ouvrez server/.env et modifiez les valeurs

# 5. Tester la configuration
npm run test-config

# 6. Démarrer le serveur
npm run dev
```

---

## ⚠️ Problèmes Courants

### Le serveur ne démarre pas

**Problème** : MongoDB n'est pas installé/démarré

**Solution** :
- Installez MongoDB : https://www.mongodb.com/try/download/community
- Démarrez MongoDB :
  - Windows : MongoDB démarre automatiquement après installation
  - Linux/Mac : `sudo systemctl start mongod`

### "Port 3000 déjà utilisé"

**Solution** : Changez le port dans `server/.env` :
```env
PORT=3001
```

### Le jeu ne se connecte pas

**Solution** : Vérifiez que le serveur est bien démarré (regardez le terminal)

---

## 📚 Documentation Complète

- **[README-SERVEUR-COMPLET.md](README-SERVEUR-COMPLET.md)** - Guide complet
- **[DEPLOIEMENT-SERVEUR.md](DEPLOIEMENT-SERVEUR.md)** - Hébergement en ligne
- **[SERVEUR-README.md](SERVEUR-README.md)** - Aperçu des fonctionnalités

---

## 🆘 Besoin d'Aide ?

1. Lancez le test de configuration :
   ```bash
   cd server
   npm run test-config
   ```

2. Consultez les logs du serveur dans le terminal

3. Vérifiez la console du navigateur (F12)

---

## 🎯 Prochaines Étapes

Une fois le serveur local fonctionnel :

1. ✅ Testez toutes les fonctionnalités
2. 🌐 Hébergez en ligne (voir [DEPLOIEMENT-SERVEUR.md](DEPLOIEMENT-SERVEUR.md))
3. 🎮 Partagez avec vos amis !

---

**Bon jeu ! 🎮**
