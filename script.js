const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let animationId;
let isAnimating = false;

const settings = {
    speed: 1,
    size: 1.2,
    colorMode: 'mafer'
};

const heartConfig = {
    particleCount: 100,
    maxParticles: 2500,
};

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        let t = Math.random() * Math.PI * 2;
        let scale = Math.min(width, height) / 35 * settings.size; 
        
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);

        this.x = width / 2 + x * scale;
        this.y = height / 2 - y * scale;

        this.vx = (Math.random() - 0.5) * 2 * settings.speed;
        this.vy = (Math.random() - 0.5) * 2 * settings.speed;

        this.life = 1; 
        this.decay = Math.random() * 0.01 + 0.005; 
        this.size = Math.random() * 2 + 1;

        let hueBase = Math.random() > 0.5 ? 340 + Math.random() * 20 : 0 + Math.random() * 15;
        this.hue = hueBase;
    }

    update() {
        this.x += this.vx * settings.speed;
        this.y += this.vy * settings.speed;
        this.life -= this.decay;
        if (this.life <= 0) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.life})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < heartConfig.maxParticles; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    if (!isAnimating) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    animationId = requestAnimationFrame(animate);
}

function startHeartAnimation() {
    if (isAnimating) return;
    resize();
    initParticles();
    isAnimating = true;
    animate();
}