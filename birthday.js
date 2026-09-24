// Personalize the entire card here.
export const CARD_CONFIG = {
  recipient: 'Quỳnh Như',
  sender: 'GQuoc',
  nickname: 'cô bé của anh',
  birthday: 'Ngày của em',
  ageLine: 'thêm một tuổi mới, vẫn thật xinh như em',
  wish:
    'Chúc mừng sinh nhật em. Mong tuổi mới sẽ mang đến cho em thật nhiều bình yên, tiếng cười và những điều khiến trái tim em rung động.',
  secretMessage:
    'Anh mong những ngày mới sẽ dịu dàng với em, để mỗi sáng thức dậy em đều có một lý do thật đẹp để mỉm cười. Cảm ơn em vì đã làm những khoảnh khắc bình thường cũng trở nên đáng nhớ hơn. Tuổi mới này, mong em luôn được yêu thương, được nâng niu và gặp thật nhiều điều xứng đáng với trái tim của em.',
  musicTitle: 'Golden little moments',
  musicUrl: '',
  images: [
    'temp_images/photo_10_matcha_flowers.jpg',
    'temp_images/photo_1_mountain_sea.png',
    'temp_images/photo_2_beach_sunset.png',
  ],
};

const CONFIG_DEFAULTS = Object.freeze({
  recipient: 'Em',
  sender: 'Anh',
  nickname: 'cô bé của anh',
  birthday: 'Ngày của em',
  ageLine: 'thêm một tuổi mới thật xinh, em nhé',
  wish: 'Anh chúc em luôn gặp những điều dịu dàng và rực rỡ nhất.',
  secretMessage: 'Em xứng đáng với thật nhiều niềm vui và yêu thương.',
  musicTitle: 'Golden little moments',
  musicUrl: '',
  images: [],
});

export function safeImageList(images) {
  const cleanImages = Array.isArray(images)
    ? images.filter((source) => typeof source === 'string').map((source) => source.trim()).filter(Boolean)
    : [];

  return cleanImages.length ? cleanImages : [''];
}

export function normalizeCardConfig(config = {}) {
  const safeConfig = config && typeof config === 'object' ? config : {};
  const normalized = { ...CONFIG_DEFAULTS, ...safeConfig };

  return {
    ...normalized,
    recipient: String(normalized.recipient || CONFIG_DEFAULTS.recipient).trim(),
    sender: String(normalized.sender || CONFIG_DEFAULTS.sender).trim(),
    nickname: String(normalized.nickname || CONFIG_DEFAULTS.nickname).trim(),
    birthday: String(normalized.birthday || CONFIG_DEFAULTS.birthday).trim(),
    ageLine: String(normalized.ageLine || CONFIG_DEFAULTS.ageLine).trim(),
    wish: String(normalized.wish || CONFIG_DEFAULTS.wish).trim(),
    secretMessage: String(normalized.secretMessage || CONFIG_DEFAULTS.secretMessage).trim(),
    musicTitle: String(normalized.musicTitle || CONFIG_DEFAULTS.musicTitle).trim(),
    musicUrl: String(normalized.musicUrl || '').trim(),
    images: safeImageList(normalized.images),
  };
}

export function getEnvelopeUiState(isOpen) {
  return isOpen
    ? {
        expanded: 'true',
        hint: 'Chạm vào lá thư để gấp lại',
        label: 'Gấp lá thư lại',
      }
    : {
        expanded: 'false',
        hint: 'Chạm vào phong bì để mở thư',
        label: 'Mở lá thư bí mật',
      };
}

export function sanitizeMusicUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';

  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch {
    return '';
  }
}

export function calculateTilt(clientX, clientY, rect, maximum = 4.5) {
  if (!rect || rect.width <= 0 || rect.height <= 0) return { x: 0, y: 0 };

  const clamp = (value) => Math.max(-maximum, Math.min(maximum, value));
  const horizontal = ((clientX - rect.left) / rect.width - 0.5) * 2;
  const vertical = (0.5 - (clientY - rect.top) / rect.height) * 2;

  return {
    x: clamp(vertical * maximum),
    y: clamp(horizontal * maximum),
  };
}

