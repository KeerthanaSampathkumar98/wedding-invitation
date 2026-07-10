/**
 * Cinematic Luxury Wedding Invitation Architecture
 * Engine: Vanilla JS ES6 + HTML5 Canvas Rendering
 * Performance Baseline: Target 60 FPS under IntersectionObserver tracking
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCinematicFXEngine();
    initCountdownTimer();
    initIntersectionObservers();
    initAudioController();
    initSmoothScrollEvents();
});

/* ==========================================================================
   PRELOADER CONTROLLER
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const percentDisplay = document.getElementById('loader-percentage');
    let currentPercent = 0;
    
    // Simulate luxury resource loading progression smoothly
    const interval = setInterval(() => {
        currentPercent += Math.floor(Math.random() * 12) + 4;
        if (currentPercent >= 100) {
            currentPercent = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 500);
        }
        percentDisplay.textContent = `${currentPercent}%`;
    }, 80);
}

/* ==========================================================================
   CINEMATIC FX CANVAS ENGINE (Particles, Fireflies, Fireworks)
   ========================================================================== */
function initCinematicFXEngine() {
    const canvas = document.getElementById('cinematic-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const particles = [];
    const fireworks = [];
    const config = {
        maxParticles: 45,
        fireflyColor: 'rgba(243, 229, 171, ',
        petalColor: 'rgba(183, 110, 121, '
    };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Particle Object Defenition
    class Particle {
        constructor(type) {
            this.type = type; // 'firefly' or 'petal'
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height + height;
            this.size = Math.random() * (this.type === 'firefly' ? 2.5 : 5) + 1;
            this.speedY = -(Math.random() * 0.7 + 0.3);
            this.speedX = Math.sin(Math.random() * 2) * 0.4;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.oscillationSpeed = Math.random() * 0.02 + 0.01;
            this.oscillationDegree = 0;
        }
        update() {
            this.y += this.speedY;
            this.oscillationDegree += this.oscillationSpeed;
            this.x += this.speedX + Math.sin(this.oscillationDegree) * 0.3;
            
            if (this.y < -20 || this.x < -20 || this.x > width + 20) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            if (this.type === 'firefly') {
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = config.fireflyColor + this.alpha + ')';
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(243, 229, 171, 0.8)';
            } else {
                // Leaf/Petal organic shape paths
                ctx.ellipse(this.x, this.y, this.size, this.size * 1.5, Math.PI / 4, 0, Math.PI * 2);
                ctx.fillStyle = config.petalColor + this.alpha + ')';
                ctx.shadowBlur = 0;
            }
            ctx.fill();
        }
    }

    // Fireworks Dynamic Explosion Element
    class Firework {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * (height * 0.35) + height * 0.1;
            this.particles = [];
            this.exploded = false;
            this.color = `hsl(${Math.random() * 40 + 25}, 85%, 65%)`; // Royal golden-orange spectra
            this.timer = Math.random() * 60 + 40; 
        }
        explode() {
            const count = 50;
            for(let i=0; i<count; i++) {
                const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
                const speed = Math.random() * 2.5 + 1;
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    velX: Math.cos(angle) * speed,
                    velY: Math.sin(angle) * speed,
                    alpha: 1,
                    decay: Math.random() * 0.015 + 0.008
                });
            }
            this.exploded = true;
        }
        update() {
            if (!this.exploded) {
                this.timer--;
                if(this.timer <= 0) this.explode();
            } else {
                this.particles.forEach((p, index) => {
                    p.x += p.velX;
                    p.y += p.velY;
                    p.velY += 0.015; // smooth gravity index
                    p.alpha -= p.decay;
                    if(p.alpha <= 0) this.particles.splice(index, 1);
                });
                if(this.particles.length === 0) this.reset();
            }
        }
        draw() {
            if (this.exploded) {
                ctx.shadowBlur = 0;
                this.particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = this.color.replace(')', `, ${p.alpha})`).replace('hsl', 'hsla');
                    ctx.fill();
                });
            }
        }
    }

    // Instantiate Particle System Arrays
    for(let i=0; i < config.maxParticles / 2; i++) {
        particles.push(new Particle('firefly'));
        particles.push(new Particle('petal'));
    }
    for(let i=0; i<3; i++) {
        fireworks.push(new Firework());
    }

    // Frame Execution Loop
    function renderFrame() {
        ctx.clearRect(0, 0, width, height);
        
        // Disable shadowBlur resets unless drawing fireflies to prioritize performance metrics
        particles.forEach(p => { p.update(); p.draw(); });
        ctx.shadowBlur = 0; 
        
        fireworks.forEach(f => { f.update(); f.draw(); });
        
        requestAnimationFrame(renderFrame);
    }
    
    requestAnimationFrame(renderFrame);
}

