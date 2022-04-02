const canvas = document.createElement('canvas'),
ctx = canvas.getContext('2d'),
cursor = document.querySelector('#cursor'),
cursorPos = {
    x: 0,
    y: 0,
    mass: 1
},
circle = document.querySelector('#circle');

canvas.style.backgroundColor = "rgba(20, 20, 20, 1)";
document.querySelector('.animated-background').append(canvas);

document.addEventListener('mousemove', (event) => {
    cursorPos.x = event.clientX;
    cursorPos.y = event.clientY;
    cursor.style.left = circle.style.left = cursorPos.x + 'px';
    cursor.style.top = circle.style.top =cursorPos.y +'px';
});

const AnimOpts = {
    distance        : 150,
    width           : canvas.width = document.documentElement.clientWidth,
    height          : canvas.height = document.documentElement.clientHeight, 
    backgroundColor : "rgba(20, 20, 20, 0.2)",
};

const cursorTail = {
    size            : 100,
    particles       : [],
    smooth          : 0.01
}

class Particle{
        constructor(x, y, velocityX, velocityY, accelerationX, accelerationY, mass , radius, color, smooth, sphere,maxVelocity,maxAcceleartion,minVelocity,minAcceleartion){
        this.x                  = x                 || 0;
        this.y                  = y                 || 0;
        this.velocityX          = velocityX         || 0;
        this.velocityY          = velocityY         || 0;
        this.accelerationX      = accelerationX     || 0;
        this.accelerationY      = accelerationY     || 0;
        this.mass               = mass              || 0.05;
        this.radius             = radius            || 1;
        this.color              = color             || "#FFF";
        this.smooth             = smooth            || 1;
        this.sphere             = sphere            || 300
        this.maxVelocity        = maxVelocity       || 5
        this.maxAcceleartion    = maxAcceleartion   || 2
        this.minVelocity        = minVelocity       || 0
        this.minAcceleartion    = minAcceleartion   || 0
    }

    collision(OtherParticle){
        if((this.radius + OtherParticle.radius)*(this.radius + OtherParticle.radius) < 
            (this.x - OtherParticle.x)*
            (this.x - OtherParticle.x)+
            (this.y - OtherParticle.y)*
            (this.y - OtherParticle.y)
        )return true;
        return false;
    }
    
    calcGravity(OtherParticle){
        let dx = OtherParticle.x - this.x,
            dy = OtherParticle.y - this.y,
            dist = Math.sqrt(dx*dx+dy*dy),  
            f = (dist-this.sphere)/dist*OtherParticle.mass || 1;
            this.accelerationX += dx*f*this.mass;
            this.accelerationY += dy*f*this.mass;
    }

    move(){
        if(Math.abs(this.velocityX) > this.maxVelocity && this.velocityX > 0)this.velocityX = this.maxVelocity;
        if(Math.abs(this.velocityX) > this.maxVelocity && this.velocityX < 0)this.velocityX = -this.maxVelocity;
        if(Math.abs(this.velocityY) > this.maxVelocity && this.velocityY > 0)this.velocityY = this.maxVelocity;
        if(Math.abs(this.velocityY) > this.maxVelocity && this.velocityY < 0)this.velocityY = -this.maxVelocity;
        this.velocityX *= this.smooth;
        this.velocityY *= this.smooth;
        this.velocityX += this.accelerationX;
        this.velocityY += this.accelerationY;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
};

function randomD(min,max){
    return Math.random()*(max-min)+min;
}

function randomHEX(){
    return "#" + Math.round(Math.random()*255).toString(16).padStart(2, '0')+ Math.round(Math.random()*255).toString(16).padStart(2, '0')+ Math.round(Math.random()*255).toString(16).padStart(2, '0')
}

function HexToRgb(hex){
    return parseInt(hex.slice(1,3),16).toString(10) + "," + parseInt(hex.slice(3,5),16).toString(10) + "," + parseInt(hex.slice(5,7),16).toString(10);
}

function getDistance(x1,y1,x2,y2){
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

window.addEventListener('resize', () =>{
    AnimOpts.width = canvas.width = document.documentElement.clientWidth;
    AnimOpts.height = canvas.height = document.documentElement.clientHeight;
});

//Очищаем канвас
function clear(){
    ctx.fillStyle = AnimOpts.backgroundColor;
    ctx.fillRect(0,0,AnimOpts.width,AnimOpts.height);
}

function drawLines(){
    for(let i of cursorTail.particles){
        let len = getDistance(i.x,i.y,cursorPos.x,cursorPos.y);
        if(len < AnimOpts.distance){
            ctx.strokeStyle = `rgba(${HexToRgb(i.color)},${1-1/AnimOpts.distance*len})`
            ctx.lineWidth = 1;
            ctx.beginPath()
            ctx.moveTo(cursorPos.x, cursorPos.y);
            ctx.lineTo(i.x,i.y);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

function update(){
    for(let i of cursorTail.particles){
        i.calcGravity(cursorPos);
        for(let j of cursorTail.particles){
            if(i != j)
                i.calcGravity(j);
        }
    }

    for(let i of cursorTail.particles)
    i.move();
}

function drawTail(){
    for(let i of cursorTail.particles){
            ctx.fillStyle = i.color;
            ctx.beginPath();
            ctx.arc(i.x,i.y,i.radius,0,Math.PI*2);
            ctx.fill();
            ctx.closePath();
    }
}

function render(){
    clear();
    update();
    drawLines();
    drawTail();
    requestAnimationFrame(render);
}

function init(){
    for(let i = 0; i < cursorTail.size; i++){
        cursorTail.particles.push(
            new Particle(
                Math.random()*AnimOpts.width,
                Math.random()*AnimOpts.height,
                undefined,
                undefined, 
                undefined,
                undefined, 
                Math.random()*0.1, 
                Math.random()*5, 
                randomHEX(),
                0.9,
                300,
                5,
                Math.random()
                ));
    }
    render();
};
init();