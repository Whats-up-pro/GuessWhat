# Pastel Dreamland Birthday Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Build a standalone, configurable, accessible interactive birthday card at the new GitHub Pages endpoint birthday.html.

**Architecture:** A semantic HTML page loads a dedicated stylesheet and ES module. birthday.js owns the editable CARD_CONFIG, configuration normalization, state, Web Audio effects, and one canvas loop. birthday.css owns the responsive two-column composition, Butter Croissant material tokens, and reduced-motion fallback.

**Tech Stack:** HTML5, vanilla CSS, vanilla ES modules, Canvas 2D API, Web Audio API, Node built-in test runner.

**Spec:** docs/superpowers/specs/2026-09-24-pastel-dreamland-birthday-design.md

## Global Constraints

- Leave existing scheduling pages unchanged; serve the new endpoint from birthday.html.
- Use non-portrait assets from temp_images, beginning with photo_10_matcha_flowers.jpg.
- Preserve a Vanilla runtime; use Astryx token discipline as design reference, never add a React requirement.
- Place all content and image sources in CARD_CONFIG at the start of birthday.js.
- Animate DOM interfaces with transform and opacity, use one visibility-aware canvas loop, and respect reduced motion.
- Do not use em dashes in visible copy.

## Review Focus

- Empty or invalid images display CSS fallbacks independently.
- Replay cancels an active typewriter timer before starting over.
- Keyboard users can open and close the envelope and return focus to its trigger.
- Reduced-motion users receive all content without particles, tilt, or persistent animation.
- Opening a third-party music link never claims that cross-origin Spotify audio is playing in-page.

---

### Task 1: Create the semantic shell and configurable module

**Files:**
- Create: birthday.html
- Create: birthday.js
- Create: tests/birthday-config.test.mjs

**Interfaces:**
- Produces: CARD_CONFIG, normalizeCardConfig(config), and safeImageList(images).
- Enables: rendering and interaction controllers in subsequent tasks.

- [ ] **Step 1: Write the failing configuration tests**

~~~js
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
  assert.deepEqual(safeImageList(['', null, 'temp_images/photo_10_matcha_flowers.jpg']), ['temp_images/photo_10_matcha_flowers.jpg']);
  assert.equal(safeImageList([]).length, 1);
});
~~~

- [ ] **Step 2: Run the test to verify it fails**

Run: node --test tests/birthday-config.test.mjs

Expected: FAIL with module not found for birthday.js.

- [ ] **Step 3: Implement the skeleton and data boundary**

Create birthday.html with main, article, two labelled sections, a decorative canvas, Polaroid stack, cake button, surprise trigger, recipient title, birthday metadata, wish box, sound control, vinyl control, and a native dialog. Link birthday.css and a module birthday.js.

At the beginning of birthday.js, export CARD_CONFIG, normalizeCardConfig, and safeImageList. The default config contains recipient, nickname, birthday, wish, secretMessage, musicTitle, musicUrl, and the three approved non-portrait images. Merge defaults, trim image strings, and return one empty fallback entry if none survive. Initialize the DOM only when document is defined.

- [ ] **Step 4: Run the configuration test to verify it passes**

Run: node --test tests/birthday-config.test.mjs

Expected: PASS with 2 tests.

- [ ] **Step 5: Commit**

~~~bash
git add birthday.html birthday.js tests/birthday-config.test.mjs
git commit -m "feat: add configurable birthday card shell"
~~~

### Task 2: Implement cultured-butter composition and responsive layout

**Files:**
- Create: birthday.css
- Modify: birthday.html
- Modify: tests/birthday-config.test.mjs

**Interfaces:**
- Consumes: semantic hooks from Task 1.
- Produces: desktop two-column and mobile vertical layout, image fallback, cake, and Polaroid visual states.

- [ ] **Step 1: Add a failing static contract test**

~~~js
import fs from 'node:fs';

test('birthday page contains the interaction anchors', () => {
  const html = fs.readFileSync(new URL('../birthday.html', import.meta.url), 'utf8');
  for (const id of ['celebration-canvas', 'polaroid-stack', 'cake-button', 'surprise-button', 'wish-text', 'envelope-dialog']) {
    assert.match(html, new RegExp('id="' + id + '"'));
  }
});
~~~

- [ ] **Step 2: Run the test to verify it fails**

Run: node --test tests/birthday-config.test.mjs

Expected: FAIL until all required anchors exist.

- [ ] **Step 3: Implement visual design**

In birthday.css define semantic roles: surface cream #fff9ef, butter #ffd88d, apricot #ffb787, berry #c85c72, cocoa ink #4d3540, mint wash #b5ead7, and translucent glass. Use the roles consistently, representing Astryx-style semantic token discipline. Center the card at 950px wide, use a grid of 320px and remaining content, blur only the card surface, and collapse to one column at 780px.

Draw the cake from CSS tiers and frosting. Use transforms for the candle flame, smoke, Polaroid separation, button press, and vinyl rotation. Use a bright 1px border, a compact corner-radius scale, and a cocoa comic shadow on the surprise button. Include a reduced-motion media query disabling non-essential transforms and animation.

