let doodler;
let gap;
let platforms = [];
let score = 0;
let doodleLeftImg, doodleRigthImg, platformImg;
let backgraundImg;
let speed = 5;
let jumpCount = 0;
let startY
let goingLeft = true

function preload() {
    backgraundImg = loadImage('photos/fone.jpg');
    doodleLeftImg = loadImage('photos/doodler-left.png');
    doodleRigthImg = loadImage('photos/doodler-right.png');
    platformImg = loadImage('photos/platform.png');
}

function setup() {
    createCanvas(532, height/1.01);
    doodler = new Doodle(width / 2, height - 50, doodleLeftImg, doodleRigthImg);

    let firstPlatformY = doodler.position.y + doodler.size / 2;
    let platformCount = 6;
    gap = height / platformCount;

    for (let i = 1; i <= platformCount; i++) {
        platforms.push(new Platform(random(width - 90), firstPlatformY - i * gap, platformImg));
    }

    startY = height / 1.2 - doodler.position.y;
}




function draw() {
    let transY = height / 1.2 - doodler.position.y;
    translate(0, transY);
    image(backgraundImg, 0, -transY);

    doodler.update(platforms);
    doodler.show();

    while (platforms.length < 6 || platforms[platforms.length - 1].y > -transY) {
        let newPlatformY = platforms.length === 0 ? height : platforms[platforms.length - 1].y - gap;
        platforms.push(new Platform(random(width), newPlatformY, platformImg));
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
        resetMatrix();
        fill(255, 0, 0);
        textSize(50);
        textAlign(CENTER, CENTER);
        text(`You Lose!
your score is ${score}`
            , width / 2, height / 2);
        noLoop(); // Stop the draw loop
        setTimeout(restartGame, 2000);
        return;
    }
    if (transY <= startY + 300) {
        fill(0, 150, 0);
        rect(0, height, width, 100);
        jumpCount = 0
    }

    if (jumpCount <= 15 && (mouseIsPressed || keyIsDown(UP_ARROW) || keyIsDown(32))) {
        jumpCount++;
        doodler.jump();
    }
    if (keyIsDown(LEFT_ARROW)) {
        doodler.move('left', speed);
        goingLeft = true
    } else if (keyIsDown(RIGHT_ARROW)) {
        doodler.move('right', speed);
        goingLeft = false
    }

    resetMatrix();

    push();
    fill(255, 255, 255);
    textSize(30);
    textAlign(CENTER, TOP);
    text(score, width / 2, 50);
    pop();
}






function restartGame() {
    score = 0;
    platforms = [];
    for (let i = 1; i <= 6; i++) {
        platforms.push(new Platform(random(width) - 10, height - i * gap, platformImg));
    }
    doodler = new Doodle(width / 2, height - 50, doodleLeftImg, doodleRigthImg);

    loop();
}