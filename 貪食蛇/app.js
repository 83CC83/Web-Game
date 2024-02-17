const canvas = document.getElementById("myCanvas");
// getContext()回傳drawing context，可以用來在canvas內畫圖
const ctx = canvas.getContext("2d");

const unit = 20;
const row = canvas.height / unit; // 320/20 = 16
const column = canvas.width / unit;

let snake = [];
// array中的每個元素都是一個物件
// 物件的工作是儲存身體的x,y座標
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    // console.log("畫果實");
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let newX;
    let newY;

    function checkOverlap(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (newX == snake[i].x && newY == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }
    // false 只做一次
    do {
      newX = Math.floor(Math.random() * column) * unit;
      newY = Math.floor(Math.random() * row) * unit;
      checkOverlap(newX, newY);
    } while (overlapping);

    this.x = newX;
    this.y = newY;
  }
}

// 初始設定
createSnake();
let myFruit = new Fruit();

window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e) {
  //   console.log(e);
  if (e.key == "ArrowRight" && d != "Left") {
    // console.log("你正在按向右鍵");
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    // console.log("你正在按向下鍵");
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    // console.log("你正在按向左鍵");
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    // console.log("你正在按向上鍵");
    d = "Up";
  }

  // 手速快可能產生的問題：
  // 一開始draw d = "Left", 接著先按 d = "Up", 再 d = "Right"

  // 每次按上下左右鍵，在下一幀被畫出來之前，不接受任何keydown事件
  // 防止連續按鍵導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}

let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;

function draw() {
  // 每次畫圖之前確認蛇有無咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return; // 不會再重畫，以下通通不執行
    }
  }

  //   console.log("正在執行...");
  // 背景全設定為黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 畫出果實
  myFruit.drawFruit();

  // 畫出蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white"; //外框顏色

    // 先檢查以穿牆
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // x, y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); // 實際畫出
    // 最外層
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // 以目前d的方向來決定蛇的下一幀要放在哪個座標
  let snakeX = snake[0].x; //snake[0] 是物件，snake[0].x 是number
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  // 更新頭部
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 確認蛇是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    // 重新選定一個新的果實隨機位置
    myFruit.pickALocation();
    // 更新分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
    document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
