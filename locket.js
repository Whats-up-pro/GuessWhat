/**
 * ==========================================================================
 * Matcha Locket Web App Logic (v2.0 Native Multi-Screen)
 * Controls:
 * - Date/Time/Gift/Address state selection
 * - Double-Ring Shutter Send button validation
 * - Screen transition: Main Screen -> Chat Screen (with Telegram API dispatch)
 * - Friends Bottom Sheet modal
 * - History / Memories Modal
 * - Web Audio pop synthesis
 * Zero-Emoji Policy | Clean Typography | Astryx Dark Matcha
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

  // --- App State ---
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

      gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
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
  const screenMain = document.getElementById('screen-main');
  const screenChat = document.getElementById('screen-chat');

  const datePills = document.querySelectorAll('.date-pill');
  const timeGroup = document.getElementById('time-group');
  const timeChipsContainer = document.getElementById('time-chips-container');
  const giftChips = document.querySelectorAll('#gift-chips-container .tag-chip');
  const addressChips = document.querySelectorAll('#address-chips-container .tag-chip');
  const addressInputCollapse = document.getElementById('address-input-collapse');
  const customAddressInput = document.getElementById('custom-address-input');

  const shutterBtn = document.getElementById('locket-shutter-btn');
  const shutterHint = document.getElementById('shutter-hint');

  // Modals & Sheets
  const friendsBackdrop = document.getElementById('friends-backdrop');
  const btnOpenFriends = document.getElementById('btn-open-friends');
  const btnOpenFriendsLeft = document.getElementById('btn-open-friends-left');
  const btnCloseFriends = document.getElementById('btn-close-friends');

  const historyBackdrop = document.getElementById('history-backdrop');
  const btnOpenHistory = document.getElementById('btn-open-history');
  const btnBackCamera = document.getElementById('btn-back-camera');

  const btnOpenChatShortcut = document.getElementById('btn-open-chat-shortcut');
  const btnBackToMain = document.getElementById('btn-back-to-main');
  const btnRescheduleChat = document.getElementById('btn-reschedule-chat');

  const chatBubbleDatetime = document.getElementById('chat-bubble-datetime');
  const chatBubbleGift = document.getElementById('chat-bubble-gift');
  const chatBubbleAddress = document.getElementById('chat-bubble-address');
  const chatTimestamp = document.getElementById('chat-timestamp');

  const btnFlash = document.getElementById('btn-flash');
  const btnFlip = document.getElementById('btn-flip');

  // --- Date Selection ---
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
      updateShutterState();
    });
  });

  // --- Render Time Slots ---
  function renderTimeSlots(dateKey) {
    timeChipsContainer.innerHTML = '';
    const slots = TIME_SLOTS[dateKey] || [];

    slots.forEach(slot => {
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
        updateShutterState();
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

  // --- Gift Selection ---
  giftChips.forEach(chip => {
    chip.addEventListener('click', function () {
      playPopSound(520);
      giftChips.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      state.selectedGift = this.dataset.gift;
    });
  });

  // --- Address Selection ---
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

  // --- Update Shutter Button State ---
  function updateShutterState() {
    if (!state.selectedDateKey) {
      shutterBtn.disabled = true;
      shutterHint.textContent = 'Chọn ngày trước nhé';
      shutterHint.style.color = 'var(--text-secondary)';
      return;
    }

    if (!state.selectedTimeId) {
      shutterBtn.disabled = true;
      shutterHint.textContent = 'Chọn khung giờ tiện nhất nhen';
      shutterHint.style.color = 'var(--text-secondary)';
      return;
    }

    shutterBtn.disabled = false;
    shutterHint.textContent = 'Bấm nút để gửi cho anh';
    shutterHint.style.color = 'var(--matcha-brand)';
  }

  // --- Shutter Send Action -> Dispatch to Telegram & Switch to Chat ---
  shutterBtn.addEventListener('click', async function () {
    if (shutterBtn.disabled) return;

    playPopSound(720, 0.12);
    shutterBtn.disabled = true;
    shutterHint.textContent = 'Đang gửi...';

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

    // Populate Chat Screen
    chatBubbleDatetime.textContent = `${state.selectedDateLabel} · ${state.selectedTimeLabel}`;
    chatBubbleGift.textContent = `Món mang qua: ${state.selectedGift}`;
    chatBubbleAddress.textContent = `Địa chỉ: ${addressText}`;
    chatTimestamp.textContent = `Hôm nay lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

    // Transition to Chat View
    screenMain.classList.remove('active');
    screenChat.classList.add('active');
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

  // --- Modal: Your Friends Bottom Sheet ---
  function openFriendsSheet() {
    playPopSound(500);
    friendsBackdrop.classList.remove('hidden');
  }

  function closeFriendsSheet() {
    playPopSound(420);
    friendsBackdrop.classList.add('hidden');
  }

  btnOpenFriends.addEventListener('click', openFriendsSheet);
  btnOpenFriendsLeft.addEventListener('click', openFriendsSheet);
  btnCloseFriends.addEventListener('click', closeFriendsSheet);
  friendsBackdrop.addEventListener('click', function (e) {
    if (e.target === friendsBackdrop) closeFriendsSheet();
  });

  // --- Modal: History Full Screen ---
  function openHistory() {
    playPopSound(540);
    historyBackdrop.classList.remove('hidden');
  }

  function closeHistory() {
    playPopSound(420);
    historyBackdrop.classList.add('hidden');
  }

  btnOpenHistory.addEventListener('click', openHistory);
  btnBackCamera.addEventListener('click', closeHistory);
  historyBackdrop.addEventListener('click', function (e) {
    if (e.target === historyBackdrop) closeHistory();
  });

  // --- Screen Navigation: Chat View Controls ---
  btnOpenChatShortcut.addEventListener('click', function () {
    playPopSound(500);
    screenMain.classList.remove('active');
    screenChat.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function returnToMain() {
    playPopSound(460);
    screenChat.classList.remove('active');
    screenMain.classList.add('active');
    shutterBtn.disabled = false;
    updateShutterState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  btnBackToMain.addEventListener('click', returnToMain);
  btnRescheduleChat.addEventListener('click', returnToMain);

  // --- Fun Micro-Interactions: Flash & Flip ---
  let flashActive = false;
  btnFlash.addEventListener('click', function () {
    playPopSound(600);
    flashActive = !flashActive;
    this.style.color = flashActive ? 'var(--matcha-brand)' : 'var(--text-primary)';
  });

  let flipAngle = 0;
  btnFlip.addEventListener('click', function () {
    playPopSound(580);
    flipAngle += 180;
    this.querySelector('svg').style.transform = `rotate(${flipAngle}deg)`;
    this.querySelector('svg').style.transition = 'transform 0.4s var(--ease-spring)';
  });

})();
