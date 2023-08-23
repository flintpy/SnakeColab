// Instantiating the game 
document.getElementById('start-button').addEventListener('click', () => {
    const difficulty = document.getElementById('difficulty').value;
    new AdvancedSnakeGame(difficulty, 'game-board');
});

class AdvancedSnakeGame {
    constructor(difficulty, canvasId = 'game-board') {
    this.canvasSize = {
        width: canvasElement.width,
        height: canvasElement.height
    };  
            this.config = {
            gridSize: 20,
            easySpeed: 200,
            mediumSpeed: 100,
            hardSpeed: 50,
            // Reset startingPoint for canvas 
            startingPoint: { x: 0, y: 0 },
            startingScore: 0,
            directionMap: {
                ArrowLeft: 'left',
                ArrowRight: 'right',
                ArrowUp: 'up',
                ArrowDown: 'down'
            },
            oppositeDirections: {
                'left': 'right',
                'right': 'left',
                'up': 'down',
                'down': 'up'
            }
        };

        this.state = {
        direction: this.config.directionMap.ArrowRight,
        snake: [this.config.startingPoint],
        direction: 'right',
        score: this.config.startingScore,
        food: null,   
    };

        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');

        this.env = {
            scoreBoard: document.getElementById('score'),
            difficulty: this.setDifficulty(difficulty),
        }

        this.env.interval = setInterval(() => this.tick(), this.env.difficulty);

        this.state.food = this.generateFood();

        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        this.render(); 
    }
    
    setDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy': return this.config.easySpeed;
            case 'medium': return this.config.mediumSpeed;
            case 'hard': return this.config.hardSpeed;
            default: return this.config.mediumSpeed;
        }
    }

    generateFood() {
                let newFood = {};
        do {
            newFood.x = Math.floor(Math.random() * this.config.gridSize);
            newFood.y = Math.floor(Math.random() * this.config.gridSize);
        } while (this.state.snake.some(part => part.x === newFood.x && part.y === newFood.y));
        return newFood;
    }

    moveSnake() {
        const newHead = { ...this.state.snake[0] };
        switch (this.state.direction) {
            case 'left': 
                newHead.x = (newHead.x - 1 + this.config.gridSize) % this.config.gridSize; 
                break;
            case 'right': 
                newHead.x = (newHead.x + 1) % this.config.gridSize; 
                break;
            case 'up':
                newHead.y = (newHead.y - 1 + this.config.gridSize) % this.config.gridSize;
                break;
            case 'down': 
                newHead.y = (newHead.y + 1) % this.config.gridSize; 
                break;
    }

    this.state.snake.unshift(newHead);
        
    checkCollision(head){
        if (this.state.snake.some(part => part.x === head.x && part.y === head.y)) {
            clearInterval(this.env.interval); // Game over if snake collides with itself
            alert('Game Over! Score: ' + this.state.score);
            // throw new Error('Game Over. Snake collided with itself.'); or any other preferred way to end the game
            return false;
        }
        return true;
    }

    tick() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.moveSnake();
        this.render();
    }
    
    handleKeydown(event) {
        const newDirection = this.config.directionMap[event.key];
        const isNotOppositeDirection = newDirection !== this.config.oppositeDirections[this.state.direction];

        if (isNotOppositeDirection && newDirection) {
            this.state.direction = newDirection;
        }
    }
    
    isFoodEaten(head){
        return head.x === this.state.food.x && head.y === this.state.food.y;
    }

    render() {
        this.context.fillStyle = 'green';
        this.context.fillRect(this.state.snake[0].x, this.state.snake[0].y, 10, 10);
        
        // Additional canvas context settings for our food
        this.context.fillStyle = 'red';
        this.context.fillRect(this.state.food.x, this.state.food.y, 10, 10);
    }
    
    updateScore(){
         this.state.score += 10;
        this.env.scoreBoard.textContent = this.state.score;
    }  
}


// Instantiating the game 
document.getElementById('start-button').addEventListener('click', () => {
    const difficulty = document.getElementById('difficulty').value;
    // pass our canvas id 
    new AdvancedSnakeGame(difficulty, 'gameBoard');
});
