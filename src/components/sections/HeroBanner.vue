<template>
  <section id="inicio" class="hero">
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source :src="videoSrc" type="video/mp4">
      </video>
      <div class="overlay"></div>
    </div>
    <div class="hero-content">
      <div class="text-container">
        <h1 class="hero-title">Demoliciones CRRB</h1>
        <h2 class="hero-subtitle">Expertos en demoliciones industriales y civiles</h2>
        <a href="#contacto" class="cta-button">Contáctanos</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  videoSrc: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}

.hero-content {
  max-width: 800px;
  padding: 0 20px;
  z-index: 1;
}

.text-container {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 10px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.hero-subtitle {
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--light-text);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: #000;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 50px;
  transition: var(--transition-default);
  box-shadow: var(--shadow-sm);
}

.cta-button:hover {
  background-color: #e5ac00;
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .cta-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style> 