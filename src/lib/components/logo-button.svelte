<script lang="ts">
    import logoImg from '$lib/assets/logo-2.svg'
    import type { MouseEventHandler } from 'svelte/elements';

    interface Props {
        onclick?: MouseEventHandler<HTMLButtonElement>;
        type?: "button" | "submit" | "reset" | null | undefined;
        buttonText: string;
    }

    let { 
        onclick = () => {}, 
        type = undefined,
        buttonText = "Click Here" 
        }: Props = $props();
</script>

    <button {onclick} {type}>
            <img class="cta-img" src={logoImg} alt="Monty Pages">
            <h2>{buttonText}</h2>
    </button>

<style>
    button {
        width: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        background-color: hsl(from var(--clr-white, #fff) h s l / .7);
        color: var(--clr-red, red);
        border-radius: 100vw;
        border: none;
        padding: 1em;
    }

    button:hover, button:focus-visible {
        text-decoration: underline;
    }
    
    button:focus-visible {
        outline: 2px solid var(--clr-blue, rebeccapurple);
    }

    button:active {
        opacity: 0.7;
    }

    h2 {
        line-height: 1;
        margin: 0;
        margin-right: 0.5em;
    }
</style>