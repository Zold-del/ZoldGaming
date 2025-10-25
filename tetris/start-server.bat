@echo off
echo ======================================
echo   Démarrage du serveur BlockDrop
echo ======================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Node.js n'est pas installé!
    echo Téléchargez-le sur https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js détecté: 
node --version
echo.

REM Naviguer vers le dossier server
cd server

REM Vérifier si .env existe
if not exist ".env" (
    echo [ATTENTION] Fichier .env non trouvé!
    echo Création à partir de .env.example...
    copy .env.example .env
    echo.
    echo [IMPORTANT] Modifiez le fichier server/.env avec vos configurations!
    echo Appuyez sur une touche pour continuer...
    pause >nul
)

REM Vérifier si node_modules existe
if not exist "node_modules" (
    echo Installation des dépendances...
    call npm install
    echo.
)

echo Démarrage du serveur...
echo Le serveur sera disponible sur http://localhost:3000
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

REM Démarrer le serveur
call npm run dev