const BIRTHDAY_MELODY = Object.freeze([
  { frequency: 261.63, duration: 260 },
  { frequency: 261.63, duration: 140 },
  { frequency: 293.66, duration: 430 },
  { frequency: 261.63, duration: 430 },
  { frequency: 349.23, duration: 430 },
  { frequency: 329.63, duration: 760 },
  { frequency: 261.63, duration: 260 },
  { frequency: 261.63, duration: 140 },
  { frequency: 293.66, duration: 430 },
  { frequency: 261.63, duration: 430 },
  { frequency: 392.0, duration: 430 },
  { frequency: 349.23, duration: 760 },
  { frequency: 261.63, duration: 260 },
  { frequency: 261.63, duration: 140 },
  { frequency: 523.25, duration: 430 },
  { frequency: 440.0, duration: 430 },
  { frequency: 349.23, duration: 430 },
  { frequency: 329.63, duration: 430 },
  { frequency: 293.66, duration: 760 },
  { frequency: 466.16, duration: 260 },
  { frequency: 466.16, duration: 140 },
  { frequency: 440.0, duration: 430 },
  { frequency: 349.23, duration: 430 },
  { frequency: 392.0, duration: 430 },
  { frequency: 349.23, duration: 900 },
]);

export function getMelodyStep(index) {
  const safeIndex = Number.isFinite(index) ? Math.max(0, Math.floor(index)) : 0;
  return { ...BIRTHDAY_MELODY[safeIndex % BIRTHDAY_MELODY.length] };
}

export function nextTypewriterFrame(message, position) {
  const characters = Array.from(String(message));
  const safePosition = Math.max(0, Number.isFinite(position) ? position : 0);

  return {
    text: characters.slice(0, safePosition).join(''),
    done: safePosition >= characters.length,
  };
}

export function makeConfettiPiece(width, height, random = Math.random, origin = {}) {
  const palette = ['#f26f82', '#ffd166', '#8bd3c7', '#bd9cdb', '#ff9f68', '#fff8de'];
  const spread = Math.max(140, width * 0.38);
  const x = Number.isFinite(origin.x) ? origin.x : width / 2;
  const y = Number.isFinite(origin.y) ? origin.y : Math.min(height * 0.38, 280);

  return {
    x: x + (random() - 0.5) * spread,
    y: y + (random() - 0.5) * 34,
    vx: (random() - 0.5) * 11,
    vy: -5.5 - random() * 8,
    gravity: 0.14 + random() * 0.13,
    drag: 0.986,
    size: 6 + random() * 7,
    rotation: random() * Math.PI,
    rotationSpeed: (random() - 0.5) * 0.34,
    color: palette[Math.floor(random() * palette.length) % palette.length],
    life: 1,
    decay: 0.004 + random() * 0.004,
    shape: random() > 0.72 ? 'circle' : 'rect',
  };
}

let typewriterTimer = 0;
let canvasController = null;
let soundEnabled = true;
let audioContext = null;
let melodyTimer = 0;
let melodyIndex = 0;
let melodyPlaying = false;

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function createImageFallback(label) {
  const fallback = document.createElement('div');
  fallback.className = 'polaroid-fallback';
  fallback.setAttribute('role', 'img');
  fallback.setAttribute('aria-label', label);
  fallback.textContent = 'Một kỷ niệm thật dịu dàng ✦';
  return fallback;
}

function renderPolaroids(container, images) {
  if (!container) return;

  const captions = ['niềm vui bé xíu', 'chuyến đi dịu dàng', 'những giờ vàng ấm áp'];
  const fragment = document.createDocumentFragment();

  images.slice(0, 3).forEach((source, index) => {
    const frame = document.createElement('span');
    frame.className = 'polaroid';

    if (source) {
      const image = document.createElement('img');
      image.src = source;
      image.alt = `Kỷ niệm sinh nhật ${index + 1}`;
      image.loading = index === 0 ? 'eager' : 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => {
        image.replaceWith(createImageFallback(`Ảnh kỷ niệm ${index + 1} đang được thay bằng hình nền`));
      }, { once: true });
      frame.append(image);
    } else {
      frame.append(createImageFallback(`Hình nền cho kỷ niệm ${index + 1}`));
    }

    const caption = document.createElement('span');
    caption.className = 'polaroid-caption';
    caption.textContent = captions[index] || 'kỷ niệm thật ngọt ngào';
    frame.append(caption);
    fragment.append(frame);
  });

  container.replaceChildren(fragment);
}

export function startTypewriter(element, message) {
  window.clearTimeout(typewriterTimer);
  const characters = Array.from(String(message));

  if (prefersReducedMotion()) {
    element.textContent = characters.join('');
    element.classList.remove('is-typing');
    return;
  }

  let position = 0;
  element.textContent = '';
  element.classList.add('is-typing');

  const tick = () => {
    position += 1;
    const frame = nextTypewriterFrame(message, position);
    element.textContent = frame.text;

    if (frame.done) {
      element.classList.remove('is-typing');
      return;
    }

    const current = characters[position - 1];
    const pause = /[,.!?]/u.test(current) ? 115 : 27 + Math.random() * 30;
    typewriterTimer = window.setTimeout(tick, pause);
  };

  typewriterTimer = window.setTimeout(tick, 260);
}

