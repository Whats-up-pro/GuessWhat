// Web Audio Synthesis for crisp sound effects
class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    if (!this.enabled) return;
    try {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio not supported or blocked', e);
    }
  }

  playSuccess() {
    this.playTone(523.25, 'triangle', 0.12, 0.15); // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.12, 0.15), 100); // E5
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.2), 200); // G5
  }

  playError() {
    this.playTone(260, 'sawtooth', 0.15, 0.15);
    setTimeout(() => this.playTone(200, 'sawtooth', 0.25, 0.15), 120);
  }

  playClick() {
    this.playTone(400, 'sine', 0.05, 0.05);
  }
}

// Confetti Particle Effect
class Confetti {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 70) {
    const colors = ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2,
        y: this.canvas.height / 3,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 16,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    if (!this.animId) {
      this.loop();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.rotSpeed;
      p.opacity -= 0.012;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      this.ctx.restore();

      if (p.opacity <= 0 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
    }
  }
}

// App State & Data
const sound = new SoundController();
const confetti = new Confetti(document.getElementById('confetti-canvas'));

let score = 0;
let streak = 0;

function updateStats(pointsEarned = 0, isWin = true) {
  if (isWin) {
    score += pointsEarned;
    streak += 1;
    sound.playSuccess();
    confetti.burst(60);
  } else {
    streak = 0;
    sound.playError();
  }
  document.getElementById('score-count').textContent = score;
  document.getElementById('streak-count').textContent = streak;
}

// Sound toggle
const soundBtn = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');
soundBtn.addEventListener('click', () => {
  sound.enabled = !sound.enabled;
  soundIcon.textContent = sound.enabled ? '🔊' : '🔇';
});

// Mode Switching
const tabs = document.querySelectorAll('.mode-tab');
const modeContents = document.querySelectorAll('.mode-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    sound.playClick();
    tabs.forEach(t => t.classList.remove('active'));
    modeContents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    const targetId = `mode-${tab.dataset.mode}`;
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  });
});

/* ========================================================
   MODE 1: Secret Number Guessing
======================================================== */
let numberMax = 50;
let targetNumber = 1;
let numberAttemptsLeft = 5;
let numberGameOver = false;

const numberInput = document.getElementById('number-input');
const numberSubmit = document.getElementById('number-submit');
const mysteryBox = document.getElementById('mystery-box');
const numberHint = document.getElementById('number-hint');
const guessHistory = document.getElementById('guess-history');
const numberLives = document.getElementById('number-lives');
const numberRestart = document.getElementById('number-restart');
const diffButtons = document.querySelectorAll('.diff-btn');

function initNumberGame() {
  targetNumber = Math.floor(Math.random() * numberMax) + 1;
  numberAttemptsLeft = numberMax === 50 ? 5 : (numberMax === 100 ? 7 : 9);
  numberGameOver = false;
  mysteryBox.textContent = '?';
  mysteryBox.className = 'mystery-box';
  numberHint.textContent = `Hãy đoán một số trong khoảng từ 1 đến ${numberMax}!`;
  numberHint.style.color = 'var(--text-main)';
  guessHistory.innerHTML = '<span class="history-empty">Chưa có lượt đoán nào</span>';
  updateLivesDisplay();
  numberInput.value = '';
  numberInput.disabled = false;
  numberSubmit.disabled = false;
}

function updateLivesDisplay() {
  numberLives.textContent = '❤️'.repeat(numberAttemptsLeft) + '🖤'.repeat(
    (numberMax === 50 ? 5 : (numberMax === 100 ? 7 : 9)) - numberAttemptsLeft
  );
}

diffButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sound.playClick();
    diffButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    numberMax = parseInt(btn.dataset.range, 10);
    initNumberGame();
  });
});

