const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const lunaContainer = document.getElementById('lunaContainer');
const startBtn = document.getElementById('startBtn');
const bgMusic = document.getElementById('bgMusic');
const lunaDOM = document.querySelector('.luna'); 
const lyricsDOM = document.getElementById('lyricsContainer');

// --- LETRAS DE LA CANCIÓN CON SUS TIEMPOS ---
const letrasCancion = [
    { tiempo: 14, texto: "Novedad<br>Va iniciando este amor<br>Aún estás oculta<br>Y yo te debo descifrar" },
    { tiempo: 27, texto: "Cuarto<br>Va creciente el corazón<br>Te veo un poco más<br>De perfil que linda estás" },
    { tiempo: 40, texto: "Ay, luna, luna, luna<br>Dame la dicha y fortuna<br>De dormir entre tus dunas<br>Otra vez" },
    { tiempo: 53, texto: "Ay, luna, luna, luna<br>Eres el faro que me alumbra<br>Entre la oscuridad confusa<br>Guíame" },
    { tiempo: 67, texto: "Luna llena luminiscente<br>Me hechizaste en fase brillante<br>Tu cariño no se me pierde<br>Ni siquiera en cuarto menguante" },
    { tiempo: 80, texto: "Y aunque todo esto se acabe<br>Y tu rostro ya no lo vea<br>El ciclo volverá al instante<br>En que te conocí, luna nueva" },
    { tiempo: 93, texto: "Pues, tú sabes bien<br>Que yo te soñaré<br>Durante siglos y siglos<br>Siempre te voy a querer" },
    { tiempo: 107, texto: "Pues, tú sabes bien<br>Que yo te soñaré<br>Durante siglos y siglos<br>Aunque no me puedas ver" },
    { tiempo: 120, texto: "Ay, luna, luna, luna<br>Dame la dicha y fortuna<br>De dormir entre tus dunas<br>Otra vez" },
    { tiempo: 133, texto: "Ay, luna, luna, luna<br>Eres el faro que me alumbra<br>Entre la oscuridad confusa<br>Guíame" },
    { tiempo: 148, texto: "Todos los procesos<br>Tienen un inicio y fin<br>Porque todo lo que nace<br>Se tiene que morir" },
    { tiempo: 154, texto: "Pero hoy estás aquí<br>Igual que la noche anterior<br>Tu proceso se repite<br>Y se recicla nuestro amor" },
    { tiempo: 160, texto: "Y desde aquí te estaré viendo<br>Como brillas todavía<br>Como cubres con tu sábana<br>Azul mi vida fría" },
    { tiempo: 167, texto: "Que de día es pesadilla<br>Y en la noches de nostalgia<br>Tu recuerdo me acompaña<br>Y me salva del miedo a la nada" },
    { tiempo: 176, texto: "Luna, luna, luna<br>Dame la dicha y fortuna<br>De dormir entre tus dunas<br>Otra vez" },
    { tiempo: 190, texto: "Ay, luna, luna, luna<br>Eres el faro que me alumbra<br>Entre la oscuridad confusa<br>Guíame" },
    { tiempo: 203, texto: "Luna<br>Eres mi luz<br>Eres mi lumbre<br>En la noche oscura" }
];
let currentLyricIndex = -1;

let width, height;
let starsArray = [];
let hasStarted = false;

let starSpeedMultiplier = 1; 
let targetStarSpeed = 1;     

const STAR_COUNT = 400; 
const MOUSE_RADIUS = 100; 
let mouse = { x: null, y: null };

bgMusic.playbackRate = 1.25; 

const tiemposLuna = [40, 54, 120, 134, 176, 189];
let flashesHechos = new Set();
let isRapidFlashing = false; 

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize(); 

class Particle {
    constructor() {
        this.angle = Math.random() * Math.PI * 2; 
        this.radius = Math.random() * (Math.max(width, height) * 1.2); 
        this.angularSpeed = (Math.random() * 0.001 + 0.0002); 
        this.offsetX = 0;
        this.offsetY = 0;
        this.size = Math.random() * 1.5 + 0.5;
        this.twinkleSpeed = Math.random() * 0.01 + 0.002; 
        this.opacity = Math.random(); 
        this.density = (Math.random() * 20) + 1;
    }

    draw() {
        ctx.beginPath();
        if (isRapidFlashing) {
            ctx.fillStyle = Math.floor(Date.now() / 300) % 2 === 0 ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.1)';
        } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        }
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.angle += this.angularSpeed * starSpeedMultiplier;
        let cx = width / 2;
        let cy = height * 0.65; 
        let baseX = cx + Math.cos(this.angle) * this.radius;
        let baseY = cy + Math.sin(this.angle) * this.radius;

        if (mouse.x !== null) {
            let dx = mouse.x - (baseX + this.offsetX);
            let dy = mouse.y - (baseY + this.offsetY);
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < MOUSE_RADIUS) {
                let force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
                this.offsetX -= (dx / distance) * force * this.density;
                this.offsetY -= (dy / distance) * force * this.density;
            } else {
                this.offsetX -= this.offsetX / 10;
                this.offsetY -= this.offsetY / 10;
            }
        } else {
            this.offsetX -= this.offsetX / 10;
            this.offsetY -= this.offsetY / 10;
        }

        this.x = baseX + this.offsetX;
        this.y = baseY + this.offsetY;

        if (!isRapidFlashing) {
            this.opacity += this.twinkleSpeed;
            if (this.opacity >= 1 || this.opacity <= 0.1) this.twinkleSpeed *= -1;
        }
    }
}

