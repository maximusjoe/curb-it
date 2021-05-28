/*
Credits : https://www.youtube.com/channel/UC8n8ftV94ZU_DJLOLtrpORA
*/

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 16;

// load images

const ground = new Image();
ground.src = "img/ground.jpg";

const foodImg = new Image();
foodImg.src = "img/food.png";

const snakeImg = new Image();
snakeImg.src = "img/snake.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "sound/audio/dead.mp3";
eat.src = "sound/audio/eat.mp3";
up.src = "sound/audio/up.mp3";
right.src = "sound/audio/right.mp3";
left.src = "sound/audio/left.mp3";
down.src = "sound/audio/down.mp3";

// create the snake

let snake = [];

snake[0] = {
    x: 9 * box,
    y: 10 * box
};

// create the food

let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
}

// create the score var

let score = 0;

//control the snake

let d;

document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") {
        left.play();
        d = "LEFT";
    } else if (key == 38 && d != "DOWN") {
        d = "UP";
        up.play();
    } else if (key == 39 && d != "LEFT") {
        d = "RIGHT";
        right.play();
    } else if (key == 40 && d != "UP") {
        d = "DOWN";
        down.play();
    }
}

// cheack collision function
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// draw everything to the canvas

function draw() {

    ctx.drawImage(ground, 0, 0);

    for (let i = 0; i < snake.length; i++) {
        ctx.drawImage(snakeImg, snake[i].x, snake[i].y, box, box);

    }

    ctx.drawImage(foodImg, food.x, food.y);

    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // which direction
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // if the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        eat.play();
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        }
        // we don't remove the tail
    } else {
        // remove the tail
        snake.pop();
    }

    // add new Head

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    // game over

    if (snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collision(newHead, snake)) {
        clearInterval(game);
        dead.play();
        $(".reload").show();
    }

    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "22px Changa one";
    ctx.fillText(score, 2 * box, 1.6 * box);

    $(document).on('click', '.button-pad .button', function (e) {
        var e = jQuery.Event("keydown");
        if ($(this).hasClass('left-btn')) {
            left.play();
            d = "LEFT";
        } else if ($(this).hasClass('up-btn')) {
            d = "UP";
            up.play();
        } else if ($(this).hasClass('right-btn')) {
            d = "RIGHT";
            right.play();
        } else if ($(this).hasClass('down-btn')) {
            d = "DOWN";
            down.play();
        }
        $(document).trigger(e);
    });

}

// call draw function every 100 ms

let game = setInterval(draw, 100);

$(".reload").hide();

window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);