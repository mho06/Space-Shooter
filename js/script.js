const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

/*---------------------------------
    Game-Variables Section
---------------------------------*/
const enemies = [];
const bullets = [];
const meteors = [];
const powerUps = [];

const powerUpTypes = [
    { type: "health", image: "assets/images/healthpill.png" }, // Health pill
    { type: "score", image: "assets/images/scorepill.png" },   // Score pill
    { type: "invisible", image: "assets/images/invisiblepill.png" }, // Invisible pill
];

const spaceshipOptions = [
    "assets/images/playerShip1_blue.png",
    "assets/images/playerShip1_red.png",
    "assets/images/playerShip1_green.png",
    "assets/images/playerShip1_orange.png",
];
const meteorTypes = [
    "assets/images/meteor1.png", // Replace with your meteor image paths
    "assets/images/meteor2.png",
    "assets/images/meteor3.png",
    "assets/images/meteor4.png",
];

// Enemy images
const enemyTypes = [
    "assets/images/enemy1.png", // Replace with your enemy image paths
    "assets/images/enemy2.png",
    "assets/images/enemy3.png",
    "assets/images/enemy4.png",
    "assets/images/enemy5.png",
];

let selectedShip = spaceshipOptions[0]; // Default ship
let enemySpeed = 2;
let enemySpawnInterval = 2000; // Initial spawn interval (milliseconds)
let lastEnemySpawnTime = 0; // Tracks last time an enemy was spawned
let bulletWidth = 5;
let bulletHeight = 10;
let bulletSpeed = 7;
const meteorWidth = 50; // Width of the meteor
const meteorHeight = 50; // Height of the meteor
const meteorSpeed = 2; // Speed of the meteor
let powerUpWidth = 30;
let powerUpHeight = 30;
let powerUpSpeed = 3;
let level = 1;
let score = 0;
let health = 3; // Player starts with 3 lives
let gameOver = false;

// Enemy dimensions
const enemyWidth = 50;
const enemyHeight = 50;

// Player properties
const player = {
    x: canvas.width / 2 - 25, // Center horizontally
    y: canvas.height - 100,  // Position near bottom
    width: 50,
    height: 50,
    speed: 5,
};



/*---------------------------------
    Audio Section
---------------------------------*/
const shootSound = new Audio("assets/sounds/shoot.ogg");
const explosionSound = new Audio("assets/sounds/explosion.wav");

// Load background music
const backgroundMusic = new Audio("assets/sounds/background.ogg"); // Replace with your music file path
backgroundMusic.loop = true; // Loop the music
backgroundMusic.volume = 0.3; // Set volume level



/*---------------------------------
    Characters Section
---------------------------------*/
// Load player 
const spaceshipImage = new Image();
spaceshipImage.src = selectedShip;

// Load bullet
const bulletImage = new Image();
bulletImage.src = "assets/images/bullet.png"; // Replace with your bullet image path

//Load enemies
const enemyImage = new Image();
enemyImage.src = "assets/images/enemy1.png"; // Replace with your enemy image path

//Load PowerUps
const powerUpImage = new Image();
powerUpImage.src = "assets/images/scorepill.png"; // Replace with your power-up image path

//Load meteors
const meteorImage = new Image();
meteorImage.src = "assets/images/meteor1.png"; // Custom meteor image

// High score
let highScore = localStorage.getItem("highScore") || 0;

// Keyboard input
const keys = { left: false, right: false };


/*---------------------------------
    EventListeners Section
---------------------------------*/
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") keys.left = true;
    if (event.key === "ArrowRight") keys.right = true;
    if (event.key === " ") spawnBullet(); // Shoot bullets
    if (gameOver && event.key === " ") restartGame(); // Restart game
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") keys.left = false;
    if (event.key === "ArrowRight") keys.right = false;
});

// Reset canvas context
function resetCanvasContext() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
}






/*---------------------------------
    Player Section
---------------------------------*/

