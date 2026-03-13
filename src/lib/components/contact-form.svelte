<script>
    import { enhance } from '$app/forms'; // Import SvelteKit's enhance function for progressive enhancement
    import LogoButton from './logo-button.svelte';

    let { form } = $props(); // Optional: bind to the form prop to access return values
</script>

<h2>Contact Us</h2>
<form action="?/submitMail" method="POST" use:enhance>
    <div class="grid">
        <input type="text" name="name" id="name" required />
        <label style="--clr-label: var(--clr-yellow);" for="name">Your Name</label>
    </div>

    <div class="grid">
        <input type="email" name="email" id="email" required />
        <label style="--clr-label: var(--clr-yellow);" for="email">Your Email</label>
    </div>

    <div class="grid">
        <textarea name="message" id="message" rows="5" required></textarea>
        <label style="--clr-label: var(--clr-yellow);" for="message">Message</label>
    </div>

    <div class="center">
        <LogoButton type="submit" buttonText="Get Started" />
    </div>
</form>

{#if form?.message}
    <p>{form.message}</p>
{/if}

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .grid {
        display: grid;
    }

    label {
        font-size: 1rem;
        color: var(--clr-label, #ddd);
    }

    input, textarea {
        padding: 0.5rem;

        &:focus {
            outline: 2px solid var(--clr-blue, rebeccapurple);
        }
    }

    .center {
        display: flex;
        justify-content: center;
    }
</style>