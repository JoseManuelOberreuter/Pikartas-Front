<template>
  <div class="admin-products">
    <div class="container">
      <div class="products-header">
        <h1>
          <font-awesome-icon icon="box" class="header-icon" />
          Gestión de Productos
        </h1>
        <button @click="openCreateModal" class="btn btn-primary">
          <font-awesome-icon icon="plus" class="btn-icon" />
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
        <div class="filter-group">
          <label class="filter-checkbox-label">
            <input 
              v-model="showInactive" 
              type="checkbox" 
              class="filter-checkbox"
            />
            <span>Mostrar productos inactivos</span>
          </label>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <font-awesome-icon icon="spinner" spin class="loading-icon" />
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
                      @change="updateStock(product._id || product.id, $event.target.value)"
                      type="number" 
                      min="0" 
                      class="stock-input"
                    />
                  </div>
                </td>
                <td>
                  <span 
                    class="status-badge" 
                    :class="{ 
                      'status-active': product.is_active !== false && product.stock > 0, 
                      'status-inactive': product.is_active === false || product.stock === 0 
                    }"
                  >
                    {{ product.is_active === false ? 'Inactivo' : (product.stock > 0 ? 'Disponible' : 'Agotado') }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button @click="editProduct(product)" class="btn btn-sm btn-outline">
                      <font-awesome-icon icon="edit" class="action-icon" />
                    </button>
                    <button 
                      v-if="product.is_active === false" 
                      @click="reactivateProduct(product.id)" 
                      class="btn btn-sm btn-success"
                      title="Reactivar producto"
                    >
                      <font-awesome-icon icon="undo" class="action-icon" />
                    </button>
                    <button @click="deleteProduct(product.id)" class="btn btn-sm btn-danger">
                      <font-awesome-icon icon="trash" class="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="filteredProducts.length === 0" class="no-products">
          <div class="empty-state">
            <div class="empty-icon">
              <font-awesome-icon icon="box" class="empty-icon-svg" />
            </div>
            <h3>No hay productos</h3>
            <p>Comienza agregando tu primer producto</p>
            <button @click="openCreateModal" class="btn btn-primary">
              <font-awesome-icon icon="plus" class="btn-icon" />
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
            <button @click="closeModal" class="close-btn">
              <font-awesome-icon icon="times" class="close-icon" />
            </button>
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
              <div class="category-selector">
                <select v-model="productForm.category" required class="form-select">
                  <option value="">Seleccionar categoría</option>
                  <option v-for="category in availableCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                  <option value="__new__">
                    <font-awesome-icon icon="plus" class="option-icon" />
                    Crear nueva categoría
                  </option>
                </select>
                
                <div v-if="productForm.category === '__new__'" class="new-category-input">
                  <input 
                    v-model="newCategoryName" 
                    type="text" 
                    placeholder="Nombre de la nueva categoría"
                    class="form-input"
                    @keyup.enter="addNewCategory"
                  />
                  <button 
                    type="button" 
                    @click="addNewCategory" 
                    class="btn btn-sm btn-primary"
                    :disabled="!newCategoryName.trim()"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Imagen del Producto *</label>
              <div class="image-upload-container">
                <input 
                  type="file" 
                  @change="handleImageUpload" 
                  accept="image/*"
                  class="file-input"
                  id="product-image"
                />
                <label for="product-image" class="file-input-label">
                  <font-awesome-icon icon="camera" class="upload-icon" />
                  <span class="upload-text">
                    {{ selectedImage ? selectedImage.name : 'Seleccionar imagen' }}
                  </span>
                </label>
                
                <div v-if="selectedImage" class="image-preview">
                  <img :src="imagePreviewUrl" alt="Preview" class="preview-image" />
                  <button 
                    type="button" 
                    @click="removeImage" 
                    class="remove-image-btn"
                  >
                    <font-awesome-icon icon="times" class="remove-icon" />
                  </button>
                </div>
                
                <div v-if="productForm.image && !selectedImage" class="current-image">
                  <img :src="productForm.image" alt="Current" class="preview-image" />
                  <span class="current-image-label">Imagen actual</span>
                </div>
              </div>
              <small class="form-help">Selecciona una imagen para el producto (JPG, PNG, GIF)</small>
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
const showInactive = ref(false)
const availableCategories = ref([])
const newCategoryName = ref('')
const selectedImage = ref(null)
const imagePreviewUrl = ref('')

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
  const activeProducts = products.value.filter(p => p.is_active !== false && p.is_active !== null)
  const cats = [...new Set(activeProducts.map(p => p.category))]
  return cats.sort()
})

