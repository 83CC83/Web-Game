const canvas = document.getElementById("myCanvas1");
const ctx1 = canvas.getContext("2d");
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

let snake = [];
function createSnake() {
  snake[0] = {
    x: 80,
    y: 100,
  };
  snake[1] = {
    x: 60,
    y: 100,
  };
  snake[2] = {
    x: 40,
    y: 100,
  };
  snake[3] = {
    x: 20,
    y: 100,
  };
}
createSnake();

function draw() {
  ctx1.fillStyle = "black";
  ctx1.fillRect(0, 0, canvas.width, canvas.height);
  ctx1.fillStyle = "yellow";
  ctx1.fillRect(150, 200, unit, unit);

  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx1.fillStyle = "lightgreen";
    } else {
      ctx1.fillStyle = "lightblue";
    }
    ctx1.strokeStyle = "white";

    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    ctx1.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx1.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  snakeX += unit;
  let newHead = {
    x: snakeX,
    y: snakeY,
  };
  snake.pop();
  snake.unshift(newHead);
}
let myGame1 = setInterval(draw, 100);

const c = document.getElementById("myCanvas2");
const canvasWidth = c.width;
const canvasHeight = c.height;
const ctx2 = c.getContext("2d");

let circleX = 160;
let circleY = 60;
let radius = 20;
let xSpeed = 20; // 20/1000
let ySpeed = 20;
let groundX = 100;
let groundY = 230;
let groundHeight = 15;

function drawCircle() {
  // 地板
  if (
    circleX >= groundX - radius &&
    circleX <= groundX + 150 + radius &&
    circleY >= groundY - radius &&
    circleY <= groundY + 15 + radius
  ) {
    if (ySpeed > 0) {
      circleY -= 50;
    } else {
      circleY += 50;
    }
    ySpeed *= -1;
  }

  // 邊界
  if (circleX >= canvasWidth - radius) {
    xSpeed *= -1;
  }
  if (circleX <= radius) {
    xSpeed *= -1;
  }
  if (circleY <= radius) {
    ySpeed *= -1;
  }
  if (circleY >= canvasHeight - radius) {
    ySpeed *= -1;
  }

  circleX += xSpeed;
  circleY += ySpeed;

  ctx2.fillStyle = "black";
  ctx2.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx2.fillStyle = "orange";
  ctx2.fillRect(groundX, groundY, 150, groundHeight);

  ctx2.fillStyle = "lightgreen";
  ctx2.strokeStyle = "white";
  ctx2.fillRect(300, 230, 50, 50);
  ctx2.strokeRect(300, 230, 50, 50);

  ctx2.beginPath();
  ctx2.arc(circleX, circleY, radius, 0, 2 * Math.PI);
  ctx2.stroke();
  ctx2.fillStyle = "yellow";
  ctx2.fill();
}
let myGame2 = setInterval(drawCircle, 25);
