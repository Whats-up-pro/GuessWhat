import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeCardConfig, safeImageList } from '../birthday.js';

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
