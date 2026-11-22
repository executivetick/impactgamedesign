// Sample Game Lab game: shows how a games/gamelab/<Name>/ folder works.
// Delete this folder once real Game Lab games are in.
var paddle = createSprite(200, 370, 80, 14);
var ball = createSprite(200, 200, 16, 16);
ball.velocityX = 3;
ball.velocityY = -4;
var score = 0;
var over = false;

function draw() {
  background("#0B1F3A");

  if (!over) {
    if (keyDown("left")) paddle.x -= 7;
    if (keyDown("right")) paddle.x += 7;
    paddle.x = constrain(paddle.x, 40, 360);

    if (ball.x < 8 || ball.x > 392) ball.velocityX = -ball.velocityX;
    if (ball.y < 8) ball.velocityY = abs(ball.velocityY);
    if (ball.isTouching(paddle) && ball.velocityY > 0) {
      ball.velocityY = -abs(ball.velocityY) - 0.2;
      score = score + 1;
    }
    if (ball.y > 410) over = true;
  } else if (keyWentDown("space")) {
    ball.x = 200; ball.y = 200; ball.velocityX = 3; ball.velocityY = -4;
    score = 0; over = false;
  }

  fill("#FFFFFF");
  rect(paddle.x - 40, paddle.y - 7, 80, 14);
  fill("#C8102E");
  ellipse(ball.x, ball.y, 16, 16);

  fill("#FFFFFF");
  textSize(18);
  text("Score: " + score, 14, 28);
  if (over) {
    textSize(32);
    text("GAME OVER", 104, 190);
    textSize(16);
    text("Press Space to play again", 104, 220);
  }
}
