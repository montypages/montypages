<script>
	import Header from '$lib/components/header.svelte';
	import OneLiner from '$lib/components/one-liner.svelte';
	import ContactForm from '$lib/components/contact-form.svelte';
	import LogoBreakout from '$lib/components/logo-breakout.svelte';
	import { onMount } from 'svelte';
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
	import { SHAPE_DIMS, scaleDim } from '$lib/types/logo.js';

	/** @import { FormState } from '$lib/types/logo'*/

	/** @type {FormState} formState */
	let formState = $state('idle');
	let { form } = $props();
	let currentSection = $state(0);
	/**
	 * @type {HTMLElement[]}
	 */
	let sections = $state([]);
	const center = {
		x: innerWidth.current ? innerWidth.current / 2 : 0,
		y: innerHeight.current ? innerHeight.current / 2 : 0
	};

	/** @import { SectionAnchors } from '$lib/types/logo.js' */

	// ─── Element refs for anchor targets ─────────────────────────────────────

	/** @type {HTMLHeadingElement | null} */
	let section1Heading = $state(null);

	/** @type {HTMLParagraphElement | null} */
	let section1Para = $state(null);

	/** @type {HTMLHeadingElement | null} */
	let formSectionHeading = $state(null);

	/** @type {HTMLLabelElement | null} */
	let formSectionName = $state(null);

	/** @type {HTMLLabelElement | null} */
	let formSectionEmail = $state(null);

	/** @type {HTMLLabelElement | null} */
	let formSectionMessage = $state(null);

	/** @type {HTMLDivElement | null} */
	let btnContainer = $state(null);

	/** @type {HTMLDivElement | null} */
	let msgDiv = $state(null);

	// ─── Live anchor computation ──────────────────────────────────────────────
	// Recomputes on every scroll tick so shapes track their target elements
	// as the page moves. Falls back to offscreen positions until refs are ready.

	/** @type {number} */
	let scrollY = $state(0);

	/**
	 * Measures an element's position relative to the viewport.
	 * Returns null if the ref isn't mounted yet.
	 * @param {HTMLElement | null} el
	 * @returns {DOMRect | null}
	 */
	function rect(el) {
		return el ? el.getBoundingClientRect() : null;
	}

	/** @type {SectionAnchors[]} */
	const anchors = $derived.by(() => {
		// Reference scrollY so this derived re-runs on every scroll tick
		void scrollY;
		const vw = innerWidth.current ?? 1280;
		const offscreenLeft = { x: -200, y: 0, scale: 1, rotate: 0 };
		const offscreenRight = { x: vw + 400, y: 0, scale: 0, rotate: 720 };

		// Scaled dimensions for positioning math
		const urlbarW = scaleDim(SHAPE_DIMS.urlbar.w, vw);
		const urlbarH = scaleDim(SHAPE_DIMS.urlbar.h, vw);
		const tealW = scaleDim(SHAPE_DIMS.teal.w, vw);
		const tealH = scaleDim(SHAPE_DIMS.teal.h, vw);
		const redW = scaleDim(SHAPE_DIMS.red.w, vw);
		const redH = scaleDim(SHAPE_DIMS.red.h, vw);
		const circleW = scaleDim(SHAPE_DIMS.circle.w, vw);
		const circleH = scaleDim(SHAPE_DIMS.circle.h, vw);

		//   Section 1 anchors
		const h = rect(section1Heading);
		const p = rect(section1Para);
		//   Form Section anchors
		const formH = rect(formSectionHeading);
		const formName = rect(formSectionName);
		const formEmail = rect(formSectionEmail);
		const formMessage = rect(formSectionMessage);
		const formBtn = rect(btnContainer);
		const formMsg = rect(msgDiv);

		/** @type {Record<FormState, SectionAnchors>} */
		const formAnchors = {
			idle: {
				red: formName
					? {
							x: formName.right + formName.width * 0 - redW * 1,
							y: formName.bottom + formName.height * 0 - redH * 0.4,
							scale: 1,
							rotate: 202
						}
					: offscreenLeft,
				teal: formEmail
					? {
							x: formEmail.right + formEmail.width * 0.1 + tealW * 0,
							y: formEmail.bottom - formEmail.height * 0 - tealH * 1.7,
							scale: 1,
							rotate: 21
						}
					: offscreenRight,
				urlbar: formH
					? {
							x: formH.left + formH.width * 0.5 - urlbarW * 0.7,
							y: formH.bottom,
							scale: 1,
							rotate: -357
						}
					: offscreenLeft,
				circle: formMessage
					? {
							x: formMessage.right + formMessage.width * 0 + circleW * 0.5,
							y: formMessage.bottom - circleH * 1,
							scale: 1,
							rotate: 0
						}
					: offscreenRight
			},
			active: {
				urlbar: formBtn 
					? { x: formBtn.right + formBtn?.width * 0 + urlbarW * 0.5, y: formBtn.top + formBtn.height * 0.5 - urlbarH * 0.5, scale: 1, rotate: 0 }
					: offscreenLeft,
				circle: formBtn 
					? { x: formBtn.right + formBtn?.width * 0 - circleW * 0.5 + tealW * 1, y: formBtn.top + formBtn.height * 0.5 - circleH * 0.5, scale: 1, rotate: 0 }
					: offscreenRight,
				red: formBtn 
					? { x: formBtn.right + formBtn?.width * 0 - redW * 1.5, y: formBtn.top + formBtn.height * 1 - redH * 1, scale: 1, rotate: 210 }
					: offscreenLeft,
				teal: formBtn 
					? { x: formBtn.right + formBtn?.width * 0 + tealW * 0, y: formBtn.top + formBtn.height * 0 + tealH * 0, scale: 1, rotate: 0 }
					: offscreenRight,
			},
			success: {
				urlbar: offscreenLeft,
				circle: offscreenRight,
				red: offscreenLeft,
				teal: offscreenRight,
			}
		};

		return [
			// Section 0 — hero: shapes locked over the logo (opacity 0)
			{
				urlbar: { x: center.x * 0.95, y: center.y * 0.72, scale: 1, rotate: 0 },
				circle: { x: center.x * 1.03, y: center.y * 0.77, scale: 1, rotate: 0 },
				red: { x: center.x * 0.94, y: center.y * 0.79, scale: 1, rotate: 0 },
				teal: { x: center.x * 0.94, y: center.y * 0.79, scale: 1, rotate: 0 }
			},
			// Section 1 — shapes anchor to the h2 and p elements
			{
				// left edge of h2, aligned to its bottom
				red: h
					? {
							x: h.left + redW * 0.5,
							y: h.bottom + h.height * 0.5 - redH * 0.5,
							scale: 1,
							rotate: 10
						}
					: offscreenLeft,
				// center of h2 bottom
				teal: h
					? {
							x: h.left + h.width * 0.5 - tealW * 0.5,
							y: h.bottom - h.height * 0.4 - tealH * 0.5,
							scale: 1,
							rotate: 25
						}
					: offscreenLeft,
				// right edge of h2 bottom
				urlbar: h
					? {
							x: h.right - h.width * 0.1 - urlbarW,
							y: h.bottom - urlbarH * 0.5,
							scale: 1,
							rotate: 3
						}
					: offscreenLeft,
				// top-left corner of the paragraph
				circle: h
					? { x: h.left - h.width * 0.07 - circleW * 0.5, y: h.top, scale: 1, rotate: 0 }
					: offscreenLeft
			},
			// Section 2 — contact: shapes move to new decorative positions
			formAnchors[formState]
		];
	});

	onMount(() => {
		// Scroll listener updates scrollY, which invalidates the derived anchors
		const onScroll = () => {
			scrollY = window.scrollY;
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		sections = Array.from(document.querySelectorAll('[data-section]'));

		const observer = new IntersectionObserver(
			/** @param {IntersectionObserverEntry[]} entries */
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const target = /** @type {HTMLElement} */ (entry.target);
						currentSection = Number(target.dataset.section);
					}
				});
			},
			{ threshold: 0.8 }
		);

		sections.forEach((el) => observer.observe(el));

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<Header />

<!--
  The floating shape layer — receives current section index.
  Adjust logoX/logoY to match where your logo actually is on screen.
-->
<LogoBreakout
	section={currentSection}
	logoX={innerWidth.current ? innerWidth.current / 2 : 0}
	logoY={-100}
	{anchors}
/>

<!--
  Page sections — each gets data-section="N" for the observer.
-->

<main>
	<section data-section="1" class="section">
		<OneLiner bind:heading={section1Heading} bind:para={section1Para} />
	</section>

	<section data-section="2" class="section" id="contactForm">
		<div class="form-container">
			<ContactForm
				{form}
				bind:heading={formSectionHeading}
				bind:input1={formSectionName}
				bind:input2={formSectionEmail}
				bind:input3={formSectionMessage}
				bind:btnContainer={btnContainer}
				bind:msgDiv={msgDiv}
				bind:formState
			/>
		</div>
	</section>
</main>

<footer class="section">
	<p class="copyright">&copy;2026 All Rights Reserved</p>
</footer>

<style>
	.form-container {
		width: min(90%, 700px);
		margin: 0 auto;
	}

	.copyright {
		font-size: 0.7rem;
	}

	section {
		min-height: 100vh;
		display: flex;
		align-items: center;
	}
</style>
