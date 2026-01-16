<template>
  <section class="hero">
    <div class="hero-carousel">
      <!-- Logo Section -->
      <div class="hero-logo">
        <img src="@/assets/img/logo.png" alt="Pikartas Logo" class="logo-image" />
      </div>
      
      <div class="carousel-container" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div class="carousel-slide" data-slide="0">
          <div class="slide-content">
            <h1 class="slide-title text-hero-title">
              ¡Atrapa Todas Las Cartas!
            </h1>
            <p class="slide-description text-hero-subtitle">
              Descubre las cartas Pokémon más raras y poderosas. 
              Booster packs, cartas holográficas y coleccionables exclusivos.
            </p>
            <div class="slide-actions">
              <router-link to="/shop" class="btn btn-primary">
                <font-awesome-icon icon="shopping-bag" />
                Explorar Cartas
              </router-link>
              <router-link to="/offers" class="btn btn-outline">
                <font-awesome-icon icon="fire" />
                Ver Ofertas
              </router-link>
            </div>
          </div>
        </div>
        
        <div class="carousel-slide" data-slide="1">
          <div class="slide-content">
            <h1 class="slide-title text-hero-title">
              ¡Descuentos Increíbles!
            </h1>
            <p class="slide-description text-hero-subtitle">
              Hasta 50% de descuento en booster packs seleccionados. 
              Cartas holográficas y rarezas únicas a precios especiales.
            </p>
            <div class="slide-actions">
              <router-link to="/offers" class="btn btn-primary">
                <font-awesome-icon icon="percent" />
                Ver Descuentos
              </router-link>
              <router-link to="/shop" class="btn btn-outline">
                <font-awesome-icon icon="shopping-cart" />
                Comprar Ahora
              </router-link>
            </div>
          </div>
        </div>
        
        <div class="carousel-slide" data-slide="2">
          <div class="slide-content">
            <h1 class="slide-title text-hero-title">
              Cartas Legendarias
            </h1>
            <p class="slide-description text-hero-subtitle">
              Las cartas más raras y valiosas de Pokémon. 
              Ediciones limitadas y cartas de primera generación.
            </p>
            <div class="slide-actions">
              <router-link to="/shop" class="btn btn-primary">
                <font-awesome-icon icon="crown" />
                Ver Colección
              </router-link>
              <router-link to="/shop" class="btn btn-outline">
                <font-awesome-icon icon="star" />
                Favoritos
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Carousel Controls -->
      <div class="carousel-controls">
        <button class="carousel-btn prev" @click="prevSlide">
          <font-awesome-icon icon="chevron-left" />
        </button>
        <button class="carousel-btn next" @click="nextSlide">
          <font-awesome-icon icon="chevron-right" />
        </button>
      </div>
      
      <!-- Scroll Down Arrow -->
      <div class="scroll-indicator">
        <button class="scroll-arrow" @click="scrollDown" aria-label="Desplazarse hacia abajo">
          <font-awesome-icon icon="chevron-down" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(0)
const totalSlides = 3
let carouselInterval = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides
  updateCarousel()
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? totalSlides - 1 : currentSlide.value - 1
  updateCarousel()
}

const updateCarousel = () => {
  // La animación ahora se maneja con CSS transform
}

const scrollDown = () => {
  // Ajustar para que el header no tape el contenido
  const heroHeight = window.innerHeight - 85
  window.scrollTo({
    top: heroHeight,
    behavior: 'smooth'
  })
}

const startCarousel = () => {
  carouselInterval = setInterval(() => {
    nextSlide()
  }, 5000) // Cambia cada 5 segundos
}

const stopCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval)
    carouselInterval = null
  }
}

onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
/* Hero Section - Carrusel con deslizamiento */
.hero {
  position: relative;
  height: calc(100vh - var(--header-height));
  margin-top: var(--header-height);
  overflow: hidden;
}

.hero-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Logo Section */
.hero-logo {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  animation: fadeInDown 1s ease-out;
  filter: drop-shadow(0 12px 40px rgba(0, 0, 0, 0.8));
  transition: transform 0.3s ease;
}

.hero-logo:hover {
  transform: translateX(-50%) scale(1.05);
}

.logo-image {
  height: 180px;
  width: auto;
  object-fit: contain;
  display: block;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.8s cubic-bezier(0.5, 0, 0.1, 1);
  will-change: transform;
}

.carousel-slide {
  position: relative;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
}

.slide-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  padding-top: 8rem;
  color: var(--color-white);
}

.slide-title {
  font-size: clamp(1.8rem, 4vw, 3rem);
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.slide-description {
  font-size: var(--font-size-xl);
  margin: 0 0 2rem 0;
  opacity: 1;
  animation: slideInUp 0.8s ease-out 0.4s both;
  max-width: 600px;
}

.slide-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
  flex-wrap: wrap;
  animation: slideInUp 0.8s ease-out 0.6s both;
}

.slide-actions .btn {
  padding: 1rem 2rem;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 180px;
  justify-content: center;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.slide-actions .btn-primary {
  background: var(--color-white);
  color: var(--color-black);
  border: 2px solid var(--color-white);
}

.slide-actions .btn-primary:hover {
  background: transparent;
  color: var(--color-white);
  border-color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.slide-actions .btn-outline {
  background: transparent;
  color: var(--color-white);
  border: 2px solid var(--color-white);
}

.slide-actions .btn-outline:hover {
  background: var(--color-white);
  color: var(--color-black);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

/* Controles del carrusel */
.carousel-controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 3;
}

.carousel-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--color-white);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.carousel-btn:active {
  transform: scale(0.95);
}

/* Scroll Down Arrow */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  animation: bounceDown 2s ease-in-out infinite;
}

.scroll-arrow {
  background: none;
  border: none;
  color: var(--color-white);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 2rem;
}

.scroll-arrow:hover {
  color: rgba(255, 255, 255, 0.8);
  transform: translateY(-5px);
}

.scroll-arrow:active {
  transform: translateY(0px);
}

@keyframes bounceDown {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(10px);
  }
}

/* Animaciones */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    height: calc(100vh - var(--header-height));
  }
  
  .hero-logo {
    top: 1rem;
  }
  
  .logo-image {
    height: 120px;
  }
  
  .slide-content {
    padding: 1.5rem;
    padding-top: 6rem;
  }
  
  .slide-title {
    font-size: clamp(1.2rem, 6vw, 2rem);
    line-height: 1.4;
    letter-spacing: 0.3px;
  }
  
  .slide-description {
    font-size: var(--font-size-lg);
  }
  
  .slide-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .slide-actions .btn {
    width: 100%;
    max-width: 300px;
  }
  
  .carousel-controls {
    padding: 0 1rem;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .scroll-indicator {
    bottom: 1rem;
  }
  
  .scroll-arrow {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .hero {
    height: calc(100vh - var(--header-height));
  }
  
  .hero-logo {
    top: 0.5rem;
  }
  
  .logo-image {
    height: 80px;
  }
  
  .slide-content {
    padding: 1rem;
    padding-top: 5rem;
  }
  
  .slide-title {
    font-size: clamp(1rem, 8vw, 1.5rem);
    line-height: 1.6;
  }
  
  .slide-description {
    font-size: var(--font-size-base);
  }
  
  .carousel-controls {
    padding: 0 0.5rem;
  }
  
  .carousel-btn {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  
  .scroll-arrow {
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }
}
</style>
