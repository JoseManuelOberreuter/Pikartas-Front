<template>
  <!-- TODO: cambiar logica para bajar a 0 productos en el carrito, el usuario no puede eliminar el producto del carrito en esta vista -->

  <div class="product-detail">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="container">
        <font-awesome-icon icon="spinner" spin class="loading-spinner" />
        <h2 class="text-hero-title">Cargando producto...</h2>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!product" class="not-found">
      <div class="container">
        <h2 class="text-hero-title">Producto no encontrado</h2>
        <p class="text-hero-subtitle">El producto que buscas no existe o no está disponible.</p>
        <router-link to="/shop" class="btn btn-primary">
          <font-awesome-icon icon="arrow-left" class="btn-icon" />
          Volver a la tienda
        </router-link>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else>
      <!-- Hero Section -->
      <section class="product-hero">
        <div class="product-hero-background" :style="{ backgroundImage: `url(${product.image})` }"></div>
        <div class="product-hero-overlay"></div>
        <div class="container">
          <nav class="breadcrumb">
            <router-link to="/">Inicio</router-link> /
            <router-link to="/shop">Tienda</router-link> /
            <span>{{ product.name }}</span>
          </nav>
          
          <div class="product-hero-content">
            <div class="product-hero-image">
              <div class="main-image-wrapper">
                <img :src="product.image" :alt="product.name" class="main-image" />
                <div class="product-badges" v-if="isOnSale">
                  <span class="badge badge-sale">
                    <font-awesome-icon icon="tag" class="badge-icon" />
                    {{ discountPercentage }}% OFF
                  </span>
                </div>
              </div>
            </div>
            
            <div class="product-hero-info">
              <h1 class="product-title text-hero-title">{{ product.name }}</h1>
              
              <div class="product-price">
                <span v-if="isOnSale" class="price-original">${{ formatCLP(product.price) }}</span>
                <span :class="{ 'price-sale': isOnSale, 'price-normal': !isOnSale }" class="price-main">
                  ${{ formatCLP(displayPrice) }}
                </span>
              </div>

              <div class="product-description">
                <p class="description-text">{{ product.description }}</p>
              </div>

              <div class="product-actions">
                <div class="quantity-selector">
                  <label class="quantity-label">Cantidad:</label>
                  <div class="quantity-input">
                    <button 
                      class="qty-btn" 
                      @click="decreaseQuantity" 
                      :disabled="quantity <= 1"
                    >
                      <font-awesome-icon icon="minus" class="qty-icon" />
                    </button>
                    <input 
                      type="number" 
                      v-model="quantity" 
                      :min="1" 
                      :max="product.stock"
                      class="qty-input"
                    />
                    <button 
                      class="qty-btn" 
                      @click="increaseQuantity" 
                      :disabled="quantity >= product.stock"
                    >
                      <font-awesome-icon icon="plus" class="qty-icon" />
                    </button>
                  </div>
                </div>

                <button 
                  class="btn btn-primary add-to-cart"
                  @click="addToCart"
                  :disabled="product.stock === 0"
                >
                  <font-awesome-icon icon="shopping-cart" class="btn-icon" />
                  {{ product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito' }}
                </button>

                <button class="btn btn-outline" @click="goBack">
                  <font-awesome-icon icon="arrow-left" class="btn-icon" />
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Related Products -->
      <section v-if="relatedProducts.length > 0" class="related-products-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title text-title-quaternary">Productos Relacionados</h2>
          </div>
          <div class="products-grid">
            <ProductCard 
              v-for="relatedProduct in relatedProducts" 
              :key="relatedProduct.id" 
              :product="relatedProduct"
              @view-product="viewProduct"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '../services/api'
import { useCartStore } from '../stores/cart.js'
import ProductCard from '../components/ProductCard.vue'
import { useNotifications } from '../composables/useNotifications'
import { formatCLP } from '../utils/formatters.js'

const route = useRoute()
const router = useRouter()
const { success } = useNotifications()
const cartStore = useCartStore()

const quantity = ref(1)
const product = ref(null)
const loading = ref(false)
const allProducts = ref([])

// Check if product is currently on sale (within date range)
const isOnSale = computed(() => {
  if (!product.value || !product.value.is_on_sale || !product.value.discount_percentage) {
    return false
  }
  
  const now = new Date()
  const startDate = product.value.sale_start_date ? new Date(product.value.sale_start_date) : null
  const endDate = product.value.sale_end_date ? new Date(product.value.sale_end_date) : null
  
  if (!startDate || !endDate) {
    return false
  }
  
  return now >= startDate && now <= endDate
})

// Calculate discount percentage
const discountPercentage = computed(() => {
  if (!isOnSale.value || !product.value.discount_percentage) {
    return 0
  }
  return Math.round(product.value.discount_percentage)
})

// Calculate display price (sale price if on sale, otherwise regular price)
const displayPrice = computed(() => {
  if (isOnSale.value && product.value.discount_percentage) {
    return product.value.price * (1 - product.value.discount_percentage / 100)
  }
  return product.value.price
})

// Cargar producto específico por ID
const loadProduct = async (productId) => {
  loading.value = true
  try {
    const response = await productService.getProductById(productId)
    
    if (response.success && response.data) {
      // Manejar tanto _id como id del backend
      const productId = response.data._id || response.data.id;
      
      product.value = {
        id: productId,
        name: response.data.name,
        price: response.data.price,
        image: response.data.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        description: response.data.description,
        category: response.data.category,
        stock: response.data.stock,
        is_on_sale: response.data.is_on_sale || false,
        discount_percentage: response.data.discount_percentage || null,
        sale_start_date: response.data.sale_start_date || null,
        sale_end_date: response.data.sale_end_date || null
      }
    } else {
      product.value = null
    }
  } catch (error) {
    product.value = null
  } finally {
    loading.value = false
  }
}

// Cargar todos los productos para mostrar relacionados
const loadAllProducts = async () => {
  try {
    const response = await productService.getAllProducts()
    
    // Response from service is: { success: true, data: { products: [...], pagination: {...} } }
    // Handle new response format: { success: true, data: { products: [...] } }
    // Or legacy format: { success: true, data: [...] } (array directly)
    let productsArray = []
    
    if (response?.success) {
      // New format: response.data is an object with products property
      if (response.data?.products && Array.isArray(response.data.products)) {
        productsArray = response.data.products
      }
      // Legacy format: response.data is directly an array
      else if (Array.isArray(response.data)) {
        productsArray = response.data
      }
    }
    
    if (productsArray.length > 0) {
      allProducts.value = productsArray.map(p => ({
        id: p._id || p.id, // Manejar tanto _id como id
        name: p.name,
        price: p.price,
        image: p.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        description: p.description,
        category: p.category,
        stock: p.stock
      }))
    }
  } catch (error) {
    console.error('[ProductDetail] Error loading all products:', error);
    allProducts.value = []
  }
}

// Get related products (same category, excluding current product)
const relatedProducts = computed(() => {
  if (!product.value) return []
  
  return allProducts.value
    .filter(p => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 4)
})

// Methods
const increaseQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = async () => {
  if (product.value && product.value.stock > 0) {
    for (let i = 0; i < quantity.value; i++) {
      await cartStore.addToCart(product.value)
    }
    success(`¡${quantity.value} ${product.value.name} agregado${quantity.value > 1 ? 's' : ''} al carrito!`)
    quantity.value = 1
  }
}

const goBack = () => {
  router.go(-1)
}

const viewProduct = (productId) => {
  router.push(`/product/${productId}`)
}

// Observar cambios en la ruta para cargar el producto correcto
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadProduct(newId)
    quantity.value = 1
  }
}, { immediate: true })

