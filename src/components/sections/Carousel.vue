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
import { ref, onMounted, onUnmounted } from 'vue';

const images = [
  { src: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', alt: 'Demolición 1' },
  { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', alt: 'Demolición 2' },
  { src: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', alt: 'Demolición 3' },
  { src: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', alt: 'Demolición 4' }
];

const currentSlide = ref(0);
let autoSlideInterval;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % images.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + images.length) % images.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

onMounted(() => {
  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(autoSlideInterval);
});
</script>

<style scoped>
.carousel-section {
  padding: 6rem 0;
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

.carousel {
  position: relative;
  margin: 0 auto;
  max-width: 900px;
}

.carousel-container {
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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
  transition: background-color 0.3s ease;
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
  transition: background-color 0.3s ease;
}

.indicator.active {
  background-color: #ffc107;
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