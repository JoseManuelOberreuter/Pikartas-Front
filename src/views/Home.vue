<template>
  <div class="home">
    <section class="hero">
      <div class="hero-carousel">
        <div class="carousel-container">
          <div class="carousel-slide active" data-slide="0">
            <div class="slide-bg slide-1">
              <div class="slide-overlay"></div>
            </div>
            <div class="slide-content">
              <div class="slide-badge">
                <font-awesome-icon icon="star" class="badge-icon" />
                <span>Nuevos Lanzamientos</span>
              </div>
              <h1 class="slide-title">
                <font-awesome-icon icon="dice-d20" class="title-icon" />
                ¡Atrapa Todas Las Cartas!
              </h1>
              <p class="slide-description">
                Descubre las cartas Pokémon más raras y poderosas. 
                Booster packs, cartas holográficas y coleccionables exclusivos.
              </p>
              <div class="slide-actions">
                <router-link to="/shop" class="btn btn-primary">
                  <font-awesome-icon icon="shopping-bag" />
                  Explorar Cartas
                </router-link>
                <router-link to="/shop" class="btn btn-outline">
                  <font-awesome-icon icon="fire" />
                  Ver Ofertas
                </router-link>
              </div>
            </div>
          </div>
          
          <div class="carousel-slide" data-slide="1">
            <div class="slide-bg slide-2">
              <div class="slide-overlay"></div>
            </div>
            <div class="slide-content">
              <div class="slide-badge">
                <font-awesome-icon icon="fire" class="badge-icon" />
                <span>Ofertas Especiales</span>
              </div>
              <h1 class="slide-title">
                <font-awesome-icon icon="gift" class="title-icon" />
                ¡Descuentos Increíbles!
              </h1>
              <p class="slide-description">
                Hasta 50% de descuento en booster packs seleccionados. 
                Cartas holográficas y rarezas únicas a precios especiales.
              </p>
              <div class="slide-actions">
                <router-link to="/shop" class="btn btn-primary">
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
            <div class="slide-bg slide-3">
              <div class="slide-overlay"></div>
            </div>
            <div class="slide-content">
              <div class="slide-badge">
                <font-awesome-icon icon="crown" class="badge-icon" />
                <span>Colección Premium</span>
              </div>
              <h1 class="slide-title">
                <font-awesome-icon icon="gem" class="title-icon" />
                Cartas Legendarias
              </h1>
              <p class="slide-description">
                Las cartas más raras y valiosas de Pokémon. 
                Ediciones limitadas y cartas de primera generación.
              </p>
              <div class="slide-actions">
                <router-link to="/shop" class="btn btn-primary">
                  <font-awesome-icon icon="crown" />
                  Ver Colección
                </router-link>
                <router-link to="/shop" class="btn btn-outline">
                  <font-awesome-icon icon="heart" />
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
        
        <!-- Carousel Indicators -->
        <div class="carousel-indicators">
          <button 
            v-for="(slide, index) in 3" 
            :key="index"
            :class="['indicator', { active: currentSlide === index }]"
            @click="goToSlide(index)"
          ></button>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="section-title">¿Por qué elegir Pikartas?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <font-awesome-icon icon="truck" class="feature-icon" />
            <h3>Envío Rápido</h3>
            <p>Envío gratuito en compras mayores a $500. Entrega en 24-48 horas.</p>
          </div>
          <div class="feature-card">
            <font-awesome-icon icon="shield-alt" class="feature-icon" />
            <h3>Compra Segura</h3>
            <p>Pagos 100% seguros con encriptación SSL y múltiples métodos de pago.</p>
          </div>
          <div class="feature-card">
            <font-awesome-icon icon="star" class="feature-icon" />
            <h3>Calidad Garantizada</h3>
            <p>Productos originales con garantía oficial y soporte técnico especializado.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-products">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Productos Destacados</h2>
          <router-link to="/shop" class="view-all-link">
            Ver todos <font-awesome-icon icon="chevron-down" class="arrow-icon" />
          </router-link>
        </div>
        
        <div class="products-grid">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :product="product"
            @view-product="viewProduct"
          />
        </div>
      </div>
    </section>

    <section class="newsletter">
      <div class="container">
        <div class="newsletter-content">
          <h2>Mantente al día con nuestras ofertas</h2>
          <p>Suscríbete a nuestro newsletter y recibe ofertas exclusivas</p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input 
              type="email" 
              v-model="emailSubscription"
              placeholder="tu@email.com" 
              required
            >
            <button type="submit" class="btn btn-primary">
              Suscribirse
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { productService } from '../services/api'
import ProductCard from '../components/ProductCard.vue'
import { useNotifications } from '../composables/useNotifications'

