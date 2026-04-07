<script>
    import logo from '$lib/assets/logo-1.svg';
    import LogoButton from './logo-button.svelte';
</script>

    <header data-section="0" class="section">
        <div class="container wide">
            <div class="logo">
                <img class="logo-img" src={logo} alt="Monty Pages">
                <h1 class="logo-text">Monty Pages</h1>
                <h2>Beautiful Custom Websites</h2>
                <a href="#contactForm">
                    <LogoButton buttonText="Contact" />
                </a>
            </div>
        </div>
    </header>

<style>
    header {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
</style>