onMounted(async () => {
  // Cargar el producto actual
  if (route.params.id) {
    await loadProduct(route.params.id)
  }
  
  // Cargar todos los productos para mostrar relacionados
  await loadAllProducts()
  
  // Reset quantity when component mounts
  quantity.value = 1
})
</script>

<style scoped>
.product-detail {
  position: relative;
  min-height: 100vh;
}

/* Loading State */
.loading-state {
  padding: var(--spacing-6xl) 0;
  text-align: center;
  min-height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-xl);
  color: var(--color-primary);
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Not Found State */
.not-found {
  padding: var(--spacing-6xl) 0;
  text-align: center;
  min-height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found h2 {
  margin: 0 0 var(--spacing-xl) 0;
}

/* Product Hero Section */
.product-hero {
  position: relative;
  min-height: calc(100vh - var(--header-height));
  margin-top: var(--header-height);
  display: flex;
  align-items: center;
  overflow: hidden;
}

.product-hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(20px);
  transform: scale(1.1);
  z-index: 1;
}

.product-hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(1, 1, 1, 0.85) 0%,
    rgba(1, 1, 1, 0.75) 50%,
    rgba(1, 1, 1, 0.85) 100%
  );
  z-index: 2;
}

.product-hero .container {
  position: relative;
  z-index: 3;
  padding: var(--spacing-6xl) var(--container-padding);
}