function handleNumberGuess() {
  if (numberGameOver) return;
  const val = parseInt(numberInput.value, 10);
  if (isNaN(val) || val < 1 || val > numberMax) {
    numberHint.textContent = `Vui lòng nhập số hợp lệ từ 1 đến ${numberMax}!`;
    sound.playError();
    return;
  }

  // Remove empty label
  const emptySpan = guessHistory.querySelector('.history-empty');
  if (emptySpan) emptySpan.remove();

  numberInput.value = '';
  numberInput.focus();

  const historyBadge = document.createElement('span');
  historyBadge.className = 'history-item';

  if (val === targetNumber) {
    mysteryBox.textContent = targetNumber;
    mysteryBox.classList.add('won');
    numberHint.textContent = `🎉 CHÍNH XÁC! Số bí ẩn là ${targetNumber}!`;
    numberHint.style.color = 'var(--accent-emerald)';
    historyBadge.classList.add('correct');
    historyBadge.textContent = `${val} (Chuẩn!)`;
    guessHistory.appendChild(historyBadge);

    numberGameOver = true;
    numberInput.disabled = true;
    numberSubmit.disabled = true;
    updateStats(20 * numberAttemptsLeft, true);
  } else {
    numberAttemptsLeft--;
    updateLivesDisplay();

    if (val < targetNumber) {
      numberHint.textContent = `📈 Số bí ẩn LỚN HƠN ${val}! Thử lại nào!`;
      historyBadge.classList.add('higher');
      historyBadge.textContent = `${val} ▲`;
      sound.playTone(320, 'sine', 0.1);
    } else {
      numberHint.textContent = `📉 Số bí ẩn NHỎ HƠN ${val}! Thử lại nào!`;
      historyBadge.classList.add('lower');
      historyBadge.textContent = `${val} ▼`;
      sound.playTone(280, 'sine', 0.1);
    }
    guessHistory.appendChild(historyBadge);

    if (numberAttemptsLeft <= 0) {
      mysteryBox.textContent = targetNumber;
      mysteryBox.classList.add('lost');
      numberHint.textContent = `💀 Hết lượt rồi! Số bí ẩn chính là ${targetNumber}!`;
      numberHint.style.color = 'var(--accent-rose)';
      numberGameOver = true;
      numberInput.disabled = true;
      numberSubmit.disabled = true;
      updateStats(0, false);
    }
  }
}

numberSubmit.addEventListener('click', handleNumberGuess);
numberInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleNumberGuess();
});
numberRestart.addEventListener('click', () => {
  sound.playClick();
  initNumberGame();
});

/* ========================================================
   MODE 2: Emoji Riddle
======================================================== */
const emojiPuzzles = [
  { clue: "☕ + 💻 + 🌙", category: "Nghề nghiệp / Thói quen", hint: "Người thức đêm gõ phím viết phần mềm", answers: ["lap trinh vien", "coder", "developer", "it", "lap trinh"] },
  { clue: "🧋 + 🧊 + 🧽", category: "Đồ uống cực hot", hint: "Thức uống yêu thích của giới trẻ có viên trân châu", answers: ["tra sua", "tra sua tran chau"] },
  { clue: "⚽ + 🇻🇳 + 🥇", category: "Thể thao nước nhà", hint: "Đội tuyển bóng đá quốc gia Việt Nam", answers: ["bong da viet nam", "doi tuyen viet nam", "viet nam"] },
  { clue: "🕷️ + 🕸️ + 🦸‍♂️", category: "Siêu anh hùng", hint: "Chàng trai Peter Parker bị nhện cắn", answers: ["nguoi nhen", "spiderman", "spider man"] },
  { clue: "✈️ + 🏝️ + 📸", category: "Sở thích đời sống", hint: "Xách ba lô lên và đi khám phá những vùng đất mới", answers: ["du lich", "di du lich", "travel"] }
];

let currentEmojiIdx = 0;
const emojiClueEl = document.getElementById('emoji-clue');
const emojiCatEl = document.getElementById('emoji-category');
const emojiHintEl = document.getElementById('emoji-hint');
const emojiInput = document.getElementById('emoji-input');
const emojiSubmit = document.getElementById('emoji-submit');
const emojiFeedback = document.getElementById('emoji-feedback');
const emojiSkip = document.getElementById('emoji-skip');
const emojiNext = document.getElementById('emoji-next');

function normalizeStr(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function loadEmojiPuzzle(idx) {
  const p = emojiPuzzles[idx % emojiPuzzles.length];
  emojiClueEl.textContent = p.clue;
  emojiCatEl.textContent = `Chủ đề: ${p.category}`;
  emojiHintEl.textContent = `Gợi ý: ${p.hint}`;
  emojiInput.value = '';
  emojiInput.disabled = false;
  emojiSubmit.disabled = false;
  emojiFeedback.textContent = '';
  emojiFeedback.className = 'feedback-msg';
  emojiNext.classList.add('hidden');
  emojiSkip.classList.remove('hidden');
}

function checkEmojiAnswer() {
  const val = normalizeStr(emojiInput.value);
  if (!val) return;

  const p = emojiPuzzles[currentEmojiIdx % emojiPuzzles.length];
  const isCorrect = p.answers.some(ans => normalizeStr(ans) === val);

  if (isCorrect) {
    emojiFeedback.textContent = '🎉 Tuyệt vời! Bạn đã giải mã chính xác!';
    emojiFeedback.className = 'feedback-msg success';
    emojiInput.disabled = true;
    emojiSubmit.disabled = true;
    emojiNext.classList.remove('hidden');
    emojiSkip.classList.add('hidden');
    updateStats(50, true);
  } else {
    emojiFeedback.textContent = '❌ Chưa đúng rồi, hãy thử suy nghĩ lại chút xem!';
    emojiFeedback.className = 'feedback-msg error';
    sound.playError();
  }
}

emojiSubmit.addEventListener('click', checkEmojiAnswer);
emojiInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkEmojiAnswer();
});
emojiSkip.addEventListener('click', () => {
  sound.playClick();
  currentEmojiIdx++;
  loadEmojiPuzzle(currentEmojiIdx);
});
emojiNext.addEventListener('click', () => {
  sound.playClick();
  currentEmojiIdx++;
  loadEmojiPuzzle(currentEmojiIdx);
});

