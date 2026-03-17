<div class="grainy-container">
  <!-- SVG Filter defined once -->
  <svg style="display: none;">
    <filter id="noiseFilter">
      <feTurbulence 
        type="fractalNoise" 
        baseFrequency="0.7" 
        stitchTiles="stitch" />
    </filter>
  </svg>
</div>

<style>
  .grainy-container {
    width: 100%;
    height: 100vh;
    background: #f3f4f6;
    position: relative;
  }
  
  /* Use a pseudo-element to apply the noise over the background */
  .grainy-container::before {
    content: '';
    position: absolute;
    inset: 0;
    filter: url(#noiseFilter);
    opacity: 0.5; /* Control how strong the texture is */
    pointer-events: none;
  }
</style>