function ensureAudioContext() {
  if (!soundEnabled || typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function playCelebrationSound(kind = 'pop') {
  const context = ensureAudioContext();
  if (!context) return;

  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(kind === 'wish' ? 0.11 : 0.16, now + 0.012);
  master.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'wish' ? 0.7 : 0.28));
  master.connect(context.destination);

  const notes = kind === 'wish' ? [523.25, 659.25, 783.99] : [330, 494];
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = now + index * 0.08;
    oscillator.type = index % 2 ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.08, start + 0.2);
    gain.gain.setValueAtTime(0.45 / notes.length, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.24);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(start);
    oscillator.stop(start + 0.26);
  });
}

function playMelodyNote(step) {
  const context = ensureAudioContext();
  if (!context || !soundEnabled) return;

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(step.frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.075, now + 0.025);
  gain.gain.setValueAtTime(0.075, now + Math.max(0.04, step.duration / 1000 - 0.09));
  gain.gain.exponentialRampToValueAtTime(0.0001, now + step.duration / 1000);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + step.duration / 1000 + 0.02);
}

function scheduleMelodyStep() {
  if (!melodyPlaying) return;
  const step = getMelodyStep(melodyIndex);
  playMelodyNote(step);
  melodyIndex += 1;
  melodyTimer = window.setTimeout(scheduleMelodyStep, step.duration + 45);
}

function startBirthdayMelody() {
  window.clearTimeout(melodyTimer);
  melodyPlaying = true;
  melodyIndex = 0;
  scheduleMelodyStep();
}

function stopBirthdayMelody() {
  melodyPlaying = false;
  window.clearTimeout(melodyTimer);
}

function makeBackdropParticle(width, height, random = Math.random) {
  const roll = random();
  const kind = roll > 0.83 ? 'balloon' : roll > 0.22 ? 'sparkle' : 'star';
  const size = kind === 'balloon' ? 15 + random() * 17 : 1.5 + random() * 4;

  return {
    kind,
    x: random() * width,
    y: random() * height,
    size,
    speed: kind === 'balloon' ? 0.12 + random() * 0.23 : 0.08 + random() * 0.17,
    sway: random() * Math.PI * 2,
    alpha: 0.22 + random() * 0.45,
    color: ['#f29aae', '#ffd88d', '#b5ead7', '#d9c9ec'][Math.floor(random() * 4)],
    trail: 22 + random() * 28,
  };
}

