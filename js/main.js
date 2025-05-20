// main.js - Fonctionnalités principales du site ZoldGaming

document.addEventListener('DOMContentLoaded', function() {
    // Navigation mobile (hamburger menu)
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.querySelector('.main-nav');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Effet de parallaxe simple pour le fond de la section hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }
    
    // Animations au scroll pour les éléments
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.game-card, .feature-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Préchargement des images pour améliorer les performances
    const preloadImages = function() {
        const imagesToPreload = [
            'images/bg-grid.png',
            'images/hero-bg.png',
            'images/placeholder-game1.png',
            'images/placeholder-game2.png',
            'images/placeholder-game3.png'
        ];
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    };
    
    preloadImages();
    
    // Vérification de la connexion utilisateur (à adapter selon votre système d'authentification)
    checkLoginStatus();
    
    // Placeholder images for games if not loaded
    const gameImages = document.querySelectorAll('.game-thumbnail img');
    gameImages.forEach(img => {
        img.addEventListener('error', function() {
            img.src = 'images/placeholder-default.png';
        });
    });
});

// Fonction pour formater les scores avec séparateurs de milliers
function formatScore(score) {
    return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Fonction pour générer un ID unique
function generateUID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Fonction pour obtenir des paramètres d'URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Fonction pour le système de notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
