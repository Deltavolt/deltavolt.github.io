var enemy1;
var enemy2;
var enemy3;
var enemy4;
var enemy5;
var enemy6;
var enemy7;
var enemy8;
var laser;
var lose;
var x;
var y;
var laserSpeed;

function setup() {
  createCanvas(500, 500);
  enemy1 = createSprite(250+20, 250+20, 20, 20);
  enemy2 = createSprite(250+20, 250-20, 20, 20);
  enemy3 = createSprite(250-20, 250+20, 20, 20);
  enemy4 = createSprite(250-20, 250-20, 20, 20);
  enemy5 = createSprite(250+40, 250, 20, 20);
  enemy6 = createSprite(250-40, 250, 20, 20);
  enemy7 = createSprite(250, 250+40, 20, 20);
  enemy8 = createSprite(250, 250-40, 20, 20);
  laser = createSprite(250, 0, 5, 50);
  lose = 0;
  laserSpeed = 5;
  x = 0;
  y = 1;
}

function draw() {
  background(191, 191, 255);
//laserSpeed += 0.01;
  if(enemy1.position.x > 500) {
    enemy1.position.x = 500;
  }
  if(enemy1.position.x < 0) {
    enemy1.position.x = 0;
  }
  if(enemy1.position.y > 500) {
    enemy1.position.y = 500;
  }
  if(enemy1.position.y < 0) {
    enemy1.position.y = 0;
  }
  if(enemy2.position.x > 500) {
    enemy2.position.x = 500;
  }
  if(enemy2.position.x < 0) {
    enemy2.position.x = 0;
  }
  if(enemy2.position.y > 500) {
    enemy2.position.y = 500;
  }
  if(enemy2.position.y < 0) {
    enemy2.position.y = 0;
  }
  if(enemy3.position.x > 500) {
    enemy3.position.x = 500;
  }
  if(enemy3.position.x < 0) {
    enemy3.position.x = 0;
  }
  if(enemy3.position.y > 500) {
    enemy3.position.y = 500;
  }
  if(enemy3.position.y < 0) {
    enemy3.position.y = 0;
  }
  if(enemy4.position.x > 500) {
    enemy4.position.x = 500;
  }
  if(enemy4.position.x < 0) {
    enemy4.position.x = 0;
  }
  if(enemy4.position.y > 500) {
    enemy4.position.y = 500;
  }
  if(enemy4.position.y < 0) {
    enemy4.position.y = 0;
  }
  if(enemy5.position.x > 500) {
    enemy5.position.x = 500;
  }
  if(enemy5.position.x < 0) {
    enemy5.position.x = 0;
  }
  if(enemy5.position.y > 500) {
    enemy5.position.y = 500;
  }
  if(enemy5.position.y < 0) {
    enemy5.position.y = 0;
  }
  if(enemy6.position.x > 500) {
    enemy6.position.x = 500;
  }
  if(enemy6.position.x < 0) {
    enemy6.position.x = 0;
  }
  if(enemy6.position.y > 500) {
    enemy6.position.y = 500;
  }
  if(enemy6.position.y < 0) {
    enemy6.position.y = 0;
  }
  if(enemy7.position.x > 500) {
    enemy7.position.x = 500;
  }
  if(enemy7.position.x < 0) {
    enemy7.position.x = 0;
  }
  if(enemy7.position.y > 500) {
    enemy7.position.y = 500;
  }
  if(enemy7.position.y < 0) {
    enemy7.position.y = 0;
  }
  if(enemy8.position.x > 500) {
    enemy8.position.x = 500;
  }
  if(enemy8.position.x < 0) {
    enemy8.position.x = 0;
  }
  if(enemy8.position.y > 500) {
    enemy8.position.y = 500;
  }
  if(enemy8.position.y < 0) {
    enemy8.position.y = 0;
  }
  if(laser.position.x > 500) {
    laser.position.x = 500;
  }
  if(laser.position.x < 0) {
    laser.position.x = 0;
  }
  if(laser.position.y > 535) {
    laser.position.y = 535;
  }
  if(laser.position.y < 0) {
    laser.position.y = 0;
  }
//laser.position.y += laserSpeed;
laser.setVelocity(0, laserSpeed);
  if(laser.overlap(enemy1)) {
    laser.position.x = floor(500*random());
    laser.position.y = 0;
    laser.setVelocity(0, 0);
  }
  if(laser.overlap(enemy2)) {
    laser.position.x = floor(500*random());
    laser.position.y = 0;
    laser.setVelocity(0, 0);
  }
  if(laser.overlap(enemy3)) {
    laser.position.x = floor(500*random());
    laser.position.y = 0;
    laser.setVelocity(0, 0);
  }
  if(laser.overlap(enemy4)) {
    laser.position.x = floor(500*random());
    laser.position.y = 0;
    laser.setVelocity(0, 0);
  }
  if(laser.overlap(enemy5)) {
    laser.position.x = floor(500*random());
    laser.position.y = 0;
    laser.setVelocity(0, 0);
  }
  if(laser.overlap(enemy6)) {
    laser.position.x = floor(500*random());
    laser.position.y = 0;
    laser.setVelocity(0, 0);
  }
  if(laser.overlap(enemy7)) {
    laser.position.x = floor(500*random());
    laser.position.y = 0;
    laser.setVelocity(0, 0);
  }
  if(laser.overlap(enemy8)) {
    laser.position.x = floor(500*random());
    laser.position.y = 0;
    laser.setVelocity(0, 0);
  }
  if(laser.position.y == 535) {
    lose = 1;
  }
  if(lose==1) {
    fill(255, 0, 0);
    text("Game Over", 220, 250);
  }
  
  if(lose === 0) {
    enemy1.attractionPoint(1,mouseX,mouseY);
    enemy2.attractionPoint(1.125,mouseX,mouseY);
    enemy3.attractionPoint(1.25,mouseX,mouseY);
    enemy4.attractionPoint(1.375,mouseX,mouseY);
    enemy5.attractionPoint(1.5,mouseX,mouseY);
    enemy6.attractionPoint(1.625,mouseX,mouseY);
    enemy7.attractionPoint(1.75,mouseX,mouseY);
    enemy8.attractionPoint(1.875,mouseX,mouseY);
    if(keyDown(RIGHT_ARROW)) {
      enemy1.attractionPoint(-1,mouseX,mouseY);
      enemy2.attractionPoint(-1.125,mouseX,mouseY);
      enemy3.attractionPoint(-1.25,mouseX,mouseY);
      enemy4.attractionPoint(-1.375,mouseX,mouseY);
      enemy5.attractionPoint(-1.5,mouseX,mouseY);
      enemy6.attractionPoint(-1.625,mouseX,mouseY);
      enemy7.attractionPoint(-1.75,mouseX,mouseY);
      enemy8.attractionPoint(-1.875,mouseX,mouseY);
      enemy1.attractionPoint(1,laser.position.x,laser.position.y);
      enemy2.attractionPoint(1.125,laser.position.x,laser.position.y);
      enemy3.attractionPoint(1.25,laser.position.x,laser.position.y);
      enemy4.attractionPoint(1.375,laser.position.x,laser.position.y);
      enemy5.attractionPoint(1.5,laser.position.x,laser.position.y);
      enemy6.attractionPoint(1.625,laser.position.x,laser.position.y);
      enemy7.attractionPoint(1.75,laser.position.x,laser.position.y);
      enemy8.attractionPoint(1.875,laser.position.x,laser.position.y);
    }
    if(keyDown(DOWN_ARROW)) {
      enemy1.position.x = mouseX;
      enemy2.position.x = mouseX;
      enemy3.position.x = mouseX;
      enemy4.position.x = mouseX;
      enemy5.position.x = mouseX;
      enemy6.position.x = mouseX;
      enemy7.position.x = mouseX;
      enemy8.position.x = mouseX;
      enemy1.position.y = mouseY;
      enemy2.position.y = mouseY;
      enemy3.position.y = mouseY;
      enemy4.position.y = mouseY;
      enemy5.position.y = mouseY;
      enemy6.position.y = mouseY;
      enemy7.position.y = mouseY;
      enemy8.position.y = mouseY;
      enemy1.setVelocity(0, 0);
      enemy2.setVelocity(0, 0);
      enemy3.setVelocity(0, 0);
      enemy4.setVelocity(0, 0);
      enemy5.setVelocity(0, 0);
      enemy6.setVelocity(0, 0);
      enemy7.setVelocity(0, 0);
      enemy8.setVelocity(0, 0);
    }
    if(keyDown(LEFT_ARROW)) {
    laser.attractionPoint(1,mouseX,mouseY);
    }
    if(keyDown(UP_ARROW)) {
      enemy1.attractionPoint(-1,mouseX,mouseY);
      enemy2.attractionPoint(-1.125,mouseX,mouseY);
      enemy3.attractionPoint(-1.25,mouseX,mouseY);
      enemy4.attractionPoint(-1.375,mouseX,mouseY);
      enemy5.attractionPoint(-1.5,mouseX,mouseY);
      enemy6.attractionPoint(-1.625,mouseX,mouseY);
      enemy7.attractionPoint(-1.75,mouseX,mouseY);
      enemy8.attractionPoint(-1.875,mouseX,mouseY);
    }
  }
  if(lose == 1) {
    enemy1.attractionPoint(1,250,250);
    enemy2.attractionPoint(1.125,250,250);
    enemy3.attractionPoint(1.25,250,250);
    enemy4.attractionPoint(1.375,250,250);
    enemy5.attractionPoint(1.5,250,250);
    enemy6.attractionPoint(1.625,250,250);
    enemy7.attractionPoint(1.75,250,250);
    enemy8.attractionPoint(1.875,250,250);
  }
  drawSprites();
  fill(95, 0, 255);
  text("x = " + floor(mouseX), 450, 20);
  text("y = " + floor(mouseY), 450, 35);
  text("laser speed = " + floor(laserSpeed*100)/100, 410, 50);
}