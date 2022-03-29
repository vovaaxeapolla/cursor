const canvas = document.createElement('canvas'),
ctx = canvas.getContext('2d'),
cursor = document.querySelector('#cursor'),
cursorPos = {
    x: 0,
    y: 0,
};
 
let anim = 0;

document.querySelector('.animated-background').append(canvas);

document.addEventListener('mousemove', (event) => {
    cursor.style.left = event.clientX + 'px';
    cursor.style.top = event.clientY +'px';
    cursorPos.x = event.clientX;
    cursorPos.y = event.clientY;
});

const AnimationProperties = {
    amountParticles: 1200,
    particles: [],
    distance: 150,
    width: canvas.width = document.documentElement.clientWidth,
    height: canvas.height = document.documentElement.clientHeight, 
    particleColor: "#5ff",
    backgroundColor: "#222",
    clickAnim: false
};

class Particle{
    constructor(width, height){
        this.x = Math.random()*width;
        this.y = Math.random()*height;
        this.velocityX = Math.random()*2-1;
        this.velocityY = Math.random()*2-1;
    }
    
    move(){
        if(this.x + this.velocityX > AnimationProperties.width || this.x + this.velocityX < 0)this.velocityX *= -1;
        if(this.y + this.velocityY > AnimationProperties.height || this.y + this.velocityY < 0)this.velocityY *= -1;
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
};

document.addEventListener('mousedown', async function(e){
    let id = setInterval(() => {
        if(anim < 1)
        anim += 0.015;
        else{
        clearInterval(id);
        AnimationProperties.clickAnim = true;
        setTimeout(() =>{
            id = setInterval(() => {
                if(anim > 0)
                anim -= 0.015;
                else
                clearInterval(id)
            },1)
            AnimationProperties.clickAnim = false;
        },1000);
        }
    },1);   
});

window.addEventListener('resize', () =>{
    AnimationProperties.width = canvas.width = document.documentElement.clientWidth;
    AnimationProperties.height = canvas.height = document.documentElement.clientHeight;
});

//Очищаем канвас
function clear(){
    ctx.fillStyle = AnimationProperties.backgroundColor;
    ctx.fillRect(0,0,AnimationProperties.width,AnimationProperties.height);
}

function drawLines(){
    for(let i = 0; i < AnimationProperties.amountParticles; i++){
        let len = Math.sqrt((cursorPos.x-AnimationProperties.particles[i].x)*
                            (cursorPos.x-AnimationProperties.particles[i].x)+
                            (cursorPos.y-AnimationProperties.particles[i].y)*
                            (cursorPos.y-AnimationProperties.particles[i].y));
        if(len < AnimationProperties.distance){
            ctx.strokeStyle = `rgba(255,255,255,${1-1/AnimationProperties.distance*len-anim})`
            ctx.lineWidth = 1;
            ctx.beginPath()
            ctx.moveTo(cursorPos.x, cursorPos.y);
            ctx.lineTo(AnimationProperties.particles[i].x,AnimationProperties.particles[i].y);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

function drawText(){
    ctx.font = '48px serif';
    ctx.fillStyle = "#fff";
    ctx.fillText('Го секс', cursorPos.x+ 20, cursorPos.y);
}

function draw(){
    for(let i = 0; i < AnimationProperties.amountParticles; i++){
        let len = Math.sqrt((cursorPos.x-AnimationProperties.particles[i].x)*
                            (cursorPos.x-AnimationProperties.particles[i].x)+
                            (cursorPos.y-AnimationProperties.particles[i].y)*
                            (cursorPos.y-AnimationProperties.particles[i].y));
        if(len < AnimationProperties.distance){
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(AnimationProperties.particles[i].x,AnimationProperties.particles[i].y,0.5,0,Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
    }
}

function update(){
    for(let i = 0; i < AnimationProperties.amountParticles; i++)
    AnimationProperties.particles[i].move();
}

function render(){
    clear();
    update();
    drawLines();
    if(AnimationProperties.clickAnim)
    drawText();
    requestAnimationFrame(render);
}

function init(){
    for(let i = 0; i < AnimationProperties.amountParticles; i++)
        AnimationProperties.particles.push(new Particle(AnimationProperties.width, AnimationProperties.height));
    clear();
    render();
};

init();