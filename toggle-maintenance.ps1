# Script pour activer le mode maintenance sur Vercel
# Usage: .\toggle-maintenance.ps1 [on|off]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("on","off")]
    [string]$Mode
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BLOCKDROP - Gestion Maintenance" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($Mode -eq "on") {
    Write-Host "🔧 Activation du mode maintenance..." -ForegroundColor Yellow
    
    # Sauvegarde du vercel.json actuel
    if (Test-Path "vercel.json") {
        Copy-Item "vercel.json" "vercel-backup.json" -Force
        Write-Host "✅ Sauvegarde de vercel.json créée" -ForegroundColor Green
    }
    
    # Active le mode maintenance
    Copy-Item "vercel-maintenance.json" "vercel.json" -Force
    Write-Host "✅ Configuration maintenance activée" -ForegroundColor Green
    
    # Déploie sur Vercel
    Write-Host ""
    Write-Host "📦 Déploiement sur Vercel..." -ForegroundColor Yellow
    vercel --prod
    
    Write-Host ""
    Write-Host "✅ MODE MAINTENANCE ACTIVÉ !" -ForegroundColor Green
    Write-Host "   Les visiteurs verront la page de maintenance." -ForegroundColor White
    
} else {
    Write-Host "🎮 Désactivation du mode maintenance..." -ForegroundColor Yellow
    
    # Restaure le vercel.json original
    if (Test-Path "vercel-backup.json") {
        Copy-Item "vercel-backup.json" "vercel.json" -Force
        Remove-Item "vercel-backup.json" -Force
        Write-Host "✅ Configuration normale restaurée" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Pas de sauvegarde trouvée, utilisation de la config par défaut" -ForegroundColor Yellow
        
        # Crée une config par défaut si pas de backup
        $defaultConfig = @'
{
  "version": 2,
  "builds": [
    {
      "src": "public/**",
      "use": "@vercel/static"
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
'@
        $defaultConfig | Out-File -FilePath "vercel.json" -Encoding utf8
    }
    
    # Déploie sur Vercel
    Write-Host ""
    Write-Host "📦 Déploiement sur Vercel..." -ForegroundColor Yellow
    vercel --prod
    
    Write-Host ""
    Write-Host "✅ MODE NORMAL RESTAURÉ !" -ForegroundColor Green
    Write-Host "   Le site est de nouveau accessible." -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
