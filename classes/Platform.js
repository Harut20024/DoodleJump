class Platform {
  constructor(x, y, img,answ,monstrImg) {
    this.x = x;
    this.y = y;
    this.img = img
    this.imgOfMonster = monstrImg
    this.height = 25;
    this.width = 90;
    this.monsterIs = answ;
  }
  draw() {
    if(this.monsterIs)image(this.imgOfMonster, this.x-10, this.y-60, this.width+20, this.height+50);
    image(this.img, this.x, this.y, this.width, this.height);
  }
}