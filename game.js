const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "images/player.png";

const enemyImg = new Image();
enemyImg.src = "images/enemy.png";

const treeImg = new Image();
treeImg.src = "images/tree.png";

const backgroundImg = new Image();
backgroundImg.src = "images/background.png";

canvas.width = 900;
canvas.height = 500;

let score = 0;
let health = 100;



let player = {
    x: 100,
    y: 250,
    width: 40,
    height: 40,
    speed: 5
};

let enemies = [
    {x:700,y:100,width:40,height:40},
    {x:800,y:200,width:40,height:40},
    {x:650,y:300,width:40,height:40},
    {x:750,y:400,width:40,height:40},
    {x:850,y:150,width:40,height:40}
];

let bullets = [];
let enemyBullets = [];
let keys = {};

document.addEventListener("keydown", function(e){

    keys[e.key] = true;

    if(e.code === "Space"){
        bullets.push({
            x: player.x + player.width,
            y: player.y + 18,
            width: 12,
            height: 5,
            speed: 10
        });
    }

});

document.addEventListener("keyup", function(e){
    keys[e.key] = false;
});

function update(){

    // Player movement
    if(keys["a"] || keys["ArrowLeft"]) player.x -= player.speed;
    if(keys["d"] || keys["ArrowRight"]) player.x += player.speed;
    if(keys["w"] || keys["ArrowUp"]) player.y -= player.speed;
    if(keys["s"] || keys["ArrowDown"]) player.y += player.speed;

    // Keep player inside map
    if(player.x < 0) player.x = 0;
    if(player.y < 0) player.y = 0;

    if(player.x > canvas.width - player.width)
        player.x = canvas.width - player.width;

    if(player.y > canvas.height - player.height)
        player.y = canvas.height - player.height;

    // Move player bullets
    for(let bullet of bullets){
        bullet.x += bullet.speed;
    }

    bullets = bullets.filter(b => b.x < canvas.width);

    // Enemies
    for(let enemy of enemies){

        // Chase player
        if(enemy.x > player.x) enemy.x -= 2;
        if(enemy.x < player.x) enemy.x += 2;

        if(enemy.y > player.y) enemy.y -= 2;
        if(enemy.y < player.y) enemy.y += 2;

        // Touch player
        if(
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ){
            health -= 0.2;
        }

        // Enemy shoots
        if(Math.random() < 0.003){
            enemyBullets.push({
                x: enemy.x,
                y: enemy.y + 18,
                width: 10,
                height: 5,
                speed: 5
            });
        }
    }

    // Move enemy bullets
    for(let bullet of enemyBullets){
        bullet.x -= bullet.speed;
    }

    enemyBullets = enemyBullets.filter(b => b.x > 0);

    // Enemy bullets hit player
    for(let i = enemyBullets.length - 1; i >= 0; i--){

        let b = enemyBullets[i];

        if(
            b.x < player.x + player.width &&
            b.x + b.width > player.x &&
            b.y < player.y + player.height &&
            b.y + b.height > player.y
        ){
            health -= 10;
            enemyBullets.splice(i,1);
        }

    }

    // Player bullets hit enemies
    for(let i = enemies.length - 1; i >= 0; i--){

        for(let j = bullets.length - 1; j >= 0; j--){

            if(
                bullets[j].x < enemies[i].x + enemies[i].width &&
                bullets[j].x + bullets[j].width > enemies[i].x &&
                bullets[j].y < enemies[i].y + enemies[i].height &&
                bullets[j].y + bullets[j].height > enemies[i].y
            ){
                enemies.splice(i,1);
                bullets.splice(j,1);
                score += 100;
                break;
            }

        }

    }

    // Respawn enemies
    if(enemies.length === 0){

        for(let i = 0; i < 5; i++){

            enemies.push({
                x:650 + Math.random()*200,
                y:Math.random()*450,
                width:40,
                height:40
            });

        }

    }

}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Ground
    // Background Image
ctx.drawImage(backgroundImg,0,0,canvas.width,canvas.height);

    // Trees
  
ctx.drawImage(treeImg,200,100,60,80);
ctx.drawImage(treeImg,500,300,60,80);
ctx.drawImage(treeImg,750,80,60,80);

    // Score
    ctx.fillStyle = "white";
    ctx.font = "25px Arial";
    ctx.fillText("Score : " + score,20,30);

    // Health
    ctx.fillStyle = "red";
    ctx.fillText("Health : " + Math.floor(health),20,60);

  // Player
ctx.drawImage(
    playerImg,
    player.x,
    player.y,
    player.width,
    player.height
);

    // Enemies
for(let enemy of enemies){
    ctx.drawImage(
        enemyImg,
        enemy.x,
        enemy.y,
        enemy.width,
        enemy.height
    );
}

    // Player bullets
    ctx.fillStyle = "yellow";
    for(let bullet of bullets){
        ctx.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);
    }

    // Enemy bullets
    ctx.fillStyle = "white";
    for(let bullet of enemyBullets){
        ctx.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);
    }

    // Game Over
    if(health <= 0){

        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "60px Arial";
        ctx.fillText("GAME OVER",220,250);

        ctx.font = "30px Arial";
        ctx.fillText("Final Score : " + score,300,320);
    }

}







function gameLoop(){

    update();
    draw();

    if(health > 0){
        requestAnimationFrame(gameLoop);
    }

}

let loaded = 0;

function imageLoaded(){
    loaded++;
    if(loaded === 4){
        gameLoop();
    }
}

playerImg.onload = imageLoaded;
enemyImg.onload = imageLoaded;
treeImg.onload = imageLoaded;
backgroundImg.onload = imageLoaded;