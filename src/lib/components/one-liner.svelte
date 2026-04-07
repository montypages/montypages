<script>
    /** @type {{ heading: HTMLHeadingElement | null, para: HTMLParagraphElement | null }}*/
    let { heading = $bindable(), para = $bindable() } = $props();
</script>

    <div class="container center">
        <h2 bind:this={heading}>Your voice. Your brand. Your site.</h2>
        <p bind:this={para}>You know you need an online presence, but you don't know who you can trust to deliver a website that fits you and your needs. At Monty Pages we take the time to get to know you and your business so that we can build a custom website that beautifully represents you to your future clients. You'll feel great knowing that you have a website that accurately represents your organization.</p>
    </div>

<style>
    .center {
        display: grid;
        justify-items: center;
    }

    h2 {
        width: fit-content;
    }
</style>