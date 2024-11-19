const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;
const canvasBoxes = canvasSize / box;

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let direction;
let food = {
    x: Math.floor(Math.random() * canvasBoxes) * box,
    y: Math.floor(Math.random() * canvasBoxes) * box,
};

let score = 0;
let previousScore = 0;
let gamePaused = false;
let game;

document.addEventListener("keydown", setDirection);

function setDirection(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode === 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (event.keyCode === 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode === 40 && direction !== "UP") {
        direction = "DOWN";
    } else if (event.keyCode === 48) {
        // Tecla "0" para pausar/retomar
        gamePaused = !gamePaused;
        if (gamePaused) {
            clearInterval(game);
            document.getElementById("message").innerText = "Jogo Pausado";
        } else {
            document.getElementById("message").innerText = "";
            game = setInterval(draw, 200);
        }
    }
}

function collision(newHead, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    if (gamePaused) return;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#00FF00" : "#FFFFFF";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * canvasBoxes) * box,
            y: Math.floor(Math.random() * canvasBoxes) * box,
        };
        score++;
        document.getElementById("score").innerText = "Pontuação: " + score * 10;
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvasSize ||
        snakeY >= canvasSize ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        document.getElementById("message").innerText =
            "Você perdeu! Pontuação final: " +
            score * 10 +
            ". Pontuação anterior: " +
            previousScore * 10;
        previousScore = score;
        score = 0;
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    snake.unshift(newHead);
}

game = setInterval(draw, 200); // Intervalo ajustado para 200 milissegundos
