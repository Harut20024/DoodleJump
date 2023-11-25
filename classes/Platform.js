class Platform {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img
    this.height = 25;
    this.width = 90;
  }

  draw() {
    image(this.img, this.x, this.y, this.width, this.height);
  }
}