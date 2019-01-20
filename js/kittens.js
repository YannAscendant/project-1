// This sectin contains some game constants. 
let GAME_WIDTH = 540
let GAME_HEIGHT = 540

let ENEMY_WIDTH = 25
let ENEMY_HEIGHT = 25
let MAX_ENEMIES = 0

let PLAYER_WIDTH = 20
let PLAYER_HEIGHT = 20

// These two constants keep us from using "magic numbers" in our code
let LEFT_ARROW_CODE = 37
let RIGHT_ARROW_CODE = 39
let UP_ARROW_CODE = 38
let DOWN_ARROW_CODE = 40
let PRESS_W = 87
let PRESS_S = 83

// These two constants allow us to DRY
let MOVE_LEFT = "left"
let MOVE_RIGHT = "right"
let MOVE_UP = "up"
let MOVE_DOWN = "down"

// Preload game images
let imageFilenames = ["enemy.gif", "stars.gif", "player.png", "meteor_sprite_0.png", "meteor_sprite_1.png", "meteor_sprite_2.png", "meteor_sprite_3.png", "meteor_sprite_4.png", "smallAsteroid.png"]
let images = {}

const meteorArr = ["meteor_sprite_0.png", "meteor_sprite_1.png", "meteor_sprite_2.png", "meteor_sprite_3.png", "meteor_sprite_4.png"]

//play audio
var audio = new Audio('Alien_Recording.wav');
audio.loop = true
audio.play();

//constants for moving the ship
let ratio = window.devicePixelRatio || 1
const ACCELERATION_MAX = 0.0035 * ratio
const SPEED_LIMIT = 5
const FRICTION = 0.98
const ADAPTATION_ENEMY = 270
const POWER_UP_SPAWN_RATE = 0.8
const ORIENTATION_SHIP = 0.0005
let enemySpeed = 0
let lastTime = 0
let DECELERATION_RATE = 2
let ACCELERATION_RATE = 2.0

imageFilenames.forEach(function(imgName) {
  let img = document.createElement("img")
  img.src = "images/" + imgName
  images[imgName] = img
})

//problem 3: put the rendering in a separate class
class Entity {

  render(ctx) {
    this.domElement.style.left = this.x + "px"
    this.domElement.style.top = this.y + "px"
    //mais pourquoi ca le fais a l'envers??? ;
    this.domElement.style.transform = ("rotateZ(-" + (this.angle - Math.PI / 2) + "rad)")
  }
}

// This section is where you will be doing most of your coding


class Enemy extends Entity {
  constructor(root, xPos) {
    super()
    this.root = root
    this.x = xPos
    this.y = -ENEMY_HEIGHT
    let img = document.createElement("img")
    img.src = "images/enemy.gif"
    img.style.position = "absolute"
    img.style.left = this.x + "px"
    img.style.top = this.y + "px"
    img.style.zIndex = 5
    this.img = img
    root.appendChild(img)
    this.domElement = img
    // Each enemy should have a different speed
    this.speed = Math.random() / 200 + 0.25
    //this.imgCounter = 1;
  }

  update(timeDiff) {
    this.y = this.y + timeDiff * this.speed
    //this.changeSprite();
  }

  destroy() {
    // When an enemy reaches the end of the screen, the corresponding DOM element should be destroyed
    this.root.removeChild(this.domElement)
  }

  // changeSprite(){
  //   if (this.imgCounter% 15 === 0){

  //   this.img.src ='images/' + meteorArr[this.imgCounter/15];
  // }
  //   if(this.imgCounter < 60) {
  //     this.imgCounter ++
  //   }
  //   else{
  //     this.imgCounter = 0;
  //   }
  // }
}

class Player extends Entity {
  constructor(root) {
    super()
    this.root = root

    this.x = GAME_WIDTH/2 //* PLAYER_WIDTH
    this.y = GAME_HEIGHT - PLAYER_HEIGHT - 10
    this.angle = Math.PI / 2
    this.acceleration = 0
    this.speed = 0
    this.lastFrame = Date.now()
  
    let img = document.createElement("img")
    img.src = "images/player.png"
    img.style.position = "absolute"
    img.style.left = this.x + "px"
    img.style.top = this.y + "px"
    img.style.zIndex = "10"
    root.appendChild(img)
    this.domElement = img
  }


