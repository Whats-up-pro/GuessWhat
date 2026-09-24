const MAX_BODY_BYTES = 2_048;
const MAX_ADDRESS_LENGTH = 300;

function jsonResponse(body, status, origin) {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Vary': 'Origin',
  });

  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Access-Control-Max-Age', '86400');
  }

  return new Response(JSON.stringify(body), { status, headers });
}

function isValidPayload(payload) {
  return payload
    && typeof payload === 'object'
    && typeof payload.timeSlot === 'string'
    && payload.timeSlot.length > 0
    && payload.timeSlot.length <= 100
    && typeof payload.gift === 'string'
    && payload.gift.length > 0
    && payload.gift.length <= 80
    && typeof payload.address === 'string'
    && payload.address.length > 0
    && payload.address.length <= MAX_ADDRESS_LENGTH;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowedOrigin = env.ALLOWED_ORIGIN;

    if (!allowedOrigin || origin !== allowedOrigin) {
      return jsonResponse({ error: 'Origin not allowed' }, 403);
    }

    if (request.method === 'OPTIONS') {
      return jsonResponse({}, 204, allowedOrigin);
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, allowedOrigin);
    }

    if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
      return jsonResponse({ error: 'Content-Type must be application/json' }, 415, allowedOrigin);
    }

    const contentLength = Number(request.headers.get('Content-Length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return jsonResponse({ error: 'Request body too large' }, 413, allowedOrigin);
    }

    const clientIp = request.headers.get('CF-Connecting-IP');
    if (!clientIp) {
      return jsonResponse({ error: 'Unable to identify client' }, 400, allowedOrigin);
    }

    const rateLimit = await env.TELEGRAM_LIMITER.limit({ key: clientIp });
    if (!rateLimit.success) {
      return jsonResponse({ error: 'Too many requests' }, 429, allowedOrigin);
    }

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return jsonResponse({ error: 'Telegram is not configured' }, 503, allowedOrigin);
    }

    let rawBody;
    try {
      rawBody = await request.text();
    } catch {
      return jsonResponse({ error: 'Invalid request body' }, 400, allowedOrigin);
    }

    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return jsonResponse({ error: 'Request body too large' }, 413, allowedOrigin);
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return jsonResponse({ error: 'Invalid JSON' }, 400, allowedOrigin);
    }

    if (!isValidPayload(payload)) {
      return jsonResponse({ error: 'Invalid notification fields' }, 400, allowedOrigin);
    }

    const message = [
      '🍵 THÔNG BÁO LỊCH HẸN MỚI 🍵',
      '',
      `📌 Khung giờ: ${payload.timeSlot}`,
      `🍈 Món mang qua: ${payload.gift}`,
      `📍 Địa chỉ: ${payload.address}`,
      `⏰ Thời điểm chọn: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
      '',
      '✨ Đã lưu thông tin đầy đủ rồi nha anh!',
    ].join('\n');

    let telegramResponse;
    try {
      telegramResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: message,
        }),
      });
    } catch {
      return jsonResponse({ error: 'Telegram could not be reached' }, 502, allowedOrigin);
    }

    let telegramResult;
    try {
      telegramResult = await telegramResponse.json();
    } catch {
      return jsonResponse({ error: 'Telegram returned an invalid response' }, 502, allowedOrigin);
    }

    if (!telegramResponse.ok || telegramResult?.ok !== true) {
      return jsonResponse({ error: 'Telegram rejected the notification' }, 502, allowedOrigin);
    }

    return jsonResponse({ ok: true }, 200, allowedOrigin);
  },
};
