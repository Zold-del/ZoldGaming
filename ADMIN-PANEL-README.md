# 👑 Panel Administrateur BlockDrop

## 📋 Vue d'ensemble

Le panel administrateur BlockDrop est une interface web complète pour gérer votre serveur de jeu. Il permet de superviser les utilisateurs, gérer les scores, consulter les statistiques et administrer la plateforme.

## ✨ Fonctionnalités

### 📊 Dashboard
- **Statistiques en temps réel**
  - Nombre total d'utilisateurs
  - Parties jouées
  - Total des points marqués
  - Utilisateurs actifs (7 derniers jours)
- **Top 10 des meilleurs scores**
- **Nouveaux utilisateurs inscrits**
- **Activité des derniers jours**

### 👥 Gestion des utilisateurs
- **Liste complète des utilisateurs** avec pagination
- **Recherche** par nom ou email
- **Filtrage** par rôle (user, admin, moderator)
- **Modifier** les informations utilisateur
  - Nom d'utilisateur
  - Email
  - Rôle
  - Statut actif/inactif
- **Supprimer** des utilisateurs (avec leurs scores)
- **Voir les statistiques** de chaque utilisateur

### 🏆 Gestion des scores
- **Liste tous les scores** avec pagination
- **Filtrage** par mode de jeu
- **Affichage détaillé** :
  - Joueur
  - Score
  - Lignes complétées
  - Niveau atteint
  - Durée de partie
  - Date
- **Suppression** de scores individuels

### 📈 Statistiques avancées
- **Statistiques globales** :
  - Total de parties
  - Score moyen
  - Meilleur score
  - Lignes moyennes
  - Niveau moyen
- **Statistiques par mode de jeu**
- **Top 10 des meilleurs joueurs**
- **Répartition par rôle**

## 🚀 Installation et configuration

### 1. Créer votre premier compte administrateur

Exécutez le script de création d'admin dans le dossier server :

```bash
cd server
npm run create-admin
```

Suivez les instructions pour créer votre compte :
- Nom d'utilisateur (minimum 3 caractères)
- Email
- Mot de passe (minimum 6 caractères)

### 2. Accéder au panel admin

Une fois le serveur démarré, accédez au panel admin à :

```
http://localhost:3000/admin.html
```

Ou avec Live Server :
```
http://localhost:5500/admin.html
```

### 3. Connexion

Connectez-vous avec les identifiants que vous avez créés.

## 🔐 Sécurité

### Niveaux d'accès

Le système gère 3 niveaux de rôles :

1. **user** - Utilisateur normal
   - Peut jouer
   - Peut voir son profil
   - Peut consulter le leaderboard

2. **moderator** - Modérateur
   - Accès en lecture au panel admin
   - Peut consulter les statistiques
   - Ne peut PAS modifier ou supprimer

3. **admin** - Administrateur
   - Accès complet au panel
   - Peut modifier tous les utilisateurs
   - Peut supprimer utilisateurs et scores
   - Peut promouvoir d'autres admins

### Protection des routes

Toutes les routes admin sont protégées par :
- **Authentication JWT** - Token valide requis
- **Vérification du rôle** - Rôle admin ou moderator requis
- **Actions sensibles** - Certaines actions (suppression, modification de rôle) requièrent le rôle admin strict

### Restrictions

- Un admin ne peut pas supprimer son propre compte
- Un admin ne peut pas modifier son propre rôle
- Les modérateurs ont accès en lecture seule

## 🎨 Interface

Le panel admin dispose d'une interface moderne et responsive :

- **Sidebar de navigation** - Accès rapide à toutes les sections
- **Dashboard** - Vue d'ensemble en un coup d'œil
- **Tables interactives** - Tri, recherche, pagination
- **Modales** - Modification sans rechargement de page
- **Design responsive** - Fonctionne sur mobile et tablette

## 📡 API Endpoints

