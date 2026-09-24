import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateTilt,
  getEnvelopeUiState,
  getMelodyStep,
  makeConfettiPiece,
  nextTypewriterFrame,
  normalizeCardConfig,
  safeImageList,
  sanitizeMusicUrl,
} from '../birthday.js';

test('normalizes omitted message fields', () => {
  const config = normalizeCardConfig({ recipient: 'Mai' });

  assert.equal(config.recipient, 'Mai');
  assert.ok(config.wish.length > 0);
  assert.ok(config.secretMessage.length > 0);
});

test('keeps fallback wishes in the anh-em voice', () => {
  const config = normalizeCardConfig();

  assert.doesNotMatch(config.wish, /bạn/i);
  assert.doesNotMatch(config.secretMessage, /bạn/i);
  assert.match(config.wish, /em/i);
  assert.match(config.secretMessage, /em/i);
});

test('keeps the sender name for the letter signature', () => {
  const config = normalizeCardConfig({ sender: '  GQuoc  ' });

  assert.equal(config.sender, 'GQuoc');
});

test('describes the envelope action for both closed and open states', () => {
  assert.deepEqual(getEnvelopeUiState(false), {
    expanded: 'false',
    hint: 'Chạm vào phong bì để mở thư',
    label: 'Mở lá thư bí mật',
  });
  assert.deepEqual(getEnvelopeUiState(true), {
    expanded: 'true',
    hint: 'Chạm vào lá thư để gấp lại',
    label: 'Gấp lá thư lại',
  });
});

test('retains usable image sources and gives a fallback item', () => {
  assert.deepEqual(
    safeImageList(['', null, 'temp_images/photo_10_matcha_flowers.jpg']),
    ['temp_images/photo_10_matcha_flowers.jpg'],
  );
  assert.equal(safeImageList([]).length, 1);
});

test('advances typewriter one visible character at a time', () => {
  assert.deepEqual(nextTypewriterFrame('Chúc mừng', 3), { text: 'Chú', done: false });
  assert.deepEqual(nextTypewriterFrame('Chúc', 9), { text: 'Chúc', done: true });
});

test('generates finite confetti motion values', () => {
  const piece = makeConfettiPiece(400, 300, () => 0.5);

  assert.ok(Number.isFinite(piece.x));
  assert.ok(Number.isFinite(piece.y));
  assert.ok(Number.isFinite(piece.vx));
  assert.ok(Number.isFinite(piece.vy));
  assert.ok(piece.size >= 6 && piece.size <= 13);
});

test('accepts only outbound http music links', () => {
  assert.equal(sanitizeMusicUrl('https://open.spotify.com/track/example'), 'https://open.spotify.com/track/example');
  assert.equal(sanitizeMusicUrl('javascript:alert(1)'), '');
  assert.equal(sanitizeMusicUrl(''), '');
});

test('calculates bounded card tilt around the card center', () => {
  const rect = { left: 100, top: 50, width: 400, height: 200 };

  assert.deepEqual(calculateTilt(300, 150, rect), { x: 0, y: 0 });
  assert.deepEqual(calculateTilt(500, 50, rect), { x: 4.5, y: 4.5 });
  assert.deepEqual(calculateTilt(100, 250, rect), { x: -4.5, y: -4.5 });
});

test('birthday melody cycles through playable notes', () => {
  const first = getMelodyStep(0);
  const looped = getMelodyStep(25);

  assert.deepEqual(looped, first);
  assert.ok(first.frequency > 0);
  assert.ok(first.duration >= 180);
});
