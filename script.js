// Cấu hình Telegram nhận thông báo
const TELEGRAM_CONFIG = {
  botToken: "8055369195:AAGzh1Hmu7WLEtaW5QE8hp5zaaAJrqv8lPA",
  chatId: "6177241794"
};

async function sendTelegramNotification(timeSlot) {
  if (!TELEGRAM_CONFIG.botToken || TELEGRAM_CONFIG.botToken === "YOUR_BOT_TOKEN") {
    console.warn("Chưa cấu hình Telegram Bot Token hoặc Chat ID");
    return;
  }

  const text = `🍵 <b>TING TING! EM ẤY CHỐT LỊCH NÈ</b> 🍵\n\n` +
               `🍃 <b>Lịch đã chọn:</b> <code>${timeSlot}</code>\n` +
               `⏰ <b>Thời điểm bấm:</b> ${new Date().toLocaleTimeString('vi-VN')} (${new Date().toLocaleDateString('vi-VN')})\n\n` +
               `🐱 <i>Chúc hai bạn có một buổi hẹn matcha thật ngọt ngào nha! ✨</i>`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.chatId,
        text: text,
        parse_mode: "HTML"
      })
    });
  } catch (err) {
    console.error("Lỗi gửi thông báo Telegram:", err);
  }
}

// Soft Cute Pop Audio Synthesizer
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
      osc.frequency.setValueAtTime(460, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playSuccessSparkle() {
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.50];
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

// Astryx Matcha Floating Botanical Particles System (Leaves, Hearts & Sparkles)
class MatchaParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.burstParticles = [];
    this.colors = ['#707E46', '#C0CBA9', '#8FA35E', '#A4B87C', '#DCE3CE', '#3E481D'];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initPassiveParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initPassiveParticles() {
    const types = ['leaf', 'heart', 'sparkle'];
    for (let i = 0; i < 16; i++) {
      this.particles.push({
        type: types[Math.floor(Math.random() * types.length)],
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 0.35 + 0.15,
        driftX: (Math.random() - 0.5) * 0.35,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.28 + 0.12,
        color: this.colors[Math.floor(Math.random() * this.colors.length)]
      });
    }
  }

  burst(count = 35) {
    const types = ['leaf', 'heart', 'sparkle'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.burstParticles.push({
        type: types[Math.floor(Math.random() * types.length)],
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 12 + 8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        opacity: 1,
        color: this.colors[Math.floor(Math.random() * this.colors.length)]
      });
    }
  }

  drawHeart(x, y, size, opacity, color) {
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

  drawLeaf(x, y, size, rotation, opacity, color) {
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.beginPath();
    this.ctx.moveTo(0, -size);
    this.ctx.bezierCurveTo(size * 0.75, -size * 0.4, size * 0.75, size * 0.4, 0, size);
    this.ctx.bezierCurveTo(-size * 0.75, size * 0.4, -size * 0.75, -size * 0.4, 0, -size);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  drawSparkle(x, y, size, opacity, color) {
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      this.ctx.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
      this.ctx.lineTo(
        Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.3),
        Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.3)
      );
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  renderParticle(p) {
    if (p.type === 'leaf') {
      this.drawLeaf(p.x, p.y, p.size, p.rotation, Math.max(0, p.opacity), p.color);
    } else if (p.type === 'heart') {
      this.drawHeart(p.x, p.y, p.size, Math.max(0, p.opacity), p.color);
    } else {
      this.drawSparkle(p.x, p.y, p.size, Math.max(0, p.opacity), p.color);
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.driftX;
      p.rotation += p.rotSpeed;
      if (p.y < -20) {
        p.y = this.canvas.height + 20;
        p.x = Math.random() * this.canvas.width;
      }
      this.renderParticle(p);
    });

    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const bp = this.burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.vy += 0.2;
      bp.rotation += bp.rotSpeed;
      bp.opacity -= 0.015;

      this.renderParticle(bp);

      if (bp.opacity <= 0) {
        this.burstParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Periods configuration per day
const PERIOD_DATA = {
  fri: [
    { id: 'afternoon', label: '☀️ Chiều' },
    { id: 'evening', label: '🌙 Tối' }
  ],
  sat: [
    { id: 'morning', label: '🌤️ Sáng' }
  ]
};

// Main App Logic
document.addEventListener('DOMContentLoaded', () => {
  const audio = new CuteAudio();
  const canvasElement = document.getElementById('particle-canvas') || document.getElementById('heart-canvas');
  const particles = new MatchaParticles(canvasElement);

  const dateCards = document.querySelectorAll('.date-card');
  const periodSection = document.getElementById('period-section');
  const periodOptions = document.getElementById('period-options');
  const confirmBtn = document.getElementById('confirm-btn');
  const ctaText = document.getElementById('cta-text');

  const bookingView = document.getElementById('booking-view');
  const successView = document.getElementById('success-view');
  const confirmedTimeDisplay = document.getElementById('confirmed-time-display');
  const changeBtn = document.getElementById('change-btn');

  let selectedDayKey = null;
  let selectedDateLabel = null;
  let selectedPeriodLabel = null;

  // Render period bubbles when a date is selected
  function renderPeriods(dayKey) {
    const options = PERIOD_DATA[dayKey] || [];
    periodOptions.innerHTML = '';
    selectedPeriodLabel = null;

    options.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'period-bubble';
      btn.type = 'button';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.textContent = item.label;

      btn.addEventListener('click', () => {
        audio.playPop();
        periodOptions.querySelectorAll('.period-bubble').forEach(b => {
          b.classList.remove('selected');
          b.setAttribute('aria-checked', 'false');
        });

        btn.classList.add('selected');
        btn.setAttribute('aria-checked', 'true');
        selectedPeriodLabel = item.label;

        // Both Date & Period are selected -> Enable CTA
        confirmBtn.removeAttribute('disabled');
        ctaText.textContent = 'Chốt lịch này 🍵✨';
      });

      periodOptions.appendChild(btn);
    });

    // Reveal the section with smooth animation
    periodSection.classList.add('active');

    // Update CTA button to soft reminder
    confirmBtn.setAttribute('disabled', 'true');
    ctaText.textContent = 'Chọn buổi nữa nha 🍃';
  }

  // Handle Date Selection (Tier 1)
  dateCards.forEach(card => {
    card.addEventListener('click', () => {
      audio.playPop();

      dateCards.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
      });

      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');

      selectedDayKey = card.dataset.day;
      selectedDateLabel = card.dataset.label;

      renderPeriods(selectedDayKey);
    });
  });

  // Handle Confirmation
  confirmBtn.addEventListener('click', () => {
    if (!selectedDateLabel || !selectedPeriodLabel) return;

    const finalSchedule = `${selectedDateLabel} · ${selectedPeriodLabel}`;

    audio.playSuccessSparkle();
    particles.burst(40);

    // Gửi Telegram thông báo
    sendTelegramNotification(finalSchedule);

    // Hiển thị lịch đã chốt trên màn hình chúc mừng
    confirmedTimeDisplay.textContent = finalSchedule;

    // Chuyển màn hình
    bookingView.classList.remove('active');
    setTimeout(() => {
      successView.classList.add('active');
    }, 150);
  });

  // Re-pick button
  changeBtn.addEventListener('click', () => {
    audio.playPop();
    successView.classList.remove('active');
    setTimeout(() => {
      bookingView.classList.add('active');
    }, 150);
  });
});

