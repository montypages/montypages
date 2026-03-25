<script>
	import Header from '$lib/components/header.svelte';
	import OneLiner from '$lib/components/one-liner.svelte';
	import ContactForm from '$lib/components/contact-form.svelte';
	import LogoBreakout from '$lib/components/logo-breakout.svelte';
	import { onMount } from 'svelte';
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';

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

	/** @type {HTMLParagraphElement | null} */
	let formSectionHeading = $state(null);

	/** @type {HTMLParagraphElement | null} */
	let formSectionName = $state(null);

	/** @type {HTMLParagraphElement | null} */
	let formSectionEmail = $state(null);

	/** @type {HTMLParagraphElement | null} */
	let formSectionMessage = $state(null);

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

		//   Section 1 anchors
		const h = rect(section1Heading);
		const p = rect(section1Para);
		//   Form Section anchors
		const formH = rect(formSectionHeading);
		const formName = rect(formSectionName);
		const formEmail = rect(formSectionEmail);
		const formMessage = rect(formSectionMessage);

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
					? { x: h.left + 70, y: h.bottom - 12, scale: 2, rotate: 10 }
					: { x: -200, y: 0, scale: 1, rotate: 0 },
				// center of h2 bottom
				teal: h
					? { x: h.left + h.width / 2 - 19, y: h.bottom - 43, scale: 2, rotate: 25 }
					: { x: -200, y: 0, scale: 1, rotate: 0 },
				// right edge of h2 bottom
				urlbar: h
					? { x: h.right - 200, y: h.bottom - 9, scale: 2, rotate: 3 }
					: { x: -200, y: 0, scale: 1, rotate: 0 },
				// top-left corner of the paragraph
				circle: p
					? { x: p.left - 50, y: p.top - 4, scale: 1.5, rotate: 0 }
					: { x: -200, y: 0, scale: 1, rotate: 0 }
			},
			// Section 2 — contact: shapes move to new decorative positions
			{
				// left edge of h2, aligned to its bottom
				red: formName
					? { x: formName.left - 70, y: formName.top, scale: 2, rotate: 12 }
					: { x: -200, y: 0, scale: 1, rotate: 0 },
				// center of h2 bottom
				teal: formEmail
					? { x: formEmail.left, y: formEmail.top + 60, scale: 2, rotate: 187 }
					: { x: -200, y: 0, scale: 1, rotate: 0 },
				// right edge of h2 bottom
				urlbar: formH
					? { x: formH.left + formH.width / 2 - 80, y: formH.bottom - 9, scale: 2.5, rotate: -357 }
					: { x: -200, y: 0, scale: 1, rotate: 0 },
				// top-left corner of the paragraph
				circle: formMessage
					? { x: formMessage.left - 50, y: formMessage.top - 4, scale: 1.5, rotate: 0 }
					: { x: -200, y: 0, scale: 1, rotate: 0 }
			},
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

	<section data-section="2" class="section">
		<div class="form-container">
			<ContactForm 
				{form} 
				bind:heading={formSectionHeading} 
				bind:input1={formSectionName} 
				bind:input2={formSectionEmail} 
				bind:input3={formSectionMessage} 
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
