<template>
  <div class="shop">
    <div class="container">
      <div class="shop-header">
        <h1>🛍️ Nuestra Tienda</h1>
        <p>Explora nuestra colección de productos tecnológicos</p>
      </div>

      <div class="shop-controls">
        <div class="filters">
          <div class="filter-group">
            <label>Categoría:</label>
            <select v-model="selectedCategory" @change="filterProducts">
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Ordenar por:</label>
            <select v-model="sortBy" @change="sortProducts">
              <option value="name">Nombre</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Precio máximo: ${{ maxPrice }}</label>
            <input 
              type="range" 
              v-model="maxPrice" 
              :min="0" 
              :max="2000" 
              :step="50"
              @input="filterProducts"
              class="price-slider"
            >
          </div>
        </div>
        
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="filterProducts"
            placeholder="Buscar productos..."
            class="search-input"
          >
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <div class="results-info">
        <p v-if="!loading">Mostrando {{ filteredProducts.length }} productos</p>
        <p v-else>Cargando productos...</p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">🔄</div>
        <p>Cargando productos desde el servidor...</p>
      </div>

      <div v-else-if="products.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No hay productos disponibles</h3>
        <p>No se pudieron cargar los productos del servidor.</p>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="no-results">
        <div class="no-results-icon">😔</div>
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustar los filtros o buscar con otros términos</p>
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
const maxPrice = ref(2000)
const searchQuery = ref('')

// Categorías (se pueden cargar desde el backend también)
const categories = ref([
  'Todos',
  'Electrónicos', 
  'Accesorios',
  'Fotografía'
])

// Cargar productos desde el backend
const loadProducts = async () => {
  loading.value = true
  try {
    console.log('🔍 Shop: Cargando productos desde el backend...');
    const response = await productService.getAllProducts()
    console.log('📦 Shop: Respuesta del servidor:', response);
    
    // Mapear la respuesta del backend al formato esperado
    if (response.success && response.data) {
      console.log(`✅ Shop: ${response.data.length} productos recibidos del servidor`);
      products.value = response.data.map(product => ({
        id: product._id || product.id, // Manejar tanto _id como id
        name: product.name,
        price: product.price,
        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        description: product.description,
        category: product.category,
        stock: product.stock
      }))
      console.log('🎯 Shop: Productos mapeados:', products.value);
    } else {
      console.warn('⚠️ Shop: Respuesta inválida del servidor:', response);
      products.value = []
    }
  } catch (error) {
    console.error('❌ Shop: Error cargando productos:', error)
    // Fallback a productos mock si falla
    products.value = []
  } finally {
    loading.value = false
    console.log(`📊 Shop: Carga finalizada. Total productos: ${products.value.length}`);
  }
}

// Computed properties
const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // Filter by category
  if (selectedCategory.value !== 'Todos') {
    result = result.filter(product => product.category === selectedCategory.value)
  }
  
  // Filter by price
  result = result.filter(product => product.price <= maxPrice.value)
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  }
  
  // Sort products
  switch (sortBy.value) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      result.sort((a, b) => b.price - a.price)
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
  console.log('🔍 Shop: Navegando a producto con ID:', productId);
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
  maxPrice.value = 2000
  searchQuery.value = ''
}

onMounted(async () => {
  // Cargar productos primero
  await loadProducts()
  
  // Set initial max price based on the highest product price
  if (products.value.length > 0) {
    const highestPrice = Math.max(...products.value.map(p => p.price))
    maxPrice.value = Math.ceil(highestPrice / 100) * 100
  }
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
}

.shop-header {
  text-align: center;
  margin-bottom: 3rem;
}

.shop-header h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  color: #333;
  font-weight: 700;
}

.shop-header p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.shop-controls {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.875rem;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 0.875rem;
  min-width: 120px;
}

.price-slider {
  width: 150px;
  margin: 0;
}

.search-box {
  position: relative;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.results-info {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.results-info p {
  margin: 0;
  color: #666;
  font-weight: 500;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
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

.loading-state p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-top: 2rem;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-results h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
}

.no-results p {
  margin: 0 0 2rem 0;
  color: #666;
  font-size: 1.1rem;
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
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

/* Responsive Design */
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
  
  .filters {
    justify-content: space-between;
    gap: 1rem;
  }
  
  .filter-group {
    flex: 1;
    min-width: 100px;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .filters {
    flex-direction: column;
  }
  
  .filter-group {
    flex: none;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style> 