// Select the canvas element
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const enemies = [];
const enemyWidth = 50;
const enemyHeight = 50;
const enemySpeed = 2;

// Bullet properties
const bullets = [];
const bulletWidth = 5;
const bulletHeight = 10;
const bulletSpeed = 7;

// Set the canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Placeholder for game initialization
function initGame() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Space Shooter", canvas.width / 2 - 100, canvas.height / 2);
}

// Player ship properties
const player = {
    x: canvas.width / 2 - 25, // Start at the center of the canvas
    y: canvas.height - 60, // Near the bottom of the canvas
    width: 50,
    height: 50,
    color: "blue",
    speed: 5
};

// Handle keyboard input
const keys = {
    left: false,
    right: false
};

// Event listeners for key presses
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") keys.left = true;
    if (event.key === "ArrowRight") keys.right = true;
});
document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") keys.left = false;
    if (event.key === "ArrowRight") keys.right = false;
});
// Handle shooting with spacebar
document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        spawnBullet();
    }
});

// Update player position
function updatePlayer() {
    if (keys.left && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.right && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
}

// Draw the player ship
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Function to create enemies
function spawnEnemy() {
    const x = Math.random() * (canvas.width - enemyWidth); // Random x position
    const y = -enemyHeight; // Start off-screen (above canvas)
    enemies.push({ x, y, width: enemyWidth, height: enemyHeight, color: "red" });
}

// Update enemy positions
function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemySpeed; // Move enemy down the screen

        // Remove enemy if it goes off the bottom of the canvas
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

// Spawn an enemy every 1.5 seconds
setInterval(spawnEnemy, 1500);


// Spawn a bullet
function spawnBullet() {
    bullets.push({
        x: player.x + player.width / 2 - bulletWidth / 2, // Center bullet on player
        y: player.y,
        width: bulletWidth,
        height: bulletHeight,
        color: "yellow"
    });
}

// Update bullet positions
function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bulletSpeed; // Move bullet up the screen

        // Remove bullet if it goes off the top of the canvas
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

// Score variable
let score = 0;

// Update score when an enemy is destroyed
function updateScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Check for collisions between bullets and enemies
function checkCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y
            ) {
                // Remove enemy and bullet on collision
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                i--; // Adjust bullet index after removal

                // Increase the score
                score += 10;
                break;
            }
        }
    }
}

// Game over flag
let gameOver = false;

// Function to display "Game Over" screen
function displayGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 80);
}

// Restart the game
document.addEventListener("keydown", (event) => {
    if (gameOver && event.key.toLowerCase() === "r") {
        // Reset game state
        gameOver = false;
        score = 0;
        bullets.length = 0;
        enemies.length = 0;
        player.x = canvas.width / 2 - player.width / 2;
        gameLoop(); // Restart the game loop
    }
});

// Check for game over (when an enemy reaches the player)
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


// Update the game loop to include the game over check
function gameLoop() {
    if (gameOver) return; // Stop the loop if the game is over

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    updatePlayer(); // Update player position
    drawPlayer(); // Draw the player ship
    updateEnemies(); // Update enemy positions
    drawEnemies(); // Draw enemies
    updateBullets(); // Update bullet positions
    drawBullets(); // Draw bullets
    checkCollisions(); // Check for collisions
    checkGameOver(); // Check for game over
    updateScore(); // Display the score
    requestAnimationFrame(gameLoop); // Repeat the loop
}



// Start the game loop
gameLoop();

// Start the game
initGame();