  // This method is called by the game engine when left/right arrows are pressed
  move(direction) {
    if (direction === MOVE_LEFT ) {
      this.angle = this.angle + Math.PI/10
//      this.x = this.x - PLAYER_WIDTH
    } else if (direction === MOVE_RIGHT ) {
      this.angle = this.angle - Math.PI/20 
//      this.x = this.x + PLAYER_WIDTH
    }else if (direction === MOVE_UP ) {
      this.acceleration = this.acceleration + ACCELERATION_RATE
    }else if (direction === MOVE_DOWN) {
      //this.acceleration = Math.max(this.acceleration - DECELERATION_RATE, 0)
      this.speed = this.speed * 0.5;
      this.acceleration = this.acceleration * 0.5;
    }



  }

  update(timeDiff) {
    //console.log("begening of the player update loop")

    this.x = this.x + Math.cos(this.angle) * this.speed
    this.y = this.y - Math.sin(this.angle) * this.speed

//Limit player speed
    if(this.speed < SPEED_LIMIT){
      this.speed = (this.speed + this.acceleration * (timeDiff/1000)) / FRICTION
    }
    else{this.speed = this.speed}
    console.log("friction:" + FRICTION)


    //test for collisions of bg
    if (this.y + PLAYER_HEIGHT < 0) {
      this.y = GAME_HEIGHT
    }
    if (this.y > GAME_HEIGHT) {
      this.y = 0
    }
    if (this.x + PLAYER_WIDTH < 0) {
      this.x = GAME_WIDTH
    }
    if (this.x > GAME_WIDTH) {
      this.x = 0
    }



    // console logging EVERYTHING!!!!
    // console.log("angle:" + this.angle)
    // console.log("speed:" +this.speed)
    // console.log("this.x:" +this.x)
    // console.log("this.y" +this.y)
    // console.log("timediff:" +timeDiff)
    console.log("acceleration" +this.acceleration)
    //console.log("" + )
    //this.changeSprite();

  }
}

class Text {
  constructor(root, xPos, yPos) {
    this.root = root

    let span = document.createElement("span")
    span.style.position = "absolute"
    span.style.left = xPos
    span.style.top = yPos
    span.style.font = "bold 30px Impact"
    span.style.zIndex = "10"  // added the Zindex and color to make sure the score shows on top.
    span.style.color = "white"

    root.appendChild(span)
    this.domElement = span
  }

  // This method is called by the game engine when left/right arrows are pressed
  update(txt) {
    this.domElement.innerText = txt
  }
}

/*
This section is a tiny game engine.
This engine will use your Enemy and Player classes to create the behavior of the game.
*/
class Engine {
  constructor(element) {
    this.root = element
    // Setup the player
    this.player = new Player(this.root)
    this.info = new Text(this.root, 5, 30)

    // Setup enemies, making sure there are always three
    this.setupEnemies()

    // Put a white div at the bottom so that enemies seem like they dissappear
    let whiteBox = document.createElement("div")
    whiteBox.style.zIndex = 150
    whiteBox.style.position = "absolute"
    whiteBox.style.top = GAME_HEIGHT + "px"
    whiteBox.style.height = PLAYER_HEIGHT + "px"
    whiteBox.style.width = GAME_WIDTH + "px"
    whiteBox.style.background = "#fff"
    this.root.append(whiteBox)

    let bg = document.createElement("img")
    bg.src = "images/stars.gif"
    bg.style.position = "absolute"
    bg.style.height = GAME_HEIGHT + "px"
    bg.style.width = GAME_WIDTH + "px"
    this.root.append(bg)


//  //   this should make the game go full screen
//     bg.addEventListener("click", function () {
//       bg.requestFullscreen().then(function () {
//         screen.lockOrientationUniversal = screen.lockOrientation ||
//           screen.mozLockOrientation ||
//           screen.msLockOrientation
//         screen.lockOrientationUniversal("portrait-primary")
//       })
//     })


    // Since gameLoop will be called out of context, bind it once here.
    this.gameLoop = this.gameLoop.bind(this)
  }

  /*
     The game allows for 5 horizontal slots where an enemy can be present.
     At any point in time there can be at most MAX_ENEMIES enemies otherwise the game would be impossible
     */
  setupEnemies() {
    if (!this.enemies) {
      this.enemies = []
    }

    while (
      this.enemies.filter(function() {
        return true
      }).length < MAX_ENEMIES
    ) {
      this.addEnemy()
    }
  }

