<script>
	import Header from '$lib/components/header.svelte';
	import OneLiner from '$lib/components/one-liner.svelte';
	import ContactForm from '$lib/components/contact-form.svelte';
	import LogoBreakout from '$lib/components/logo-breakout.svelte';
	import { onMount } from 'svelte';
	import { innerWidth } from 'svelte/reactivity/window';

	let { form } = $props();
	let currentSection = $state(0);
	/**
	 * @type {HTMLElement[]}
	 */
	let sections = $state([]);
  const center = innerWidth.current ? innerWidth.current / 2 : 0;

  /** @import { SectionAnchors } from '$lib/types/logo.js' */

	// ─── Anchor declarations ──────────────────────────────────────────────────
	// One SectionAnchors object per page section.
	// Index 0 = hero (shapes locked over the logo, not visible).
	// Index 1, 2, ... = content sections — place shapes wherever suits the layout.
	// x/y are fixed-viewport px from top-left.

	/** @type {SectionAnchors[]} */
	const anchors = [
		// Section 0 — hero: shapes sit over the logo (opacity 0, just a placeholder)
		{
			urlbar: { x: (center), y: 47, scale: 1, rotate: 0 },
			circle: { x: center, y: 64, scale: 1, rotate: 0 },
			red: { x: center, y: 64, scale: 1, rotate: 0 },
			teal: { x: center, y: 64, scale: 1, rotate: 0 }
		},
		// Section 1 — about: shapes drift out across the page
		{
			urlbar: { x: 680, y: 90, scale: 4, rotate: 12 },
			circle: { x: 820, y: 340, scale: 5, rotate: 0 },
			red: { x: 200, y: 480, scale: 3.5, rotate: -15 },
			teal: { x: 480, y: 180, scale: 4.5, rotate: 20 }
		},
		// Section 2 — contact: shapes settle into final decorative positions
		{
			urlbar: { x: 400, y: 480, scale: 3.5, rotate: -8 },
			circle: { x: 100, y: 200, scale: 4, rotate: 0 },
			red: { x: 750, y: 300, scale: 2.8, rotate: 10 },
			teal: { x: 200, y: 360, scale: 3, rotate: -12 }
		}
	];

	onMount(() => {
		sections = Array.from(document.querySelectorAll('[data-section]'));

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
            const target = /**@type {HTMLElement}*/ (entry.target);
						currentSection = Number(target.dataset.section);
					}
				});
			},
			{
				// Trigger when section is > 40% visible
				threshold: 0.4
			}
		);

		sections.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
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
	<section data-section="1">
		<OneLiner />
	</section>

	<section data-section="2">
		<div class="form-container">
			<ContactForm {form} />
		</div>
	</section>
</main>

<footer>
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
	}
</style>
