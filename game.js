class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('scoreValue');
        this.startButton = document.getElementById('startButton');
        
        // Grid settings
        this.gridSize = 12;
        
        // Game state
        this.snake = [];
        this.food = null;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.isGameOver = false;
        
        // Color palette
        this.colors = {
            snake: [
                '#2E7BBF', '#3A8DBA', '#2D8286',  // Cool tones
                '#6D896D', '#838145', '#A08B48',  // Neutral tones
                '#A498C1', '#D59C94', '#E8B3B3',  // Pastel tones
                '#E26E34', '#D24531', '#B7302E',  // Warm tones
                '#573746', '#703C3B', '#8C413D'   // Dark tones
            ],
            food: '#E0302F',
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
        
        // Redraw the game if it's running
        if (!this.isGameOver) {
            this.draw();
        }
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.startButton.addEventListener('click', () => this.startGame());
        
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
        this.scoreElement.textContent = this.score;
        this.isGameOver = false;
        this.startButton.disabled = true;
        
        // Generate initial food
        this.generateFood();
        
        // Start game loop
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), 150);
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        
        this.food = food;
    }
    
    update() {
        if (this.isGameOver) return;
        
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
        
        // Check for self collision only
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check if food is eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            this.generateFood();
        } else {
            this.snake.pop();
        }
        
        this.draw();
    }
    
    checkCollision(head) {
        // Only check for self collision now
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            const color = this.colors.snake[index % this.colors.snake.length];
            this.drawPolygon(segment.x, segment.y, color);
        });
        
        // Draw food
        this.drawPolygon(this.food.x, this.food.y, this.colors.food);
    }
    
    drawPolygon(x, y, color) {
        const size = this.tileSize;
        const centerX = x * size + size / 2;
        const centerY = y * size + size / 2;
        const radius = size * 0.35;
        
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const px = centerX + radius * Math.cos(angle);
            const py = centerY + radius * Math.sin(angle);
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.stroke();
    }
    
    gameOver() {
        this.isGameOver = true;
        clearInterval(this.gameLoop);
        this.startButton.disabled = false;
        this.startButton.textContent = 'Play Again';
        
        // Draw game over message
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#E8B3B3';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
    }
}

// Initialize game when the page loads
window.addEventListener('load', () => {
    new SnakeGame();
}); 