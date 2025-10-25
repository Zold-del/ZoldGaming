# 🔧 Mode Maintenance - BLOCKDROP

Ce dossier contient les outils pour gérer le mode maintenance de votre site sur Vercel.

## 📋 Fichiers

- `maintenance.html` - La page de maintenance affichée aux visiteurs
- `vercel-maintenance.json` - Configuration Vercel pour le mode maintenance
- `toggle-maintenance.ps1` - Script PowerShell pour activer/désactiver facilement

## 🚀 Utilisation

### Activer le mode maintenance

```powershell
.\toggle-maintenance.ps1 on
```

Cette commande va :
1. ✅ Sauvegarder votre configuration actuelle (`vercel.json` → `vercel-backup.json`)
2. ✅ Activer la configuration de maintenance
3. ✅ Déployer automatiquement sur Vercel
4. ✅ Afficher la page de maintenance à tous les visiteurs

### Désactiver le mode maintenance

```powershell
.\toggle-maintenance.ps1 off
```

Cette commande va :
1. ✅ Restaurer votre configuration normale
2. ✅ Déployer automatiquement sur Vercel
3. ✅ Remettre le site en ligne normalement

## 🎨 Personnaliser la page de maintenance

Vous pouvez modifier `public/maintenance.html` pour :
- Changer le message affiché
- Modifier les couleurs et le design
- Ajouter un temps estimé de retour
- Ajouter vos liens sociaux

## 📱 Alternative : Désactiver manuellement sur Vercel

### Option 1 : Via le Dashboard Vercel
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet "zold-gaming"
3. Allez dans **Settings** → **General**
4. Faites défiler jusqu'à **Deployment Protection**
5. Activez "Pause Deployments" pour désactiver temporairement

### Option 2 : Supprimer le projet
1. Dashboard Vercel → Votre projet
2. **Settings** → **General** → **Delete Project**
3. ⚠️ Attention : Cette action est irréversible !

## 🔄 Commandes manuelles

Si vous préférez faire manuellement :

### Activer maintenance
```powershell
Copy-Item vercel-maintenance.json vercel.json -Force
vercel --prod
```

### Désactiver maintenance
```powershell
Copy-Item vercel-backup.json vercel.json -Force
vercel --prod
```

## 💡 Conseils

- ✅ Testez d'abord avec `vercel` (sans --prod) pour voir l'aperçu
- ✅ Gardez toujours une sauvegarde de votre `vercel.json`
- ✅ Informez vos utilisateurs à l'avance de la maintenance
- ✅ Personnalisez le temps estimé dans la page de maintenance

## 🆘 En cas de problème

Si quelque chose ne fonctionne pas :

1. Vérifiez que Vercel CLI est installé : `vercel --version`
2. Vérifiez que vous êtes authentifié : `vercel whoami`
3. Restaurez manuellement depuis `vercel-backup.json` si besoin
4. Contactez le support Vercel si nécessaire

---

**Note** : Le mode maintenance redirige TOUTES les routes vers la page de maintenance, y compris l'API. Utilisez-le uniquement pour des maintenances courtes.
