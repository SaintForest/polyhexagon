class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('scoreValue');
        this.startButton = document.getElementById('startButton');
        this.aiButton = document.getElementById('aiButton');
        this.gameOverMessage = document.querySelector('.game-over-message');
        
        // Initialize logo handler
        this.logoHandler = new LogoHandler();
        
        // Grid settings
        this.gridSize = 16;
        
        // Game state
        this.snake = [];
        this.food = { x: 0, y: 0, color: null };  // Added color property
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.isGameOver = false;
        this.isAIMode = false;
        this.aiEnabledDuringGame = false;
        
        // Color palette for snake
        this.colors = {
            snake: [
                '#2E7BBF', '#3A8DBA', '#2D8286',  // Cool tones
                '#6D896D', '#838145', '#A08B48',  // Neutral tones
                '#A498C1', '#D59C94', '#E8B3B3',  // Pastel tones
                '#E26E34', '#D24531', '#B7302E',  // Warm tones
                '#573746', '#703C3B', '#8C413D'   // Dark tones
            ],
            background: 'rgba(0, 0, 0, 0.2)'
        };
        
        this.setupEventListeners();
        this.resizeCanvas();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Prevent default touch behavior
        document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }
    
    resizeCanvas() {
        // Calculate the maximum size that fits in the viewport
        const maxWidth = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.8);
        const size = Math.floor(maxWidth / this.gridSize) * this.gridSize;
        
        this.canvas.width = size;
        this.canvas.height = size;
        this.tileSize = size / this.gridSize;
        
        // Only draw if the game is running
        if (this.gameLoop) {
            this.draw();
        }
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.startButton.addEventListener('click', () => this.startGame());
        this.aiButton.addEventListener('click', () => this.toggleAI());
        
        // Mobile controls
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const upBtn = document.getElementById('upBtn');
        const downBtn = document.getElementById('downBtn');
        
        // Touch events for mobile buttons
        leftBtn.addEventListener('touchstart', () => this.handleDirection('left'));
        rightBtn.addEventListener('touchstart', () => this.handleDirection('right'));
        upBtn.addEventListener('touchstart', () => this.handleDirection('up'));
        downBtn.addEventListener('touchstart', () => this.handleDirection('down'));
        
        // Click events for mobile buttons
        leftBtn.addEventListener('click', () => this.handleDirection('left'));
        rightBtn.addEventListener('click', () => this.handleDirection('right'));
        upBtn.addEventListener('click', () => this.handleDirection('up'));
        downBtn.addEventListener('click', () => this.handleDirection('down'));
    }
    
    handleDirection(newDirection) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        
        if (opposites[newDirection] !== this.direction) {
            this.nextDirection = newDirection;
        }
    }
    
    handleKeyPress(e) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };
        
        const newDirection = keyMap[e.key];
        if (!newDirection) return;
        
        this.handleDirection(newDirection);
    }
    
    startGame() {
        // Reset game state
        this.snake = [
            { x: 2, y: 2 },
            { x: 1, y: 2 },
            { x: 0, y: 2 }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.aiEnabledDuringGame = false;
        if (this.gameOverMessage) {
            this.gameOverMessage.style.display = 'none';
        }
        this.isGameOver = false;
        this.startButton.disabled = true;
        
        // Reset logo handler
        this.logoHandler.reset();
        
        // Reset canvas style
        this.canvas.style.border = '2px solid #E26E34';
        this.canvas.style.boxShadow = '0 0 15px rgba(226, 110, 52, 0.2)';
        
        // Generate initial food
        this.generateFood();
        
        // Start game loop
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), 120);

        // Update score display based on initial AI mode
        this.updateScoreDisplay();
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        
        this.food = {
            ...food,
            color: this.logoHandler.getNextFoodColor()
        };
    }
    
    toggleAI() {
        this.isAIMode = !this.isAIMode;
        this.aiButton.classList.toggle('active', this.isAIMode);
        
        // If game is running, mark that AI was enabled during gameplay
        if (this.gameLoop && !this.isGameOver) {
            this.aiEnabledDuringGame = true;
        }
        
        // Update score display
        this.updateScoreDisplay();
        
        // If game is not running, start it automatically
        if (this.isAIMode && !this.gameLoop) {
            this.startGame();
        }
    }
    
    findPathToFood() {
        const head = this.snake[0];
        const possibleMoves = [
            { dir: 'up', x: head.x, y: (head.y - 1 + this.gridSize) % this.gridSize },
            { dir: 'down', x: head.x, y: (head.y + 1) % this.gridSize },
            { dir: 'left', x: (head.x - 1 + this.gridSize) % this.gridSize, y: head.y },
            { dir: 'right', x: (head.x + 1) % this.gridSize, y: head.y }
        ];

        // Filter out moves that would cause immediate collision
        const safeMoves = possibleMoves.filter(move => {
            // Check for immediate collision with snake body
            if (this.snake.some(segment => segment.x === move.x && segment.y === move.y)) {
                return false;
            }

            // Check if this move would trap the snake
            const futureSnake = [
                { x: move.x, y: move.y },
                ...this.snake.slice(0, -1)
            ];
            
            // Check if there's a path to the food after this move
            const canReachFood = this.hasPathToFood(move.x, move.y, futureSnake);
            return canReachFood;
        });

        if (safeMoves.length === 0) return null;

        // Find the move that gets us closest to the food
        let bestMove = null;
        let minDistance = Infinity;

        for (const move of safeMoves) {
            const distance = Math.abs(move.x - this.food.x) + Math.abs(move.y - this.food.y);
            if (distance < minDistance) {
                minDistance = distance;
                bestMove = move;
            }
        }

        return bestMove ? bestMove.dir : null;
    }

    hasPathToFood(startX, startY, snake) {
        const visited = new Set();
        const queue = [{ x: startX, y: startY }];
        visited.add(`${startX},${startY}`);

        while (queue.length > 0) {
            const current = queue.shift();
            
            // If we reached the food, we found a path
            if (current.x === this.food.x && current.y === this.food.y) {
                return true;
            }

            // Check all possible moves
            const moves = [
                { x: current.x, y: (current.y - 1 + this.gridSize) % this.gridSize },
                { x: current.x, y: (current.y + 1) % this.gridSize },
                { x: (current.x - 1 + this.gridSize) % this.gridSize, y: current.y },
                { x: (current.x + 1) % this.gridSize, y: current.y }
            ];

            for (const move of moves) {
                const key = `${move.x},${move.y}`;
                
                // Skip if already visited or if it's part of the snake
                if (visited.has(key) || snake.some(segment => segment.x === move.x && segment.y === move.y)) {
                    continue;
                }

                visited.add(key);
                queue.push(move);
            }
        }

        return false;
    }
    
    drawPolygon(x, y, color, isHead = false) {
        const size = this.tileSize;
        const centerX = x * size + size / 2;
        const centerY = y * size + size / 2;
        const radius = size * 0.45;
        
        this.ctx.beginPath();
        // Draw a square
        this.ctx.moveTo(centerX - radius, centerY - radius);
        this.ctx.lineTo(centerX + radius, centerY - radius);
        this.ctx.lineTo(centerX + radius, centerY + radius);
        this.ctx.lineTo(centerX - radius, centerY + radius);
        this.ctx.closePath();
        
        this.ctx.fillStyle = color;
        this.ctx.fill();
        
        // Draw different outlines for head and body
        if (isHead) {
            this.ctx.strokeStyle = '#00FFFF'; // Bright cyan/neon blue for head
            this.ctx.lineWidth = 2; // Slightly thicker line for head
        } else {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.lineWidth = 1;
        }
        this.ctx.stroke();
    }
    
    drawFood() {
        const size = this.tileSize;
        const centerX = this.food.x * size + size / 2;
        const centerY = this.food.y * size + size / 2;
        const radius = size * 0.45;
        
        // Draw the food color
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - radius, centerY - radius);
        this.ctx.lineTo(centerX + radius, centerY - radius);
        this.ctx.lineTo(centerX + radius, centerY + radius);
        this.ctx.lineTo(centerX - radius, centerY + radius);
        this.ctx.closePath();
        
        this.ctx.fillStyle = this.food.color;
        this.ctx.fill();
        
        // Add neon glow effect
        this.ctx.shadowColor = '#ff0000';
        this.ctx.shadowBlur = 15;
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 10;
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        this.ctx.shadowColor = '#ffff00';
        this.ctx.shadowBlur = 20;
        this.ctx.strokeStyle = '#ffff00';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
    }
    
    draw() {
        // Clear the canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.snake.forEach((segment, index) => {
            const color = this.colors.snake[index % this.colors.snake.length];
            this.drawPolygon(segment.x, segment.y, color, index === 0);
        });

        // Draw food with neon effect
        this.drawFood();
    }
    
    gameOver() {
        this.isGameOver = true;
        clearInterval(this.gameLoop);
        this.startButton.disabled = false;
        this.startButton.textContent = 'Play Again';
        if (this.gameOverMessage) {
            this.gameOverMessage.style.display = 'block';
            this.gameOverMessage.textContent = 'Game Over!';
        }
        this.canvas.style.borderColor = '#E26E34';
        this.canvas.style.boxShadow = '0 0 20px rgba(226, 110, 52, 0.3)';
        this.draw();

        // Reset AI mode and score display
        this.isAIMode = false;
        this.aiButton.classList.remove('active');
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        const scoreLabel = document.querySelector('.score');
        const scoreValue = document.getElementById('scoreValue');
        if (this.aiEnabledDuringGame || this.isAIMode) {
            scoreLabel.innerHTML = 'Score(AI): <span id="scoreValue">' + this.score + '</span>';
        } else {
            scoreLabel.innerHTML = 'Score: <span id="scoreValue">' + this.score + '</span>';
        }
    }

    update() {
        if (this.isGameOver) return;
        
        if (this.isAIMode) {
            const aiMove = this.findPathToFood();
            if (aiMove) {
                this.handleDirection(aiMove);
            }
        }
        
        this.direction = this.nextDirection;
        const head = { ...this.snake[0] };
        
        // Update head position
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // Wrap around the edges
        head.x = (head.x + this.gridSize) % this.gridSize;
        head.y = (head.y + this.gridSize) % this.gridSize;
        
        // Check for self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check if food is eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScoreDisplay();
            this.logoHandler.revealColor(this.food.color);
            this.generateFood();
        } else {
            this.snake.pop();
        }
        
        this.draw();
    }
}

// Initialize game when the page loads
window.addEventListener('load', () => {
    new SnakeGame();
}); 