// Function to select a ship
function selectShip(index) {
    selectedShip = spaceshipOptions[index];
    alert(`You selected Ship ${index + 1}!`);
}

// Update player movement
function updatePlayer() {
    if (keys.left && player.x > 0) player.x -= player.speed;
    if (keys.right && player.x + player.width < canvas.width) player.x += player.speed;
}

// Draw the player ship
function drawPlayer() {
    if (isInvisible) {
        ctx.globalAlpha = 0.3; // Set transparency (30% visible)
    } else {
        ctx.globalAlpha = 1; // Fully visible
    }

    // Draw the player ship
    ctx.drawImage(spaceshipImage, player.x, player.y, player.width, player.height);

    // Reset globalAlpha to default after drawing
    ctx.globalAlpha = 1;
}


//Player invisibility 
let isInvisible = false; // Track invisibility state

function makePlayerInvisible() {
    if (isInvisible) return; // If already invisible, do nothing

    isInvisible = true;
    console.log("Player is now invisible!");

    setTimeout(() => {
        isInvisible = false; // Reset invisibility
        console.log("Invisibility expired!");
    }, 20000); // Invisibility lasts for 20 seconds
}


/*---------------------------------
    Enemies Section
---------------------------------*/

// Spawn enemies
function spawnEnemy() {
    const x = Math.random() * (canvas.width - enemyWidth); // Random x position
    const randomEnemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)]; // Select random enemy image
    enemies.push({
        x,
        y: -enemyHeight,
        width: enemyWidth,
        height: enemyHeight,
        image: new Image(), // Create a new Image object
    });
    enemies[enemies.length - 1].image.src = randomEnemyType; // Assign the selected image
}


// Update enemies
function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemySpeed;

        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }
    }
}

// Draw enemies
function drawEnemies() {
    enemies.forEach((enemy) => {
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}


/*---------------------------------
    Meteors Section
---------------------------------*/

function spawnMeteor() {
    const x = Math.random() * (canvas.width - meteorWidth); // Random x position
    const randomMeteorType = meteorTypes[Math.floor(Math.random() * meteorTypes.length)]; // Select random meteor image
    meteors.push({
        x,
        y: -meteorHeight,
        width: meteorWidth,
        height: meteorHeight,
        image: new Image(), // Create a new Image object
    });
    meteors[meteors.length - 1].image.src = randomMeteorType; // Assign the selected image
}



function updateMeteors() {
    for (let i = 0; i < meteors.length; i++) {
        meteors[i].y += meteorSpeed; // Move the meteor down the screen

        // Remove the meteor if it goes off-screen
        if (meteors[i].y > canvas.height) {
            meteors.splice(i, 1); // Remove from array
            i--; // Adjust index
        }
    }
}


function drawMeteors() {
    meteors.forEach((meteor) => {
        ctx.drawImage(meteor.image, meteor.x, meteor.y, meteor.width, meteor.height);
    });
}


/*---------------------------------
    Bullets Section
---------------------------------*/
function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bulletSpeed;

        if (bullets[i].y + bulletHeight < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}
function drawBullets() {
    bullets.forEach((bullet) => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bulletWidth, bulletHeight);
    });
}
function spawnBullet() {
    shootSound.play();
    bullets.push({
        x: player.x + player.width / 2 - bulletWidth / 2,
        y: player.y,
        width: bulletWidth,
        height: bulletHeight,
    });
}


/*---------------------------------
    PowerUps Section
---------------------------------*/
function spawnPowerUp() {
    // Randomly determine if a power-up should spawn (50% chance to spawn)
    if (Math.random() < 0.5) return; // Skip spawning this time

    // Randomly select the type of power-up
    let selectedPowerUp;
    const rarity = Math.random(); // Generate a random number between 0 and 1

    if (rarity < 0.45) {
        selectedPowerUp = powerUpTypes[2]; // 45% chance: Health Pill
    } else if (rarity < 0.9) {
        selectedPowerUp = powerUpTypes[1]; // 45% chance: Score Pill
    } else {
        selectedPowerUp = powerUpTypes[0]; // 10% chance: Invisible Pill
    }

    const x = Math.random() * (canvas.width - powerUpWidth); // Random x position
    powerUps.push({
        x,
        y: -powerUpHeight, // Start above the screen
        width: powerUpWidth,
        height: powerUpHeight,
        type: selectedPowerUp.type, // Assign the type
        image: new Image(), // Create an Image object
    });
    powerUps[powerUps.length - 1].image.src = selectedPowerUp.image; // Set the image source
}


function updatePowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
        powerUps[i].y += powerUpSpeed; // Move power-up downward

        // Remove the power-up if it moves off the screen
        if (powerUps[i].y > canvas.height) {
            powerUps.splice(i, 1); // Remove from array
            i--; // Adjust index after removal
        }
    }
}

function drawPowerUps() {
    powerUps.forEach((powerUp) => {
        ctx.drawImage(powerUp.image, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    });
}



/*---------------------------------
    Collisions Section
---------------------------------*/
function checkCollisions() {
    // Handle enemy collisions
    for (let i = 0; i < enemies.length; i++) {
        if (
            enemies[i].x < player.x + player.width && // Enemy's left side crosses player's right side
            enemies[i].x + enemies[i].width > player.x && // Enemy's right side crosses player's left side
            enemies[i].y < player.y + player.height && // Enemy's top side crosses player's bottom side
            enemies[i].y + enemies[i].height > player.y // Enemy's bottom side crosses player's top side
        ) {
            if (!isInvisible) { 
                health--; // Only lose health if the player is visible
                console.log(`Player hit by enemy! Health: ${health}`);
            } else {
                console.log("Enemy collision ignored due to invisibility!");
            }

            enemies.splice(i, 1); // Always remove the enemy after a collision
            i--; // Adjust index after removal

            if (health <= 0) {
                gameOver = true;
                displayGameOver();
                return;
            }
        }
    }

    // Handle meteor collisions
    for (let i = 0; i < meteors.length; i++) {
        if (
            meteors[i].x < player.x + player.width &&
            meteors[i].x + meteors[i].width > player.x &&
            meteors[i].y < player.y + player.height &&
            meteors[i].y + meteors[i].height > player.y
        ) {
            if (!isInvisible) { 
                health--; // Only lose health if the player is visible
                console.log(`Player hit by meteor! Health: ${health}`);
            } else {
                console.log("Meteor collision ignored due to invisibility!");
            }

            meteors.splice(i, 1); // Always remove the meteor after a collision
            i--; // Adjust index after removal

            if (health <= 0) {
                gameOver = true;
                displayGameOver();
                return;
            }
        }
    }

    // Handle bullet-enemy collisions
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y
            ) {
                explosionSound.play(); // Play explosion sound
                bullets.splice(i, 1); // Remove bullet
                enemies.splice(j, 1); // Remove enemy
                score += 10; // Increase score
                i--; // Adjust index after bullet removal
                j--; // Adjust index after enemy removal
                break; // Exit inner loop
            }
        }
    }

    // Handle power-up collisions
    for (let i = 0; i < powerUps.length; i++) {
        if (
            powerUps[i].x < player.x + player.width &&
            powerUps[i].x + powerUps[i].width > player.x &&
            powerUps[i].y < player.y + player.height &&
            powerUps[i].y + powerUps[i].height > player.y
        ) {
            if (powerUps[i].type === "health") {
                health++;
                console.log("Health increased! Current health:", health);
            } else if (powerUps[i].type === "score") {
                score += 50;
                console.log("Score increased! Current score:", score);
            } else if (powerUps[i].type === "invisible") {
                makePlayerInvisible();
            }

            powerUps.splice(i, 1); // Remove the power-up after applying its effect
            i--; // Adjust index after removal
        }
    }
}




