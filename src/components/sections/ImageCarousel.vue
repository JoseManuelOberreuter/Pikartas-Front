<template>
  <section class="carousel-section">
    <div class="container">
      <h2 class="section-title">Nuestros Proyectos</h2>
      <div class="carousel">
        <button class="carousel-button prev" @click="prevSlide">❮</button>
        <div class="carousel-container">
          <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div class="carousel-slide" v-for="(image, index) in images" :key="index">
              <img :src="image.src" :alt="image.alt">
            </div>
          </div>
        </div>
        <button class="carousel-button next" @click="nextSlide">❯</button>
        
        <div class="carousel-indicators">
          <button 
            v-for="(_, index) in images" 
            :key="index" 
            :class="['indicator', { active: currentSlide === index }]"
            @click="goToSlide(index)">
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  }
});

const currentSlide = ref(0);

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.images.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + props.images.length) % props.images.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

onMounted(() => {
  // Iniciar carrusel automático
  const autoSlide = setInterval(() => {
    nextSlide();
  }, 5000);

  // Limpiar intervalo cuando el componente se desmonte
  return () => clearInterval(autoSlide);
});
</script>

<style scoped>
.carousel-section {
  padding: 6rem 0;
  background-color: var(--background-medium);
}

.carousel {
  position: relative;
  margin: 0 auto;
  max-width: 900px;
}

.carousel-container {
  overflow: hidden;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  flex: 0 0 100%;
  height: 500px;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  transition: var(--transition-default);
}

.carousel-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.prev {
  left: -25px;
}

.next {
  right: -25px;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #555;
  border: none;
  cursor: pointer;
  transition: var(--transition-default);
}

.indicator.active {
  background-color: var(--primary-color);
}

@media (max-width: 768px) {
  .carousel-slide {
    height: 300px;
  }
  
  .carousel-button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .prev {
    left: -15px;
  }
  
  .next {
    right: -15px;
  }
}

@media (max-width: 480px) {
  .carousel-slide {
    height: 200px;
  }
}
</style> 