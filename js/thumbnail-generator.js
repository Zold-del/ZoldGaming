// Script for generating thumbnail placeholder for Space Invaders
const drawSpaceInvadersThumbnail = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 300, 200);
  
  // Grid
  ctx.strokeStyle = '#222222';
  ctx.lineWidth = 1;
  for (let y = 20; y < 200; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(300, y);
    ctx.stroke();
  }
  for (let x = 20; x < 300; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 200);
    ctx.stroke();
  }
  
  // Space ship at bottom
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(140, 160, 20, 10);
  ctx.fillRect(130, 170, 40, 10);
  
  // Invaders - row 1 (type 1)
  const drawInvader1 = (x, y) => {
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(x+5, y, 10, 5);
    ctx.fillRect(x, y+5, 20, 10);
    ctx.fillRect(x+5, y+15, 10, 5);
    ctx.fillRect(x, y+5, 5, 15);
    ctx.fillRect(x+15, y+5, 5, 15);
  };
  
  // Invaders - row 2 (type 2)
  const drawInvader2 = (x, y) => {
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(x+5, y, 10, 5);
    ctx.fillRect(x, y+5, 20, 5);
    ctx.fillRect(x, y+10, 20, 5);
    ctx.fillRect(x+5, y+15, 5, 5);
    ctx.fillRect(x+10, y+15, 5, 5);
  };
  
  // Draw rows of invaders
  for (let i = 0; i < 5; i++) {
    drawInvader1(60 + i*40, 30);
  }
  
  for (let i = 0; i < 5; i++) {
    drawInvader2(60 + i*40, 70);
  }
  
  // Bullets
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(150, 130, 2, 10);
  ctx.fillRect(90, 130, 2, 10);
  ctx.fillRect(210, 100, 2, 10);
  
  // Text
  ctx.font = '12px "Press Start 2P"';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('SPACE INVADERS', 150, 190);
  
  return canvas.toDataURL('image/png');
};

// Script for generating thumbnail placeholder for Memory Game
const drawMemoryThumbnail = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#000033';
  ctx.fillRect(0, 0, 300, 200);
  
  // Cards
  const drawCard = (x, y, color, revealed) => {
    ctx.fillStyle = revealed ? color : '#333355';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    ctx.fillRect(x, y, 40, 40);
    ctx.strokeRect(x, y, 40, 40);
    
    if (revealed && color === '#000033') {
      // Symbol on card
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', x + 20, y + 20);
    }
  };
  
  // Draw grid of cards
  const cardColors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#ff8800', '#000033'
  ];
  
  let index = 0;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      const revealed = index % 8 === 7 || index % 8 === 0;
      drawCard(30 + col*45, 30 + row*50, cardColors[index % 8], revealed);
      index++;
    }
  }
  
  // Text
  ctx.font = '12px "Press Start 2P"';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('MEMORY PIXEL', 150, 190);
  
  return canvas.toDataURL('image/png');
};

// Script for generating thumbnail placeholder for Mini RPG
const drawRPGThumbnail = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  // Background (dungeon floor)
  ctx.fillStyle = '#221100';
  ctx.fillRect(0, 0, 300, 200);
  
  // Draw grid pattern for dungeon floor
  ctx.strokeStyle = '#332211';
  ctx.lineWidth = 1;
  for (let y = 0; y < 200; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(300, y);
    ctx.stroke();
  }
  for (let x = 0; x < 300; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 200);
    ctx.stroke();
  }
  
  // Draw walls
  ctx.fillStyle = '#443322';
  // Top wall
  ctx.fillRect(40, 20, 220, 20);
  // Side walls
  ctx.fillRect(40, 20, 20, 120);
  ctx.fillRect(240, 20, 20, 120);
  
  // Character (hero)
  ctx.fillStyle = '#0066ff';
  ctx.fillRect(140, 100, 20, 20);
  // Character face
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(145, 105, 4, 4);
  ctx.fillRect(151, 105, 4, 4);
  ctx.fillRect(147, 112, 6, 2);
  
  // Monster
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(200, 80, 20, 20);
  // Monster eyes
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(203, 85, 5, 5);
  ctx.fillRect(212, 85, 5, 5);
  // Monster teeth
  ctx.fillRect(205, 93, 3, 3);
  ctx.fillRect(212, 93, 3, 3);
  
  // Treasure chest
  ctx.fillStyle = '#ffaa00';
  ctx.fillRect(80, 60, 25, 15);
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(85, 55, 15, 5);
  
  // Combat UI
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 150, 300, 50);
  
  // UI text
  ctx.font = '10px "Press Start 2P"';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText('HERO HP: 120/120', 10, 165);
  ctx.fillText('ATTAQUE', 10, 185);
  ctx.fillText('MAGIE', 120, 185);
  ctx.fillText('OBJET', 210, 185);
  
  // Game title
  ctx.font = '12px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('MINI RPG', 150, 40);
  
  return canvas.toDataURL('image/png');
};

// Export function to generate all game thumbnails
export const generateGameThumbnails = () => {
  return {
    spaceInvaders: drawSpaceInvadersThumbnail(),
    memory: drawMemoryThumbnail(),
    rpg: drawRPGThumbnail()
  };
};
