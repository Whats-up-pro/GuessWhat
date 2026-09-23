import test from 'node:test';
import assert from 'node:assert/strict';

import {
  makeConfettiPiece,
  nextTypewriterFrame,
  normalizeCardConfig,
  safeImageList,
} from '../birthday.js';

test('normalizes omitted message fields', () => {
  const config = normalizeCardConfig({ recipient: 'Mai' });

  assert.equal(config.recipient, 'Mai');
  assert.ok(config.wish.length > 0);
  assert.ok(config.secretMessage.length > 0);
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
