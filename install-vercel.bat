@echo off
echo Installation et configuration de Vercel CLI...
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installé.
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo Node.js détecté. Installation de Vercel CLI...
npm install -g vercel

echo.
echo Vercel CLI installé avec succès !
echo.
echo Pour déployer votre projet :
echo 1. Connectez-vous à Vercel : vercel login
echo 2. Allez dans le dossier tetris : cd tetris
echo 3. Déployez : vercel --prod
echo.
echo Ou utilisez le déploiement automatique via GitHub.
echo.
pause