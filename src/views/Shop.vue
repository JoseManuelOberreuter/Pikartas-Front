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
              <option value="rating">Rating</option>
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
        <p>Mostrando {{ filteredProducts.length }} productos</p>
      </div>

      <div class="products-grid" v-if="filteredProducts.length > 0">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product"
          @view-product="viewProduct"
        />
      </div>

      <div v-else class="no-results">
        <div class="no-results-icon">😔</div>
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustar los filtros o buscar con otros términos</p>
        <button @click="resetFilters" class="btn btn-primary">
          Limpiar Filtros
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { products, categories } from '../data/products.js'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()

// Reactive data
const selectedCategory = ref('Todos')
const sortBy = ref('name')
const maxPrice = ref(2000)
const searchQuery = ref('')

// Computed properties
const filteredProducts = computed(() => {
  let result = [...products]
  
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
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
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
  maxPrice.value = 2000
  searchQuery.value = ''
}

onMounted(() => {
  // Set initial max price based on the highest product price
  const highestPrice = Math.max(...products.map(p => p.price))
  maxPrice.value = Math.ceil(highestPrice / 100) * 100
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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