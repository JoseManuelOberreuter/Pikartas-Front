<template>
  <div class="app">
    <!-- Header fijo -->
    <header class="header">
      <div class="logo">Demoledora CRRB</div>
      <nav class="nav">
        <a href="#inicio" class="nav-link">Inicio</a>
        <a href="#nosotros" class="nav-link">Sobre Nosotros</a>
        <a href="#contacto" class="nav-link">Contáctanos</a>
      </nav>
    </header>

    <!-- Hero Banner (Inicio) -->
    <section id="inicio" class="hero">
      <div class="video-container">
        <video autoplay muted loop class="background-video">
          <source :src="Retroexcavadora" type="video/mp4">
        </video>
        <div class="overlay"></div>
      </div>
      <div class="hero-content">
        <div class="text-container">
          <h1 class="hero-title">Demoledora CRRB</h1>
          <h2 class="hero-subtitle">Expertos en demoliciones industriales y civiles</h2>
          <a href="#contacto" class="cta-button">Contáctanos</a>
        </div>
      </div>
    </section>

    <!-- Sobre Nosotros -->
    <section id="nosotros" class="about">
      <div class="container">
        <h2 class="section-title">Sobre Nosotros</h2>
        <div class="about-content">
          <div class="about-text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.</p>
            
            <h3>Nuestros Servicios</h3>
            <ul class="services-list">
              <li>
                <span class="icon">🏗️</span>
                <span>Demolición de estructuras industriales</span>
              </li>
              <li>
                <span class="icon">🏢</span>
                <span>Demolición de edificios comerciales</span>
              </li>
              <li>
                <span class="icon">🏠</span>
                <span>Demolición residencial controlada</span>
              </li>
              <li>
                <span class="icon">♻️</span>
                <span>Gestión y reciclaje de escombros</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Carrusel de Imágenes -->
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

    <!-- Formulario de Contacto -->
    <section id="contacto" class="contact">
      <div class="container">
        <h2 class="section-title">Contáctanos</h2>
        <form class="contact-form" @submit.prevent="submitForm">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="formData.nombre" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="formData.email" required>
          </div>
          
          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <input type="tel" id="telefono" v-model="formData.telefono" required>
          </div>
          
          <div class="form-group">
            <label for="mensaje">Mensaje</label>
            <textarea id="mensaje" v-model="formData.mensaje" rows="5" required></textarea>
          </div>
          
          <button type="submit" class="submit-button">Enviar</button>
        </form>
      </div>
    </section>

    <!-- Botón de WhatsApp -->
    <a href="https://wa.me/56912345678" class="whatsapp-button" target="_blank" rel="noopener noreferrer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="whatsapp-icon">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
      </svg>
    </a>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <h3>Demoledora CRRB</h3>
            <p>&copy; {{ new Date().getFullYear() }} Todos los derechos reservados.</p>
            <p class="legal">Este sitio web y su contenido están protegidos por las leyes de propiedad intelectual.</p>
          </div>
          
          <div class="footer-social">
            <h4>Síguenos</h4>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="social-icon">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="social-icon">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="social-icon">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div class="footer-contact">
            <h4>Contacto</h4>
            <p>Av. Ejemplo 1234, Santiago, Chile</p>
            <p>+56 9 1234 5678</p>
            <p>info@demoledoratitanes.com</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Retroexcavadora from './assets/Retroexcavadora2.mp4';

// Datos para el carrusel
const images = [
  { src: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', alt: 'Demolición 1' },
  { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', alt: 'Demolición 2' },
  { src: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', alt: 'Demolición 3' },
  { src: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', alt: 'Demolición 4' }
];

// Estado del carrusel
const currentSlide = ref(0);

// Funciones del carrusel
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % images.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + images.length) % images.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

// Datos del formulario
const formData = ref({
  nombre: '',
  email: '',
  telefono: '',
  mensaje: ''
});

// Método para enviar el formulario (simulado)
const submitForm = () => {
  alert('Formulario enviado (simulación)');
  // Aquí iría la lógica para enviar el formulario
  formData.value = {
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  };
};

// Configurar scroll suave
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

  // Iniciar carrusel automático
  const autoSlide = setInterval(() => {
    nextSlide();
  }, 5000);

  // Limpiar intervalo cuando el componente se desmonte
  return () => clearInterval(autoSlide);
});
</script>

<style scoped>
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
  color: #111; /* Texto oscuro para mejor contraste */
  background-color: #e0e0e0; /* Fondo gris claro */
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

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  transition: all 0.3s ease;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffc107;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #f5f5f5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #ffc107;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #ffc107;
}

.nav-link:hover::after {
  width: 100%;
}

/* Hero Banner */
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
  background-color: rgba(0, 0, 0, 0.5); /* Caja semitransparente para mejorar contraste */
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
  color: #f5f5f5;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #ffc107;
  color: #000;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.cta-button:hover {
  background-color: #e5ac00;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
}

/* Sobre Nosotros */
.about {
  padding: 6rem 0;
  background-color: #f0f0f0; /* Fondo más claro */
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 10rem;
  padding: 2rem 4rem;
}

.about-text {
  flex: 1;
}

.about-text p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: #333;
}

.services-list {
  list-style: none;
  margin-top: 1.5rem;
}

.services-list li {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #333;
}

.icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #ffc107;
}

/* Carrusel */
.carousel-section {
  padding: 6rem 0;
  background-color: #e0e0e0;
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

/* Formulario de Contacto */
.contact {
  padding: 6rem 0;
  background-color: #f0f0f0;
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  color: #333;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ffc107;
  box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.2);
}

.submit-button {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #ffc107;
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #e5ac00;
}

/* Botón de WhatsApp */
.whatsapp-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #25D366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 999;
  transition: all 0.3s ease;
}

.whatsapp-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
}

.whatsapp-icon {
  width: 30px;
  height: 30px;
  fill: white;
}

/* Footer */
.footer {
  background-color: #333;
  padding: 4rem 0; /* Footer más alto */
  color: #f5f5f5;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.footer-info h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ffc107;
}

.footer-info p {
  margin-bottom: 0.5rem;
}

.footer-info .legal {
  font-size: 0.8rem;
  color: #aaa;
  margin-top: 1rem;
}

.footer-social h4,
.footer-contact h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #ffc107;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #444;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.social-link:hover {
  background-color: #ffc107;
}

.social-icon {
  width: 20px;
  height: 20px;
  fill: white;
}

.footer-contact p {
  margin-bottom: 0.5rem;
  color: #ddd;
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-direction: column;
  }
  
  .logo {
    margin-bottom: 1rem;
  }
  
  .nav {
    gap: 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .about-content {
    margin: 0 1rem;
    padding: 1rem;
  }
  
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
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
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
  
  .carousel-slide {
    height: 200px;
  }
  
  .whatsapp-button {
    width: 50px;
    height: 50px;
    bottom: 20px;
    right: 20px;
  }
  
  .whatsapp-icon {
    width: 25px;
    height: 25px;
  }
}
</style>