const board = document.getElementById("game-board");
const instrectionText = document.getElementById("instraction-text");
const instrectionText1 = document.getElementById("instraction-text1");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highscore");
const levels = document.getElementById("level");

const continueButton = document.getElementById("continue-btn");
const backButton = document.getElementById("back-btn");
let gridSize = 30;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = "right";
let isGameStarted = false;
let gameSpeedDeley = 400;
let highScore = 0;
let gameIntervalId;
let currentLevel = 0;
let level = [
    { gridSize: 30, gameSpeedDelay: 600, levelUpScore: 2 },
    { gridSize: 40, gameSpeedDelay: 400, levelUpScore: 20 },
    { gridSize: 50, gameSpeedDelay: 200, levelUpScore: 30 },
    { gridSize: 60, gameSpeedDelay: 100, levelUpScore: 40 }
];
let gameSpeedDelay = level[currentLevel].gameSpeedDelay;

document.addEventListener("keydown", hendleKeyPress);
continueButton.addEventListener("click", startGame);
backButton.addEventListener("click", goBack);

draw();
updateUI();

function draw() {
    board.innerHTML = ""
    drawSnake();
    drawFood();
    snakeScore();
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = creatElement("div", "snake");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);

    });

}

function creatElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}


function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;

}


function drawFood() {
    let foodElement = creatElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
}

function generateFood() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;

    return { x, y }

}



function move() {
    let head = { ...snake[0] };

    switch (direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        clearInterval(gameIntervalId);
        gameIntervalId = setInterval(() => {
            move();
            checkCollision();
            draw()
            snakeScore();
            if (snake.length - 1 === level[currentLevel].levelUpScore) {
                levelUp();
                updateLevelDisplay();
            }
        }, gameSpeedDeley);

    } else {
        snake.pop();
    }
}
continueButton.style.display = "none";
backButton.style.display = "none";
function startGame() {
    instrectionText1.style.display = "none";

    isGameStarted = true;
    instrectionText.style.display = "none";
    logo.style.display = "none";

    gameIntervalId = setInterval(() => {
        move();
        checkCollision()
        draw()
    }, gameSpeedDeley);
}

function hendleKeyPress(e) {

    if ((!isGameStarted && e.code === "Space") ||
        (!isGameStarted && e.key === " ")) {
        startGame();
    } else {
        switch (e.key) {
            case "ArrowUp":
                direction = "up"
                break;
            case "ArrowDown":
                direction = "down";
                break;
            case "ArrowLeft":
                direction = "left";
                break;
            case "ArrowRight":
                direction = "right";
                break;
        }
    }
}

function checkCollision() {
    let head = { ...snake[0] };
    if (head.x < 1 || head.x > gridSize ||
        head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }

    }


}

function resetGame() {
    stopGame();
    updateHighScore();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = "right";

    snakeScore();
}

function stopGame() {
    clearInterval(gameIntervalId);
    isGameStarted = false;
    logo.style.display = "block";
    instrectionText.style.display = "block"
}

function snakeScore() {
    let currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, "0")
}

function updateHighScore() {

    let curentScore = snake.length - 1;
    if (curentScore > highScore) {
        highScore = curentScore;
    }

    highScoreText.textContent = highScore.toString().padStart(3, "0");
    highScoreText.style.display = "block";
}


document.addEventListener("keydown", hendleKeyPress)

instrectionText.style.display = "block";
stopGame();
function levelUp() {
    instrectionText.style.display = "none";
    logo.style.display = "block";
    instrectionText1.style.display = "block";
    continueButton.style.display = "block";
    backButton.style.display = "block";
    clearInterval(gameIntervalId);
    currentLevel++;
    if (currentLevel < level.length) {
        gridSize = level[currentLevel].gridSize;
        gameSpeedDelay = level[currentLevel].gameSpeedDelay;
        clearInterval(gameIntervalId);
        gameIntervalId = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
        level.levelContent = `Level: ${currentLevel + 1}`;
    } else {
        alert("Congratulations! You've completed all level.");
        currentLevel = 0;
        gridSize = level[currentLevel].gridSize;
        gameSpeedDelay = level[currentLevel].gameSpeedDelay;
        snake = [{ x: 10, y: 10 }];
        food = generateFood();
        direction = "right";
        updateUI();
        draw();

        instrectionText.style.display = "none";
        logo.style.display = "block";

    }
}

function updateLevelDisplay() {
    document.getElementById("level").textContent = `Level: ${currentLevel + 1}`;
}

gridSize = level[currentLevel].gridSize;
gameSpeedDelay = level[currentLevel].gameSpeedDelay;



document.addEventListener("keydown", hendleKeyPress);
continueButton.addEventListener("click", startGame);
backButton.addEventListener("click", goBack);
function goBack() {
    if (isGameStarted) {
        stopGame();

        currentLevel = 0;
        gridSize = level[currentLevel].gridSize;
        gameSpeedDelay = level[currentLevel].gameSpeedDelay;
        snake = [{ x: 10, y: 10 }];
        food = generateFood();
        direction = "right";
        updateUI();
        draw();
        instrectionText.style.display = "block";
        logo.style.display = "block";
        instrectionText1.style.display = "none";
        continueButton.style.display = "none";
        backButton.style.display = "none";
    }
}

function updateUI() {
    score.textContent = `Score: ${getScore()}`;
    highScore.textContent = `High Score: ${highScore.toString().padStart(3, "0")}`;
    level.textContent = `Level: ${currentLevel + 1}`;
}

function getScore() {
    return (snake.length - 1).toString().padStart(3, "0");
}
