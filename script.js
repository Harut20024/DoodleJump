let doodler;
let gap;
let platforms = [];
let score = 0;
let doodleLeftImg,
  doodleRigthImg,
  doodleJumpImg,
  platformImg,
  monsterImg1,
  monsterImg2,
  jetImg,
  doodleInJet;
let backgraundImg;
let speed = 5;
let jumpCount = 0;
let startY;
let goingLeft = true;
let MonstrIn = false;
let MonsterArr = [];
let isJumping = false;
let balls = [];
let lastShotTime = 0;
let doodlerJetOn = false;
let audioContextStarted = false;
let jumpSound, jetSound, monsterSound, looseSound, shootSound;
let gameStarted = false;

function preload() {
  monsterImg1 = loadImage("photos/monsters/1.png");
  jetImg = loadImage("photos/jet.png");
  doodleInJet = loadImage("photos/doodler-jet.png");
  monsterImg2 = loadImage("photos/monsters/2.png");
  backgraundImg = loadImage("photos/fone.jpg");
  doodleLeftImg = loadImage("photos/doodler-left.png");
  doodleRigthImg = loadImage("photos/doodler-right.png");
  platformImg = loadImage("photos/platform.png");
  doodleJumpImg = loadImage("photos/doodle-jump.png");
  MonsterArr = [monsterImg1, monsterImg2];

  //sounds
  jumpSound = loadSound("sounds/jump.mp3");
  jetSound = loadSound("sounds/jetpack.mp3");
  monsterSound = loadSound("sounds/monster.mp3");
  shootSound = loadSound("sounds/shoot.mp3");
  looseSound = loadSound("sounds/loose.mp3");
}

function setup() {
  getAudioContext().suspend();
  let canvas = createCanvas(532, height / 1.01);
  if (canvas.mousePressed) canvas.mousePressed(startAudioContext);
  else {
    alert("hello");
  }
  doodler = new Doodle(width / 2, height - 50, doodleLeftImg, doodleRigthImg);

  let firstPlatformY = doodler.position.y + doodler.size / 2;
  let platformCount = 6;
  gap = height / platformCount;

  for (let i = 1; i <= platformCount; i++) {
    platforms.push(
      new Platform(random(width - 90), firstPlatformY - i * gap, platformImg)
    );
  }
  balls = [];
  startY = height / 1.2 - doodler.position.y;
}

