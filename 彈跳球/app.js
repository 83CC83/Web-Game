const c = document.getElementById("myCanvas");
const canvasWidth = c.width;
const canvasHeight = c.height;
const ctx = c.getContext("2d");

let circleX = 160;
let circleY = 60;
let radius = 20;
let xSpeed = 20; // 20/1000
let ySpeed = 20;

let groundX = 100;
let groundY = 400;
let groundHeight = 20;

let brickArray = [];
let brickX = 50;
let brickY = 50;
let count = 0;

// min, max
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = brickX;
    this.height = brickY;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }
}
// let brick = new Brick(100, 100);
// 製作所有方塊
for (let i = 0; i < 10; i++) {
  let newX = getRandomArbitrary(0, (canvasWidth - brickX) / brickX) * brickX;
  let newY = getRandomArbitrary(0, (canvasHeight - brickY) / brickY) * brickY;
  let overlapping = false;
  do {
    if (brickArray.length != 0) {
      for (let i = 0; i < brickArray.length; i++) {
        if (brickArray[i].x == newX && brickArray[i].y == newY) {
          overlapping = true;
          newX =
            getRandomArbitrary(0, (canvasWidth - brickX) / brickX) * brickX;
          newY =
            getRandomArbitrary(0, (canvasHeight - brickY) / brickY) * brickY;
          break;
        } else {
          overlapping = false;
        }
      }
    }
  } while (overlapping);
  new Brick(newX, newY);
}

c.addEventListener("mousemove", (e) => {
  // console.log(e);
  groundX = e.clientX;
});

function drawCircle() {
  // console.log("drawing...");

  // 確認球是否有打到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circleX, circleY)) {
      // 打到
      count++;
      brick.visible = false;

      // 改變x,y方向速度，並且將方塊從brickArray中移除
      // 從上方或下方撞擊
      if (circleY >= brick.y + brick.height || circleY <= brick.y) {
        ySpeed *= -1;
      }
      // 從左方或右方撞擊
      if (circleX <= brick.x || circleX >= brick.x + brick.width) {
        xSpeed *= -1;
      }

      // brickArray.splice(index, 1); // O(n)，重新排列花時間
      // if (brickArray.length == 0) {
      //   alert("遊戲結束");
      //   clearInterval(game);
      // }
      if (count == 10) {
        alert("遊戲結束");
        clearInterval(game);
      }
    }
  });

  // 確認球是否打到橘色地板
  if (
    circleX >= groundX - radius &&
    circleX <= groundX + 200 + radius &&
    circleY >= groundY - radius &&
    circleY <= groundY + 20 + radius
  ) {
    // 施加彈力
    if (ySpeed > 0) {
      // 往下掉
      circleY -= 50; //不能太小
    } else {
      // 往上打到橘色地板
      circleY += 50;
    }
    ySpeed *= -1;
  }

  // 確認球有無打到邊界
  // 右邊
  if (circleX >= canvasWidth - radius) {
    xSpeed *= -1; // 越來越慢
  }
  // 左邊
  if (circleX <= radius) {
    xSpeed *= -1;
  }
  // 上面
  if (circleY <= radius) {
    ySpeed *= -1;
  }
  // 下面
  if (circleY >= canvasHeight - radius) {
    ySpeed *= -1;
  }

  // 更動圓的座標
  circleX += xSpeed;
  circleY += ySpeed;

  // 畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 畫出所有方塊
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick(); // 被打到的方塊就不會畫出來
    }
  });

  // 畫出可控制的地板
  ctx.fillStyle = "orange";
  ctx.fillRect(groundX, groundY, 200, groundHeight);

  // 畫出圓球
  // x, y, radius, startAngle, endAngle
  ctx.beginPath(); // create new path
  ctx.arc(circleX, circleY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game;
const b1 = document.getElementById("startBTN");
b1.addEventListener("click", () => {
  game = setInterval(drawCircle, 25);
});
const b2 = document.getElementById("stopBTN");
b2.addEventListener("click", () => {
  clearInterval(game);
  alert("遊戲暫停，若要繼續請按「開始」");
});
