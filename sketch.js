var PLAY = 1;
var END = 0;
var gameState = PLAY;

var Runner, Runner_running, Runner_collided;
var ground, invisibleGround, groundImage;

var UpperObstaclesGroup, obstacleImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4; 

var score = 0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  Runner_running =   loadAnimation("Images/Runner1.png","Images/Runner3.png","Images/Runner4.png","Images/Runner5.png","Images/Runner6.png","Images/Runner7.png");
  Runner_collided = loadAnimation("Images/Runner3.png");
  
  groundImage = loadImage("Images/ground2.png");
  
  obstacle1 = loadImage("Images/obstacle1.png");
  obstacle2 = loadImage("Images/obstacle2.png");
  obstacle3 = loadImage("Images/obstacle3.png");
  obstacle4 = loadImage("Images/obstacle4.png");
  
  
  gameOverImg = loadImage("GAME OVER.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  Runner = createSprite(50,180,20,50);
  
  Runner.addAnimation("running", Runner_running);
  Runner.addAnimation("collided", Runner_collided);
  Runner.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  //gameOver = createSprite(300,100);
  //gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  UpperObstaclesGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  Runner.debug = false;
  background(255,94,19);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && Runner.y >= 159) {
      Runner.velocityY = -12;
    }
  
    Runner.velocityY = Runner.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    Runner.collide(invisibleGround);
    spawnUpperObstacles();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(Runner)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    Runner.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    UpperObstaclesGroup.setVelocityXEach(0);
    
    //change the Runner animation
    Runner.changeAnimation("collided",Runner_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    UpperObstaclesGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnUpperObstacles() {
  //write code here to spawn the UpperObstacles
  if (frameCount % 60 === 0) {
    var UpperObstacles = createSprite(600,120,40,10);
    UpperObstacles.y = Math.round(random(80,120));
    UpperObstacles.addImage(UpperObstaclesImage);
    UpperObstacles.scale = 0.5;
    UpperObstacles.velocityX = -3;
    
     //assign lifetime to the variable
    UpperObstacles.lifetime = 200;
    
    //adjust the depth
    UpperObstacles.depth = Runner.depth;
    Runner.depth = Runner.depth + 1;
    
    //add each UpperObstacles to the group
    UpperObstaclesGroup.add(UpperObstacles);
  }
  var rand = Math.round(random(1,2));
  switch(rand) {
    case 1: Upperobstacle.addImage(obstacle1);
            break;
    case 2: Upperobstacle.addImage(obstacle3);
            break;
    default: break;
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
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
  UpperObstaclesGroup.destroyEach();
  
  Runner.changeAnimation("running",Runner_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