function createCanvasController(canvas) {
  const context = canvas.getContext('2d', { alpha: true });
  const state = {
    canvas,
    context,
    width: 0,
    height: 0,
    ratio: 1,
    backdrop: [],
    confetti: [],
    frame: 0,
    running: false,
    lastTime: 0,
  };

  const resize = () => {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(state.width * state.ratio);
    canvas.height = Math.round(state.height * state.ratio);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    context.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);

    if (!state.backdrop.length) {
      const count = Math.min(42, Math.max(22, Math.round(state.width / 34)));
      state.backdrop = Array.from({ length: count }, () => makeBackdropParticle(state.width, state.height));
    }
  };

  const drawSparkle = (particle, elapsed) => {
    const pulse = 0.55 + Math.sin(elapsed * 0.002 + particle.sway) * 0.38;
    context.save();
    context.translate(particle.x, particle.y);
    context.globalAlpha = particle.alpha * pulse;
    context.fillStyle = particle.color;
    context.rotate(elapsed * 0.00015 + particle.sway);
    context.beginPath();
    context.moveTo(0, -particle.size);
    context.lineTo(particle.size * 0.28, -particle.size * 0.25);
    context.lineTo(particle.size, 0);
    context.lineTo(particle.size * 0.28, particle.size * 0.25);
    context.lineTo(0, particle.size);
    context.lineTo(-particle.size * 0.28, particle.size * 0.25);
    context.lineTo(-particle.size, 0);
    context.lineTo(-particle.size * 0.28, -particle.size * 0.25);
    context.closePath();
    context.fill();
    context.restore();
  };

  const drawBalloon = (particle, elapsed) => {
    particle.sway += 0.004;
    const swayX = Math.sin(particle.sway + elapsed * 0.00025) * 0.35;
    particle.x += swayX;
    context.save();
    context.globalAlpha = particle.alpha;
    context.fillStyle = particle.color;
    context.strokeStyle = 'rgba(77, 53, 64, .2)';
    context.lineWidth = 1;
    context.beginPath();
    context.ellipse(particle.x, particle.y, particle.size * 0.72, particle.size, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(particle.x, particle.y + particle.size);
    context.quadraticCurveTo(particle.x + 5, particle.y + particle.size + 10, particle.x - 1, particle.y + particle.size + 19);
    context.stroke();
    context.restore();
  };

  const drawShootingStar = (particle) => {
    context.save();
    context.globalAlpha = particle.alpha;
    const gradient = context.createLinearGradient(
      particle.x - particle.trail,
      particle.y - particle.trail * 0.45,
      particle.x,
      particle.y,
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, particle.color);
    context.strokeStyle = gradient;
    context.lineWidth = Math.max(1, particle.size * 0.42);
    context.beginPath();
    context.moveTo(particle.x - particle.trail, particle.y - particle.trail * 0.45);
    context.lineTo(particle.x, particle.y);
    context.stroke();
    context.fillStyle = particle.color;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size * 0.55, 0, Math.PI * 2);
    context.fill();
    context.restore();
  };

  const drawConfetti = (piece) => {
    context.save();
    context.globalAlpha = Math.max(0, piece.life);
    context.fillStyle = piece.color;
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation);
    if (piece.shape === 'circle') {
      context.beginPath();
      context.arc(0, 0, piece.size * 0.5, 0, Math.PI * 2);
      context.fill();
    } else {
      context.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.66);
    }
    context.restore();
  };

  const animate = (time) => {
    if (!state.running) return;
    const delta = Math.min(2, (time - state.lastTime || 16.67) / 16.67);
    state.lastTime = time;
    context.clearRect(0, 0, state.width, state.height);

    state.backdrop.forEach((particle) => {
      particle.y -= particle.speed * delta;
      if (particle.kind === 'star') {
        particle.x += particle.speed * 2.2 * delta;
        particle.y += particle.speed * 1.1 * delta;
      }
      if (particle.y < -particle.size * 2) {
        particle.y = state.height + particle.size * 2;
        particle.x = Math.random() * state.width;
      }
      if (particle.kind === 'balloon') drawBalloon(particle, time);
      else if (particle.kind === 'star') drawShootingStar(particle);
      else drawSparkle(particle, time);
    });

    state.confetti.forEach((piece) => {
      piece.vx *= piece.drag;
      piece.vy = piece.vy * piece.drag + piece.gravity * delta;
      piece.x += piece.vx * delta;
      piece.y += piece.vy * delta;
      piece.rotation += piece.rotationSpeed * delta;
      piece.life -= piece.decay * delta;
      drawConfetti(piece);
    });
    state.confetti = state.confetti.filter((piece) => piece.life > 0 && piece.y < state.height + 40);
    state.frame = window.requestAnimationFrame(animate);
  };

  const start = () => {
    if (state.running || document.hidden || prefersReducedMotion()) return;
    state.running = true;
    state.lastTime = performance.now();
    state.frame = window.requestAnimationFrame(animate);
  };

  const stop = () => {
    state.running = false;
    window.cancelAnimationFrame(state.frame);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  return { state, start, stop };
}

export function startBackdrop(canvas) {
  if (!canvas || prefersReducedMotion()) return null;
  canvasController = createCanvasController(canvas);
  canvasController.start();
  return canvasController;
}

export function launchConfetti(count = 120, origin = {}) {
  if (!canvasController || prefersReducedMotion()) return;
  const { state } = canvasController;
  for (let index = 0; index < count; index += 1) {
    state.confetti.push(makeConfettiPiece(state.width, state.height, Math.random, origin));
  }
  canvasController.start();
}

export function blowCandle(button) {
  if (!button || button.getAttribute('aria-pressed') === 'true') return false;
  button.classList.add('is-extinguished');
  button.setAttribute('aria-pressed', 'true');
  launchConfetti(150, { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 });
  playCelebrationSound('wish');
  return true;
}