const filteredProducts = computed(() => {
  // Filtrar productos según si se muestran inactivos o no
  // Supabase devuelve is_active (snake_case)
  let filtered = products.value.filter(p => {
    if (showInactive.value) {
      // Si showInactive está activo, mostrar todos los productos
      return true;
    } else {
      // Si showInactive está desactivado, mostrar solo activos
      const isActive = p.is_active !== false && p.is_active !== null;
      return isActive;
    }
  })

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
const loadCategories = async () => {
  try {
    // Intentar cargar categorías desde el endpoint específico
    const response = await productService.getCategories()
    if (response.success && response.data) {
      availableCategories.value = response.data
    } else {
      // Si no hay endpoint específico, extraer categorías de productos existentes
      await loadCategoriesFromProducts()
    }
  } catch (err) {
    // Fallback: extraer categorías de productos existentes
    await loadCategoriesFromProducts()
  }
}

const loadCategoriesFromProducts = async () => {
  try {
    const response = await adminService.getAllProducts()
    // Handle new response format: { success: true, data: { products: [...], pagination: {...} } }
    // Or legacy format: { success: true, data: [...] }
    const productsArray = response.data?.products || response.data || []
    
    if (response.success && productsArray.length > 0) {
      // Extraer categorías únicas de los productos
      const categories = [...new Set(productsArray.map(p => p.category).filter(Boolean))]
      availableCategories.value = categories.sort()
    } else {
      // Fallback a categorías básicas
      availableCategories.value = ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes', 'Belleza', 'Automóviles', 'Otros', 'Plantas']
    }
  } catch (err) {
    // Fallback a categorías básicas
    availableCategories.value = ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes', 'Belleza', 'Automóviles', 'Otros', 'Plantas']
  }
}

const addNewCategory = () => {
  const categoryName = newCategoryName.value.trim()
  if (!categoryName) return
  
  if (!availableCategories.value.includes(categoryName)) {
    availableCategories.value.push(categoryName)
    availableCategories.value.sort()
  }
  
  productForm.value.category = categoryName
  newCategoryName.value = ''
}

const loadProducts = async () => {
  loading.value = true
  try {
    const response = await adminService.getAllProducts()
    // Handle new response format: { success: true, data: { products: [...], pagination: {...} } }
    // Or legacy format: { success: true, data: [...] }
    const productsArray = response.data?.products || response.data || []
    products.value = productsArray
  } catch (err) {
    error('Error al cargar productos')
  } finally {
    loading.value = false
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedImage.value = file
    imagePreviewUrl.value = URL.createObjectURL(file)
    // Limpiar la URL de imagen anterior si existe
    productForm.value.image = ''
  }
}

const removeImage = () => {
  selectedImage.value = null
  imagePreviewUrl.value = ''
  // Limpiar el input file
  const fileInput = document.getElementById('product-image')
  if (fileInput) fileInput.value = ''
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
  selectedImage.value = null
  imagePreviewUrl.value = ''
  showModal.value = true
}

const editProduct = (product) => {
  // Verificar que el producto tenga un ID válido (probar diferentes nombres)
  const productId = product._id || product.id
  if (!productId) {
    error('Error: Producto sin ID válido')
    return
  }
  
  isEditing.value = true
  
  // Copiar todos los campos del producto
  productForm.value = {
    _id: productId,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    image: product.image
  }
  
  selectedImage.value = null
  imagePreviewUrl.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  selectedImage.value = null
  imagePreviewUrl.value = ''
}

const submitProduct = async () => {
  submitting.value = true
  try {
    // Crear FormData para enviar archivos
    const formData = new FormData()
    
    // Agregar campos del formulario
    formData.append('name', productForm.value.name)
    formData.append('description', productForm.value.description)
    formData.append('price', productForm.value.price)
    formData.append('stock', productForm.value.stock)
    formData.append('category', productForm.value.category)
    
    // Agregar imagen si se seleccionó una nueva
    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    } else if (productForm.value.image && !isEditing.value) {
      // Si no hay imagen nueva pero hay URL, enviar la URL
      formData.append('image', productForm.value.image)
    }
    
    if (isEditing.value) {
      if (!productForm.value._id) {
        throw new Error('ID de producto no encontrado')
      }
      
      await adminService.updateProduct(productForm.value._id, formData)
      success('Producto actualizado correctamente')
    } else {
      await adminService.createProduct(formData)
      success('Producto creado correctamente')
    }
    
    await loadProducts()
    closeModal()
  } catch (err) {
    error(err.message || 'Error al guardar producto')
  } finally {
    submitting.value = false
  }
}

const updateStock = async (productId, newStock) => {
  try {
    // Verificar que el ID sea válido
    if (!productId) {
      error('Error: ID de producto inválido')
      return
    }
    
    const stockValue = parseInt(newStock)
    if (stockValue < 0) {
      return
    }
    
    await adminService.updateProductStock(productId, stockValue)
    
    success('Stock actualizado')
    await loadProducts()
  } catch (err) {
    error('Error al actualizar stock')
  }
}

const deleteProduct = async (productId) => {
  // Validar y convertir a número
  const id = parseInt(productId);
  if (!id || isNaN(id)) {
    error('Error: ID de producto inválido');
    return;
  }
  
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
  
  try {
    await adminService.deleteProduct(id);
    success('Producto eliminado');
    await loadProducts();
  } catch (err) {
    error(err.message || 'Error al eliminar producto');
  }
};

const reactivateProduct = async (productId) => {
  // Validar y convertir a número
  const id = parseInt(productId);
  if (!id || isNaN(id)) {
    error('Error: ID de producto inválido');
    return;
  }
  
  if (!confirm('¿Estás seguro de que quieres reactivar este producto?')) return;
  
  try {
    // Crear FormData para actualizar solo el campo is_active
    // Supabase espera el valor como boolean true, no como string
    const formData = new FormData();
    formData.append('is_active', 'true'); // El backend lo convertirá a boolean
    
    await adminService.updateProduct(id, formData);
    success('Producto reactivado exitosamente');
    await loadProducts();
  } catch (err) {
    error(err.message || 'Error al reactivar producto');
  }
};

// Lifecycle
onMounted(async () => {
  await loadProducts()
  await loadCategories()
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
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  color: var(--icon-admin-products-header);
  font-size: 1.2em;
  transition: all var(--transition-normal);
}

.products-header:hover .header-icon {
  transform: scale(1.1) rotate(5deg);
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

.filter-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.filter-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #007bff;
}

.loading {
  text-align: center;
  padding: 4rem;
}

.loading-icon {
  font-size: 2.5rem;
  color: var(--icon-admin-products-loading);
  margin: 0 auto 1rem;
  display: block;
  animation: spin 1s linear infinite;
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

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-icon {
  font-size: 0.875rem;
  transition: all var(--transition-normal);
}

.btn:hover .btn-icon {
  transform: scale(1.1);
}

.btn-primary .btn-icon {
  color: var(--icon-admin-products-add);
}

.btn-outline .btn-icon {
  color: var(--icon-admin-products-edit);
}

.btn-danger .btn-icon {
  color: var(--icon-admin-products-delete);
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon-svg {
  font-size: 1em;
  color: var(--icon-admin-products-empty);
  transition: all var(--transition-normal);
}

.empty-state:hover .empty-icon-svg {
  transform: scale(1.1) rotate(10deg);
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
  color: var(--icon-admin-products-close);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  transition: all var(--transition-normal);
}

.close-btn:hover {
  color: var(--icon-admin-products-close-hover);
  transform: scale(1.1);
}

.close-icon {
  font-size: 1rem;
  transition: all var(--transition-normal);
}

.close-btn:hover .close-icon {
  color: var(--icon-admin-products-close-hover);
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

.category-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.new-category-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.new-category-input input {
  flex: 1;
  margin: 0;
}

.new-category-input .btn {
  margin: 0;
  white-space: nowrap;
}

.image-upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input {
  display: none;
}

.file-input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8f9fa;
}

.file-input-label:hover {
  border-color: #007bff;
  background: #e3f2fd;
}

.upload-icon {
  font-size: 1.5rem;
  color: var(--icon-admin-products-camera);
  transition: all var(--transition-normal);
}

.file-input-label:hover .upload-icon {
  transform: scale(1.1);
}

.action-icon {
  font-size: 0.875rem;
  transition: all var(--transition-normal);
}

.btn:hover .action-icon {
  transform: scale(1.1);
}

.remove-icon {
  font-size: 0.75rem;
  transition: all var(--transition-normal);
}

.remove-image-btn:hover .remove-icon {
  transform: scale(1.1);
}

.upload-text {
  color: #666;
  font-weight: 500;
}

.image-preview, .current-image {
  position: relative;
  display: inline-block;
  max-width: 200px;
}

.preview-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.remove-image-btn:hover {
  background: #c82333;
}

.current-image-label {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}
</style> 