.breadcrumb {
  font-size: var(--font-size-sm);
  color: var(--color-white);
  margin-bottom: var(--spacing-3xl);
  opacity: 0.8;
}

.breadcrumb a {
  color: var(--color-primary);
  text-decoration: none;
  transition: all var(--transition-normal);
}

.breadcrumb a:hover {
  color: var(--color-primary-light);
  text-decoration: underline;
}

.breadcrumb span {
  color: var(--color-white);
  opacity: 0.6;
}

.product-hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-6xl);
  align-items: center;
}

.product-hero-image {
  position: relative;
}

.main-image-wrapper {
  position: relative;
  border-radius: var(--border-radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
  background: var(--color-secondary);
  animation: fadeInUp 0.8s ease-out;
}

.main-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.product-badges {
  position: absolute;
  top: var(--spacing-xl);
  left: var(--spacing-xl);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.badge {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(10px);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  white-space: nowrap;
}

.badge-sale {
  color: var(--color-white);
  background: linear-gradient(135deg, var(--color-quaternary) 0%, var(--color-quaternary-dark) 100%);
}

.badge-icon {
  font-size: var(--font-size-xs);
}

.product-hero-info {
  color: var(--color-white);
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.product-title {
  font-size: clamp(var(--font-size-3xl), 5vw, var(--font-size-4xl));
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-3xl) 0;
  line-height: var(--line-height-tight);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.product-price {
  margin-bottom: var(--spacing-4xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.price-main {
  font-size: clamp(var(--font-size-3xl), 4vw, var(--font-size-4xl));
  font-weight: var(--font-weight-bold);
}

.price-normal {
  color: var(--color-primary);
}

.price-sale {
  color: var(--color-quaternary);
}

.price-original {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  opacity: 0.6;
  text-decoration: line-through;
}

.product-description {
  margin-bottom: var(--spacing-4xl);
  padding: var(--spacing-3xl);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.description-text {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-white);
  opacity: 0.95;
  margin: 0;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.quantity-label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  font-size: var(--font-size-lg);
}

.quantity-input {
  display: flex;
  align-items: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  width: fit-content;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.qty-btn {
  width: 50px;
  height: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
}

.qty-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-icon {
  font-size: var(--font-size-base);
  transition: all var(--transition-normal);
}

.qty-input {
  width: 100px;
  text-align: center;
  border: none;
  padding: var(--spacing-md);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  background: transparent;
  color: var(--color-white);
}

.qty-input:focus {
  outline: none;
}

.add-to-cart {
  font-size: var(--font-size-xl);
  padding: var(--spacing-xl) var(--spacing-3xl);
  font-weight: var(--font-weight-bold);
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-3xl) 0;
  text-align: center;
}

/* Related Products Section */
.related-products-section {
  padding: var(--spacing-6xl) 0;
  background: transparent;
}

.section-header {
  margin-bottom: var(--spacing-5xl);
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-3xl);
  justify-items: center;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .product-hero-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-4xl);
  }
  
  .product-hero-image {
    max-width: 600px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .product-hero {
    min-height: auto;
    padding: var(--spacing-5xl) 0;
  }
  
  .product-hero .container {
    padding: var(--spacing-4xl) var(--container-padding);
  }
  
  .product-title {
    font-size: var(--font-size-3xl);
  }
  
  .price-main {
    font-size: var(--font-size-2xl);
  }
  
  .product-actions {
    gap: var(--spacing-lg);
  }
  
  .add-to-cart {
    font-size: var(--font-size-lg);
    padding: var(--spacing-lg) var(--spacing-2xl);
  }
  
  .product-description-section,
  .related-products-section {
    padding: var(--spacing-5xl) 0;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-2xl);
  }
}

@media (max-width: 480px) {
  .product-hero .container {
    padding: var(--spacing-3xl) var(--spacing-md);
  }
  
  .product-title {
    font-size: var(--font-size-2xl);
  }
  
  .price-main {
    font-size: var(--font-size-xl);
  }
  
  .price-original {
    font-size: var(--font-size-lg);
  }
  
  .product-description {
    padding: var(--spacing-2xl);
  }
  
  .description-text {
    font-size: var(--font-size-base);
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style> 