<script>
  import { Spring } from 'svelte/motion';

  /**
   * LogoBreakout.svelte
   *
   * Scroll-driven shape breakout animation for the Monty Pages logo.
   * The 6 logo shapes sit invisibly over the static SVG logo at section 0,
   * then float out to hand-tuned positions as the user scrolls through sections.
   *
   * @prop {number} section - Active section index (0 = hero, 1 = second, 2 = third)
   * @prop {number} logoX   - Left edge of the static logo in viewport px (default 40)
   * @prop {number} logoY   - Top edge of the static logo in viewport px (default 40)
   */
  let { section = 0, logoX = 40, logoY = 40 } = $props();

  // ─── Types ────────────────────────────────────────────────────────────────

  /**
   * @typedef {Object} ShapeDefinition
   * @property {string}          id      - Unique key matching a key in `destinations`
   * @property {number}          w       - Width in px
   * @property {number}          h       - Height in px
   * @property {string}          bg      - CSS background colour
   * @property {string}          border  - CSS border shorthand
   * @property {number}          rx      - Border-radius in px
   * @property {number}          ox      - X offset from logoX when locked
   * @property {number}          oy      - Y offset from logoY when locked
   * @property {string}          [clip]  - Optional CSS clip-path value
   */

  /**
   * @typedef {Object} SpringTarget
   * @property {number} x      - Absolute viewport X position (px)
   * @property {number} y      - Absolute viewport Y position (px)
   * @property {number} scale  - Uniform scale factor
   * @property {number} rotate - Rotation in degrees
   */

  /**
   * @typedef {Object} SpringConfig
   * @property {number} stiffness - Spring stiffness (lower = slower/floatier)
   * @property {number} damping   - Spring damping  (lower = more overshoot)
   */

  // ─── Logo geometry ────────────────────────────────────────────────────────
  // Tuned to a ~192 × 88 px rendered logo (SVG viewBox ≈ 54mm × 26mm @ 96dpi × 0.74).
  // Offsets (ox, oy) are relative to (logoX, logoY).

  /** @type {ShapeDefinition[]} */
  const shapeBase = [
    // // Dark screen rectangle
    // {
    //   id: 'screen',
    //   w: 85,  h: 50,
    //   bg: '#0c120c',
    //   border: '1.5px solid #4d4d4d',
    //   rx: 3,
    //   ox: 0,   oy: 0,
    // },
    // // Light base bar
    // {
    //   id: 'base',
    //   w: 109, h: 4,
    //   bg: '#f0eff4',
    //   border: '1px solid #888',
    //   rx: 2,
    //   ox: -11, oy: 52,
    // },
    // Yellow URL bar
    {
      id: 'urlbar',
      w: 65,  h: 9,
      bg: '#f9cb40',
      border: 'none',
      rx: 1,
      ox: 9,   oy: 7,
    },
    // White circle
    {
      id: 'circle',
      w: 26,  h: 26,
      bg: '#f0eff4',
      border: 'none',
      rx: 13,
      ox: 52,  oy: 24,
    },
    // Red rectangle
    {
      id: 'red',
      w: 38,  h: 23,
      bg: '#c20114',
      border: 'none',
      rx: 0,
      ox: 9,   oy: 24,
      clip: 'polygon(0% 0%, 100% 0%, 0% 100%)',
    },
    // Teal triangle (clip-path simulates the SVG path)
    {
      id: 'teal',
      w: 38,  h: 23,
      bg: '#048ba8',
      border: 'none',
      rx: 0,
      ox: 47,  oy: 24,
      clip: 'polygon(100% 0%, 0% 100%, 100% 100%)',
    },
  ];

  // ─── Per-section destinations ─────────────────────────────────────────────
  // x/y are absolute fixed-viewport positions (px from top-left).
  // Hand-tuned for a ~1280px wide layout — adjust to taste.
  //
  // Index 0 → logo-locked (shapes overlay the static SVG, opacity 0)
  // Index 1 → break out across the page
  // Index 2 → settle into final decorative positions

  /** @type {Record<string, SpringTarget[]>} */
  const destinations = $derived({
    // screen: [
    //   { x: logoX,        y: logoY,        scale: 1,    rotate: 0   },  // s0: locked
    //   { x: -30,          y: 120,          scale: 3.2,  rotate: -8  },  // s1
    //   { x: 820,          y: 60,           scale: 2.4,  rotate: 6   },  // s2
    // ],
    // base: [
    //   { x: logoX - 11,   y: logoY + 52,   scale: 1,    rotate: 0   },
    //   { x: 600,          y: 520,          scale: 2.8,  rotate: 4   },
    //   { x: -20,          y: 580,          scale: 2,    rotate: -3  },
    // ],
    urlbar: [
      { x: logoX + 9,    y: logoY + 7,    scale: 1,    rotate: 0   },
      { x: 680,          y: 90,           scale: 4,    rotate: 12  },
      { x: 400,          y: 480,          scale: 3.5,  rotate: -8  },
    ],
    circle: [
      { x: logoX + 52,   y: logoY + 24,   scale: 1,    rotate: 0   },
      { x: 820,          y: 340,          scale: 5,    rotate: 0   },
      { x: 100,          y: 200,          scale: 4,    rotate: 0   },
    ],
    red: [
      { x: logoX + 9,    y: logoY + 24,   scale: 1,    rotate: 0   },
      { x: 200,          y: 480,          scale: 3.5,  rotate: -15 },
      { x: 750,          y: 300,          scale: 2.8,  rotate: 10  },
    ],
    teal: [
      { x: logoX + 47,   y: logoY + 24,   scale: 1,    rotate: 0   },
      { x: 480,          y: 180,          scale: 4.5,  rotate: 20  },
      { x: 200,          y: 360,          scale: 3,    rotate: -12 },
    ],
  });

  // ─── Spring instances (one per shape, varied feel) ────────────────────────
  // Lower stiffness + lower damping = more floaty overshoot.
  // The new Svelte 5 API uses `new Spring(initialValue, options)`.
  // Read animated values via `.current` — no `$` store prefix needed.

  /** @type {SpringConfig[]} */
  const springConfigs = [
    { stiffness: 0.04, damping: 0.28 },   // screen  – slow, drifty
    { stiffness: 0.06, damping: 0.32 },   // base    – medium
    { stiffness: 0.05, damping: 0.25 },   // urlbar  – bouncy
    { stiffness: 0.03, damping: 0.22 },   // circle  – very floaty
    { stiffness: 0.07, damping: 0.30 },   // red     – snappier
    { stiffness: 0.04, damping: 0.26 },   // teal    – floaty + slight overshoot
  ];

  /** @type {Spring<SpringTarget>[]} */
  const springs = shapeBase.map((sh, i) => {
    /** @type {SpringTarget} */
    const dest = destinations[sh.id][0];
    return new Spring(
      { x: dest.x, y: dest.y, scale: dest.scale, rotate: dest.rotate },
      springConfigs[i]
    );
  });

  // ─── React to section changes ─────────────────────────────────────────────

  $effect(() => {
    /** @type {number} */
    const idx = Math.min(Math.max(section, 0), 2);

    shapeBase.forEach((sh, i) => {
      /** @type {SpringTarget} */
      const dest = destinations[sh.id][idx];
      springs[i].set({ x: dest.x, y: dest.y, scale: dest.scale, rotate: dest.rotate });
    });
  });

  // ─── Opacity ──────────────────────────────────────────────────────────────
  // Section 0: shapes invisible (static logo shows through).
  // Section 1+: shapes fully visible as they drift away.

  /** @type {number} */
  const targetOpacity = $derived(section === 0 ? 0 : 1);
</script>

<!--
  Floating shape layer — position: fixed so shapes move with the viewport,
  not the scroll. z-index sits above page content but below modals.
  pointer-events: none so it never blocks clicks.
-->
<div
  class="logo-breakout-layer"
  aria-hidden="true"
>
  {#each shapeBase as sh, i}
    {@const s = springs[i].current}
    <div
      class="floating-shape"
      style="
        width: {sh.w}px;
        height: {sh.h}px;
        background: {sh.bg};
        border: {sh.border};
        border-radius: {sh.rx}px;
        clip-path: {sh.clip ?? 'none'};
        transform: translate({s.x}px, {s.y}px) scale({s.scale}) rotate({s.rotate}deg);
        opacity: {targetOpacity};
      "
    ></div>
  {/each}
</div>

<style>
  .logo-breakout-layer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    overflow: hidden;
  }

  .floating-shape {
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform, opacity;
    transition: opacity 0.6s ease;
    transform-origin: top left;
  }
</style>