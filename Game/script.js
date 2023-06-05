// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1500;
canvas.height = 800;

let score = 0;
let gameFrame = 0;
ctx.font = '70px Georgia';
let gameSpeed = 1;
let gameOver = false;

//Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener('mouseup', function(){
    mouse.click = false;
})

//Player
const playerLeft = new Image();
playerLeft.src = 'plane_2_red.png';
const playerRight = new Image();
playerRight.src = 'flipped_plane_2_red.png';

class Player {
    constructor(){
        this.x = canvas.width;
        this.y = canvas. height/2;
        this.radius = 70;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 1013; 
        this.spriteHeight = 1013;
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        if ( mouse.x != this.x) {
            this.x -= dx/30;
        }
        if ( mouse.y != this.y) {
            this.y -= dy/30;
        }
    }
    draw(){
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 120, 0- 120, this.spriteWidth/4, this.spriteHeight/4);
        } else {
        ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 120, 0- 120, this.spriteWidth/4, this.spriteHeight/4);
        }
        ctx.restore();
    }
}
const player = new Player();

// Coins
const bubblesArray = [];

const goldcoin = new Image();
goldcoin.src = 'gold_coin.png';

class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;     
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }
    draw(){
        ctx.drawImage(goldcoin, this.x, this.y, this.radius * 2, this.radius * 2);
    }
}
function handleBubbles(){
    if (gameFrame % 50 == 0){
        bubblesArray.push(new Bubble());
    }
    for (let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update();
        bubblesArray[i].draw();
    } 
    for (let i = 0; i< bubblesArray.length; i++){
        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2){
            bubblesArray.splice(i, 1);
        }
        if (bubblesArray[i]){
            if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
                if (!bubblesArray[i].counted){
                    playSound('Collect.wav');
                    score++;
                    bubblesArray[i].counted = true;
                    bubblesArray.splice(i, 1);
                }
            }
        }
        
    }
}

function playSound(url) {
    const audio = new Audio(url);
    audio.play();
  }


//background
const background = new Image();
background.src = 'background.png';

//Enemies
const enemyImage = new Image();
enemyImage.src = 'enemy.png';

class Enemy{
    constructor(){
        this.x = canvas.width + 200;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 30;
        this.speed = Math.random() * 10 + 1 + score/8;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 187;
    }
    draw(){
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 58, this.y - 25, this.spriteWidth / 4, this.spriteHeight / 4);
    }
    update(){
        this.x -= this.speed;
        if (this.x < 0 - this.radius * 2){
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 10 + 1 + score/8;
        }
        if (gameFrame % 5 == 0){
            this.frame++;
            if (this.frame >= 12) this.frame = 0;
            if (this.frame == 3 || this.frame == 7 || this.frame || 11){
                this.frameX = 0;
            }   else {
                this.frameX++;
            }
           
        }
        // collision with player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + player.radius){
            handleGameOver();
        }
    }
}

const enemy1 = new Enemy();
const enemy2 = new Enemy();
const enemy3 = new Enemy();
function handleEnemies(){
    enemy1.draw();
    enemy1.update();
    enemy2.draw();
    enemy2.update();
    enemy3.draw();
    enemy3.update();
}

function handleGameOver(){
    ctx.fillStyle = 'black';
    ctx.fillText('Game OVER, you have collected ' + score + ' coin(s)', 120, 200);
    ctx.fillText('Press F5 for restart', 480, 500)
    gameOver = true;
}
//Animation Loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    handleBubbles();
    player.update();
    player.draw();
    handleEnemies();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    if (!gameOver) requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
});

