// Pong game implementation
document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('pong-canvas');
    const ctx = canvas.getContext('2d');
    
    // Game constants
    const PADDLE_WIDTH = 12;
    const PADDLE_HEIGHT = 80;
    const BALL_RADIUS = 8;
    const WINNING_SCORE = 7;
    
    // Colors
    const COLORS = {
        background: '#000000',
        ball: '#ffffff',
        paddle1: '#ff00ff', // Player paddle - magenta
        paddle2: '#00ffff', // AI paddle - cyan
        text: '#ffffff',
        court: '#444444'
    };
    
    // Game state
    let gameState = {
        ball: {
            x: canvas.width / 2,
            y: canvas.height / 2,
            dx: 5,
            dy: 5,
            speed: 5
        },
        player: {
            x: 20,
            y: canvas.height / 2 - PADDLE_HEIGHT / 2,
            score: 0,
            speed: 8
        },
        ai: {
            x: canvas.width - 20 - PADDLE_WIDTH,
            y: canvas.height / 2 - PADDLE_HEIGHT / 2,
            score: 0,
            speed: 5 // Will be adjusted by difficulty
        },
        gameOver: false,
        paused: false,
        difficulty: 'medium',
        keysPressed: {}
    };
    
    // Difficulty settings
    const DIFFICULTY_SETTINGS = {
        easy: { aiSpeed: 3, aiReactionTime: 0.2 },
        medium: { aiSpeed: 5, aiReactionTime: 0.1 },
        hard: { aiSpeed: 7, aiReactionTime: 0.05 }
    };
    
    // Initialize game
    init();
    
    function init() {
        // Set initial ball direction randomized
        resetBall();
        
        // Reset scores
        gameState.player.score = 0;
        gameState.ai.score = 0;
        
        // Reset game flags
        gameState.gameOver = false;
        gameState.paused = false;
        
        // Update score displays
        updateScoreDisplay();
        
        // Add event listeners
        setupEventListeners();
        
        // Start game loop
        requestAnimationFrame(gameLoop);
    }
    
    function resetBall() {
        gameState.ball.x = canvas.width / 2;
        gameState.ball.y = canvas.height / 2;
        
        // Randomize direction
        gameState.ball.dx = (Math.random() > 0.5 ? 1 : -1) * gameState.ball.speed;
        gameState.ball.dy = (Math.random() * 2 - 1) * gameState.ball.speed;
    }
    
    function setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            gameState.keysPressed[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            gameState.keysPressed[e.key] = false;
        });
        
        // Mobile controls
        document.querySelector('.up-btn')?.addEventListener('touchstart', () => {
            gameState.keysPressed['ArrowUp'] = true;
        });
        
        document.querySelector('.up-btn')?.addEventListener('touchend', () => {
            gameState.keysPressed['ArrowUp'] = false;
        });
        
        document.querySelector('.down-btn')?.addEventListener('touchstart', () => {
            gameState.keysPressed['ArrowDown'] = true;
        });
        
        document.querySelector('.down-btn')?.addEventListener('touchend', () => {
            gameState.keysPressed['ArrowDown'] = false;
        });
        
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', restartGame);
        
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                setDifficulty(e.target.dataset.difficulty);
                
                // Update active button
                document.querySelectorAll('.difficulty-btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });
    }
    
    function setDifficulty(level) {
        if (DIFFICULTY_SETTINGS[level]) {
            gameState.difficulty = level;
            gameState.ai.speed = DIFFICULTY_SETTINGS[level].aiSpeed;
        }
    }
    
    function updateScoreDisplay() {
        document.getElementById('player-score').textContent = gameState.player.score;
        document.getElementById('ai-score').textContent = gameState.ai.score;
    }
    
    function gameLoop() {
        if (gameState.gameOver || gameState.paused) {
            return;
        }
        
        // Clear canvas
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw court
        drawCourt();
        
        // Process player input
        handlePlayerInput();
        
        // Update AI
        updateAI();
        
        // Update ball position
        updateBall();
        
        // Draw game objects
        drawGame();
        
        // Check winning condition
        checkWinCondition();
        
        // Continue the game loop
        requestAnimationFrame(gameLoop);
    }
    
    function drawCourt() {
        // Center line
        ctx.beginPath();
        ctx.setLineDash([10, 10]);
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = COLORS.court;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Center circle
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
        ctx.strokeStyle = COLORS.court;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    function handlePlayerInput() {
        // Move paddle up
        if (gameState.keysPressed['ArrowUp'] || gameState.keysPressed['w'] || gameState.keysPressed['W']) {
            gameState.player.y = Math.max(0, gameState.player.y - gameState.player.speed);
        }
        
        // Move paddle down
        if (gameState.keysPressed['ArrowDown'] || gameState.keysPressed['s'] || gameState.keysPressed['S']) {
            gameState.player.y = Math.min(canvas.height - PADDLE_HEIGHT, gameState.player.y + gameState.player.speed);
        }
    }
    
    function updateAI() {
        // Simple AI: follow the ball with some delay
        const diffSettings = DIFFICULTY_SETTINGS[gameState.difficulty];
        const aiReactionTime = diffSettings.aiReactionTime;
        
        // Only move if ball is moving toward AI
        if (gameState.ball.dx > 0) {
            // Predict where ball will be
            const targetY = gameState.ball.y - (PADDLE_HEIGHT / 2);
            
            // Add some "thinking time" based on difficulty
            const aiTargetY = gameState.ai.y + (targetY - gameState.ai.y) * (1 - aiReactionTime);
            
            // Move towards target
            if (aiTargetY < gameState.ai.y) {
                gameState.ai.y = Math.max(0, gameState.ai.y - gameState.ai.speed);
            } else if (aiTargetY > gameState.ai.y) {
                gameState.ai.y = Math.min(canvas.height - PADDLE_HEIGHT, gameState.ai.y + gameState.ai.speed);
            }
        }
    }
    
    function updateBall() {
        // Move ball
        gameState.ball.x += gameState.ball.dx;
        gameState.ball.y += gameState.ball.dy;
        
        // Wall collision (top and bottom)
        if (gameState.ball.y < BALL_RADIUS || gameState.ball.y > canvas.height - BALL_RADIUS) {
            gameState.ball.dy = -gameState.ball.dy;
            playSound('wall');
        }
        
        // Paddle collision
        checkPaddleCollision();
        
        // Scoring
        checkScoring();
    }
    
    function checkPaddleCollision() {
        // Player paddle collision
        if (
            gameState.ball.dx < 0 &&
            gameState.ball.x - BALL_RADIUS < gameState.player.x + PADDLE_WIDTH &&
            gameState.ball.x + BALL_RADIUS > gameState.player.x &&
            gameState.ball.y + BALL_RADIUS > gameState.player.y &&
            gameState.ball.y - BALL_RADIUS < gameState.player.y + PADDLE_HEIGHT
        ) {
            handlePaddleHit(gameState.player);
        }
        
        // AI paddle collision
        if (
            gameState.ball.dx > 0 &&
            gameState.ball.x + BALL_RADIUS > gameState.ai.x &&
            gameState.ball.x - BALL_RADIUS < gameState.ai.x + PADDLE_WIDTH &&
            gameState.ball.y + BALL_RADIUS > gameState.ai.y &&
            gameState.ball.y - BALL_RADIUS < gameState.ai.y + PADDLE_HEIGHT
        ) {
            handlePaddleHit(gameState.ai);
        }
    }
    
    function handlePaddleHit(paddle) {
        // Reverse horizontal direction
        gameState.ball.dx = -gameState.ball.dx;
        
        // Calculate impact point (0-1 where the ball hit the paddle)
        const impact = (gameState.ball.y - paddle.y) / PADDLE_HEIGHT;
        
        // Change angle based on impact (middle = straight, top/bottom = angled)
        gameState.ball.dy = 10 * (impact - 0.5);
        
        // Increase speed slightly with each hit
        const speedIncrease = 0.2;
        gameState.ball.speed += speedIncrease;
        
        // Apply speed in the current direction
        const direction = gameState.ball.dx > 0 ? 1 : -1;
        gameState.ball.dx = direction * gameState.ball.speed;
        
        // Play sound
        playSound('paddle');
    }
    
    function checkScoring() {
        // Ball out of bounds left (AI scores)
        if (gameState.ball.x < 0) {
            gameState.ai.score++;
            updateScoreDisplay();
            playSound('score');
            resetBall();
        }
        
        // Ball out of bounds right (Player scores)
        if (gameState.ball.x > canvas.width) {
            gameState.player.score++;
            updateScoreDisplay();
            playSound('score');
            resetBall();
        }
    }
    
    function checkWinCondition() {
        if (gameState.player.score >= WINNING_SCORE || gameState.ai.score >= WINNING_SCORE) {
            gameState.gameOver = true;
            showGameOver();
        }
    }
    
    function drawGame() {
        // Add glow effect to the whole canvas
        ctx.shadowBlur = 0;
        
        // Draw paddles with glow effect
        drawPaddle(gameState.player.x, gameState.player.y, COLORS.paddle1);
        drawPaddle(gameState.ai.x, gameState.ai.y, COLORS.paddle2);
        
        // Draw ball with glow effect
        drawBall();
        
        // Draw scores
        drawScores();
    }
    
    function drawPaddle(x, y, color) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
        
        // Add inner highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x + 2, y + 2, PADDLE_WIDTH - 4, 10);
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
    
    function drawBall() {
        ctx.shadowColor = COLORS.ball;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.ball;
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
    
    function drawScores() {
        ctx.font = '32px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = COLORS.text;
        
        // Player score
        ctx.shadowColor = COLORS.paddle1;
        ctx.shadowBlur = 10;
        ctx.fillText(gameState.player.score.toString(), canvas.width / 4, 50);
        
        // AI score
        ctx.shadowColor = COLORS.paddle2;
        ctx.shadowBlur = 10;
        ctx.fillText(gameState.ai.score.toString(), (canvas.width / 4) * 3, 50);
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
    
    function showGameOver() {
        const finalScore = `${gameState.player.score} - ${gameState.ai.score}`;
        document.getElementById('final-score').textContent = finalScore;
        
        // Set result message
        let resultMessage = '';
        if (gameState.player.score > gameState.ai.score) {
            resultMessage = 'Vous avez gagné !';
        } else {
            resultMessage = 'Vous avez perdu !';
        }
        document.getElementById('game-result').textContent = resultMessage;
        
        // Show game over screen
        document.getElementById('game-over').style.display = 'block';
        
        // Save game stats
        saveGameStats();
    }
    
    function saveGameStats() {
        // Get current user
        const currentUser = getCurrentUser();
        if (!currentUser) return;
        
        // Update user game stats
        if (!currentUser.games) {
            currentUser.games = {};
        }
        
        if (!currentUser.games.pong) {
            currentUser.games.pong = {
                wins: 0,
                losses: 0,
                timesPlayed: 0,
                lastPlayed: null
            };
        }
        
        const pongStats = currentUser.games.pong;
        pongStats.timesPlayed++;
        pongStats.lastPlayed = new Date().toISOString();
        
        // Update wins/losses
        if (gameState.player.score > gameState.ai.score) {
            pongStats.wins++;
            // Give more coins for winning
            currentUser.coins = (currentUser.coins || 0) + 15;
        } else {
            pongStats.losses++;
            // Give fewer coins for losing
            currentUser.coins = (currentUser.coins || 0) + 5;
        }
        
        // Save updated user data
        localStorage.setItem('zoldgaming_current_user', JSON.stringify(currentUser));
        
        // Update all users list as well
        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsers(users);
        }
    }
    
    function restartGame() {
        document.getElementById('game-over').style.display = 'none';
        init();
    }
    
    function playSound(type) {
        // Sound would be implemented here
        // For now, just a placeholder for future sound effects
    }
});
