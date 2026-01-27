<template>
  <div class="shop">
    <div class="container">
      <div class="shop-header">
        <h1 class="text-hero-title"><font-awesome-icon icon="dice" class="shop-header-icon" /> Nuestra Tienda</h1>
        <p class="text-hero-subtitle">Explora nuestra colección de cartas Pokémon</p>
      </div>

      <div class="shop-controls">
        <div class="filter-container">
          <div class="filter-group">
            <label class="filter-label text-hero-subtitle">Categoría:</label>
            <select v-model="selectedCategory" @change="filterProducts" class="filter-select">
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label text-hero-subtitle">Ordenar por:</label>
            <select v-model="sortBy" @change="sortProducts" class="filter-select">
              <option value="name">Nombre</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
            </select>
          </div>
          
          <button @click="resetFilters" class="filter-reset-btn" title="Limpiar filtros">
            <font-awesome-icon icon="times" />
            Limpiar
          </button>
        </div>
        
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="filterProducts"
            placeholder="Buscar productos..."
            class="search-input"
          >
          <font-awesome-icon icon="search" class="search-icon" />
        </div>
      </div>

      <div class="results-info">
        <p v-if="!loading" class="text-hero-subtitle">Mostrando {{ filteredProducts.length }} productos</p>
        <p v-else class="text-hero-subtitle">Cargando productos...</p>
      </div>

      <div v-if="loading" class="loading-state">
        <font-awesome-icon icon="spinner" class="loading-spinner" spin />
        <p class="text-hero-subtitle">Cargando productos desde el servidor...</p>
      </div>

      <div v-else-if="products.length === 0" class="empty-state">
        <h3 class="text-title-quaternary">No hay productos disponibles</h3>
        <p class="text-hero-subtitle">No se pudieron cargar los productos del servidor.</p>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="no-results">
        <font-awesome-icon icon="times-circle" class="no-results-icon" />
        <h3 class="text-title-quaternary">No se encontraron productos</h3>
        <p class="text-hero-subtitle">Intenta ajustar los filtros o buscar con otros términos</p>
        <button @click="resetFilters" class="btn btn-primary">
          Limpiar Filtros
        </button>
      </div>

      <div v-else class="products-grid">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product"
          @view-product="viewProduct"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productService } from '../services/api'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()

// Referencias reactivas
const products = ref([])
const loading = ref(false)
const selectedCategory = ref('Todos')
const sortBy = ref('name')
const searchQuery = ref('')

// Categorías (se pueden cargar desde el backend también)
// Inicializar con categorías de Pikartas, pero se cargarán dinámicamente desde el backend
const categories = ref([
  'Todos',
  'Cartas Raras', 
  'Cartas Comunes',
  'Booster Packs',
  'Coleccionables'
])

// Cargar productos desde el backend
const loadProducts = async () => {
  loading.value = true
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
    
    // Mapear la respuesta del backend al formato esperado
    if (productsArray.length > 0) {
      products.value = productsArray.map(product => ({
        id: product._id || product.id, // Manejar tanto _id como id
        name: product.name,
        price: product.price,
        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        description: product.description,
        category: product.category,
        stock: product.stock,
        // Include sale information for ProductCard to display offers
        is_on_sale: product.is_on_sale || false,
        discount_percentage: product.discount_percentage || null,
        sale_start_date: product.sale_start_date || null,
        sale_end_date: product.sale_end_date || null,
        sale_price: product.sale_price || null
      }))
    } else {
      products.value = []
    }
  } catch (error) {
    console.error('[Shop] Error loading products:', error);
    products.value = []
  } finally {
    loading.value = false
  }
}

// Cargar categorías desde el backend
const loadCategories = async () => {
  try {
    // Intentar cargar categorías desde el endpoint específico
    const response = await productService.getCategories()
    if (response.success && response.data && Array.isArray(response.data)) {
      // Agregar "Todos" al inicio y ordenar el resto
      const uniqueCategories = [...new Set(response.data.filter(Boolean))].sort()
      categories.value = ['Todos', ...uniqueCategories]
    } else {
      // Fallback: extraer categorías de productos cargados
      loadCategoriesFromProducts()
    }
  } catch (error) {
    console.error('[Shop] Error loading categories from endpoint:', error);
    // Fallback: extraer categorías de productos cargados
    loadCategoriesFromProducts()
  }
}

