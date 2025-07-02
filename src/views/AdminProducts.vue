<template>
  <div class="admin-products">
    <div class="container">
      <div class="products-header">
        <h1>📦 Gestión de Productos</h1>
        <button @click="openCreateModal" class="btn btn-primary">
          <span class="btn-icon">➕</span>
          Crear Producto
        </button>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <div class="filter-group">
          <label>Buscar productos:</label>
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Buscar por nombre, categoría..." 
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label>Categoría:</label>
          <select v-model="selectedCategory" class="filter-select">
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando productos...</p>
      </div>

      <!-- Products Table -->
      <div v-else class="products-table">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product._id">
                <td>
                  <div class="product-image">
                    <img :src="product.image" :alt="product.name" />
                  </div>
                </td>
                <td>
                  <div class="product-name">
                    <h4>{{ product.name }}</h4>
                    <p>{{ product.description?.substring(0, 50) }}...</p>
                  </div>
                </td>
                <td>
                  <span class="category-badge">{{ product.category }}</span>
                </td>
                <td>
                  <span class="price">${{ product.price }}</span>
                </td>
                <td>
                  <div class="stock-control">
                    <input 
                      :value="product.stock" 
                      @change="updateStock(product._id, $event.target.value)"
                      type="number" 
                      min="0" 
                      class="stock-input"
                    />
                  </div>
                </td>
                <td>
                  <span 
                    class="status-badge" 
                    :class="{ 'status-active': product.stock > 0, 'status-inactive': product.stock === 0 }"
                  >
                    {{ product.stock > 0 ? 'Disponible' : 'Agotado' }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button @click="editProduct(product)" class="btn btn-sm btn-outline">
                      ✏️
                    </button>
                    <button @click="deleteProduct(product._id)" class="btn btn-sm btn-danger">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="filteredProducts.length === 0" class="no-products">
          <div class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>No hay productos</h3>
            <p>Comienza agregando tu primer producto</p>
            <button @click="openCreateModal" class="btn btn-primary">
              Crear Primer Producto
            </button>
          </div>
        </div>
      </div>

      <!-- Modal for Create/Edit Product -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ isEditing ? 'Editar Producto' : 'Crear Producto' }}</h2>
            <button @click="closeModal" class="close-btn">&times;</button>
          </div>
          
          <form @submit.prevent="submitProduct" class="product-form">
            <div class="form-group">
              <label>Nombre del Producto *</label>
              <input 
                v-model="productForm.name" 
                type="text" 
                required 
                placeholder="Ej: iPhone 15 Pro"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Descripción *</label>
              <textarea 
                v-model="productForm.description" 
                required 
                placeholder="Descripción detallada del producto"
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Precio *</label>
                <input 
                  v-model.number="productForm.price" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  required 
                  placeholder="999.99"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label>Stock Inicial *</label>
                <input 
                  v-model.number="productForm.stock" 
                  type="number" 
                  min="0" 
                  required 
                  placeholder="10"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Categoría *</label>
              <select v-model="productForm.category" required class="form-select">
                <option value="">Seleccionar categoría</option>
                <option value="Electrónicos">Electrónicos</option>
                <option value="Ropa">Ropa</option>
                <option value="Hogar">Hogar</option>
                <option value="Deportes">Deportes</option>
                <option value="Libros">Libros</option>
                <option value="Juguetes">Juguetes</option>
                <option value="Belleza">Belleza</option>
                <option value="Automóviles">Automóviles</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div class="form-group">
              <label>URL de la Imagen *</label>
              <input 
                v-model="productForm.image" 
                type="url" 
                required 
                placeholder="https://ejemplo.com/imagen.jpg"
                class="form-input"
              />
              <small class="form-help">Proporciona una URL válida de la imagen del producto</small>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeModal" class="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" :disabled="submitting" class="btn btn-primary">
                {{ submitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Producto') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminService, productService } from '../services/api'
import { useNotifications } from '../composables/useNotifications'

const { success, error } = useNotifications()

// State
const products = ref([])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const searchTerm = ref('')
const selectedCategory = ref('')

// Form
const productForm = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  image: ''
})

// Computed
const categories = computed(() => {
  // Solo categorías de productos activos
  const activeProducts = products.value.filter(p => p.isActive !== false)
  const cats = [...new Set(activeProducts.map(p => p.category))]
  return cats.sort()
})

const filteredProducts = computed(() => {
  // 🎯 FILTRAR SOLO PRODUCTOS ACTIVOS
  let filtered = products.value.filter(p => p.isActive !== false)

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }

  return filtered
})

// Methods
const loadProducts = async () => {
  loading.value = true
  try {
    const response = await adminService.getAllProducts()
    console.log('Admin products loaded:', response);
    products.value = response.data || []
  } catch (err) {
    console.error('Error loading products:', err)
    error('Error al cargar productos')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  productForm.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: ''
  }
  showModal.value = true
}

const editProduct = (product) => {
  isEditing.value = true
  productForm.value = { ...product }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const submitProduct = async () => {
  submitting.value = true
  try {
    if (isEditing.value) {
      await adminService.updateProduct(productForm.value._id, productForm.value)
      success('Producto actualizado correctamente')
    } else {
      await adminService.createProduct(productForm.value)
      success('Producto creado correctamente')
    }
    
    await loadProducts()
    closeModal()
  } catch (err) {
    console.error('Error saving product:', err)
    error(err.message || 'Error al guardar producto')
  } finally {
    submitting.value = false
  }
}

const updateStock = async (productId, newStock) => {
  try {
    const stockValue = parseInt(newStock)
    if (stockValue < 0) return
    
    await adminService.updateProductStock(productId, stockValue)
    success('Stock actualizado')
    await loadProducts()
  } catch (err) {
    console.error('Error updating stock:', err)
    error('Error al actualizar stock')
  }
}

const deleteProduct = async (productId) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return
  
  try {
    await adminService.deleteProduct(productId)
    success('Producto eliminado')
    await loadProducts()
  } catch (err) {
    console.error('Error deleting product:', err)
    error('Error al eliminar producto')
  }
}

// Lifecycle
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.admin-products {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: #f8f9fa;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.products-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #555;
  font-size: 0.875rem;
}

.filter-input, .filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
}

.loading {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.products-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.product-image img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.product-name h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
}

.product-name p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.category-badge {
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
}

.price {
  font-weight: 600;
  color: #28a745;
}

.stock-input {
  width: 80px;
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-inactive {
  background: #f8d7da;
  color: #721c24;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-outline {
  background: white;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-icon {
  margin-right: 0.5rem;
}

.no-products {
  padding: 4rem;
}

.empty-state {
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.empty-state p {
  margin: 0 0 2rem 0;
  color: #666;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.product-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-help {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .products-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .filter-input, .filter-select {
    min-width: auto;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style> 