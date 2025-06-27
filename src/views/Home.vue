<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>🛒 Bienvenido a ShopVue</h1>
          <p>Descubre los mejores productos de tecnología con la mejor calidad y precios</p>
          <router-link to="/shop" class="btn btn-primary">
            Explorar Tienda
          </router-link>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="section-title">¿Por qué elegir ShopVue?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>Envío Rápido</h3>
            <p>Envío gratuito en compras mayores a $500. Entrega en 24-48 horas.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Compra Segura</h3>
            <p>Pagos 100% seguros con encriptación SSL y múltiples métodos de pago.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Calidad Garantizada</h3>
            <p>Productos originales con garantía oficial y soporte técnico especializado.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>Atención 24/7</h3>
            <p>Soporte al cliente disponible las 24 horas, los 7 días de la semana.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-products">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Productos Destacados</h2>
          <router-link to="/shop" class="view-all-link">Ver todos →</router-link>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { products } from '../data/products.js'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()
const emailSubscription = ref('')

// Mostrar solo los 4 productos con mejor rating
const featuredProducts = computed(() => {
  return products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
})

const viewProduct = (productId) => {
  router.push(`/product/${productId}`)
}

const subscribeNewsletter = () => {
  alert(`¡Gracias por suscribirte con ${emailSubscription.value}!`)
  emailSubscription.value = ''
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 150px 0 100px;
  text-align: center;
  margin-top: 80px;
}

.hero-content h1 {
  font-size: 3rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.hero-content p {
  font-size: 1.25rem;
  margin: 0 0 2rem 0;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Features Section */
.features {
  padding: 80px 0;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin: 0 0 3rem 0;
  color: #333;
  font-weight: 700;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  color: #333;
  font-weight: 600;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Featured Products Section */
.featured-products {
  padding: 80px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.view-all-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: color 0.3s;
}

.view-all-link:hover {
  color: #0056b3;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

/* Newsletter Section */
.newsletter {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  padding: 80px 0;
  color: white;
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-content h2 {
  font-size: 2rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.newsletter-content p {
  font-size: 1.1rem;
  margin: 0 0 2rem 0;
  opacity: 0.9;
}

.newsletter-form {
  display: flex;
  max-width: 400px;
  margin: 0 auto;
  gap: 1rem;
}

.newsletter-form input {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
}

.newsletter-form input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

/* Buttons */
.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.newsletter .btn-primary {
  background: white;
  color: #28a745;
}

.newsletter .btn-primary:hover {
  background: #f8f9fa;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}
</style> 