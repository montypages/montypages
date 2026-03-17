<script>
    import Header from "$lib/components/header.svelte";
    import OneLiner from "$lib/components/one-liner.svelte";
    import ContactForm from "$lib/components/contact-form.svelte";
    import Noise from "$lib/components/noise.svelte";

    let { form } = $props();

    function click() {
        console.log('clicked');
    }
</script>

<Header />

<main>

    <OneLiner />

    <div class="form-container">
        <ContactForm {form}/>
    </div>

</main>

<footer>
    <p class="copyright">&copy;2026 All Rights Reserved</p>
</footer>

<style>
    .form-container {
        width: min(90%, 800px);
        margin: 0 auto;
    }

    .copyright {
        font-size: 0.7rem;
    }
</style>