// Fallback: extraer categorías de productos cargados
const loadCategoriesFromProducts = () => {
  if (products.value.length > 0) {
    // Extraer categorías únicas de los productos
    const uniqueCategories = [...new Set(products.value.map(p => p.category).filter(Boolean))].sort()
    categories.value = ['Todos', ...uniqueCategories]
  }
}

// Helper function to get final price (considering offers)
const getFinalPrice = (product) => {
  if (!product) return 0
  
  // Check if product is currently on sale
  if (product.is_on_sale && product.discount_percentage) {
    const now = new Date()
    const startDate = product.sale_start_date ? new Date(product.sale_start_date) : null
    const endDate = product.sale_end_date ? new Date(product.sale_end_date) : null
    
    if (startDate && endDate && now >= startDate && now <= endDate) {
      // Product is currently on sale
      return product.price * (1 - product.discount_percentage / 100)
    }
  }
  
  // Return regular price
  return product.price
}

// Computed properties
const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // Filter by category
  if (selectedCategory.value !== 'Todos') {
    result = result.filter(product => product.category === selectedCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  }
  
  // Sort products (using final price for price sorting)
  switch (sortBy.value) {
    case 'price-low':
      result.sort((a, b) => getFinalPrice(a) - getFinalPrice(b))
      break
    case 'price-high':
      result.sort((a, b) => getFinalPrice(b) - getFinalPrice(a))
      break
    case 'name':
    default:
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
  }
  
  return result
})

// Methods
const viewProduct = (productId) => {
  router.push(`/product/${productId}`)
}

const filterProducts = () => {
  // This function is called when filters change
  // The computed property will automatically update
}

const sortProducts = () => {
  // This function is called when sorting changes
  // The computed property will automatically update
}

const resetFilters = () => {
  selectedCategory.value = 'Todos'
  sortBy.value = 'name'
  searchQuery.value = ''
}

onMounted(async () => {
  // Cargar productos primero
  await loadProducts()
  
  // Cargar categorías después de cargar productos (para tener fallback)
  await loadCategories()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.shop {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: transparent;
}

.shop-header {
  text-align: center;
  margin-bottom: 4rem;
}

.shop-header h1 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.shop-header-icon {
  color: var(--color-primary);
  font-size: 0.9em;
  transition: all var(--transition-normal);
  filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.8));
}

.shop-header h1:hover .shop-header-icon {
  transform: scale(1.1);
}

.shop-header p {
  font-size: 1.1rem;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.shop-controls {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.results-info {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-primary);
  border-radius: 6px;
  text-align: center;
}

.results-info p {
  margin: 0;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid var(--color-primary);
  margin-bottom: 3rem;
}

.loading-spinner {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--color-primary);
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: start;
}

/* Responsive: 2 columns on medium screens */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Responsive: 1 column on small screens */
@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-primary);
  border-radius: 12px;
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.no-results h3 {
  margin: 0 0 1.5rem 0;
}

.no-results p {
  margin: 0 0 2rem 0;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--color-quaternary);
  transition: all var(--transition-normal);
}

.no-results:hover .no-results-icon {
  transform: scale(1.05);
}


.btn {
  padding: 0.75rem 1.5rem;
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
  background: var(--color-primary);
  color: var(--color-black);
}

.btn-primary:hover {
  background: var(--color-quaternary);
  color: var(--color-white);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .shop {
    padding-top: 100px;
  }
  
  .shop-header h1 {
    font-size: 2rem;
  }
  
  .shop-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .shop {
    padding-top: 90px;
    padding-bottom: 60px;
  }
  
  .container {
    padding: 0 var(--spacing-md, 1rem);
  }
  
  .shop-header {
    margin-bottom: 2rem;
  }
  
  .shop-header h1 {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .shop-header p {
    font-size: 0.9rem;
  }
  
  .shop-controls {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .results-info {
    padding: 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .results-info p {
    font-size: 0.875rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
}
</style> 