# Déploiement sur GitHub Pages

Ce document explique comment déployer votre site ZoldGaming sur GitHub Pages et comment configurer Google AdSense pour la monétisation.

## 1. Préparation

### Prérequis
- Un compte [GitHub](https://github.com/)
- Git installé sur votre ordinateur
- Un compte [Google AdSense](https://www.google.com/adsense) (pour la monétisation)

## 2. Création du dépôt GitHub

1. Connectez-vous à votre compte GitHub
2. Cliquez sur le bouton "+" en haut à droite, puis sur "New repository"
3. Nommez votre dépôt : `zoldgaming` (ou un autre nom de votre choix)
4. Vous pouvez ajouter une description : "Plateforme de mini-jeux rétro au style pixel art"
5. Choisissez "Public" pour le type de dépôt
6. Cliquez sur "Create repository"

## 3. Initialisation du dépôt local et premier commit

Ouvrez un terminal dans le dossier de votre projet et exécutez les commandes suivantes :

```powershell
# Initialiser le dépôt Git local
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Version initiale de ZoldGaming"

# Configurer le dépôt distant
git remote add origin https://github.com/VOTRE-NOM-UTILISATEUR/zoldgaming.git

# Pousser le code vers GitHub
git push -u origin main
```

> Note : Si votre branche principale s'appelle "master" au lieu de "main", utilisez `git push -u origin master`.

## 4. Configuration de GitHub Pages

1. Sur GitHub, allez sur la page de votre dépôt
2. Cliquez sur "Settings" (Paramètres)
3. Faites défiler jusqu'à la section "GitHub Pages"
4. Dans "Source", sélectionnez la branche principale (main ou master)
5. Cliquez sur "Save" (Enregistrer)
6. Attendez quelques minutes que GitHub déploie votre site
7. Une fois déployé, vous verrez un message indiquant l'URL de votre site, généralement : `https://VOTRE-NOM-UTILISATEUR.github.io/zoldgaming/`

## 5. Configuration de Google AdSense

### Création d'un compte AdSense

1. Rendez-vous sur [Google AdSense](https://www.google.com/adsense)
2. Inscrivez-vous avec votre compte Google
3. Remplissez les informations demandées (site web, pays, etc.)

### Intégration du code AdSense

1. Une fois votre compte approuvé, Google vous fournira un code de suivi AdSense
2. Remplacez le code placeholder dans vos fichiers HTML par ce code réel :

```html
<!-- Remplacer cette ligne dans tous vos fichiers HTML -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-VOTRE-ID-ADSENSE" crossorigin="anonymous"></script>
```

3. Remplacez également les placeholders d'annonces par de vrais blocs AdSense :

```html
<!-- Remplacer le bloc ad-placeholder par ce code -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-VOTRE-ID-ADSENSE"
     data-ad-slot="VOTRE-ID-SLOT"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

4. Après avoir mis à jour les codes AdSense, n'oubliez pas de pousser les modifications sur GitHub :

```powershell
git add .
git commit -m "Intégration de Google AdSense"
git push
```

## 6. Mise à jour du site

Pour mettre à jour votre site, modifiez simplement vos fichiers, puis poussez les changements sur GitHub :

```powershell
# Après avoir modifié vos fichiers
git add .
git commit -m "Description des modifications"
git push
```

GitHub Pages déploiera automatiquement les mises à jour dans les minutes qui suivent.

## 7. Nom de domaine personnalisé (optionnel)

Si vous souhaitez utiliser un nom de domaine personnalisé au lieu de l'URL GitHub Pages par défaut :

1. Achetez un nom de domaine chez un registrar (Namecheap, GoDaddy, OVH, etc.)
2. Dans les paramètres GitHub Pages de votre dépôt, entrez votre nom de domaine personnalisé dans la section "Custom domain"
3. Configurez les enregistrements DNS chez votre registrar selon les instructions de GitHub
4. Activez HTTPS dans les paramètres GitHub Pages

## 8. Conseils pour maximiser les revenus AdSense

1. **Placement stratégique** : Placez les annonces à des endroits où elles seront vues mais pas intrusives
2. **Contenu de qualité** : Créez plus de jeux et de contenu pour attirer les utilisateurs
3. **Expérience utilisateur** : Assurez-vous que les annonces ne nuisent pas à l'expérience de jeu
4. **SEO** : Optimisez votre site pour les moteurs de recherche pour attirer plus de visiteurs
5. **Promotion** : Partagez votre site sur les réseaux sociaux et autres plateformes pour augmenter le trafic
6. **Analytique** : Utilisez Google Analytics pour comprendre le comportement des utilisateurs et optimiser votre site

## 9. Conformité aux politiques AdSense

Assurez-vous que votre site respecte toutes les politiques de Google AdSense :

- Pas de contenu interdit (contenu pour adultes, violence excessive, etc.)
- Pas de clics artificiels sur les annonces
- Pas de placement d'annonces trompeur
- Respectez les règles concernant le nombre d'annonces par page

---

Pour toute question ou assistance, consultez les documentations officielles de GitHub Pages et Google AdSense ou contactez leurs équipes de support.