// Check for game over
function checkGameOver() {
    for (let i = 0; i < enemies.length; i++) {
        if (
            enemies[i].y + enemies[i].height >= player.y &&
            enemies[i].x < player.x + player.width &&
            enemies[i].x + enemies[i].width > player.x
        ) {
            health--;
            enemies.splice(i, 1);
            i--;

            if (health <= 0) {
                gameOver = true;
                displayGameOver();
                return;
            }
        }
    }
}

/*---------------------------------
    Health-Levels-Scores Section
---------------------------------*/

// Update health
function updateHealth() {
    ctx.fillText(`Health: ${health}`, 10, 60);
}

// Update score
function updateScore() {
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Update high score
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 200, 60);
}

// Update level
function updateLevel() {
    ctx.fillText(`Level: ${level}`, canvas.width - 100, 30);
}

// Update difficulty
function updateDifficulty(timestamp) {
    if (score >= level * 100) {
        level++;
        enemySpeed += 0.5; // Increase enemy speed
        enemySpawnInterval = Math.max(500, enemySpawnInterval - 200); // Cap minimum interval
    }

    if (timestamp - lastEnemySpawnTime > enemySpawnInterval) {
        spawnEnemy();
        lastEnemySpawnTime = timestamp;
    }
}

/*---------------------------------
    High Score Update Section
---------------------------------*/
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 200, 60);
}

/*---------------------------------
    Main-Section
---------------------------------*/

// Initialize the game on refresh
function initializeGame() {
    // Show the ship selection menu
    const shipSelectionMenu = document.getElementById("ship-selection");
    if (shipSelectionMenu) {
        shipSelectionMenu.style.display = "block";
    }

    // Hide the canvas until the game starts
    canvas.style.display = "none";

    // Reset game variables
    selectedShip = spaceshipOptions[0];
    spaceshipImage.src = selectedShip;
    score = 0;
    level = 1;
    health = 3;
    enemySpeed = 2;
    bullets.length = 0;
    enemies.length = 0;
    powerUps.length = 0;
    gameOver = false;

    setInterval(spawnMeteor, 3000);
    setInterval(spawnPowerUp, 7000); // Try to spawn a power-up every 7 seconds
}

function restartGame() {
    gameOver = false;
    health = 3; // Reset health
    score = 0; // Reset score
    level = 1; // Reset level
    enemySpeed = 2; // Reset enemy speed
    bullets.length = 0; // Clear bullets
    enemies.length = 0; // Clear enemies
    meteors.length = 0; // Clear meteors
    powerUps.length = 0; // Clear power-ups
    player.x = canvas.width / 2 - player.width / 2; // Reset player position

    // Reset invisibility and other power-up effects
    isInvisible = false;

    console.log("Game restarted!");

    initializeGame();
    startGame();
}

function startGame() {
    // Set the selected spaceship image
    spaceshipImage.src = selectedShip;

    // Hide the ship selection menu and show the canvas
    const shipSelectionMenu = document.getElementById("ship-selection");
    if (shipSelectionMenu) {
        shipSelectionMenu.style.display = "none";
    }
    canvas.style.display = "block";

    // Center the player
    player.x = canvas.width / 2 - player.width / 2;

     // Start background music
    //  backgroundMusic.play();

    // Start the game loop
    gameLoop(0); // Pass 0 as the initial timestamp for the game loop
}

// Display game over screen
function displayGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText("Press space to Restart", canvas.width / 2, canvas.height / 2 + 40);

    // Stop background music
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Reset music to the beginning
}
// Main game loop
function gameLoop(timestamp) {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resetCanvasContext();

    updatePlayer();
    drawPlayer();

    updateEnemies();
    drawEnemies();

    updateMeteors();
    drawMeteors();

    updateBullets();
    drawBullets();

    updatePowerUps();
    drawPowerUps();

    checkCollisions();
    // checkPowerUpCollision();
    // checkEnemyCollision();
    // checkMeteorCollision(); 

    updateDifficulty(timestamp);
    
    updateLevel();
    updateScore();
    updateHealth();
    checkGameOver();

    requestAnimationFrame(gameLoop);
}

// Initialize the game when the page loads
initializeGame();