/* ========================================================
   MODE 3: Guess What? Trivia
======================================================== */
const triviaQuestions = [
  {
    question: "Guess What? Loài động vật nào có tới 3 quả tim và máu màu xanh lam?",
    options: ["Cá mập trắng", "Bạch tuộc", "Cá voi xanh", "Sao biển"],
    correct: 1,
    fact: "Bạch tuộc có 3 trái tim: 2 quả bơm máu qua mang, 1 quả bơm máu đi khắp cơ thể. Máu của chúng có màu xanh vì chứa chất hemocyanin giàu đồng!"
  },
  {
    question: "Guess What? Logo đầu tiên của tập đoàn công nghệ Apple có hình gì?",
    options: ["Quả táo cắn dở bảy sắc", "Isaac Newton ngồi dưới cây táo", "Mã nhị phân 01", "Bóng đèn Edison"],
    correct: 1,
    fact: "Logo ban đầu năm 1976 do Ron Wayne vẽ mô tả nhà bác học Isaac Newton đang ngồi đọc sách dưới một cây táo lớn với quả táo lơ lửng trên đầu."
  },
  {
    question: "Guess What? Mật ong nguyên chất có thể bảo quản được trong bao lâu mà không bị hỏng?",
    options: ["Khoảng 5 năm", "Tối đa 20 năm", "Hàng ngàn năm", "Chỉ được 6 tháng"],
    correct: 2,
    fact: "Các nhà khảo cổ đã tìm thấy những hũ mật ong nguyên chất trong các lăng mộ cổ Ai Cập hơn 3000 năm tuổi mà vẫn hoàn toàn có thể ăn được!"
  },
  {
    question: "Guess What? Trọng lượng của tất cả loài kiến trên Trái Đất xấp xỉ bằng cái gì?",
    options: ["Trọng lượng toàn bộ con người", "Trọng lượng tất cả loài chim", "Trọng lượng tất cả loài voi", "Một nửa đại dương"],
    correct: 0,
    fact: "Ước tính có khoảng 20 triệu tỷ (20.000.000.000.000.000) con kiến, và tổng sinh khối của chúng xấp xỉ bằng tổng trọng lượng của toàn bộ 8 tỷ người trên hành tinh!"
  }
];

let triviaIdx = 0;
const triviaQuestionEl = document.getElementById('trivia-question');
const triviaOptionsEl = document.getElementById('trivia-options');
const triviaExplanationEl = document.getElementById('trivia-explanation');
const factTextEl = document.getElementById('fact-text');
const triviaNextEl = document.getElementById('trivia-next');

function loadTrivia(idx) {
  const item = triviaQuestions[idx % triviaQuestions.length];
  triviaQuestionEl.textContent = item.question;
  triviaOptionsEl.innerHTML = '';
  triviaExplanationEl.classList.add('hidden');
  triviaNextEl.classList.add('hidden');

  item.options.forEach((optText, i) => {
    const btn = document.createElement('button');
    btn.className = 'trivia-option';
    btn.textContent = `${String.fromCharCode(65 + i)}. ${optText}`;
    btn.addEventListener('click', () => handleTriviaSelect(i, item));
    triviaOptionsEl.appendChild(btn);
  });
}

function handleTriviaSelect(selectedIdx, item) {
  const allBtns = triviaOptionsEl.querySelectorAll('.trivia-option');
  allBtns.forEach(b => b.disabled = true);

  if (selectedIdx === item.correct) {
    allBtns[selectedIdx].classList.add('correct');
    updateStats(40, true);
  } else {
    allBtns[selectedIdx].classList.add('wrong');
    allBtns[item.correct].classList.add('correct');
    updateStats(0, false);
  }

  factTextEl.textContent = item.fact;
  triviaExplanationEl.classList.remove('hidden');
  triviaNextEl.classList.remove('hidden');
}

triviaNextEl.addEventListener('click', () => {
  sound.playClick();
  triviaIdx++;
  loadTrivia(triviaIdx);
});

// Boot up games
initNumberGame();
loadEmojiPuzzle(0);
loadTrivia(0);
