<script>
    import Header from "$lib/components/header.svelte";
    import OneLiner from "$lib/components/one-liner.svelte";
    import ContactForm from "$lib/components/contact-form.svelte";
    import LogoBreakout from "$lib/components/logo-breakout.svelte";
    import { onMount } from "svelte";
    import { innerWidth } from "svelte/reactivity/window";

    
    let { form } = $props();
    let currentSection = $state(0);
    /**
     * @type {HTMLElement[]}
     */
    let sections = $state([]);

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
            threshold: 0.4,
        }
        );
    
        sections.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    });

    function click() {
        console.log('clicked');
    }
</script>

<Header />

<!--
  The floating shape layer — receives current section index.
  Adjust logoX/logoY to match where your logo actually is on screen.
-->
<LogoBreakout section={currentSection} logoX={innerWidth.current ? innerWidth.current / 2 : 0} logoY={-100} />
 
<!--
  Page sections — each gets data-section="N" for the observer.
-->

<main>

    <section data-section="0">
        <OneLiner />
    </section>


    <section data-section="1">
        <div class="form-container">
            <ContactForm {form}/>
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