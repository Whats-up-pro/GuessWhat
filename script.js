// Soft Cute Pop Audio Synthesizer (Zero asset dependencies)
class CuteAudio {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playPop() {
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Gentle bubble pop pitch bend
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      // Audio not supported or autoplay blocked
    }
  }

  playSuccessSparkle() {
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.28);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.28);
        }, idx * 75);
      });
    } catch (e) {}
  }
}

// Dreamy Floating Hearts Particle System
class FloatingHearts {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.burstParticles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initPassiveHearts();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initPassiveHearts() {
    for (let i = 0; i < 14; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 0.4 + 0.2,
        driftX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.25 + 0.1,
        color: ['#FFAEC0', '#FFD2DC', '#E8DCFC', '#FFE5D4'][Math.floor(Math.random() * 4)]
      });
    }
  }

  burst(count = 30) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.burstParticles.push({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 12 + 10,
        opacity: 1,
        color: ['#FF7B95', '#FFA5B8', '#FFD2DC', '#F0D4FC', '#FFDAC6'][Math.floor(Math.random() * 5)]
      });
    }
  }

  drawHeart(x, y, size, color, opacity) {
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    const d = size / 2;
    this.ctx.moveTo(0, d / 2);
    this.ctx.bezierCurveTo(-d, -d / 2, -d * 1.5, d, 0, d * 1.8);
    this.ctx.bezierCurveTo(d * 1.5, d, d, -d / 2, 0, d / 2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Passive slow floating
    this.particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.driftX;
      if (p.y < -20) {
        p.y = this.canvas.height + 20;
        p.x = Math.random() * this.canvas.width;
      }
      this.drawHeart(p.x, p.y, p.size, p.color, p.opacity);
    });

    // Celebration burst
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const bp = this.burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.vy += 0.22; // gravity
      bp.opacity -= 0.016;

      this.drawHeart(bp.x, bp.y, bp.size, bp.color, Math.max(0, bp.opacity));

      if (bp.opacity <= 0) {
        this.burstParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// App Logic
document.addEventListener('DOMContentLoaded', () => {
  const audio = new CuteAudio();
  const hearts = new FloatingHearts(document.getElementById('heart-canvas'));

  const bubbles = document.querySelectorAll('.slot-bubble');
  const confirmBtn = document.getElementById('confirm-btn');
  const bookingView = document.getElementById('booking-view');
  const successView = document.getElementById('success-view');
  const confirmedTimeDisplay = document.getElementById('confirmed-time-display');
  const changeBtn = document.getElementById('change-btn');

  let selectedTime = null;

  // Handle slot bubble click
  bubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
      audio.playPop();

      bubbles.forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
      });

      bubble.classList.add('selected');
      bubble.setAttribute('aria-checked', 'true');
      selectedTime = bubble.dataset.time;

      // Enable submit button
      confirmBtn.removeAttribute('disabled');
    });
  });

  // Handle confirmation
  confirmBtn.addEventListener('click', () => {
    if (!selectedTime) return;

    audio.playSuccessSparkle();
    hearts.burst(35);

    // Update time display
    confirmedTimeDisplay.textContent = selectedTime;

    // Transition view
    bookingView.classList.remove('active');
    setTimeout(() => {
      successView.classList.add('active');
    }, 150);

    // Save selection in session storage
    try {
      localStorage.setItem('picked_visiting_time', selectedTime);
    } catch (e) {}
  });

  // Allow re-picking
  changeBtn.addEventListener('click', () => {
    audio.playPop();
    successView.classList.remove('active');
    setTimeout(() => {
      bookingView.classList.add('active');
    }, 150);
  });
});
