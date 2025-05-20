// Tetris game implementation
document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('tetris-canvas');
    const ctx = canvas.getContext('2d');
    const nextPieceCanvas = document.getElementById('next-piece');
    const nextPieceCtx = nextPieceCanvas.getContext('2d');
    
    // Game constants
    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 20;
    const CELL_SIZE = canvas.width / GRID_WIDTH;
    const COLORS = [
        null,
        '#00FFFF', // Cyan - I
        '#0000FF', // Blue - J
        '#FF8800', // Orange - L
        '#FFFF00', // Yellow - O
        '#00FF00', // Green - S
        '#FF00FF', // Magenta - T
        '#FF0000'  // Red - Z
    ];
    
    // Add glow effect to colors
    const GLOW_COLORS = COLORS.map(color => 
        color ? `0 0 5px ${color}, 0 0 10px ${color}` : null
    );
    
    // Tetromino shapes
    const SHAPES = [
        null,
        // I
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        // J
        [
            [2, 0, 0],
            [2, 2, 2],
            [0, 0, 0]
        ],
        // L
        [
            [0, 0, 3],
            [3, 3, 3],
            [0, 0, 0]
        ],
        // O
        [
            [4, 4],
            [4, 4]
        ],
        // S
        [
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0]
        ],
        // T
        [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]
        ],
        // Z
        [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ]
    ];
    
    // Game variables
    let grid = createGrid();
    let score = 0;
    let level = 1;
    let lines = 0;
    let gameOver = false;
    let isPaused = false;
    let dropCounter = 0;
    let dropInterval = 1000; // Start with 1 second interval
    let lastTime = 0;
    let highScore = getHighScore();
    
    // Current and next piece
    let currentPiece = null;
    let nextPiece = null;
    
    // Create player
    let player = {
        position: {x: 0, y: 0},
        matrix: null,
        score: 0
    };
    
    // Initialize the game
    init();
    
    function init() {
        // Update UI
        document.getElementById('score').textContent = '0';
        document.getElementById('level').textContent = '1';
        document.getElementById('lines').textContent = '0';
        document.getElementById('high-score').textContent = highScore.toString();
        
        // Reset game variables
        grid = createGrid();
        score = 0;
        level = 1;
        lines = 0;
        gameOver = false;
        isPaused = false;
        dropCounter = 0;
        dropInterval = 1000;
        
        // Create first pieces
        createNewPiece();
        
        // Setup event listeners
        setupControls();
        
        // Start game loop
        requestAnimationFrame(update);
    }
    
    function createGrid() {
        // Create an empty grid
        const grid = [];
        for (let y = 0; y < GRID_HEIGHT; y++) {
            grid.push(new Array(GRID_WIDTH).fill(0));
        }
        return grid;
    }
    
    function createNewPiece() {
        // If there's a next piece, make it the current piece
        if (nextPiece) {
            player.matrix = nextPiece;
        } else {
            // For the first piece
            const pieceType = Math.floor(Math.random() * 7) + 1;
            player.matrix = SHAPES[pieceType];
        }
        
        // Generate next piece
        const nextPieceType = Math.floor(Math.random() * 7) + 1;
        nextPiece = SHAPES[nextPieceType];
        
        // Draw next piece preview
        drawNextPiece();
        
        // Position the piece at the top center
        player.position.y = 0;
        player.position.x = Math.floor(GRID_WIDTH / 2) - Math.floor(player.matrix[0].length / 2);
        
        // Check if game over (collision on spawn)
        if (checkCollision()) {
            gameOver = true;
            showGameOver();
        }
    }
    
    function drawNextPiece() {
        // Clear the canvas
        nextPieceCtx.fillStyle = '#000';
        nextPieceCtx.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
        
        // Center the piece in the preview canvas
        const offsetX = (nextPieceCanvas.width / 2) - (nextPiece[0].length * CELL_SIZE / 2);
        const offsetY = (nextPieceCanvas.height / 2) - (nextPiece.length * CELL_SIZE / 2);
        
        // Draw the piece
        drawMatrix(nextPiece, {x: offsetX / CELL_SIZE, y: offsetY / CELL_SIZE}, nextPieceCtx, CELL_SIZE / 1.5);
    }
    
    function drawMatrix(matrix, position, context, cellSize = CELL_SIZE) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    // Draw cell with glow effect
                    context.fillStyle = COLORS[value];
                    context.fillRect(
                        (position.x + x) * cellSize,
                        (position.y + y) * cellSize,
                        cellSize,
                        cellSize
                    );
                    
                    // Add inner cell detail
                    context.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    context.fillRect(
                        (position.x + x) * cellSize + 2,
                        (position.y + y) * cellSize + 2,
                        cellSize - 4,
                        cellSize / 3
                    );
                    
                    // Add glow effect
                    context.shadowColor = COLORS[value];
                    context.shadowBlur = 10;
                    context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                    context.strokeRect(
                        (position.x + x) * cellSize,
                        (position.y + y) * cellSize,
                        cellSize,
                        cellSize
                    );
                    context.shadowBlur = 0;
                }
            });
        });
    }
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        drawGrid();
        
        // Draw the grid with pieces
        drawMatrix(grid, {x: 0, y: 0}, ctx);
        
        // Draw the current piece
        if (!gameOver && player.matrix) {
            drawMatrix(player.matrix, player.position, ctx);
        }
    }
    
    function drawGrid() {
        // Draw grid lines
        ctx.strokeStyle = 'rgba(128, 128, 128, 0.2)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= GRID_WIDTH; x++) {
            ctx.beginPath();
            ctx.moveTo(x * CELL_SIZE, 0);
            ctx.lineTo(x * CELL_SIZE, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= GRID_HEIGHT; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * CELL_SIZE);
            ctx.lineTo(canvas.width, y * CELL_SIZE);
            ctx.stroke();
        }
    }
    
    function checkCollision() {
        const matrix = player.matrix;
        const pos = player.position;
        
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] !== 0 && // If there's a block in the tetromino
                    (grid[y + pos.y] === undefined || // If outside the grid vertically
                     grid[y + pos.y][x + pos.x] === undefined || // If outside the grid horizontally
                     grid[y + pos.y][x + pos.x] !== 0)) { // If there's a collision with existing blocks
                    return true;
                }
            }
        }
        return false;
    }
    
    function merge() {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    grid[y + player.position.y][x + player.position.x] = value;
                }
            });
        });
    }
    
    function moveLeft() {
        player.position.x--;
        if (checkCollision()) {
            player.position.x++;
        }
    }
    
    function moveRight() {
        player.position.x++;
        if (checkCollision()) {
            player.position.x--;
        }
    }
    
    function moveDown() {
        player.position.y++;
        if (checkCollision()) {
            player.position.y--;
            merge();
            clearLines();
            createNewPiece();
        }
        // Reset drop counter
        dropCounter = 0;
    }
    
    function hardDrop() {
        while (!checkCollision()) {
            player.position.y++;
        }
        player.position.y--;
        merge();
        clearLines();
        createNewPiece();
        dropCounter = 0;
    }
    
    function rotate() {
        const pos = player.position.x;
        let offset = 1;
        rotateMatrix(player.matrix);
        
        // Handle wall kicks
        while (checkCollision()) {
            player.position.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length) {
                rotateMatrix(player.matrix, -1);
                player.position.x = pos;
                return;
            }
        }
    }
    
    function rotateMatrix(matrix, dir = 1) {
        // Transpose the matrix
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < y; x++) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        
        // Reverse each row for clockwise, or each column for counter-clockwise
        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }
    
    function clearLines() {
        let linesCleared = 0;
        
        // Check each row from bottom to top
        for (let y = grid.length - 1; y >= 0; y--) {
            if (grid[y].every(cell => cell !== 0)) {
                // Create effect for line clear
                createLineClearEffect(y);
                
                // Remove the row and add a new empty one at the top
                const row = grid.splice(y, 1)[0];
                grid.unshift(new Array(GRID_WIDTH).fill(0));
                
                // Move the check position back up since we removed a row
                y++;
                
                // Count cleared lines
                linesCleared++;
            }
        }
        
        if (linesCleared > 0) {
            // Update score based on lines cleared
            updateScore(linesCleared);
            
            // Update lines counter
            lines += linesCleared;
            document.getElementById('lines').textContent = lines.toString();
            
            // Update level
            const newLevel = Math.floor(lines / 10) + 1;
            if (newLevel > level) {
                level = newLevel;
                document.getElementById('level').textContent = level.toString();
                // Increase speed with level
                dropInterval = Math.max(100, 1000 - (level - 1) * 100);
            }
        }
    }
    
    function createLineClearEffect(lineY) {
        // Flash effect for now (could be enhanced)
        ctx.fillStyle = 'white';
        ctx.fillRect(0, lineY * CELL_SIZE, canvas.width, CELL_SIZE);
    }
    
    function updateScore(linesCleared) {
        // Scoring system based on Tetris guidelines
        const points = [0, 100, 300, 500, 800];
        score += points[linesCleared] * level;
        
        // Update score display
        document.getElementById('score').textContent = score.toString();
        
        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            document.getElementById('high-score').textContent = highScore.toString();
            saveHighScore(highScore);
        }
    }
    
    function update(time = 0) {
        if (gameOver || isPaused) {
            return;
        }
        
        const deltaTime = time - lastTime;
        lastTime = time;
        
        // Increase drop counter
        dropCounter += deltaTime;
        
        // Move piece down when counter exceeds interval
        if (dropCounter > dropInterval) {
            moveDown();
        }
        
        // Draw the game
        draw();
        
        // Request next frame
        requestAnimationFrame(update);
    }
    
    function showGameOver() {
        document.getElementById('final-score').textContent = score.toString();
        document.getElementById('game-over').style.display = 'block';
        
        // Save game stats if user is logged in
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
        
        if (!currentUser.games.tetris) {
            currentUser.games.tetris = {
                highScore: 0,
                timesPlayed: 0,
                lastPlayed: null
            };
        }
        
        const tetrisStats = currentUser.games.tetris;
        tetrisStats.timesPlayed++;
        tetrisStats.lastPlayed = new Date().toISOString();
        
        if (score > tetrisStats.highScore) {
            tetrisStats.highScore = score;
        }
        
        // Add coins based on score
        const coinsEarned = Math.floor(score / 100);
        if (coinsEarned > 0) {
            currentUser.coins = (currentUser.coins || 0) + coinsEarned;
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
    
    function getHighScore() {
        // Try to get high score from current user
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.games && currentUser.games.tetris) {
            return currentUser.games.tetris.highScore || 0;
        }
        
        // Fall back to saved high score
        return parseInt(localStorage.getItem('tetris_high_score') || '0');
    }
    
    function saveHighScore(score) {
        localStorage.setItem('tetris_high_score', score.toString());
    }
    
    function setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', event => {
            if (gameOver) return;
            
            switch (event.key) {
                case 'ArrowLeft':
                    moveLeft();
                    break;
                case 'ArrowRight':
                    moveRight();
                    break;
                case 'ArrowDown':
                    moveDown();
                    break;
                case 'ArrowUp':
                    rotate();
                    break;
                case ' ':
                    hardDrop();
                    break;
                case 'p':
                    togglePause();
                    break;
            }
        });
        
        // Button controls
        document.querySelector('.left-btn').addEventListener('click', moveLeft);
        document.querySelector('.right-btn').addEventListener('click', moveRight);
        document.querySelector('.down-btn').addEventListener('click', moveDown);
        document.querySelector('.rotate-btn').addEventListener('click', rotate);
        document.querySelector('.drop-btn')?.addEventListener('click', hardDrop);
        
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', restartGame);
    }
    
    function togglePause() {
        isPaused = !isPaused;
        if (!isPaused) {
            lastTime = performance.now();
            requestAnimationFrame(update);
        }
    }
    
    function restartGame() {
        document.getElementById('game-over').style.display = 'none';
        init();
    }
});
