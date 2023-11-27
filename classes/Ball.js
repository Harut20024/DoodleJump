class Ball {
    constructor(x, y, goingLeft, isJumping) {
        this.position = createVector(x, y);
        if (isJumping) {
            this.velocity = createVector(0, -10);
            this.position.x += 40;
            this.position.y += 10;
        } else {
            this.velocity = createVector(goingLeft ? -5 : 5, 0);
            !goingLeft ? this.position.x += 80 : "";

        }
        this.size = 30;
    }

    update() {
        this.position.add(this.velocity);
    }

    show() {
        fill(255, 255, 0); // Yellow color for the ball
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }
}
