#!/bin/bash

echo "======================================"
echo "   Démarrage du serveur BlockDrop"
echo "======================================"
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "[ERREUR] Node.js n'est pas installé!"
    echo "Téléchargez-le sur https://nodejs.org/"
    exit 1
fi

echo "Node.js détecté: $(node --version)"
echo ""

# Naviguer vers le dossier server
cd server

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "[ATTENTION] Fichier .env non trouvé!"
    echo "Création à partir de .env.example..."
    cp .env.example .env
    echo ""
    echo "[IMPORTANT] Modifiez le fichier server/.env avec vos configurations!"
    read -p "Appuyez sur Entrée pour continuer..."
fi

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances..."
    npm install
    echo ""
fi

echo "Démarrage du serveur..."
echo "Le serveur sera disponible sur http://localhost:3000"
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Démarrer le serveur
npm run dev