const router = useRouter()
const { success } = useNotifications()
const emailSubscription = ref('')

// Referencias reactivas para productos
const products = ref([])
const loading = ref(false)

// Carrusel
const currentSlide = ref(0)
const totalSlides = 3
let carouselInterval = null

// Cargar productos desde el backend
const loadProducts = async () => {
  loading.value = true
  try {
    const response = await productService.getAllProducts()
    
    if (response.success && response.data) {
      products.value = response.data.map(product => ({
        id: product._id || product.id, // Manejar tanto _id como id
        name: product.name,
        price: product.price,
        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        description: product.description,
        category: product.category,
        stock: product.stock
      }))
    }
  } catch (error) {
    console.error('Error loading products:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

// Mostrar solo los 4 primeros productos
const featuredProducts = computed(() => {
  return products.value.slice(0, 4)
})

const viewProduct = (productId) => {
  console.log('🔍 Home: Navegando a producto con ID:', productId);
  router.push(`/product/${productId}`)
}

const subscribeNewsletter = () => {
  success(`¡Gracias por suscribirte con ${emailSubscription.value}!`)
  emailSubscription.value = ''
}

// Funciones del carrusel
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides
  updateCarousel()
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? totalSlides - 1 : currentSlide.value - 1
  updateCarousel()
}

const goToSlide = (index) => {
  currentSlide.value = index
  updateCarousel()
}

const updateCarousel = () => {
  const slides = document.querySelectorAll('.carousel-slide')
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide.value)
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

// Cargar productos al montar el componente
onMounted(() => {
  loadProducts()
  startCarousel()
})

// Limpiar interval al desmontar
onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
/* Hero Section - Carrusel */
.hero {
  position: relative;
  height: 80vh;
  margin-top: var(--header-height);
  overflow: hidden;
}

.hero-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
  transform: translateX(100%);
}

.carousel-slide.active {
  opacity: 1;
  transform: translateX(0);
}

.slide-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.slide-1 {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-quaternary) 100%);
}

.slide-2 {
  background: linear-gradient(135deg, var(--color-quaternary) 0%, var(--color-primary) 100%);
}

.slide-3 {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-black) 100%);
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
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
  color: var(--color-white);
}

.slide-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 1.5rem;
  animation: slideInDown 0.8s ease-out;
}

.badge-icon {
  color: var(--color-white);
  animation: pulse 2s infinite;
}

.slide-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: var(--font-weight-extrabold);
  margin: 0 0 1.5rem 0;
  line-height: 1.1;
  animation: slideInUp 0.8s ease-out 0.2s both;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.title-icon {
  color: var(--color-white);
  font-size: 0.9em;
  margin-right: 0.5rem;
  animation: bounce 2s infinite;
}

.slide-description {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-normal);
  margin: 0 0 2rem 0;
  opacity: 0.95;
  line-height: var(--line-height-relaxed);
  animation: slideInUp 0.8s ease-out 0.4s both;
  max-width: 600px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
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

/* Indicadores del carrusel */
.carousel-indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 3;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: var(--color-white);
  transform: scale(1.2);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.7);
}

/* Animaciones */
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

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
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

/* Features Section */
.features {
  padding: var(--spacing-6xl) 0;
  background: var(--color-black);
}

.section-title {
  text-align: center;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-5xl) 0;
  color: var(--color-primary);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: var(--color-quaternary);
  border-radius: var(--border-radius-full);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-3xl);
}