- [ ] **Step 4: Run tests to verify contracts pass**

Run: node --test tests/birthday-config.test.mjs

Expected: PASS with 3 tests.

- [ ] **Step 5: Commit**

~~~bash
git add birthday.html birthday.css tests/birthday-config.test.mjs
git commit -m "feat: style cultured butter birthday card"
~~~

### Task 3: Add memories, typewriter, candle, canvas, and sound behavior

**Files:**
- Modify: birthday.js
- Modify: birthday.html
- Modify: tests/birthday-config.test.mjs

**Interfaces:**
- Consumes: normalizeCardConfig and safeImageList.
- Produces: nextTypewriterFrame, makeConfettiPiece, startTypewriter, blowCandle, launchConfetti, and startBackdrop.
- Enables: Task 4 modal controller calls launchConfetti.

- [ ] **Step 1: Write failing behavior tests**

~~~js
import { nextTypewriterFrame, makeConfettiPiece } from '../birthday.js';

test('advances typewriter one visible character at a time', () => {
  assert.deepEqual(nextTypewriterFrame('Chúc mừng', 3), { text: 'Chú', done: false });
  assert.deepEqual(nextTypewriterFrame('Chúc', 9), { text: 'Chúc', done: true });
});

test('generates finite confetti motion values', () => {
  const piece = makeConfettiPiece(400, 300, () => .5);
  assert.ok(Number.isFinite(piece.x) && Number.isFinite(piece.vy));
  assert.ok(piece.size >= 6 && piece.size <= 13);
});
~~~

- [ ] **Step 2: Run the test to verify it fails**

Run: node --test tests/birthday-config.test.mjs

Expected: FAIL because the helper exports are missing.

- [ ] **Step 3: Implement the controllers**

Render Polaroids from safeImageList, replacing each failed image with an accessible CSS fallback without breaking its siblings. Toggle Polaroid separation on click and Enter or Space.

Implement the pure helper:
~~~js
export function nextTypewriterFrame(message, position) {
  return { text: message.slice(0, position), done: position >= message.length };
}
~~~
Track a single timeout id and clear it before replaying the wish.

Make candle activation idempotent: add is-extinguished, set aria-pressed true, show smoke, launch confetti once, and emit a short Web Audio tone only after direct interaction and only while sound is on. Create one Canvas state for balloons, sparkles, shooting stars, and temporary confetti. Pause on document visibilitychange and do not start it under reduced motion.

- [ ] **Step 4: Run behavior tests to verify they pass**

Run: node --test tests/birthday-config.test.mjs

Expected: PASS with 5 tests.

- [ ] **Step 5: Commit**

~~~bash
git add birthday.html birthday.js tests/birthday-config.test.mjs
git commit -m "feat: add birthday card interactions"
~~~

### Task 4: Finish envelope, vinyl, tilt, accessibility, and visual QA

**Files:**
- Modify: birthday.html
- Modify: birthday.css
- Modify: birthday.js
- Modify: tests/birthday-config.test.mjs

**Interfaces:**
- Consumes: launchConfetti from Task 3.
- Produces: keyboard-safe envelope dialog, visual vinyl control, pointer-only tilt, and evidence from automated plus browser tests.

- [ ] **Step 1: Add failing dialog contract test**

~~~js
test('dialog has semantics and a labelled close button', () => {
  const html = fs.readFileSync(new URL('../birthday.html', import.meta.url), 'utf8');
  assert.match(html, /id="envelope-dialog"[^>]*aria-labelledby="secret-title"/);
  assert.match(html, /id="close-surprise"[^>]*aria-label="Close surprise"/);
});
~~~

- [ ] **Step 2: Run the test to verify it fails**

Run: node --test tests/birthday-config.test.mjs

Expected: FAIL until exact dialog accessibility contract is present.

- [ ] **Step 3: Implement finishing interfaces**

Open the native dialog from the surprise button, retain the triggering element, move focus to the envelope button, and restore focus after close or Escape. The envelope toggles is-open and reveals secretMessage from the normalized config, with a small confetti burst.

Let the vinyl control toggle a visual spinning state and waveform. Present musicUrl as a truthful outbound link when supplied; do not fake Spotify playback. Add pointer tilt only for hover-capable devices when reduced motion is off, render with requestAnimationFrame, and reset on pointerleave.

- [ ] **Step 4: Verify automatically and in a browser**

Run: node --test tests/birthday-config.test.mjs

Expected: PASS with 6 tests.

Serve the workspace and inspect birthday.html at desktop and 390px. Check the image fallback, Polaroid expansion, wish replay, candle single-celebration rule, mute state, modal focus and Escape, envelope opening, vinyl state, and reduced-motion behavior.

- [ ] **Step 5: Commit**

~~~bash
git add birthday.html birthday.css birthday.js tests/birthday-config.test.mjs
git commit -m "feat: complete interactive birthday card"
~~~

