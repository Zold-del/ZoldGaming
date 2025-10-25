@echo off
echo Configuration du remote GitHub...
echo Remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub
echo et NOM_DU_REPO par le nom du repository que vous avez créé
echo.
echo Exemple: git remote add origin https://github.com/Zold-del/blockdrop-tetris.git
echo.
set /p GITHUB_URL="Entrez l'URL de votre repository GitHub (https://github.com/...): "
git remote add origin %GITHUB_URL%
git branch -M main
git push -u origin main
echo.
echo Repository poussé sur GitHub avec succès !
echo.
echo Maintenant, pour déployer sur Vercel :
echo 1. Allez sur https://vercel.com
echo 2. Connectez-vous avec votre compte GitHub
echo 3. Cliquez sur "Import Project"
echo 4. Sélectionnez votre repository "blockdrop-tetris"
echo 5. Configurez le déploiement :
echo    - Root Directory: tetris
echo    - Build Command: (laisser vide)
echo    - Output Directory: (laisser vide)
echo 6. Cliquez sur "Deploy"
echo.
pause