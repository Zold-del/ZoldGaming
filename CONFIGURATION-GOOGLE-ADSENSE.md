# 📢 Configuration Google AdSense pour BlockDrop

## ✅ ÉTAPE 1 : CRÉER UN COMPTE GOOGLE ADSENSE

1. Allez sur : https://www.google.com/adsense
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Commencer"**
4. Remplissez les informations :
   - URL du site : `https://zoldgaming.fr` (ou votre URL Vercel)
   - Email : votre email
   - Pays : France
5. Acceptez les conditions d'utilisation

## ✅ ÉTAPE 2 : VÉRIFIER VOTRE SITE

AdSense vous donnera un code de vérification à ajouter dans le `<head>` de votre site.

**Le code est DÉJÀ AJOUTÉ dans index.html :**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7892383510036313" crossorigin="anonymous"></script>
```

## ✅ ÉTAPE 3 : ATTENDRE L'APPROBATION

⏳ **Délai : 1 à 7 jours**

Google va :
1. Vérifier que le code est bien installé
2. Analyser votre contenu
3. Vérifier que vous respectez les règles AdSense

**Règles importantes :**
- ❌ Pas de contenu pour adultes
- ❌ Pas de contenu violent
- ❌ Pas de contenu illégal
- ✅ Contenu original
- ✅ Navigation claire
- ✅ Politique de confidentialité (RGPD déjà fait ✅)

## ✅ ÉTAPE 4 : CONFIGURATION DES ANNONCES

Une fois approuvé, vous pouvez :

### A) Utiliser les annonces automatiques
- Google place automatiquement les pubs
- Plus simple mais moins de contrôle

### B) Utiliser des emplacements manuels (DÉJÀ CONFIGURÉ ✅)
Votre code utilise déjà 2 types d'annonces :

**1. Bannière fixe (bas de l'écran) - 728×90**
```javascript
// Déjà dans AdManager.js ligne 72
adElement.setAttribute('data-ad-client', 'ca-pub-7892383510036313');
adElement.setAttribute('data-ad-slot', '3750170567');
```

**2. Interstitielle (plein écran) - 336×280**
```javascript
// Déjà dans AdManager.js ligne 178
adElement.setAttribute('data-ad-client', 'ca-pub-7892383510036313');
adElement.setAttribute('data-ad-slot', '3750170567');
```

## ⚙️ ÉTAPE 5 : OBTENIR VOS SLOTS D'ANNONCES

Dans AdSense Dashboard :
1. Allez dans **"Annonces"** → **"Par bloc d'annonces"**
2. Créez 2 blocs :
   - **Bannière** : 728×90 ou "Responsive"
   - **Interstitielle** : 336×280 ou "Rectangle moyen"
3. Copiez le `data-ad-slot` de chaque bloc
4. Remplacez `3750170567` dans `AdManager.js` :

```javascript
// Ligne 72 pour la bannière
adElement.setAttribute('data-ad-slot', 'VOTRE_SLOT_BANNIERE');

// Ligne 178 pour l'interstitielle
adElement.setAttribute('data-ad-slot', 'VOTRE_SLOT_INTERSTITIELLE');
```

## 🔧 CONFIGURATION ACTUELLE

### Votre Publisher ID
```
ca-pub-7892383510036313
```

### Emplacements des pubs
- **Bannière** : Bas de l'écran (toujours visible pendant le jeu)
- **Interstitielle** : Après chaque partie (Game Over)

### Mode développement vs production

**En local (localhost) :**
- Affiche des placeholders colorés 🛠️
- Pas de vraies pubs (AdSense ne charge pas en local)

**En production (zoldgaming.fr) :**
- Charge les vraies pubs Google AdSense
- Détection automatique des bloqueurs de pub

## 💰 REVENUS ESTIMÉS

**Taux CPM moyen (France) :** 1€ - 3€ pour 1000 impressions

**Exemple :**
- 1000 joueurs/mois = 2000 impressions de pub
- Revenus : 2€ - 6€/mois

Pour gagner plus :
- ✅ Augmenter le trafic
- ✅ Partager sur les réseaux sociaux
- ✅ Optimiser le SEO
- ✅ Publier sur itch.io, Kongregate, etc.

## 📊 SUIVI DES PERFORMANCES

Dans AdSense Dashboard :
- **Rapports** → Voir les revenus quotidiens
- **Performances** → CTR (taux de clic)
- **Annonces bloquées** → Vérifier les catégories

## 🚨 PROBLÈMES COURANTS

### "Les annonces ne s'affichent pas"
1. Vérifiez que le site est approuvé
2. Attendez 24-48h après l'approbation
3. Désactivez les bloqueurs de pub
4. Vérifiez la console (F12) pour les erreurs

### "Compte suspendu"
- Ne JAMAIS cliquer sur vos propres pubs
- Ne pas demander aux autres de cliquer
- Respecter les règles AdSense

### "Revenus trop faibles"
- Augmentez le trafic
- Optimisez l'emplacement des pubs
- Testez différents formats

## 📝 CHECKLIST FINALE

- [x] Code AdSense ajouté dans `<head>`
- [x] AdManager.js configuré
- [x] Politique de confidentialité (RGPD) ✅
- [ ] Compte AdSense créé
- [ ] Site soumis pour vérification
- [ ] Site approuvé par Google
- [ ] Slots d'annonces créés
- [ ] Slots mis à jour dans AdManager.js
- [ ] Déployé sur Vercel
- [ ] Pubs testées en production

## 🔗 LIENS UTILES

- AdSense Dashboard : https://adsense.google.com
- Règles AdSense : https://support.google.com/adsense/answer/48182
- Centre d'aide : https://support.google.com/adsense

---

**✅ Votre Publisher ID configuré :** `ca-pub-7892383510036313`