function draw() {
  if (!gameStarted) {
    background(255);
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Click to start", width / 2, height / 2);
  } else {
    let targetY = height * 1.4;
    let currentDoodlerY = doodler.position.y;
    let transY = targetY - currentDoodlerY;

    transY = max(transY, -currentDoodlerY); 
    transY = min(transY, height - currentDoodlerY - doodler.size);
    translate(0, transY);
    background(backgraundImg);

    doodler.update(platforms);
    doodler.show();

    while (
      platforms.length < 6 ||
      platforms[platforms.length - 1].y > -transY
    ) {
      let newPlatformY =
        platforms.length === 0
          ? height
          : platforms[platforms.length - 1].y - gap;

      let randNum = Math.floor(Math.random() * 14);
      let randNumJet = Math.floor(Math.random() * 24);
      let randNumforMonster = Math.floor(Math.random() * 2);

      if (randNum === 1) {
        platforms.push(
          new Platform(
            random(width - 90),
            newPlatformY,
            platformImg,
            true,
            MonsterArr[randNumforMonster],
            false
          )
        );
      } else if (randNumJet === 1 && randNum !== 1) {
        platforms.push(
          new Platform(
            random(width - 90),
            newPlatformY,
            platformImg,
            false,
            null,
            true
          )
        );
      } else {
        platforms.push(
          new Platform(
            random(width - 90),
            newPlatformY,
            platformImg,
            false,
            null,
            false
          )
        );
      }
    }

    for (let platform of platforms) {
      platform.draw();
    }

    let platformIndex = 0;
    while (platformIndex < platforms.length) {
      let platform = platforms[platformIndex];
      if (platform.y > doodler.position.y + 800) {
        platforms.splice(platformIndex, 1);
        score++;
      } else {
        platformIndex++;
      }
    }

    if (platforms[0].y + 400 < doodler.position.y) {
      if (!looseSound.isPlaying()) looseSound.play();
      resetMatrix();
      fill(255, 0, 0);
      textSize(50);
      textAlign(CENTER, CENTER);
      text(
        `You Lose!
    your score is ${score}`,
        width / 2,
        height / 2
      );
      noLoop();
      setTimeout(restartGame, 2000);
      return;
    }
    if (transY <= startY + 300) {
      isJumping = false;
      fill(0, 150, 0);
      rect(0, height, width, 100);
      jumpCount = 0;
    }

    if (jumpCount <= 15 && (mouseIsPressed || keyIsDown(UP_ARROW))) {
      if (!jumpSound.isPlaying()) jumpSound.play();
      jumpCount++;
      isJumping = true;
      doodler.jump();
    }
    if (keyIsDown(LEFT_ARROW)) {
      isJumping = false;
      doodler.move("left", speed);
      goingLeft = true;
    } else if (keyIsDown(RIGHT_ARROW)) {
      isJumping = false;
      doodler.move("right", speed);
      goingLeft = false;
    }
    let currentTime = millis();

    if (
      keyIsDown(32) &&
      currentTime - lastShotTime > 1000 &&
      !doodler.isFlying
    ) {
      if (!shootSound.isPlaying()) shootSound.play();
      lastShotTime = currentTime;
      let newBall = new Ball(
        doodler.position.x,
        doodler.position.y,
        goingLeft,
        isJumping
      );
      balls.push(newBall);
    }

    for (let i = balls.length - 1; i >= 0; i--) {
      let ball = balls[i];
      balls[i].update();
      balls[i].show();

      for (let platform of platforms) {
        if (isColliding(ball, platform)) {
          if (platform.monsterIs === true) {
            if (!monsterSound.isPlaying()) monsterSound.play();
            balls.splice(i, 1);
            platform.monsterIs = false;
          }
        }
      }

      if (
        balls[i] &&
        (balls[i].position.y < -transY ||
          balls[i].position.x > width ||
          balls[i].position.x < 0)
      ) {
        balls.splice(i, 1);
      }
    }
    resetMatrix();

    push();
    fill(255, 255, 255);
    textSize(30);
    textAlign(CENTER, TOP);
    text(`SCORE IS: ${score}`, width / 2, 50);
    pop();
  }
}

function restartGame() {
  score = 0;
  platforms = [];
  for (let i = 1; i <= 6; i++) {
    let randNum = Math.floor(Math.random() * 7);
    if (randNum === 1)
      platforms.push(
        new Platform(
          random(width - 90),
          height - i * gap,
          platformImg,
          true,
          monsterImg1
        )
      );
    else
      platforms.push(
        new Platform(
          random(width - 90),
          height - i * gap,
          platformImg,
          false,
          monsterImg1
        )
      );
  }
  doodler = new Doodle(width / 2, height - 50, doodleLeftImg, doodleRigthImg);

  loop();
}

function isColliding(ball, platform) {
  let withinXBounds =
    ball.position.x > platform.x &&
    ball.position.x < platform.x + platform.width;
  let withinYBounds =
    ball.position.y + ball.size / 2 + 50 > platform.y &&
    ball.position.y - ball.size / 2 - 50 < platform.y + platform.height;

  return withinXBounds && withinYBounds;
}

function startAudioContext() {
  if (getAudioContext().state !== "running") {
    getAudioContext()
      .resume()
      .then(() => {
        console.log("Audio Context resumed!");
        audioContextStarted = true;
      })
      .catch((e) => {
        console.error("Error resuming audio context", e);
      });
  }
}

function mousePressed() {
  if (!gameStarted) {
    userStartAudio(); // Resume audio context
    gameStarted = true;
  }
}
