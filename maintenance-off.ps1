# Désactiver le mode maintenance
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BLOCKDROP - Restauration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Désactivation du mode maintenance..." -ForegroundColor Yellow

# Restaure le vercel.json original
if (Test-Path "vercel-backup.json") {
    Copy-Item "vercel-backup.json" "vercel.json" -Force
    Remove-Item "vercel-backup.json" -Force
    Write-Host "Configuration normale restaurée" -ForegroundColor Green
} else {
    Write-Host "Pas de sauvegarde trouvée" -ForegroundColor Yellow
}

# Déploie sur Vercel
Write-Host ""
Write-Host "Déploiement sur Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "MODE NORMAL RESTAURÉ!" -ForegroundColor Green
Write-Host "Le site est de nouveau accessible." -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