/* ==========================================================================
   LIVE COUNTDOWN TIMER ENGINE
   ========================================================================== */
function initCountdownTimer() {
    // Exact Target String: 30 August 2026 6:30 PM IST (UTC+5.5) -> "2026-08-30T18:30:00+05:30"
    const targetDate = new Date("2026-08-30T18:30:00+05:30").getTime();
    
    const elements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    function update() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            // Zero-out metrics cleanly if event date is hit
            Object.keys(elements).forEach(key => elements[key].textContent = "00");
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        elements.days.textContent = String(d).padStart(2, '0');
        elements.hours.textContent = String(h).padStart(2, '0');
        elements.minutes.textContent = String(m).padStart(2, '0');
        elements.seconds.textContent = String(s).padStart(2, '0');
    }
    
    update();
    setInterval(update, 1000);
}

/* ==========================================================================
   INTERSECTION OBSERVERS & SCROLL ENGINE ANIMATIONS
   ========================================================================== */
function initIntersectionObservers() {
    // Process Heading Split Word Animations beforehand
    const splitTargets = document.querySelectorAll('.split-words-target');
    splitTargets.forEach(target => {
        const words = target.textContent.split(' ');
        target.innerHTML = '';
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.classList.add('word-span');
            span.style.transitionDelay = `${index * 0.12}s`;
            target.appendChild(span);
        });
    });

    // Observer Configuration Setup
    const options = {
        root: null,
        threshold: 0.18,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Fire internal word transitions if targeting typography containers
                const innerWords = entry.target.querySelectorAll('.word-span');
                innerWords.forEach(word => word.classList.add('animate'));
            }
        });
    }, options);

    const animatedSections = document.querySelectorAll('.scroll-animate-section');
    animatedSections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   BACKGROUND INTERACTIVE AUDIO CONTROL
   ========================================================================== */
function initAudioController() {
    const btn = document.getElementById('audio-control');
    const audio = document.getElementById('wedding-bg-music');
    const playIcon = btn.querySelector('.play-icon');
    const pauseIcon = btn.querySelector('.pause-icon');
    const textLabel = btn.querySelector('.audio-text');

    let isPlaying = false;

    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            textLabel.textContent = "Play Music";
        } else {
            audio.play().then(() => {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                textLabel.textContent = "Pause";
            }).catch(error => console.log("Audio playback user permission block validation: ", error));
        }
        isPlaying = !isPlaying;
    }

    btn.addEventListener('click', togglePlay);
    
    // Fallback context: Try automatic triggers on initial interaction states safely
    document.body.addEventListener('click', () => {
        if(!isPlaying && audio.paused) {
            // Uncomment next lines if explicit auto-on feature is required on user contact baseline
            // togglePlay(); 
        }
    }, { once: true });
}

/* ==========================================================================
   SMOOTH SCROLL INTERACTION AND MAPS RIPPLE SYSTEM
   ========================================================================== */
function initSmoothScrollEvents() {
    const scrollTrigger = document.getElementById('scroll-trigger');
    const countdownSec = document.getElementById('countdown-section');

    scrollTrigger.addEventListener('click', () => {
        countdownSec.scrollIntoView({ behavior: 'smooth' });
    });

    // Material-style luxury ripple trigger logic for buttons
    const rippleButtons = document.querySelectorAll('.ripple-btn');
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = ripple.style.height = 'max(' + rect.width + 'px,' + rect.height + 'px)';
            ripple.style.left = x - (parseFloat(ripple.style.width)/2) + 'px';
            ripple.style.top = y - (parseFloat(ripple.style.height)/2) + 'px';
            ripple.style.background = 'rgba(243, 229, 171, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.pointerEvents = 'none';
            ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.style.transform = 'scale(2.5)';
                ripple.style.opacity = '0';
            }, 10);
            
            setTimeout(() => ripple.remove(), 650);
        });
    });
}