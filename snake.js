class SnakeGame {
    constructor(difficulty) {
        this.gridSize = 20;
        this.snake = [{ x: 10, y: 10 }];
        this.food = this.generateFood();
        this.direction = 'right';
        this.gameBoard = document.getElementById('game-board');
        this.scoreBoard = document.getElementById('score');
        this.difficulty = this.setDifficulty(difficulty);
        this.score = 0;
        this.interval = setInterval(() => this.tick(), this.difficulty);
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.render(); // Initial render
    }

    setDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy': return 200;
            case 'medium': return 100;
            case 'hard': return 50;
            default: return 100;
        }
    }

    generateFood() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.gridSize);
            y = Math.floor(Math.random() * this.gridSize);
        } while (this.snake.some(part => part.x === x && part.y === y));
        return { x, y };
    }

    move() {
        const head = { ...this.snake[0] };
        switch (this.direction) {
            case 'left': head.x = (head.x - 1 + this.gridSize) % this.gridSize; break;
            case 'right': head.x = (head.x + 1) % this.gridSize; break;
            case 'up': head.y = (head.y - 1 + this.gridSize) % this.gridSize; break;
            case 'down': head.y = (head.y + 1) % this.gridSize; break;
        }

        if (this.snake.some(part => part.x === head.x && part.y === head.y)) {
            clearInterval(this.interval); // Game over if snake collides with itself
            alert('Game Over! Score: ' + this.score);
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreBoard.textContent = this.score;
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }

    tick() {
        this.move();
        this.render();
    }

    handleKeydown(event) {
        const oppositeDirections = {
            'left': 'right',
            'right': 'left',
            'up': 'down',
            'down': 'up'
        };
        const newDirection = event.key.replace('Arrow', '').toLowerCase();
        if (newDirection !== oppositeDirections[this.direction]) {
            this.direction = newDirection;
        }
    }

    render() {
        this.gameBoard.innerHTML = '';

        // Render snake
        this.snake.forEach(part => {
            const snakePartElement = document.createElement('div');
            snakePartElement.style.left = part.x * 20 + 'px';
            snakePartElement.style.top = part.y * 20 + 'px';
            snakePartElement.className = 'snake-part';
            this.gameBoard.appendChild(snakePartElement);
        });

        // Render food
        const foodElement = document.createElement('div');
        foodElement.style.left = this.food.x * 20 + 'px';
        foodElement.style.top = this.food.y * 20 + 'px';
        foodElement.className = 'food';
        this.gameBoard.appendChild(foodElement);
    }
}
