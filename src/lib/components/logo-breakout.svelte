<script>
	import { Spring } from 'svelte/motion';
	/** @import { ShapeId, SpringTarget, SectionAnchors } from '$lib/types/logo.js' */

	/**
	 * LogoBreakout.svelte
	 *
	 * Scroll-driven shape breakout animation for the Monty Pages logo.
	 * The 4 active shapes (urlbar, circle, red, teal) sit invisibly over the
	 * static SVG logo at section 0, then spring to caller-supplied anchor
	 * positions as the user scrolls through sections.
	 *
	 * @prop {number}       section - Active section index (0 = hero, 1+= content sections)
	 * @prop {number}       logoX   - Left edge of the static logo in viewport px (default 40)
	 * @prop {number}       logoY   - Top edge of the static logo in viewport px (default 40)
	 * @prop {SectionAnchors[]} anchors - Destination positions per section (index 0 = hero/locked)
	 */

	// ─── Types ────────────────────────────────────────────────────────────────

	/**
	 * @typedef {Object} ShapeDefinition
	 * @property {ShapeId} id     - Key matching a property of SectionAnchors
	 * @property {number} w      - Width in px
	 * @property {number} h      - Height in px
	 * @property {string} bg     - CSS background colour
	 * @property {string} border - CSS border shorthand
	 * @property {number} rx     - Border-radius in px
	 * @property {number} ox     - X offset from logoX when locked (section 0)
	 * @property {number} oy     - Y offset from logoY when locked (section 0)
	 * @property {string} [clip] - Optional CSS clip-path value
	 */

	/**
	 * @typedef {Object} SpringConfig
	 * @property {number} stiffness - Spring stiffness (lower = slower/floatier)
	 * @property {number} damping   - Spring damping  (lower = more overshoot)
	 */

	/** @type {{ section?: number, logoX?: number, logoY?: number, anchors: SectionAnchors[] }} */
	let { section = 0, logoX = 40, logoY = 40, anchors } = $props();

	// ─── Shape definitions ────────────────────────────────────────────────────
	// Only the 4 shapes that break out. Offsets (ox, oy) place them over the
	// static SVG logo at section 0 (opacity 0, so they're invisible until launch).

	/** @type {ShapeDefinition[]} */
	const shapes = [
		{
			id: 'urlbar',
			w: 65,
			h: 9,
			bg: '#f9cb40',
			border: 'none',
			rx: 1,
			ox: 9,
			oy: 7,
		},
		{
			id: 'circle',
			w: 26,
			h: 26,
			bg: '#f0eff4',
			border: 'none',
			rx: 13,
			ox: 52,
			oy: 24
		},
		{
			id: 'red',
			w: 38,
			h: 23,
			bg: '#c20114',
			border: 'none',
			rx: 0,
			ox: 9,
			oy: 24,
            clip: 'polygon(0% 0%, 100% 0%, 0% 100%)'
		},
		{
			id: 'teal',
			w: 38,
			h: 23,
			bg: '#048ba8',
			border: 'none',
			rx: 0,
			ox: 47,
			oy: 24,
			clip: 'polygon(100% 0%, 0% 100%, 100% 100%)'
		}
	];

	// ─── Spring instances (one per shape, varied feel) ────────────────────────

	/** @type {SpringConfig[]} */
	const springConfigs = [
		{ stiffness: 0.05, damping: 0.25 }, // urlbar – bouncy
		{ stiffness: 0.03, damping: 0.22 }, // circle – very floaty
		{ stiffness: 0.07, damping: 0.3 }, // red    – snappier
		{ stiffness: 0.02, damping: 0.26 } // teal   – floaty + slight overshoot
	];

	/** @type {Spring<SpringTarget>[]} */
	const springs = shapes.map(
		(sh, i) =>
			new Spring({ x: logoX + sh.ox, y: logoY + sh.oy, scale: 1, rotate: 0 }, springConfigs[i])
	);

	// ─── React to section + anchor changes ───────────────────────────────────

	$effect(() => {
		/** @type {number} */
		const idx = Math.min(Math.max(section, 0), anchors.length - 1);

		shapes.forEach((sh, i) => {
			/** @type {SpringTarget} */
			const dest = anchors[idx][sh.id];
			springs[i].set(dest);
		});
	});

	// ─── Opacity ──────────────────────────────────────────────────────────────
	// Section 0: invisible (static logo shows through).
	// Section 1+: fully visible as shapes drift to their anchors.

	/** @type {number} */
	const targetOpacity = $derived(section === 0 ? 0 : 1);
</script>

<!--
  Floating shape layer — position: fixed so shapes move with the viewport,
  not the scroll. z-index sits above page content but below modals.
  pointer-events: none so it never blocks clicks.
-->
<div class="logo-breakout-layer" aria-hidden="true">
	{#each shapes as sh, i}
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
		--delayX: {i * 777}ms;
		--delayY: {i * 360}ms;
		--durX: {10 / (i + 1)}s;
		--durY: {11 / (i + 1)}s;
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
		transition: opacity 300ms ease;
		transform-origin: top left;
		animation: hoverX var(--durX, 3s) ease var(--delayX, 0s) infinite alternate,
				   hoverY var(--durY, 4s) ease var(--delayY, 0s) infinite alternate;
		animation-composition: add;
	}

	@keyframes hoverX {
		to {
			transform: translateX(-3px);
		}
	}

	@keyframes hoverY {
		to {
			transform: translateY(3px);
		}
	}
</style>
