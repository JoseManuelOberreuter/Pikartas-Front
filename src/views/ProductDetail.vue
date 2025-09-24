<template>
  <div class="product-detail">
    <div class="container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">🔄</div>
        <h2>Cargando producto...</h2>
      </div>

      <div v-else-if="!product" class="not-found">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe o no está disponible.</p>
        <router-link to="/shop" class="btn btn-primary">
          ← Volver a la tienda
        </router-link>
      </div>

      <div v-else class="product-content">
        <div class="product-gallery">
          <div class="main-image">
                <img :src="product.image" :alt="product.name" />
          </div>
        </div>

        <div class="product-info">
          <nav class="breadcrumb">
            <router-link to="/">Inicio</router-link> /
            <router-link to="/shop">Tienda</router-link> /
            <span>{{ product.name }}</span>
          </nav>

          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="product-price">
            <span class="price">${{ product.price }}</span>
          </div>

          <div class="product-description">
            <h3>Descripción</h3>
            <p>{{ product.description }}</p>
          </div>

          <div class="product-meta">
            <div class="meta-item">
              <span class="meta-label">Categoría:</span>
              <span class="meta-value">{{ product.category }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Stock disponible:</span>
              <span class="meta-value" :class="{ 'low-stock': product.stock <= 10, 'out-of-stock': product.stock === 0 }">
                {{ product.stock > 0 ? `${product.stock} unidades` : 'Sin stock' }}
              </span>
            </div>
          </div>

          <div class="product-actions">
            <div class="quantity-selector">
              <label>Cantidad:</label>
              <div class="quantity-input">
                <button 
                  class="qty-btn" 
                  @click="decreaseQuantity" 
                  :disabled="quantity <= 1"
                >
                  -
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
                  +
                </button>
              </div>
            </div>

            <button 
              class="btn btn-primary add-to-cart"
              @click="addToCart"
              :disabled="product.stock === 0"
            >
              {{ product.stock === 0 ? 'Sin Stock' : `🛒 Agregar al Carrito` }}
            </button>

            <button class="btn btn-outline" @click="goBack">
              ← Volver
            </button>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="related-products">
        <h2>Productos Relacionados</h2>
        <div class="products-grid">
          <ProductCard 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id" 
            :product="relatedProduct"
            @view-product="viewProduct"
          />
        </div>
      </div>
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

const route = useRoute()
const router = useRouter()
const { success } = useNotifications()
const cartStore = useCartStore()

const quantity = ref(1)
const product = ref(null)
const loading = ref(false)
const allProducts = ref([])

// Cargar producto específico por ID
const loadProduct = async (productId) => {
  loading.value = true
  try {
    console.log('🔍 ProductDetail: Cargando producto con ID:', productId);
    const response = await productService.getProductById(productId)
    console.log('📦 ProductDetail: Respuesta del servidor:', response);
    
    if (response.success && response.data) {
      // Manejar tanto _id como id del backend
      const productId = response.data._id || response.data.id;
      console.log('🎯 ProductDetail: ID del producto:', productId);
      
      product.value = {
        id: productId,
        name: response.data.name,
        price: response.data.price,
        image: response.data.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        description: response.data.description,
        category: response.data.category,
        stock: response.data.stock
      }
      console.log('✅ ProductDetail: Producto cargado:', product.value);
    } else {
      console.warn('⚠️ ProductDetail: Respuesta inválida del servidor:', response);
      product.value = null
    }
  } catch (error) {
    console.error('❌ ProductDetail: Error cargando producto:', error)
    product.value = null
  } finally {
    loading.value = false
  }
}

// Cargar todos los productos para mostrar relacionados
const loadAllProducts = async () => {
  try {
    const response = await productService.getAllProducts()
    
    if (response.success && response.data) {
      allProducts.value = response.data.map(p => ({
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
    console.error('Error loading all products:', error)
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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.product-detail {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
}

.loading-state {
  text-align: center;
  padding: 4rem 0;
}

.loading-spinner {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.not-found {
  text-align: center;
  padding: 4rem 0;
}

.not-found h2 {
  margin: 0 0 2rem 0;
  color: #333;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
}

.product-gallery {
  position: sticky;
  top: 120px;
  height: fit-content;
}

.main-image {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.main-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}

.product-info {
  padding: 1rem 0;
}

.breadcrumb {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.breadcrumb a {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.product-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #333;
}

.product-price {
  margin-bottom: 2rem;
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #28a745;
}

.product-description {
  margin-bottom: 2rem;
}

.product-description h3 {
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  color: #333;
}

.product-description p {
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
  margin: 0;
}

.product-meta {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.meta-item:last-child {
  margin-bottom: 0;
}

.meta-label {
  font-weight: 600;
  color: #333;
}

.meta-value {
  color: #666;
}

.meta-value.low-stock {
  color: #ffc107;
  font-weight: 600;
}

.meta-value.out-of-stock {
  color: #dc3545;
  font-weight: 600;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.quantity-selector label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.quantity-input {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  width: fit-content;
}

.qty-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: #f8f9fa;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  transition: background 0.3s;
}

.qty-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-input {
  width: 80px;
  text-align: center;
  border: none;
  padding: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
}

.qty-input:focus {
  outline: none;
}

.btn {
  padding: 1rem 2rem;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 1.1rem;
  display: block;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: #666;
  border-color: #ddd;
}

.btn-outline:hover {
  background: #f8f9fa;
  border-color: #007bff;
  color: #007bff;
}

.add-to-cart {
  font-size: 1.25rem;
  padding: 1.25rem 2rem;
}

.related-products {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid #eee;
}

.related-products h2 {
  text-align: center;
  font-size: 2rem;
  margin: 0 0 3rem 0;
  color: #333;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .product-gallery {
    position: static;
  }
  
  .main-image img {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .product-title {
    font-size: 2rem;
  }
  
  .price {
    font-size: 2rem;
  }
  
  .product-actions {
    gap: 1rem;
  }
  
  .btn {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
  
  .add-to-cart {
    font-size: 1.1rem;
    padding: 1rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }
  
  .main-image img {
    height: 300px;
  }
  
  .product-title {
    font-size: 1.75rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style> 