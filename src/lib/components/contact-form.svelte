<script>
    import { enhance } from '$app/forms'; // Import SvelteKit's enhance function for progressive enhancement
    import LogoButton from './logo-button.svelte';
    import { Recaptcha, recaptcha, observer } from "svelte-recaptcha-v2";
    /*
    │Recaptcha: svelte <Recaptcha> component.
    │recaptcha: google method, gives you recaptcha.execute().
    │observer: allows you to track captcha state across components.
    */

    const googleRecaptchaSiteKey="6Lc_c48sAAAAAIDHi-YA3zojszyiQ4luYWTf1x2Z";

    let captchaToken = null;

    const onCaptchaReady = (event) => {
        /*
        │You can enable your form button here.
        */
       captchaToken = event.detail.token;
       console.log("recaptcha init has completed. Token: " + captchaToken);
    };

    const onCaptchaSuccess = (event) => {
        userTracker.resolve(event);
        console.log("token received: " + event.detail.token);
        /*
        │If using checkbox method, you can attach your
        │form logic here, or dispatch your custom event.
        */
    };

    const onCaptchaError = (event) => {
        console.log("recaptcha init has failed.");
        /*
        │Usually due to incorrect siteKey.
        |Make sure you have the correct siteKey..
        */
    };

    const onCaptchaExpire = (event) => {
        console.log("recaptcha api has expired");
        /*
        │Normally, you wouldn't need to do anything.
        │Recaptcha should reinit itself automatically.
        */
    };

    const onCaptchaOpen = (event) => {
        console.log("google decided to challange the user");
        /*
        │This fires when the puzzle frame pops.
        */
    };

    const onCaptchaClose = (event) => {
        console.log("google decided to challange the user");
        /*
        │This fires when the puzzle frame closes.
        │Usually happens when the user clicks outside
        |the modal frame.
        */
    };

    const submitHandler = async () => {
        console.log("launching recaptcha");
        recaptcha.execute();

        console.log("pending for google response");
        const event = await Promise.resolve(observer);

        const recaptchaToken = event.detail?.token ? event.detail.token : false;

        if (!recaptchaToken) {
            console.log("recaptcha is NOT OK");
            return false;
        }

        console.log("token retrieved", recaptchaToken);
    };

    let { form } = $props(); // Optional: bind to the form prop to access return values
</script>

<h2>Contact Us</h2>
<form action="?/submitMail" method="POST" use:enhance>
    <div class="grid">
        <input type="text" name="name" id="name" required />
        <label style="--clr-label: var(--clr-yellow);" for="name">Name</label>
    </div>

    <div class="grid">
        <input type="email" name="email" id="email" required />
        <label style="--clr-label: var(--clr-yellow);" for="email">Email</label>
    </div>

    <div class="grid">
        <textarea name="message" id="message" rows="5" required></textarea>
        <label style="--clr-label: var(--clr-yellow);" for="message">Message</label>
    </div>

    <Recaptcha
    sitekey={googleRecaptchaSiteKey}
    badge={"top"}
    size={"invisible"}
    on:success={onCaptchaSuccess}
    on:error={onCaptchaError}
    on:expired={onCaptchaExpire}
    on:close={onCaptchaClose}
    on:ready={onCaptchaReady} />

    <!-- Hidden input to send the token with your form -->
    <input type="hidden" name="g-recaptcha-response" value={captchaToken} />

    <LogoButton type="submit" buttonText="Get Started" disabled={!captchaToken}/>

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
        color: hsl(from var(--clr-white, white) h s l / 0.5)
    }

    input, textarea {
        padding: 0.5rem;

        &:focus {
            outline: 2px solid var(--clr-blue, rebeccapurple);
        }
    }

</style>