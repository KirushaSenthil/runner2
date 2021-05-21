var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex run1.png","trex run2.png","trex run3.png","trex run4.png","trex run5.png","trex run6.png","trex run7.png");
  trex_collided = loadAnimation("trex hit.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud1.png");
  
  obstacle1 = loadImage("cactus 1.png");
  obstacle2 = loadImage("cactus 2.png");
  obstacle3 = loadImage("cactus 3.png");
  obstacle4 = loadImage("cactus 4.png");
  obstacle5 = loadImage("cactus 5.png");
  obstacle6 = loadImage("cactus 6.png");
  
  gameOverImg = loadImage("game over1.png");
  restartImg = loadImage("restart1.png");
}

function setup() {
  createCanvas(windowWidth-10,windowHeight-20);
  
  trex = createSprite(50,windowHeight-60,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //trex.scale = 0.9;
  
  ground = createSprite(300,windowHeight-40,600,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  //ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(windowWidth/2,windowHeight/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight/2+30);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.4;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(ground.width/2-600,windowHeight-30,ground.width/2,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("pink");
  text("Score: "+ score,camera.position.x+300,50);
 

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    camera.position.x=trex.x

    trex.velocityX=trex.velocityX+0.05
  
    if(keyDown("space") && trex.y >= windowHeight-80) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
   if(camera.position.x+width/2>ground.x+ground.width/2){
    ground.x=camera.position.x;
    invisibleGround.x=camera.position.x;
   }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    gameOver.x=trex.x;
    restart.x=trex.x;
    
    //set velcity of each game object to 0
    trex.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.position.x+300,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
   // cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.position.x+400,windowHeight-65,165,40);
    //obstacle.debug = true;
    //obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}