  // This method finds a random spot where there is no enemy, and puts one in there
  addEnemy() {
    let enemySpots = GAME_WIDTH / ENEMY_WIDTH

    let enemySpot = undefined

    // Keep looping until we find a free enemy spot at random  -- removed the !enemySpot || in the condition 
    while ( this.enemies[enemySpot]) {
 
      enemySpot = Math.floor(Math.random() * enemySpots)
    }

    this.enemies[enemySpot] = new Enemy(this.root, enemySpot * ENEMY_WIDTH)
  }

  // This method kicks off the game
  start() {
    //console.log("right after start starts...")
    this.score = 0
    this.lastFrame = Date.now()
    let keydownHandler = function(e) {
      if (e.keyCode === LEFT_ARROW_CODE) {
        this.player.move(MOVE_LEFT)
      } else if (e.keyCode === RIGHT_ARROW_CODE) {
        this.player.move(MOVE_RIGHT)
      }else if (e.keyCode === UP_ARROW_CODE) {
        this.player.move(MOVE_UP)
      }else if (e.keyCode === DOWN_ARROW_CODE) {
        this.player.move(MOVE_DOWN)
      }else if (e.keyCode === PRESS_W) {
        MAX_ENEMIES = MAX_ENEMIES + 1
      }else if (e.keyCode === PRESS_S) {
        MAX_ENEMIES = Math.max(MAX_ENEMIES - 1, 1)
      }
      

      //console.log("Starting loop")
    }  
      keydownHandler = keydownHandler.bind(this)
      // Listen for keyboard left/right and update the player
      document.addEventListener("keydown", keydownHandler)
   
    this.gameLoop()
    
  }



  /*
    This is the core of the game engine. The `gameLoop` function gets called ~60 times per second
    During each execution of the function, we will update the positions of all game entities
    It's also at this point that we will check for any collisions between the game entities
    Collisions will often indicate either a player death or an enemy kill

    In order to allow the game objects to self-determine their behaviors, gameLoop will call the `update` method of each entity
    To account for the fact that we don't always have 60 frames per second, gameLoop will send a time delta argument to `update`
    You should use this parameter to scale your update appropriately
     */

  gameLoop() {

 
    // Check how long it's been since last frame
    let currentFrame = Date.now()
    let timeDiff = currentFrame - this.lastFrame
    //const ctx = engine.bg.getContext("2d")

    // Increase the score!
    this.score += timeDiff

    // Call update on all enemies
    this.enemies.forEach(function(enemy) {
      enemy.update(timeDiff)
    })

    //Call update on player. removed for each since i have only 1 player?
    //console.log("Updating Players");
    this.player.update(timeDiff)



    // Draw everything!
    //this.ctx.drawImage(images["stars.gif"], 0, 0); // draw the star bg
    let renderEnemy = function(enemy) {
      enemy.render(this.ctx)
    }
    renderEnemy = renderEnemy.bind(this)
    this.enemies.forEach(renderEnemy) // draw the enemies
    this.player.render(this.ctx) // draw the player

    // Check if any enemies should die
    this.enemies.forEach((enemy, enemyIdx) => {
      if (enemy.y > GAME_HEIGHT) {
        this.enemies[enemyIdx].destroy()
        delete this.enemies[enemyIdx]
      }
    })
    this.setupEnemies()

    // Check if player is dead
    if (this.isPlayerDead()) {
      // If they are dead, then it's game over!
      this.info.update(" GAME OVER! you scored: " + this.score)
    } else {
      // If player is not dead, then draw the score
      this.info.update(this.score)

      // Set the time marker and redraw
      this.lastFrame = Date.now()
      setTimeout(this.gameLoop, 20)
    }
  }

isPlayerDead() {
   

// THIS WORKS!!!
    return this.enemies.some((enemy) => {
      if (this.player.x < enemy.x + ENEMY_WIDTH &&
        this.player.x + PLAYER_WIDTH > enemy.x &&
        this.player.y < enemy.y + ENEMY_HEIGHT &&
        this.player.y + PLAYER_HEIGHT > enemy.y){
        return true}
      else {return false}
    })
  }
}

// This section will start the game

let gameEngine = new Engine(document.getElementById("app"))
//console.log("Startings")
gameEngine.start()


