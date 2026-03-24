<script>
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms'; // Import SvelteKit's enhance function for progressive enhancement
    import LogoButton from './logo-button.svelte';

    const googleRecaptchaSiteKey="6Lc_c48sAAAAAIDHi-YA3zojszyiQ4luYWTf1x2Z";
    let captchaCompleted = $state(false);
    let isSubmitting = $state(false);

    function handleSubmit() {
        if (isSubmitting) {return};

        isSubmitting = true;
    }

    /**
     * @param {string} token
     */
    function handleCaptchaSuccess(token) {
        console.log("Captcha completed:", token);
        captchaCompleted = true;
    }

    function handleCaptchaExpired() {
        console.log("Captcha expired");
        captchaCompleted = false;
    }

    onMount(() => {
        /** @type {any} */
        const w = window;
        // expose globally for reCAPTCHA
        w.handleCaptchaSuccess = handleCaptchaSuccess;
        w.handleCaptchaExpired = handleCaptchaExpired;
    });

    let { form, heading = $bindable(), input1 = $bindable(), input2 = $bindable(), input3 = $bindable() } = $props(); // Optional: bind to the form prop to access return values
</script>

{#if !form?.success}
<h2 bind:this={heading}>Contact Us</h2>
<form
  action="?/submitMail"
  method="POST"
  onsubmit={handleSubmit}
  use:enhance={({ cancel }) => {
    return async ({ update }) => {

        await update();

        isSubmitting = false;
    }
  }}
>
    <div class="grid" bind:this={input1}>
        <input type="text" name="name" id="name" required />
        <label style="--clr-label: var(--clr-yellow);" for="name">Name</label>
    </div>

    <div class="grid" bind:this={input2}>
        <input type="email" name="email" id="email" required />
        <label style="--clr-label: var(--clr-yellow);" for="email">Email</label>
    </div>

    <div class="grid" bind:this={input3}>
        <textarea name="message" id="message" rows="5" required></textarea>
        <label style="--clr-label: var(--clr-yellow);" for="message">Message</label>
    </div>

    <div 
        class="g-recaptcha" 
        data-sitekey={googleRecaptchaSiteKey} 
        data-callback="handleCaptchaSuccess"
        data-expired-calleback="handleCaptchaExpired"
    ></div>

    <LogoButton 
        type="submit" 
        buttonText={isSubmitting ? "Processing..." : "Get Started"} 
        disabled={!captchaCompleted || isSubmitting}
        loading={isSubmitting}
    />

</form>
{/if}

{#if form?.message}
    <div>{@html form.message}</div>
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
        color: hsl(from var(--clr-white, white) h s l / 0.5)
    }

    input, textarea {
        padding: 0.5rem;

        &:focus {
            outline: 2px solid var(--clr-blue, rebeccapurple);
        }
    }

</style>