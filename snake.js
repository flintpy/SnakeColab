class AdvancedSnakeGame {
    /**
     * Construct the snake game with initial settings
     * @param {*} difficulty - Difficulty level of the snake game
     */
    constructor(difficulty) {
        // Game's configurations
        this.config = {
            gridSize: 20,
            easySpeed: 200,
            mediumSpeed: 100,
            hardSpeed: 50,
            startingPoint: { x: 10, y: 10 },
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

        // Game's state
        this.state = {
            snake: [ this.config.startingPoint ],
            food: null,
            direction: 'right',
            score: this.config.startingScore,
        };

        // Game's environment
        this.env = {
            gameBoard: document.getElementById('game-board'),
            scoreBoard: document.getElementById('score'),
            difficulty: this.setDifficulty(difficulty),
        };

        this.env.interval = setInterval(() => this.tick(), this.env.difficulty);

        // Generate food after setting up all other things
        this.state.food = this.generateFood();

        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        this.render(); // Initial render
    }

    /**
     * Function to set difficulty of the game based on user preference
     * @param {*} difficulty - Difficulty level set by user, default to medium
     */
    setDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy': return this.config.easySpeed;
            case 'medium': return this.config.mediumSpeed;
            case 'hard': return this.config.hardSpeed;
            default: return this.config.mediumSpeed;
        }
    }

    /**
     * Function to generate food randomly inside the grid.
     */
    generateFood() {
        let newFood = {};
        do {
            newFood.x = Math.floor(Math.random() * this.config.gridSize);
            newFood.y = Math.floor(Math.random() * this.config.gridSize);
        } while (this.state.snake.some(part => part.x === newFood.x && part.y === newFood.y));
        return newFood;
    }

    /**
     * Function to move the snake according to its direction
     */
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

        // Check for snake collision
        this.checkCollision(newHead);

        this.state.snake.unshift(newHead);
        
        if(this.isFoodEaten(newHead)){
            this.updateScore();
            this.state.food = this.generateFood();
        } else {
            this.state.snake.pop();
        }
        
    }

    /**
     * Function to check if snake collides with itself or with the boundary
     * @param {*} head - Current head of the snake
     */
    checkCollision(head){
        if (this.state.snake.some(part => part.x === head.x && part.y === head.y)) {
            clearInterval(this.env.interval); // Game over if snake collides with itself
            alert('Game Over! Score: ' + this.state.score);
            // throw new Error('Game Over. Snake collided with itself.'); or any other preferred way to end the game
            return false;
        }
        return true;
    }

    /**
     * Function that will be called for every defined interval
     */
    tick() {
        this.moveSnake();
        this.render();
    }

    /**
     * Function to handle user inputs generated by keyboard
     * @param {*} event - Event generated by a keyboard
     */
    handleKeydown(event) {
        const newDirection = this.config.directionMap[event.key];
        const isNotOppositeDirection = newDirection !== this.config.oppositeDirections[this.state.direction];

        // Only allows to turn right or left 
        // Not allows to go in opposite direction straight away
        // Prevents direct reverse
        if (isNotOppositeDirection) {
            this.state.direction = newDirection;
        }
    }

    /**
     * Function to render the snake and food on game board
     */
    render() {
        this.env.gameBoard.innerHTML = '';

        // Render snake
        this.state.snake.forEach(part => this.renderElement(part, 'snake-part'));

        // Render food
        this.renderElement(this.state.food, 'food');
    }

    /**
     * Function to create and render game element (snake's part or food)
     * @param {*} element object that contains x and y position
     * @param {*} className class name to be added for the style
     */
    renderElement(element, className) {
        const newElement = document.createElement('div');
        newElement.style.left = `${element.x * 20}px`;
        newElement.style.top = `${element.y * 20}px`;
        newElement.classList.add(className);
        this.env.gameBoard.appendChild(newElement);
    }

    /**
     * Function to check if the food is eaten
     * @param {*} head coordinates of the head of snake
     * @returns boolean- true if food is eaten else false
     */
    isFoodEaten(head){
        return head.x === this.state.food.x && head.y === this.state.food.y;
    }

    /**
     * function to update score and update score in frontend
     */
    updateScore(){
        this.state.score += 10;
        this.env.scoreBoard.textContent = this.state.score;
    }
}

// Instantiating the game
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('start-button').addEventListener('click', () => {
        const difficulty = document.getElementById('difficulty').value;
        new AdvancedSnakeGame(difficulty);
    });
});
