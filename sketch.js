// Declaring variable
var trex, trexImage;
var ground, groundImage;
var invisibleGround;
var Clouds, CloudImage;
var obstacles,
  obstaclesImage1,
  obstaclesImage2,
  obstaclesImage3,
  obstaclesImage4,
  obstaclesImage5,
  obstaclesImage6;
// Assigning a value to play and end status
var PLAY = 0;
var END = 1;
var gamestate = PLAY;
// Declaring Score
var score = 0;
// creating Groups
var cloudsGroup;
var obsteclesGroup;
var trexcollided, trexcollidedImage;

var gameover, gameoverImage;
var restart, restartImage;

var die, Jump, checkpoint;

sessionStorage["HighestScore"] = 0

// For loading Images,Audio We use function preaload
function preload() {
  trexImage = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  CloudImage = loadImage("cloud.png");
  obstaclesImage1 = loadImage("obstacle1.png");
  obstaclesImage2 = loadImage("obstacle2.png");
  obstaclesImage3 = loadImage("obstacle3.png");
  obstaclesImage4 = loadImage("obstacle4.png");
  obstaclesImage5 = loadImage("obstacle5.png");
  obstaclesImage6 = loadImage("obstacle6.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  trexcollidedImage = loadImage("trex_collided.png");
  die = loadSound("die.mp3");
  Jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkpoint.mp3");
}

// Creating a sprite or objects we use function setup
function setup() {
  createCanvas(600, 400);
  // Creating Trex
  trex = createSprite(30, 360,30,30);
  trex.addAnimation("Dinosoures", trexImage);
  trex.scale = 0.4;
  trex.addAnimation("collide", trexcollidedImage);
  // Creating Ground
  ground = createSprite(200, 380, 600, 10);
  ground.addImage("floor", groundImage);

  // Trex Should Collide Properly With Invisible Ground
  invisibleGround = createSprite(25, 385, 400, 10);
  // Invisible Ground Should Not Visible In A Game
  invisibleGround.visible = false;

  // Creating Groups
  // clouds Group
  cloudsGroup = new Group();
  // ObstecalesGroup
  obstaclesGroup = new Group();
  // Debug To An Object
  trex.debug = true;

   trex.setCollider("circle", 10, 10, 55);
  // trex.setCollider("rectangle",0,0,400,trex.height)
  gameover = createSprite(300, 200);
  gameover.addImage("gameOver", gameoverImage);
  gameover.scale = 0.6;

  restart = createSprite(300, 230);
  restart.addImage("restart", restartImage);
  restart.scale = 0.4;
}

// To Display Objects And Giving Instruction To Objects
function draw() {
  // To avoid the duplication
  background("black");
  drawSprites();
  // Increasing score based on frame Count is Number of frames generated once we start the programe
  score = score + Math.round(frameCount% 10 === 0);
  fill("white");
  textSize(22);
  text("Highest Score :"+sessionStorage["HighestScore"] ,75,40)

  // Initialising gamestate play condition
  if (gamestate === PLAY) {
    ground.velocityX = -4;
    // use it string conacatination
    text("Score: " + score, 450, 40);

    // Jump the trex and limit the y position based on ground position
    if (keyDown("space") && trex.y >= 350) {
      trex.velocityY = -8;
      Jump.play();
    }

    // Creating Infinite Ground
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (score > 0 && score % 100 === 0) {
      checkpoint.play();
    }

    // If Obstacles Are touching trex switching to END state
    if (obstaclesGroup.isTouching(trex)) {
      trex.changeAnimation("collide", trexcollidedImage);
      die.play();
      gamestate = END;
      // trex.velocityY=-8
    }
    // Gravity to the trex
    trex.velocityY = trex.velocityY + 0.5;
    // Calling my own functions
    createClouds();
    createobstecles();

    gameover.visible = false;
    restart.visible = false;
  }
  // Instruction When the game is in END state
  else if (gamestate === END) {
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-60);
    cloudsGroup.setLifetimeEach(-60);
    gameover.visible = true;
    restart.visible = true;
    if (mousePressedOver(restart)) {
      startgame();
    }
  }

  trex.collide(invisibleGround);

  //  console.log(trex.y);
}

// Using framecount createing clouds at every 60 frames,by Using math.round(random())Created Clouds at Different y Positions
// Use A depth Concept To Display Which object should display first in the programe
// to avoid the memoory leak assigned lifetime to an object
function createClouds() {
  if (frameCount % 60 === 0) {
    Clouds = createSprite(570, 100, 50, 10);
    Clouds.velocityX = -6;
    Clouds.addImage("cloud", CloudImage);
    Clouds.y = Math.round(random(150, 300));
    Clouds.depth = trex.depth;
    trex.depth += 1;
    console.log("trex depth is:" + trex.depth);
    console.log("clouds depth is:" + Clouds.depth);

    // lifetime = distance / speed
    // cloudlifetime = 570/6
    Clouds.lifetime = 94;
    cloudsGroup.add(Clouds);
  }
}

// By Using Switch Statement We created different obstacles Images In a Programe
function createobstecles() {
  if (frameCount % 50 === 0) {
    obstacles = createSprite(580, 370, 10, 100);
    obstacles.velocityX = -6 + score / -1000;
    obstacles.lifetime = 96;
    obstacles.scale = 0.5;

    var Number = Math.round(random(1, 6));
    switch (Number) {
      case 1:
        obstacles.addImage(obstaclesImage1);
        break;

      case 2:
        obstacles.addImage(obstaclesImage2);
        break;

      case 3:
        obstacles.addImage(obstaclesImage3);
        break;

      case 4:
        obstacles.addImage(obstaclesImage4);
        break;

      case 5:
        obstacles.addImage(obstaclesImage5);
        break;

      case 6:
        obstacles.addImage(obstaclesImage6);
        break;

      default:
        break;
    }
    //  Adding Obstacles
    obstaclesGroup.add(obstacles);
  }
}

function startgame() {
  gamestate = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("Dinosoures", trexImage);
  if (sessionStorage["HighestScore"]<score) {
    sessionStorage["HighestScore"] = score
  }
  score = 0;
}