function initializeBirthdayCard() {
  const config = normalizeCardConfig(CARD_CONFIG);
  const polaroidStack = document.getElementById('polaroid-stack');
  const wishText = document.getElementById('wish-text');
  const cakeButton = document.getElementById('cake-button');
  const soundToggle = document.getElementById('sound-toggle');
  const surpriseButton = document.getElementById('surprise-button');
  const dialog = document.getElementById('envelope-dialog');
  const closeSurprise = document.getElementById('close-surprise');
  const envelope = document.getElementById('envelope');
  const envelopeHint = document.getElementById('envelope-hint');
  const vinylToggle = document.getElementById('vinyl-toggle');
  const musicLink = document.getElementById('music-link');
  const card = document.getElementById('birthday-card');
  let lastDialogTrigger = null;
  let tiltFrame = 0;

  document.title = `Chúc mừng sinh nhật em, ${config.recipient}!`;
  setText('recipient-name', config.recipient);
  setText('birthday-date', config.birthday);
  setText('birthday-meta', config.ageLine || config.nickname);
  setText('music-title', config.musicTitle);
  setText('secret-message', config.secretMessage);
  setText('letter-greeting', `${config.recipient} à,`);
  setText('sender-signature', `Thương em, ${config.sender} ♡`);
  renderPolaroids(polaroidStack, config.images);

  const safeMusicUrl = sanitizeMusicUrl(config.musicUrl);
  if (safeMusicUrl) {
    musicLink.href = safeMusicUrl;
    musicLink.hidden = false;
  } else {
    musicLink.removeAttribute('href');
    musicLink.hidden = true;
  }

  const togglePolaroids = () => {
    const expanded = !polaroidStack.classList.contains('is-expanded');
    polaroidStack.classList.toggle('is-expanded', expanded);
    polaroidStack.setAttribute('aria-expanded', String(expanded));
  };
  polaroidStack?.addEventListener('click', togglePolaroids);

  startTypewriter(wishText, config.wish);
  document.getElementById('replay-wish')?.addEventListener('click', () => {
    startTypewriter(wishText, config.wish);
    playCelebrationSound('pop');
  });

  cakeButton?.addEventListener('click', () => blowCandle(cakeButton));

  soundToggle?.addEventListener('click', () => {
    soundEnabled = soundToggle.getAttribute('aria-pressed') === 'true';
    soundToggle.setAttribute('aria-pressed', String(!soundEnabled));
    soundToggle.setAttribute('aria-label', soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh');
    if (soundEnabled) playCelebrationSound('pop');
  });

  surpriseButton?.addEventListener('click', () => {
    lastDialogTrigger = surpriseButton;
    const bounds = surpriseButton.getBoundingClientRect();
    dialog.showModal();
    window.requestAnimationFrame(() => envelope.focus());
    launchConfetti(95, {
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    });
    playCelebrationSound('pop');
  });

  closeSurprise?.addEventListener('click', () => dialog.close());

  dialog?.addEventListener('close', () => {
    const state = getEnvelopeUiState(false);
    envelope.classList.remove('is-open');
    envelope.setAttribute('aria-expanded', state.expanded);
    envelope.setAttribute('aria-label', state.label);
    setText('envelope-hint', state.hint);
    lastDialogTrigger?.focus();
  });

  envelope?.addEventListener('click', () => {
    const isOpen = !envelope.classList.contains('is-open');
    const state = getEnvelopeUiState(isOpen);
    envelope.classList.toggle('is-open', isOpen);
    envelope.setAttribute('aria-expanded', state.expanded);
    envelope.setAttribute('aria-label', state.label);
    if (envelopeHint) envelopeHint.textContent = state.hint;
    if (isOpen) {
      launchConfetti(65, { x: window.innerWidth / 2, y: window.innerHeight * 0.38 });
      playCelebrationSound('wish');
    }
  });

  vinylToggle?.addEventListener('click', () => {
    const isPlaying = vinylToggle.getAttribute('aria-pressed') !== 'true';
    vinylToggle.setAttribute('aria-pressed', String(isPlaying));
    vinylToggle.setAttribute('aria-label', isPlaying ? 'Tạm dừng giai điệu sinh nhật' : 'Phát giai điệu sinh nhật');
    if (isPlaying) startBirthdayMelody();
    else stopBirthdayMelody();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && vinylToggle?.getAttribute('aria-pressed') === 'true') {
      stopBirthdayMelody();
      vinylToggle.setAttribute('aria-pressed', 'false');
      vinylToggle.setAttribute('aria-label', 'Phát giai điệu sinh nhật');
    }
  });

  if (card && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion()) {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const tilt = calculateTilt(event.clientX, event.clientY, rect);
      window.cancelAnimationFrame(tiltFrame);
      tiltFrame = window.requestAnimationFrame(() => {
        card.style.setProperty('--tilt-x', `${tilt.x}deg`);
        card.style.setProperty('--tilt-y', `${tilt.y}deg`);
      });
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      window.cancelAnimationFrame(tiltFrame);
      tiltFrame = window.requestAnimationFrame(() => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    }, { passive: true });
  }

  startBackdrop(document.getElementById('celebration-canvas'));
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBirthdayCard, { once: true });
  } else {
    initializeBirthdayCard();
  }
}
