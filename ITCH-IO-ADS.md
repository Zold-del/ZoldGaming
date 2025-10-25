# Guide d'intégration AdSense sur itch.io

Ce document explique comment configurer Google AdSense pour fonctionner avec votre jeu BlockDrop hébergé sur itch.io.

## Problèmes connus avec itch.io et AdSense

itch.io présente quelques défis spécifiques pour l'intégration d'AdSense :

1. **Restriction de domaine** : Google AdSense nécessite une vérification du domaine, mais vous n'avez pas un contrôle total sur le domaine itch.io
2. **iFrame** : itch.io héberge parfois les jeux dans des iframes, ce qui peut causer des problèmes avec AdSense
3. **Cross-domain** : Des problèmes de politique de sécurité entre domaines peuvent empêcher AdSense de fonctionner correctement

## Solutions pour faire fonctionner AdSense sur itch.io

### 1. Ajouter le domaine itch.io à votre compte AdSense

1. Connectez-vous à [Google AdSense](https://www.google.com/adsense/)
2. Allez dans **Sites** > **Ajouter un site** dans le menu latéral
3. Ajoutez le domaine complet où votre jeu est hébergé : `votrenom.itch.io`
4. Suivez les étapes de vérification

### 2. Options d'hébergement sur itch.io

Lorsque vous téléchargez votre jeu sur itch.io, assurez-vous de sélectionner les bonnes options :

1. Choisissez **HTML** comme type de projet
2. Dans les paramètres d'intégration, sélectionnez **Activer l'option plein écran**
3. Désactivez l'option **Partage de ressources entre origines (CORS)** si elle est disponible
4. Utilisez l'option **Inclure les jetons nécessaires pour les requêtes API...** si disponible

### 3. Ajout d'un meta-tag pour AdSense

Assurez-vous d'ajouter cette balise meta dans votre fichier `index.html` :

```html
<meta name="referrer" content="no-referrer-when-downgrade">
```

### 4. Test avec paramètre d'URL

Vous pouvez tester le mode développement via l'URL en ajoutant `?admode=dev` à l'URL de votre jeu. Par exemple :

```url
https://votrenom.itch.io/blockdrop?admode=dev
```

Cela forcera l'affichage des placeholders de développement, même sur itch.io.

### 5. Utilisation d'un domaine personnalisé

Si vous avez un abonnement itch.io Creator, vous pouvez configurer un domaine personnalisé :

1. Achetez un domaine (GoDaddy, Namecheap, etc.)
2. Configurez-le pour pointer vers votre page itch.io
3. Dans vos paramètres itch.io, configurez ce domaine personnalisé
4. Ajoutez et vérifiez ce domaine personnalisé dans AdSense

### 6. Diagnostics des problèmes AdSense

Si vous rencontrez des problèmes, vous pouvez utiliser l'outil de diagnostic intégré :

1. Ouvrez la console du navigateur (F12 ou Ctrl+Shift+I)
2. Tapez cette commande : `adManager.showAdDiagnostics()`
3. Les résultats s'afficheront dans la console

### 7. Solutions alternatives

Si AdSense ne fonctionne pas sur itch.io malgré vos efforts :

1. **Monétisation itch.io** : Proposez votre jeu en "Pay what you want" avec un prix suggéré
2. **Version Premium** : Proposez une version sans publicités moyennant un petit paiement
3. **Site personnel** : Hébergez votre jeu sur votre propre domaine où AdSense fonctionnera sans problème

## Ressources utiles

- [Documentation Google AdSense](https://support.google.com/adsense)
- [Documentation itch.io pour les développeurs](https://itch.io/docs/creators/)
- [Forum itch.io pour les développeurs](https://itch.io/t/developer)