### Dashboard
```
GET /api/admin/dashboard
```
Retourne les statistiques générales et données du tableau de bord.

### Utilisateurs
```
GET    /api/admin/users              # Liste tous les utilisateurs
GET    /api/admin/users/:id          # Détails d'un utilisateur
PUT    /api/admin/users/:id          # Modifier un utilisateur
DELETE /api/admin/users/:id          # Supprimer un utilisateur
DELETE /api/admin/users/:id/scores   # Supprimer les scores d'un utilisateur
```

### Scores
```
GET    /api/admin/scores             # Liste tous les scores
DELETE /api/admin/scores/:id         # Supprimer un score
```

### Statistiques
```
GET /api/admin/stats                 # Statistiques avancées
```

## 🛠️ Personnalisation

### Modifier les permissions

Éditez le fichier `server/middleware/adminAuth.js` pour ajuster les niveaux d'accès.

### Ajouter des statistiques

Modifiez `server/routes/admin.js` pour ajouter de nouvelles statistiques ou endpoints.

### Personnaliser l'interface

Les fichiers à modifier :
- `admin.html` - Structure HTML
- `css/admin-panel.css` - Styles
- `js/admin-panel.js` - Logique JavaScript

## 🔧 Commandes utiles

### Créer un admin
```bash
npm run create-admin
```

### Transformer un utilisateur existant en admin
Le script `create-admin` détecte automatiquement si l'utilisateur existe et propose de le mettre à jour.

### Vérifier les admins existants
```bash
node check-users.js
```

## 📊 Utilisation

### Actions courantes

#### Promouvoir un utilisateur en admin
1. Allez dans "Utilisateurs"
2. Recherchez l'utilisateur
3. Cliquez sur "✏️ Modifier"
4. Changez le rôle en "admin"
5. Enregistrez

#### Supprimer un utilisateur abusif
1. Allez dans "Utilisateurs"
2. Trouvez l'utilisateur
3. Cliquez sur "🗑️ Supprimer"
4. Confirmez (supprime aussi tous ses scores)

#### Consulter l'activité
1. Dashboard → Voir l'activité des 7 derniers jours
2. Statistiques → Statistiques détaillées par mode

#### Nettoyer les scores suspects
1. Allez dans "Scores"
2. Filtrez par mode si nécessaire
3. Supprimez les scores suspects individuellement

## ⚠️ Notes importantes

- **Sauvegardez régulièrement** votre base de données MongoDB
- **Ne partagez jamais** vos identifiants admin
- **Changez le JWT_SECRET** dans `.env` en production
- **Utilisez HTTPS** en production
- **Limitez l'accès** au panel admin par IP si possible

## 🆘 Dépannage

### Je ne peux pas accéder au panel
- Vérifiez que le serveur est démarré (`npm run dev`)
- Vérifiez que vous êtes bien connecté
- Vérifiez votre rôle dans MongoDB

### "Accès refusé"
- Votre compte n'est pas admin
- Exécutez `npm run create-admin` pour créer un admin
- Ou promouvez votre compte existant via MongoDB

### Les statistiques ne s'affichent pas
- Vérifiez la console du navigateur (F12)
- Vérifiez que le serveur API fonctionne
- Vérifiez la connexion MongoDB

## 🎯 Bonnes pratiques

1. **Créez plusieurs admins** pour éviter le point unique de défaillance
2. **Utilisez des moderators** pour déléguer la supervision
3. **Consultez régulièrement** les statistiques pour détecter les anomalies
4. **Sauvegardez** avant toute suppression massive
5. **Documentez** les actions importantes

## 📝 Changelog

### Version 1.0.0
- Dashboard avec statistiques en temps réel
- Gestion complète des utilisateurs
- Gestion des scores
- Statistiques avancées
- Interface responsive
- Système de rôles (user, moderator, admin)
- Protection des routes API
- Script de création d'admin

---

**Développé par ZoldDev** 🎮
