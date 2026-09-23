# Pastel Dreamland Birthday Card Design

## Intent

Create a new standalone GitHub Pages page at `birthday.html`. It is a celebratory interactive birthday card, unrelated to the existing scheduling form. The intended recipient and copy remain editable from one JavaScript configuration object.

## Visual direction

The card combines Pastel Dreamland, a web glassmorphism approximation, playful comic accents, and a warm Butter Croissant / Cultured Butter material language. The palette uses strawberry cream, apricot butter, lavender cream, and restrained mint, with a toasted-caramel accent for key actions. The surface should feel soft and tactile rather than neon or overly glossy.

Design settings:

- Design variance: 8/10, from the asymmetrical Polaroid stack and hand-placed sticker accents.
- Motion intensity: 7/10, reserved for feedback, celebration, and depth.
- Visual density: 4/10, preserving breathing room for the recipient's name and wish.
- Foundation: native HTML, CSS, and JavaScript. Astryx is used as the available design tooling reference; the final static page does not force a React runtime into a vanilla site.

## Layout

Desktop is a centered 950 x 620-ish two-column card. The 320px visual column has a `Make a Wish` sticker, a three-item Polaroid stack, and the interactive cake. The remaining column holds a retro surprise button, title, birthday metadata, typewriter wish, and vinyl music module.

At 780px and below, it becomes a single vertical story: visual memories, cake interaction, then message and controls. All controls retain keyboard access and visible focus styles.

## Components and state

`CARD_CONFIG` is the only content source, including recipient name, nickname, birthday date, main wish, secret note, music title, music URL, and image array. It is rendered into the DOM on load. Missing or invalid image URLs switch to a CSS image fallback.

Interaction state is isolated into:

- Candle state: lit, extinguished, smoke active, celebration shown once.
- Surprise state: modal open or closed, envelope opened or closed.
- Sound state: audio enabled or muted, vinyl playing or paused.
- Wish state: typewriter run id for safe restart.

The card tilt is pointer-only and disables itself for touch, keyboard navigation, and reduced-motion preference.

## Motion, sound, and performance

A single canvas animation loop provides balloons, small sparkles, and shooting stars. It pauses when the tab is not visible and respects `prefers-reduced-motion`. DOM animation relies on transforms and opacity.

Confetti is custom canvas based and starts when the candle is clicked or the envelope opens. Brief celebratory SFX is synthesized with the Web Audio API after a direct user gesture, so there is no external sound asset or autoplay failure. The sound toggle is always available.

## Accessibility and resilience

The page uses semantic regions, labelled icon controls, modal focus management, Escape to close the modal, and an explicit reduced-motion mode. The background remains decorative and does not interfere with reading. Image fallback and music-link fallback keep the card useful when third-party resources fail.

## Verification

Verify desktop and mobile layouts, typewriter restart, candle lifecycle, surprise modal keyboard behavior, sound toggle, non-crashing image fallback, and reduced-motion behavior. Use a local browser screenshot pass before handoff.
