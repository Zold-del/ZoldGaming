# Activer le mode maintenance
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BLOCKDROP - Mode Maintenance" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Activation du mode maintenance..." -ForegroundColor Yellow

# Sauvegarde du vercel.json actuel
if (Test-Path "vercel.json") {
    Copy-Item "vercel.json" "vercel-backup.json" -Force
    Write-Host "Sauvegarde créée: vercel-backup.json" -ForegroundColor Green
}

# Active le mode maintenance
Copy-Item "vercel-maintenance.json" "vercel.json" -Force
Write-Host "Configuration maintenance activée" -ForegroundColor Green

# Déploie sur Vercel
Write-Host ""
Write-Host "Déploiement sur Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "MODE MAINTENANCE ACTIVÉ!" -ForegroundColor Green
Write-Host "Les visiteurs verront la page de maintenance." -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
