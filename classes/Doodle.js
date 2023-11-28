class Doodle {
    constructor(x, y, imgLeft, imgRight) {
        this.x = x;
        this.y = y;
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0.98);
        this.size = 70;
        this.imgLeft = imgLeft;
        this.imgRight = imgRight;
        this.isFlying = false;
        this.flightStartTime = 0;
    }

    preload() {
        this.img = loadImage('photos/doodle.png');
    }

    update(platforms) {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        if (this.velocity.y < -9) {
            this.velocity.y = -9;
        }
        if (this.isFlying && millis() - this.flightStartTime > 3200) {
            this.isFlying = false;
            this.velocity = createVector(0, 0); // Reset the velocity after flying
            this.acceleration = createVector(0, 0.98); // Reapply gravity
        }

        for (let platform of platforms) {
            if (
                this.position.y + this.size / 2 <= platform.y + 1 &&
                this.position.y + this.size / 2 + this.velocity.y >= platform.y &&
                this.velocity.y > 0
            ) {
                if (
                    this.position.x + this.size / 2 >= platform.x + 20 &&
                    this.position.x - this.size / 2 <= platform.x + platform.width 
                ) {
                    isJumping = false

                    if (platform.jet === true && !this.isFlying && this.position.y + this.size / 2 + this.velocity.y >= platform.y) {
                        platform.jet = false;
                        this.startFlight(-40);
                    }


                    if (platform.monsterIs === true) {
                        if (!looseSound.isPlaying()) looseSound.play();
                        resetMatrix();
                        fill(255, 0, 0);
                        textSize(50);
                        textAlign(CENTER, CENTER);
                        text(`You Lose!
    your score is ${score}`
                            , width / 2, height / 2);
                        noLoop();
                        setTimeout(restartGame, 2000);
                        return;
                    }
                    this.jump();
                    jumpCount = 0
                    break;
                }
            }
        }

        // Prevent falling off the bottom of the canvas
        if (this.position.y > height - this.size / 2) {
            this.position.y = height - this.size / 2;
            this.velocity.y = 0;
        }
    }


    show() {
        let imgToShow;
        if (this.isFlying) {
            image(doodleInJet, this.position.x - this.size / 2, this.position.y - this.size / 2, this.size + 50, this.size + 30);

        } else if (isJumping) {
            image(doodleJumpImg, this.position.x - this.size / 2, this.position.y - this.size / 2, this.size + 20, this.size + 20);

        } else if (!isJumping) {
            imgToShow = goingLeft ? this.imgLeft : this.imgRight;
            image(imgToShow, this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);

        }

    }
    move(direction, speed) {
        if (direction === 'left') {
            this.position.x -= speed;
            if (this.position.x < 0 - this.size / 2) {
                this.position.x = width + this.size / 2;
            }
        } else if (direction === 'right') {
            this.position.x += speed;
            if (this.position.x > width + this.size / 2) {
                this.position.x = 0 - this.size / 2;
            }
        }
    }


    jump() {
        this.velocity.y = -30;

    }
    startFlight() {
        if (!jetSound.isPlaying()) jetSound.play();
        this.isFlying = true;
        this.flightStartTime = millis();
        this.velocity = createVector(0, -15); // Strong initial upward velocity
        this.acceleration = createVector(0, -4); // Constant upward force
    }


}
