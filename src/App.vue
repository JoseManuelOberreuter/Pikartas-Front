<template>
  <div class="app">
    <Header />
    <Hero />
    <About />
    <Carousel />
    <Contact />
    <WhatsAppButton />
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/layout/Header.vue';
import Hero from './components/sections/Hero.vue';
import About from './components/sections/About.vue';
import Carousel from './components/sections/Carousel.vue';
import Contact from './components/sections/Contact.vue';
import Footer from './components/layout/Footer.vue';
import WhatsAppButton from './components/ui/WhatsAppButton.vue';

// Configurar scroll suave
import { onMounted } from 'vue';

onMounted(() => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Ajuste para el header fijo
          behavior: 'smooth'
        });
      }
    });
  });
});
</script>

<style>
/* Estilos generales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Roboto', Arial, sans-serif;
  line-height: 1.6;
  color: #111;
  background-color: #e0e0e0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #111;
  position: relative;
  padding-bottom: 1rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background-color: #ffc107;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
}
</style>