const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set the canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
const enemies = [];
const bullets = [];
const powerUps = [];
const enemyWidth = 50;
const enemyHeight = 50;
let enemySpeed = 2;
let enemySpawnInterval = 2000; // Initial spawn interval (in milliseconds)
let lastEnemySpawnTime = 0; // Tracks the last time an enemy was spawned
const bulletWidth = 5;
const bulletHeight = 10;
const bulletSpeed = 7;
const powerUpWidth = 30;
const powerUpHeight = 30;
const powerUpSpeed = 3;
let level = 1;
let score = 0;
let gameOver = false;

// Player properties
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: "blue",
    speed: 5
};

// Keyboard input handling
const keys = { left: false, right: false };

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") keys.left = true;
    if (event.key === "ArrowRight") keys.right = true;
    if (event.key === " ") spawnBullet(); // Shooting bullets
    if (gameOver && event.key.toLowerCase() === "r") restartGame(); // Restart
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") keys.left = false;
    if (event.key === "ArrowRight") keys.right = false;
});

// Reset canvas context state
function resetCanvasContext() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
}

// Restart the game
function restartGame() {
    gameOver = false;
    score = 0;
    level = 1;
    enemySpeed = 2;
    bullets.length = 0;
    enemies.length = 0;
    powerUps.length = 0;
    player.x = canvas.width / 2 - player.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resetCanvasContext();

    gameLoop();
}

// Update player movement
function updatePlayer() {
    if (keys.left && player.x > 0) player.x -= player.speed;
    if (keys.right && player.x + player.width < canvas.width) player.x += player.speed;
}

// Draw the player ship
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Spawn enemies
function spawnEnemy() {
    const x = Math.random() * (canvas.width - enemyWidth);
    enemies.push({ x, y: -enemyHeight, width: enemyWidth, height: enemyHeight, color: "red" });
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
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Spawn bullets
function spawnBullet() {
    bullets.push({
        x: player.x + player.width / 2 - bulletWidth / 2,
        y: player.y,
        width: bulletWidth,
        height: bulletHeight,
        color: "yellow"
    });
}

// Update bullets
function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bulletSpeed;

        if (bullets[i].y + bulletHeight < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

// Draw bullets
function drawBullets() {
    bullets.forEach((bullet) => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Spawn power-ups
function spawnPowerUp() {
    const x = Math.random() * (canvas.width - powerUpWidth);
    powerUps.push({ x, y: -powerUpHeight, width: powerUpWidth, height: powerUpHeight, color: "green" });
}

// Update power-ups
function updatePowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
        powerUps[i].y += powerUpSpeed;

        if (powerUps[i].y > canvas.height) {
            powerUps.splice(i, 1);
            i--;
        }
    }
}

// Draw power-ups
function drawPowerUps() {
    powerUps.forEach((powerUp) => {
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    });
}

// Update difficulty and speed dynamically based on level
function updateDifficulty(timestamp) {
    if (score >= level * 100) {
        level++;
        enemySpeed += 0.5; // Increase enemy speed
        enemySpawnInterval = Math.max(500, enemySpawnInterval - 200); // Decrease spawn interval, minimum 500ms
    }

    // Spawn enemies dynamically based on level
    if (timestamp - lastEnemySpawnTime > enemySpawnInterval) {
        spawnEnemy();
        lastEnemySpawnTime = timestamp;
    }
}

function updateLevel() {
    ctx.fillText(`Level: ${level}`, canvas.width - 100, 30);
}

// Update score
function updateScore() {
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Check collisions
function checkCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y
            ) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                score += 10;
                break;
            }
        }
    }
}

// Check power-up collisions
function checkPowerUpCollision() {
    for (let i = 0; i < powerUps.length; i++) {
        if (
            powerUps[i].x < player.x + player.width &&
            powerUps[i].x + powerUps[i].width > player.x &&
            powerUps[i].y < player.y + player.height &&
            powerUps[i].y + powerUps[i].height > player.y
        ) {
            score += 50;
            powerUps.splice(i, 1);
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
            gameOver = true;
            displayGameOver();
            return;
        }
    }
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
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 40);
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
    updateBullets();
    drawBullets();
    updatePowerUps();
    drawPowerUps();
    checkCollisions();
    checkPowerUpCollision();
    updateDifficulty(timestamp); // Pass timestamp for dynamic spawn rate
    updateLevel();
    updateScore();
    checkGameOver();

    requestAnimationFrame(gameLoop);
}

// Spawn enemies and power-ups at intervals
setInterval(spawnEnemy, 2000);
setInterval(spawnPowerUp, 8000);

// Start the game loop
gameLoop();
