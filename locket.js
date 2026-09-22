/**
 * ==========================================================================
 * Matcha Locket Widget Application Logic
 * Interactive scheduling, Web Audio micro-feedback, and Telegram Bot dispatch
 * Zero-Emoji Policy | Clean Typography | Tactile Feedback
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TELEGRAM_CONFIG = {
    botToken: '8055369195:AAGzh1Hmu7WLEtaW5QE8hp5zaaAJrqv8lPA',
    chatId: '6177241794'
  };

  const TIME_SLOTS = {
    fri: [
      { id: 'fri-night', label: 'Tối muộn (sau 20:30)' }
    ],
    sat: [
      { id: 'sat-morning', label: 'Sáng sớm (8:30 - 10:00)' },
      { id: 'sat-midday', label: 'Trưa / Đầu giờ chiều (11:30 - 13:30)' }
    ]
  };

  // --- State ---
  const state = {
    selectedDateKey: null,
    selectedDateLabel: null,
    selectedTimeId: null,
    selectedTimeLabel: null,
    selectedGift: 'Bưởi ngọt',
    addressType: 'old',
    customAddress: ''
  };

  // --- Web Audio Pop Synthesizer ---
  let audioCtx = null;
  function playPopSound(freq = 520, duration = 0.06) {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay gracefully suppressed
    }
  }

  // --- DOM Elements ---
  const datePills = document.querySelectorAll('.date-pill');
  const timeGroup = document.getElementById('time-group');
  const timeChipsContainer = document.getElementById('time-chips-container');
  const giftChips = document.querySelectorAll('#gift-chips-container .tag-chip');
  const addressChips = document.querySelectorAll('#address-chips-container .tag-chip');
  const addressInputCollapse = document.getElementById('address-input-collapse');
  const customAddressInput = document.getElementById('custom-address-input');
  const submitBtn = document.getElementById('locket-submit-btn');
  const btnText = document.getElementById('btn-text');

  const widgetView = document.getElementById('widget-view');
  const deliveredView = document.getElementById('delivered-view');
  const summaryDatetime = document.getElementById('summary-datetime');
  const summaryGift = document.getElementById('summary-gift');
  const summaryAddress = document.getElementById('summary-address');
  const reselectBtn = document.getElementById('reselect-btn');

  // --- Handlers: Date Selection ---
  datePills.forEach(pill => {
    pill.addEventListener('click', function () {
      playPopSound(480);
      const dateKey = this.dataset.date;
      const dateLabel = this.dataset.label;

      datePills.forEach(p => p.classList.remove('selected'));
      this.classList.add('selected');

      state.selectedDateKey = dateKey;
      state.selectedDateLabel = dateLabel;
      state.selectedTimeId = null;
      state.selectedTimeLabel = null;

      renderTimeSlots(dateKey);
      updateSubmitState();
    });
  });

  // --- Render Time Slots for Selected Date ---
  function renderTimeSlots(dateKey) {
    timeChipsContainer.innerHTML = '';
    const slots = TIME_SLOTS[dateKey] || [];

    slots.forEach((slot, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tag-chip';
      btn.dataset.timeId = slot.id;
      btn.dataset.timeLabel = slot.label;
      btn.textContent = slot.label;

      btn.addEventListener('click', function () {
        playPopSound(540);
        document.querySelectorAll('#time-chips-container .tag-chip').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');

        state.selectedTimeId = this.dataset.timeId;
        state.selectedTimeLabel = this.dataset.timeLabel;
        updateSubmitState();
      });

      timeChipsContainer.appendChild(btn);
    });

    timeGroup.classList.remove('hidden');

    // Auto-select first slot if only one slot is available (e.g. Friday evening)
    if (slots.length === 1) {
      const singleBtn = timeChipsContainer.querySelector('.tag-chip');
      if (singleBtn) {
        singleBtn.classList.add('selected');
        state.selectedTimeId = slots[0].id;
        state.selectedTimeLabel = slots[0].label;
      }
    }
  }

  // --- Handlers: Gift Selection ---
  giftChips.forEach(chip => {
    chip.addEventListener('click', function () {
      playPopSound(520);
      giftChips.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      state.selectedGift = this.dataset.gift;
    });
  });

  // --- Handlers: Address Selection ---
  addressChips.forEach(chip => {
    chip.addEventListener('click', function () {
      playPopSound(500);
      addressChips.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');

      const type = this.dataset.addressType;
      state.addressType = type;

      if (type === 'new') {
        addressInputCollapse.classList.remove('hidden');
        customAddressInput.focus();
      } else {
        addressInputCollapse.classList.add('hidden');
      }
    });
  });

  customAddressInput.addEventListener('input', function () {
    state.customAddress = this.value.trim();
  });

  // --- Submit State Validation ---
  function updateSubmitState() {
    if (!state.selectedDateKey) {
      submitBtn.disabled = true;
      btnText.textContent = 'Chọn ngày trước nhen';
      return;
    }

    if (!state.selectedTimeId) {
      submitBtn.disabled = true;
      btnText.textContent = 'Chọn khung giờ tiện nhất nhen';
      return;
    }

    submitBtn.disabled = false;
    btnText.textContent = 'Gửi phản hồi cho anh';
  }

  // --- Submit & Dispatch via Telegram ---
  submitBtn.addEventListener('click', async function () {
    if (submitBtn.disabled) return;

    playPopSound(660, 0.1);
    submitBtn.disabled = true;
    btnText.textContent = 'Đang gửi phản hồi...';

    const addressText = state.addressType === 'new' && state.customAddress
      ? `Địa chỉ mới: ${state.customAddress}`
      : 'Dạ chỗ cũ nha';

    const nowFormatted = new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const telegramMessage = 
      `*Locket Widget: Đã nhận phản hồi lịch hẹn*\n\n` +
      `*Ngày:* ${state.selectedDateLabel}\n` +
      `*Khung giờ:* ${state.selectedTimeLabel}\n` +
      `*Món mang qua:* ${state.selectedGift}\n` +
      `*Địa điểm:* ${addressText}\n\n` +
      `*Gửi lúc:* ${nowFormatted}`;

    try {
      await sendTelegramMessage(telegramMessage);
    } catch (err) {
      console.warn('Locket dispatch fallback:', err);
    }

    // Switch view to Delivered screen
    summaryDatetime.textContent = `${state.selectedDateLabel} · ${state.selectedTimeLabel}`;
    summaryGift.textContent = state.selectedGift;
    summaryAddress.textContent = addressText;

    widgetView.classList.remove('active');
    deliveredView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Telegram API Helper ---
  async function sendTelegramMessage(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
    return response.json();
  }

  // --- Reselect Button ---
  reselectBtn.addEventListener('click', function () {
    playPopSound(440);
    deliveredView.classList.remove('active');
    widgetView.classList.add('active');
    submitBtn.disabled = false;
    btnText.textContent = 'Gửi phản hồi cho anh';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();
