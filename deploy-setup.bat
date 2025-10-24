@echo off
echo ============================================================
echo 🚀 Script de préparation au déploiement - BlockDrop Tetris
echo ============================================================
echo.

REM Vérifier si Git est installé
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git n'est pas installé. Installez Git d'abord.
    pause
    exit /b 1
)

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js n'est pas installé. Installez Node.js d'abord.
    pause
    exit /b 1
)

echo ✅ Git et Node.js sont installés
echo.

REM Installer les dépendances
echo 📦 Installation des dépendances...
cd server
call npm install
cd ..

echo.
echo ✅ Dépendances installées avec succès!
echo.

REM Créer le fichier .env s'il n'existe pas
if not exist "server\.env" (
    echo 📝 Création du fichier .env...
    copy .env.example server\.env
    echo ⚠️  IMPORTANT: Éditez server\.env avec vos vraies valeurs!
)

echo.
echo 🎯 Prochaines étapes:
echo ====================
echo.
echo 1. Créez un compte MongoDB Atlas (gratuit):
echo    https://www.mongodb.com/cloud/atlas
echo.
echo 2. Éditez server\.env avec vos valeurs:
echo    - MONGODB_URI (de MongoDB Atlas)
echo    - JWT_SECRET (générez avec: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
echo    - CLIENT_URL (votre nom de domaine)
echo.
echo 3. Initialisez Git (si ce n'est pas déjà fait):
echo    git init
echo    git add .
echo    git commit -m "Initial commit"
echo.
echo 4. Créez un repository sur GitHub et poussez le code:
echo    git remote add origin https://github.com/votre-username/votre-repo.git
echo    git push -u origin main
echo.
echo 5. Déployez sur Vercel (recommandé):
echo    - Allez sur https://vercel.com
echo    - Importez votre repository GitHub
echo    - Configurez les variables d'environnement
echo    - Ajoutez votre nom de domaine
echo.
echo 📖 Pour plus de détails, consultez DEPLOYMENT_GUIDE.md
echo.
pause
