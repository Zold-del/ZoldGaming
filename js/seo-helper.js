// SEO Helper script - Add to all pages
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a local development server or GitHub Pages
  const isProduction = window.location.hostname.includes('github.io');
  const basePath = isProduction 
    ? 'https://votre-nom-utilisateur.github.io/zoldgaming/'
    : window.location.protocol + '//' + window.location.host + '/';
  
  // Get current page path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  // Set canonical URL
  const canonicalLink = document.querySelector('link[rel="canonical"]') 
    || document.createElement('link');
  canonicalLink.setAttribute('rel', 'canonical');
  canonicalLink.setAttribute('href', basePath + currentPath);
  if (!document.querySelector('link[rel="canonical"]')) {
    document.head.appendChild(canonicalLink);
  }
  
  // Add structured data for games if on a game page
  if (currentPath.includes('snake.html') || 
      currentPath.includes('tetris.html') || 
      currentPath.includes('pong.html')) {
    
    // Get game information
    let gameName = document.querySelector('.game-title')?.textContent || '';
    let gameDescription = '';
    
    // Set game-specific information
    if (currentPath.includes('snake.html')) {
      gameName = 'Snake Retro';
      gameDescription = 'Le jeu du serpent classique dans une version pixel art sur ZoldGaming.';
    } else if (currentPath.includes('tetris.html')) {
      gameName = 'Tetris Neon';
      gameDescription = 'Une version néon du jeu Tetris classique sur ZoldGaming.';
    } else if (currentPath.includes('pong.html')) {
      gameName = 'Pong Arcade';
      gameDescription = 'Le premier jeu vidéo commercial dans une version modernisée sur ZoldGaming.';
    }
    
    // Create structured data for video game
    const gameSchema = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": gameName,
      "description": gameDescription,
      "genre": "Retro",
      "gamePlatform": "Web Browser",
      "applicationCategory": "Game",
      "operatingSystem": "Any",
      "author": {
        "@type": "Organization",
        "name": "ZoldGaming"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    };
    
    // Add structured data to page
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify(gameSchema);
    document.head.appendChild(schemaScript);
  }
  
  // Add website structured data to homepage
  if (currentPath === 'index.html' || currentPath === '') {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ZoldGaming",
      "url": basePath,
      "description": "Plateforme de mini-jeux rétro au style pixel art des années 80-90.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": basePath + "jeux/index.html?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
    
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify(websiteSchema);
    document.head.appendChild(schemaScript);
  }
});
