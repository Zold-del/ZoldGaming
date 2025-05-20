# Guide de déploiement sur GitHub Pages et SEO

Ce document explique comment préparer et déployer le site ZoldGaming sur GitHub Pages, ainsi que les étapes pour optimiser le référencement (SEO) et configurer Google AdSense.

## 1. Préparation du dépôt GitHub

### Création du dépôt

1. Connectez-vous à votre compte GitHub
2. Cliquez sur "+" puis "New repository"
3. Nommez votre dépôt `zoldgaming` 
4. Description : "Plateforme de mini-jeux rétro au style pixel art"
5. Visibilité : "Public"
6. Cochez "Add a README file"
7. Cliquez sur "Create repository"

### Configuration du dépôt

1. Remplacez le contenu du fichier README.md par le contenu du fichier README_UPDATE.md
2. Dans les réglages du dépôt (Settings):
   - Allez dans "Pages" dans le menu latéral
   - Dans "Source", sélectionnez la branche "main"
   - Cliquez sur "Save"

## 2. Préparation des fichiers pour le SEO

Avant de téléverser les fichiers, effectuez les modifications suivantes :

### Mettre à jour les URL dans les fichiers SEO

Dans les fichiers suivants, remplacez `votre-nom-utilisateur` par votre nom d'utilisateur GitHub :

1. `sitemap.xml`
2. `robots.txt`
3. `js/seo-helper.js`
4. Balises meta dans les fichiers HTML (`index.html`, etc.)

### Optimisation des images

1. Convertissez les fichiers SVG en PNG pour la compatibilité maximale :
   - `images/placeholder-game1.svg` → `images/placeholder-game1.png`
   - `images/placeholder-game2.svg` → `images/placeholder-game2.png`
   - `images/placeholder-game3.svg` → `images/placeholder-game3.png`
   - `images/zoldgaming-preview.svg` → `images/zoldgaming-preview.jpg` (pour les métadonnées OpenGraph)

2. Assurez-vous que tous les liens dans le code HTML pointent vers les bonnes extensions de fichiers.

## 3. Configuration de Google AdSense

### Création d'un compte AdSense

1. Rendez-vous sur [Google AdSense](https://www.google.com/adsense)
2. Inscrivez-vous avec votre compte Google
3. Suivez les étapes pour configurer votre compte

### Intégration du code AdSense

1. Une fois votre compte approuvé, remplacez le code placeholder dans tous les fichiers HTML :

```html
<!-- Remplacer par votre code AdSense réel -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-VOTRE-ID-ADSENSE" crossorigin="anonymous"></script>
```

2. Remplacez également les blocs d'annonces :

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

## 4. Téléversement des fichiers

### En utilisant l'interface GitHub

1. Naviguez vers votre dépôt GitHub
2. Cliquez sur "Add file" > "Upload files"
3. Faites glisser tous les fichiers du projet ou utilisez le sélecteur de fichiers
4. Ajoutez un message de commit : "Chargement initial du site ZoldGaming"
5. Cliquez sur "Commit changes"

### En utilisant Git en ligne de commande

1. Clonez le dépôt localement :
```
git clone https://github.com/VOTRE-NOM-UTILISATEUR/zoldgaming.git
```

2. Copiez tous les fichiers du projet dans le dossier cloné

3. Ajoutez, commitez et poussez les changements :
```
git add .
git commit -m "Chargement initial du site ZoldGaming"
git push origin main
```

## 5. Vérification du déploiement

1. Attendez quelques minutes que GitHub Pages déploie votre site
2. Visitez `https://VOTRE-NOM-UTILISATEUR.github.io/zoldgaming/`
3. Vérifiez que toutes les pages et jeux fonctionnent correctement

## 6. Optimisation avancée du SEO (après déploiement)

### Google Search Console

1. Inscrivez-vous sur [Google Search Console](https://search.google.com/search-console)
2. Ajoutez votre propriété (`https://VOTRE-NOM-UTILISATEUR.github.io/zoldgaming/`)
3. Vérifiez la propriété en suivant les instructions
4. Soumettez votre sitemap : `https://VOTRE-NOM-UTILISATEUR.github.io/zoldgaming/sitemap.xml`

### Suivi des performances

1. Configurez [Google Analytics](https://analytics.google.com/) pour suivre le trafic
2. Intégrez le code de suivi dans vos pages HTML

## 7. Maintenance et mises à jour

Pour mettre à jour votre site après le déploiement initial :

1. Modifiez les fichiers localement
2. Testez les changements en ouvrant les fichiers dans votre navigateur
3. Commitez et poussez les changements vers GitHub :
```
git add .
git commit -m "Description des modifications"
git push origin main
```

4. Attendez que GitHub Pages redéploie votre site (généralement quelques minutes)

---

En suivant ce guide, vous aurez un site ZoldGaming parfaitement optimisé pour le SEO et prêt à être monétisé avec Google AdSense, le tout hébergé gratuitement sur GitHub Pages.
