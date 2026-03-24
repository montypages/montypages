<script>
    /** @type {{ heading: HTMLHeadingElement | null, para: HTMLParagraphElement | null }}*/
    let { heading = $bindable(), para = $bindable() } = $props();
</script>

    <div class="container">
        <h2 bind:this={heading}>Beautiful Custom Websites</h2>
        <p bind:this={para}>You know you need an online presence, but you building a website can be frustrating and time-consuming. At Monty Pages we take the time to get to know you and your business so that we can build a custom website that beautifully represents you to your future clients. You'll feel great knowing that you have a website that accurately represents your organization.</p>
    </div>

<style></style>