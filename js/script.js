// Select the canvas element
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    updatePlayer(); // Update player position
    drawPlayer(); // Draw the player ship
    requestAnimationFrame(gameLoop); // Repeat the loop
}

// Start the game loop
gameLoop();


// Start the game
initGame();