function initStars() {
    starsArray = [];
    for (let i = 0; i < STAR_COUNT; i++) starsArray.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, width, height); 
    starSpeedMultiplier += (targetStarSpeed - starSpeedMultiplier) * 0.015;
    starsArray.forEach(star => { star.update(); star.draw(); });
    if (hasStarted) requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => { 
    if (hasStarted) { mouse.x = e.x; mouse.y = e.y; } 
});
window.addEventListener('mouseout', () => { mouse.x = null; });

startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    canvas.style.pointerEvents = 'auto';
    lunaContainer.style.animationPlayState = 'running';
    hasStarted = true;
    bgMusic.play().catch(e => console.log("Audio bloqueado"));
    animate();
});

const eventosCoreografiaLuna = [
    { tiempo: 147, accion: 'brillar' },
    { tiempo: 148, accion: 'acelerar_estrellas' },
    { tiempo: 150, accion: 'esconder' },
    { tiempo: 151, accion: 'mostrar' },
    { tiempo: 153, accion: 'esconder' },
    { tiempo: 154, accion: 'mostrar' },
    { tiempo: 157, accion: 'esconder' },
    { tiempo: 158, accion: 'mostrar' },
    { tiempo: 159, accion: 'esconder' },
    { tiempo: 160, accion: 'mostrar' },
    { tiempo: 176, accion: 'normalizar_estrellas' },
    { tiempo: 220, accion: 'final_cinematico' }
];
let coreografiaHecha = new Set();

bgMusic.addEventListener('timeupdate', () => {
    if (!hasStarted) return;
    let tiempoActual = bgMusic.currentTime;

    let newLyricIndex = -1;
    for (let i = 0; i < letrasCancion.length; i++) {
        if (tiempoActual >= letrasCancion[i].tiempo) {
            newLyricIndex = i;
        } else {
            break; 
        }
    }

    if (newLyricIndex !== currentLyricIndex) {
        currentLyricIndex = newLyricIndex;
        if (currentLyricIndex !== -1) {
            lyricsDOM.style.opacity = 0; 
            setTimeout(() => {
                lyricsDOM.innerHTML = letrasCancion[currentLyricIndex].texto;
                lyricsDOM.style.opacity = 1; 
            }, 400); 
        }
    }

    tiemposLuna.forEach(t => {
        if (tiempoActual >= t && tiempoActual < t + 1 && !flashesHechos.has(t)) {
            flashesHechos.add(t);
            isRapidFlashing = true; 
            lunaDOM.classList.add('luna-baila');
            setTimeout(() => { 
                isRapidFlashing = false; 
                lunaDOM.classList.remove('luna-baila'); 
            }, 3000); 
        }
    });

    eventosCoreografiaLuna.forEach(evento => {
        if (tiempoActual >= evento.tiempo && tiempoActual < evento.tiempo + 1 && !coreografiaHecha.has(evento.tiempo)) {
            coreografiaHecha.add(evento.tiempo);
            
            if (evento.accion === 'brillar') lunaDOM.classList.add('brillo-intenso');
            if (evento.accion === 'esconder') {
                lunaContainer.classList.remove('mostrada-rapido');
                lunaContainer.classList.add('escondida-rapido');
            }
            if (evento.accion === 'mostrar') {
                lunaContainer.classList.remove('escondida-rapido');
                lunaContainer.classList.add('mostrada-rapido');
            }
            
            if (evento.accion === 'acelerar_estrellas') targetStarSpeed = 30; 
            if (evento.accion === 'normalizar_estrellas') targetStarSpeed = 1; 

            if (evento.accion === 'final_cinematico') {
                // Visuales
                document.querySelector('.mar').style.transition = 'opacity 5s ease';
                document.querySelector('.mar').style.opacity = '0';
                document.querySelector('.cielo').style.transition = 'opacity 5s ease';
                document.querySelector('.cielo').style.opacity = '0';
                canvas.style.transition = 'opacity 5s ease';
                canvas.style.opacity = '0';
                lyricsDOM.style.transition = 'opacity 2s ease'; 
                lyricsDOM.style.opacity = '0';

                // Fade Out de Música
                let fadeInterval = setInterval(() => {
                    if (bgMusic.volume > 0.05) {
                        bgMusic.volume -= 0.05;
                    } else {
                        bgMusic.volume = 0;
                        bgMusic.pause();
                        clearInterval(fadeInterval);
                    }
                }, 200);

                setTimeout(() => {
                    lunaContainer.style.transition = 'opacity 4s ease, transform 4s ease';
                    lunaContainer.style.opacity = '0';
                    lunaContainer.style.transform = 'scale(0.5)'; 
                }, 5000);
            }
        }
    });
});

initStars();