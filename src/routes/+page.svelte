<script>
    import Header from "$lib/components/header.svelte";
    import OneLiner from "$lib/components/one-liner.svelte";
    import ContactForm from "$lib/components/contact-form.svelte";

    let textures = [
        { id: 'none', label: 'None', url: '' },
        // { id: 'binding', label: 'Dark Binding', url: '/textures/binding-dark.png' },
        { id: 'plaid', label: 'My Little Plaid Dark', url: '/textures/my-little-plaid-dark.png' },
        { id: 'nami', label: 'Nami', url: '/textures/nami.png' },
        { id: 'skulls', label: 'Skulls', url: '/textures/skulls.png' },
        // { id: 'soft-kill', label: 'Soft Kill', url: '/textures/soft-kill.png' },
        // { id: 'vichy', label: 'Vichy', url: '/textures/vichy.png' },
        { id: 'diamond', label: 'Diamond', url: '/textures/white-diamond-dark.png' },
    ];

    let selectedId = $state('none');

    let selectedTexture = $derived(
        textures.find(t => t.id === selectedId)
    );

    let bgValue = $derived(
        selectedTexture?.url ? `url(${selectedTexture.url})` : 'none'
    );

    $effect(() => {
        document.body.style.setProperty('--bg-texture', bgValue);
    });

    let { form } = $props();

    function click() {
        console.log('clicked');
    }
</script>

<div class="controls">
    <label for="texture-select">Choose Texture:</label>
    <select class='filter-select' id="texture-select" bind:value={selectedTexture}>
        {#each textures as texture}
        <option class='filter-option' value={texture}>
            {texture.label}
        </option>
        {/each}
    </select>
</div>

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

    .controls {
        margin: 1rem 1rem 0 auto;

        > label {
            font-size: 0.75rem;
        }
    }

    .filter-select {
        padding: 0.125rem;
        background-color: var(--clr-black, #333);
        color: hsl(from var(--clr-white, white) h s l / 0.5);

    }

    .filter-select:focus, .filter-option:focus {
        outline: 1px solid var(--clr-blue, rebeccapurple);
        border: none;
    }

    .filter-option {
        color: hsl(from var(--clr-white, white) h s l / 0.5);
    }

    :global(body) {
        /* Use a CSS variable that updates based on the selection */
        background-image: var(--bg-texture);
        background-repeat: repeat;
        transition: background-image 0.3s ease; /* Smooth transition */
    }

    .form-container {
        width: min(90%, 800px);
        margin: 0 auto;
    }

    .copyright {
        font-size: 0.7rem;
    }
</style>