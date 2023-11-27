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

        for (let platform of platforms) {
            if (
                this.position.y + this.size / 2 <= platform.y + 1 &&
                this.position.y + this.size / 2 + this.velocity.y >= platform.y &&
                this.velocity.y > 0
            ) {
                if (
                    this.position.x + this.size / 2 >= platform.x - 20 &&
                    this.position.x - this.size / 2 <= platform.x + platform.width - 50
                ) {
                    isJumping = false
                    if (platform.monsterIs === true) {
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
        let imgToShow = goingLeft ? this.imgLeft : this.imgRight;
        !isJumping ? image(imgToShow, this.position.x, this.position.y - this.size / 2, this.size, this.size) :
            image(doodleJumpImg, this.position.x, this.position.y - this.size / 2, this.size + 20, this.size + 20)

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
}