.feature-card {
  background: var(--color-white);
  padding: var(--spacing-3xl);
  border-radius: var(--border-radius-xl);
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  border: var(--border-width-thin) solid var(--color-primary);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--color-quaternary);
  transform: translateX(-100%);
  transition: transform var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-var(--spacing-sm));
  box-shadow: var(--shadow-lg);
}

.feature-card:hover::before {
  transform: translateX(0);
}

.feature-icon {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
  transition: all var(--transition-normal);
  display: block;
}

.feature-card:hover .feature-icon {
  color: var(--color-quaternary);
  transform: scale(1.1);
}

.feature-card h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--color-primary);
}

.feature-card p {
  color: var(--color-black);
  line-height: var(--line-height-relaxed);
  margin: 0;
  font-size: var(--font-size-base);
}

/* Featured Products Section */
.featured-products {
  padding: var(--spacing-6xl) 0;
  background: var(--color-black);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-5xl);
}

.view-all-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
  transition: all var(--transition-normal);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  border: var(--border-width-thin) solid transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-all-link:hover {
  color: var(--color-black);
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateX(var(--spacing-xs));
}

.arrow-icon {
  color: var(--color-primary);
  font-size: 0.8em;
  transition: all var(--transition-normal);
  transform: rotate(-90deg);
}

.view-all-link:hover .arrow-icon {
  color: var(--color-black);
  transform: rotate(-90deg) translateX(2px);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-3xl);
}

/* Newsletter Section */
.newsletter {
  background: linear-gradient(135deg, var(--color-quaternary) 0%, var(--color-primary) 100%);
  padding: var(--spacing-6xl) 0;
  color: var(--color-white);
  position: relative;
  overflow: hidden;
}

.newsletter::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  transform: rotate(45deg);
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.newsletter-content h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-lg) 0;
}

.newsletter-content p {
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-3xl) 0;
  opacity: 0.95;
  line-height: var(--line-height-relaxed);
}

.newsletter-form {
  display: flex;
  max-width: 400px;
  margin: 0 auto;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.newsletter-form input {
  flex: 1;
  min-width: 250px;
  padding: var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  color: var(--color-gray-700);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.newsletter-form input:focus {
  outline: none;
  box-shadow: var(--shadow-md), 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.newsletter-form input::placeholder {
  color: var(--color-gray-400);
}

.newsletter .btn-primary {
  background: var(--color-black);
  color: var(--color-white);
  border-color: var(--color-black);
  font-weight: var(--font-weight-semibold);
  min-width: 140px;
}

.newsletter .btn-primary:hover {
  background: var(--color-white);
  color: var(--color-black);
  border-color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    height: 70vh;
  }
  
  .slide-content {
    padding: 1.5rem;
  }
  
  .slide-title {
    font-size: clamp(2rem, 8vw, 3rem);
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
  
  .carousel-indicators {
    bottom: 1rem;
  }
  
  .section-title {
    font-size: var(--font-size-2xl);
  }
  
  .section-header {
    flex-direction: column;
    gap: var(--spacing-lg);
    text-align: center;
  }
  
  .newsletter-form {
    flex-direction: column;
    align-items: center;
  }
  
  .newsletter-form input {
    min-width: unset;
    width: 100%;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-xl);
  }
  
  .features,
  .featured-products,
  .newsletter {
    padding: var(--spacing-5xl) 0;
  }
}

@media (max-width: 480px) {
  .hero {
    height: 60vh;
  }
  
  .slide-content {
    padding: 1rem;
  }
  
  .slide-title {
    font-size: clamp(1.8rem, 10vw, 2.5rem);
  }
  
  .slide-description {
    font-size: var(--font-size-base);
  }
  
  .slide-badge {
    font-size: var(--font-size-sm);
    padding: 0.4rem 0.8rem;
  }
  
  .carousel-controls {
    padding: 0 0.5rem;
  }
  
  .carousel-btn {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  
  .feature-card {
    padding: var(--spacing-xl);
  }
  
  .newsletter-content h2 {
    font-size: var(--font-size-2xl);
  }
}
</style> 