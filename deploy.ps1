# Script de déploiement BlockDrop Tetris
# Usage: .\deploy.ps1

Write-Host "🚀 DÉPLOIEMENT BLOCKDROP TETRIS" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si on est dans le bon dossier
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: package.json non trouvé" -ForegroundColor Red
    Write-Host "Exécutez ce script depuis la racine du projet" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Étape 1/5: Vérification des dépendances..." -ForegroundColor Yellow

# Vérifier Node.js
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js n'est pas installé" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

# Vérifier Git
$gitVersion = git --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git n'est pas installé" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Git installé" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Étape 2/5: Vérification des modifications..." -ForegroundColor Yellow

# Vérifier le statut Git
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Fichiers modifiés détectés:" -ForegroundColor Cyan
    git status --short
    Write-Host ""
    
    $response = Read-Host "Voulez-vous committer ces changements? (O/N)"
    if ($response -eq "O" -or $response -eq "o") {
        Write-Host ""
        Write-Host "📋 Étape 3/5: Commit des changements..." -ForegroundColor Yellow
        
        git add .
        
        $commitMsg = @"
🎉 feat: Améliorations majeures - RGPD, Sécurité JWT, Responsive, Audio fixes

- ✅ Système musique corrigé (AudioManager-fixed.js)
- ✅ RGPD complet (CookieConsent + export/suppression données)
- ✅ Section RGPD dans OptionsMenu
- ✅ UI responsive (mobile/tablet/touch)
- ✅ JWT avec refresh tokens cryptés AES-256
- ✅ TokenBlacklist avec TTL MongoDB
- ✅ Protection XSS/CSRF/NoSQL (Helmet + sanitize)
- ✅ CORRECTIF sliders audio temps réel
- ✅ Routes admin complètes
- ✅ Documentation déploiement complète
"@
        
        git commit -m $commitMsg
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Commit réussi" -ForegroundColor Green
        } else {
            Write-Host "❌ Erreur lors du commit" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "⚠️ Changements non commités - abandon" -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "✅ Aucune modification à committer" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Étape 4/5: Push vers GitHub..." -ForegroundColor Yellow

$currentBranch = git branch --show-current
Write-Host "Branche actuelle: $currentBranch" -ForegroundColor Cyan

$response = Read-Host "Push vers origin/$currentBranch ? (O/N)"
if ($response -eq "O" -or $response -eq "o") {
    git push origin $currentBranch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Push réussi" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors du push" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠️ Push annulé" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Étape 5/5: Déploiement Vercel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️ RAPPEL IMPORTANT:" -ForegroundColor Yellow
Write-Host "Vérifiez que les variables d'environnement suivantes sont configurées dans Vercel:" -ForegroundColor White
Write-Host "  - MONGODB_URI" -ForegroundColor Cyan
Write-Host "  - JWT_SECRET" -ForegroundColor Cyan
Write-Host "  - JWT_REFRESH_SECRET (NOUVEAU)" -ForegroundColor Cyan
Write-Host "  - ENCRYPTION_KEY (NOUVEAU - 64 chars hex)" -ForegroundColor Cyan
Write-Host "  - ALLOWED_ORIGINS" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Vercel CLI est installé
$vercelVersion = vercel --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Vercel CLI n'est pas installé" -ForegroundColor Yellow
    $response = Read-Host "Installer Vercel CLI globalement? (O/N)"
    if ($response -eq "O" -or $response -eq "o") {
        npm install -g vercel
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erreur lors de l'installation de Vercel CLI" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "ℹ️ Déployez manuellement via https://vercel.com" -ForegroundColor Cyan
        exit 0
    }
}

Write-Host "✅ Vercel CLI installé" -ForegroundColor Green
Write-Host ""

$response = Read-Host "Lancer le déploiement Vercel en production? (O/N)"
if ($response -eq "O" -or $response -eq "o") {
    Write-Host ""
    Write-Host "🚀 Déploiement en cours..." -ForegroundColor Cyan
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ DÉPLOIEMENT RÉUSSI!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Prochaines étapes:" -ForegroundColor Cyan
        Write-Host "1. Tester la bannière RGPD" -ForegroundColor White
        Write-Host "2. Vérifier les sliders audio" -ForegroundColor White
        Write-Host "3. Tester sur mobile (responsive)" -ForegroundColor White
        Write-Host "4. Vérifier le panel admin" -ForegroundColor White
        Write-Host "5. Lancer Lighthouse (Performance)" -ForegroundColor White
        Write-Host ""
        Write-Host "📖 Voir GUIDE-DEPLOIEMENT.md pour les tests détaillés" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ℹ️ Déploiement annulé" -ForegroundColor Cyan
    Write-Host "Vous pouvez déployer plus tard avec: vercel --prod" -ForegroundColor White
}

Write-Host ""
Write-Host "🎉 Script terminé!" -ForegroundColor Green
