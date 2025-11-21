<template>
  <div class="admin-products">
    <div class="container">
      <div class="products-header">
        <h1>
          <font-awesome-icon icon="box" class="header-icon" />
          Gestión de Productos
        </h1>
        <div class="header-actions">
          <button @click="openCategoryManager" class="btn btn-outline">
            <font-awesome-icon icon="tag" class="btn-icon" />
            Gestionar Categorías
          </button>
          <button @click="openCreateModal" class="btn btn-primary">
            <font-awesome-icon icon="plus" class="btn-icon" />
            Crear Producto
          </button>
        </div>
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
          <label>Estado:</label>
          <select v-model="productStatusFilter" class="filter-select">
            <option value="active">Productos activos</option>
            <option value="inactive">Productos inactivos</option>
          </select>
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
                <th>Oferta</th>
                <th>Stock</th>
                <th>Destacado</th>
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
                  <span class="price">${{ formatCLP(product.price) }}</span>
                </td>
                <td>
                  <span 
                    class="sale-badge" 
                    :class="{ 'sale-active': isProductOnSale(product) }"
                  >
                    <font-awesome-icon icon="tag" class="badge-icon" />
                    <span v-if="isProductOnSale(product)">
                      {{ roundDiscount(product.discount_percentage) }}%
                    </span>
                    <span v-else>No</span>
                  </span>
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
                    class="featured-badge" 
                    :class="{ 'featured-active': product.is_featured }"
                  >
                    <font-awesome-icon icon="star" class="badge-icon" />
                    {{ product.is_featured ? 'Sí' : 'No' }}
                  </span>
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
                    <!-- Para productos inactivos, solo mostrar opción de reactivar -->
                    <template v-if="product.is_active === false">
                      <button 
                        @click="reactivateProduct(product.id)" 
                        class="btn btn-sm btn-success"
                        title="Reactivar producto"
                      >
                        <font-awesome-icon icon="undo" class="action-icon" />
                      </button>
                    </template>
                    <!-- Para productos activos, mostrar todas las opciones -->
                    <template v-else>
                      <button 
                        @click="toggleFeatured(product._id || product.id, product.is_featured)" 
                        class="btn btn-sm"
                        :class="product.is_featured ? 'btn-featured-active' : 'btn-featured'"
                        :title="product.is_featured ? 'Quitar de destacados' : 'Marcar como destacado'"
                      >
                        <font-awesome-icon icon="star" class="action-icon" />
                      </button>
                      <button 
                        @click="openSaleModal(product)" 
                        class="btn btn-sm"
                        :class="isProductOnSale(product) ? 'btn-sale-active' : 'btn-sale'"
                        :title="isProductOnSale(product) ? 'Editar oferta' : 'Configurar oferta'"
                      >
                        <font-awesome-icon icon="tag" class="action-icon" />
                      </button>
                      <button @click="editProduct(product)" class="btn btn-sm btn-outline" title="Editar producto">
                        <font-awesome-icon icon="edit" class="action-icon" />
                      </button>
                      <button @click="deleteProduct(product.id)" class="btn btn-sm btn-danger" title="Eliminar producto">
                        <font-awesome-icon icon="trash" class="action-icon" />
                      </button>
                    </template>
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

      <!-- Modal for Category Management -->
      <div v-if="showCategoryModal" class="modal-overlay" @click="closeCategoryModal">
        <div class="modal-content category-modal" @click.stop>
          <div class="modal-header">
            <h2>
              <font-awesome-icon icon="tag" class="modal-header-icon" />
              Gestión de Categorías
            </h2>
            <button @click="closeCategoryModal" class="close-btn">
              <font-awesome-icon icon="times" class="close-icon" />
            </button>
          </div>
          
          <div class="category-manager-content">
            <!-- Add New Category -->
            <div class="category-add-section">
              <label>Agregar Nueva Categoría</label>
              <div class="category-add-input">
                <input 
                  v-model="newCategoryName" 
                  type="text" 
                  placeholder="Nombre de la nueva categoría"
                  class="form-input"
                  @keyup.enter="addNewCategoryFromManager"
                />
                <button 
                  type="button" 
                  @click="addNewCategoryFromManager" 
                  class="btn btn-primary"
                  :disabled="!newCategoryName.trim()"
                >
                  <font-awesome-icon icon="plus" class="btn-icon" />
                  Agregar
                </button>
              </div>
            </div>

            <!-- Categories List -->
            <div class="categories-list">
              <label>Categorías Existentes</label>
              <div v-if="availableCategories.length === 0" class="no-categories">
                <p>No hay categorías disponibles</p>
              </div>
              <div v-else class="categories-grid">
                <div 
                  v-for="category in availableCategories" 
                  :key="category" 
                  class="category-item"
                  :class="{ 'category-has-products': getCategoryProductCount(category) > 0 }"
                >
                  <div class="category-info">
                    <span class="category-name">{{ category }}</span>
                    <span 
                      v-if="getCategoryProductCount(category) > 0" 
                      class="category-badge-count"
                      :title="`${getCategoryProductCount(category)} producto(s) activo(s) en esta categoría`"
                    >
                      <font-awesome-icon icon="box" class="count-icon" />
                      {{ getCategoryProductCount(category) }}
                    </span>
                    <span v-else class="category-empty">Sin productos</span>
                  </div>
                  <button 
                    @click="deleteCategory(category)" 
                    class="btn btn-sm btn-danger category-delete-btn"
                    :disabled="!canDeleteCategory(category)"
                    :title="canDeleteCategory(category) ? 'Eliminar categoría' : 'No se puede eliminar: hay productos activos vinculados'"
                  >
                    <font-awesome-icon icon="trash" class="action-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeCategoryModal" class="btn btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <!-- Modal for Sale Management -->
      <div v-if="showSaleModal" class="modal-overlay" @click="closeSaleModal">
        <div class="modal-content sale-modal" @click.stop>
          <div class="modal-header">
            <h2>
              <font-awesome-icon icon="tag" class="modal-header-icon" />
              Gestión de Oferta
            </h2>
            <button @click="closeSaleModal" class="close-btn">
              <font-awesome-icon icon="times" class="close-icon" />
            </button>
          </div>
          
          <form @submit.prevent="submitSale" class="sale-form">
            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  v-model="saleForm.isOnSale" 
                  type="checkbox" 
                  class="form-checkbox"
                />
                <span>En Oferta</span>
              </label>
              <small class="form-help">Marca esta opción para poner el producto en oferta</small>
            </div>

            <div v-if="saleForm.isOnSale" class="sale-fields">
              <div class="form-group">
                <label>Porcentaje de Descuento *</label>
                <input 
                  v-model.number="saleForm.discountPercentage" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="99.99"
                  :required="saleForm.isOnSale"
                  placeholder="Ej: 20 (para 20% de descuento)"
                  class="form-input"
                />
                <small class="form-help">Ingresa el porcentaje de descuento (0-99.99%)</small>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Fecha de Inicio de Oferta *</label>
                  <input 
                    v-model="saleForm.saleStartDate" 
                    type="datetime-local" 
                    :required="saleForm.isOnSale"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label>Fecha de Fin de Oferta *</label>
                  <input 
                    v-model="saleForm.saleEndDate" 
                    type="datetime-local" 
                    :required="saleForm.isOnSale"
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeSaleModal" class="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" :disabled="submittingSale" class="btn btn-primary">
                {{ submittingSale ? 'Guardando...' : 'Guardar Oferta' }}
              </button>
            </div>
          </form>
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
                <div class="category-select-row">
                  <select v-model="productForm.category" required class="form-select">
                    <option value="">Seleccionar categoría</option>
                    <option v-for="category in availableCategories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                  <button 
                    v-if="productForm.category && canDeleteCategory(productForm.category)"
                    type="button" 
                    @click="deleteCategoryFromForm(productForm.category)" 
                    class="btn btn-sm btn-danger category-delete-inline"
                    :title="'Eliminar categoría ' + productForm.category"
                  >
                    <font-awesome-icon icon="trash" class="action-icon" />
                  </button>
                </div>
                
                <div class="new-category-input">
                  <label class="new-category-label">Crear nueva categoría</label>
                  <div class="new-category-controls">
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
                      <font-awesome-icon icon="plus" class="btn-icon" />
                      Agregar
                    </button>
                  </div>
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

            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  v-model="productForm.isFeatured" 
                  type="checkbox" 
                  class="form-checkbox"
                />
                <span>Producto Destacado</span>
              </label>
              <small class="form-help">Los productos destacados aparecerán en la página de inicio</small>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  v-model="productForm.isOnSale" 
                  type="checkbox" 
                  class="form-checkbox"
                />
                <span>En Oferta</span>
              </label>
              <small class="form-help">Marca esta opción para poner el producto en oferta</small>
            </div>

            <div v-if="productForm.isOnSale" class="sale-fields">
              <div class="form-group">
                <label>Porcentaje de Descuento *</label>
                <input 
                  v-model.number="productForm.discountPercentage" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="99.99"
                  :required="productForm.isOnSale"
                  placeholder="Ej: 20 (para 20% de descuento)"
                  class="form-input"
                />
                <small class="form-help">Ingresa el porcentaje de descuento (0-99.99%)</small>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Fecha de Inicio de Oferta *</label>
                  <input 
                    v-model="productForm.saleStartDate" 
                    type="datetime-local" 
                    :required="productForm.isOnSale"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label>Fecha de Fin de Oferta *</label>
                  <input 
                    v-model="productForm.saleEndDate" 
                    type="datetime-local" 
                    :required="productForm.isOnSale"
                    class="form-input"
                  />
                </div>
              </div>
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
import { formatCLP } from '../utils/formatters.js'

const { success, error } = useNotifications()

// State
const products = ref([])
const loading = ref(false)
const showModal = ref(false)
const showCategoryModal = ref(false)
const showSaleModal = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const submittingSale = ref(false)
const searchTerm = ref('')
const selectedCategory = ref('')
const productStatusFilter = ref('active')
const availableCategories = ref([])
const newCategoryName = ref('')
const selectedImage = ref(null)
const imagePreviewUrl = ref('')
const currentProductId = ref(null)

// Form
const productForm = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  image: '',
  isFeatured: false,
  isOnSale: false,
  discountPercentage: null,
  saleStartDate: '',
  saleEndDate: ''
})

// Sale Form
const saleForm = ref({
  isOnSale: false,
  discountPercentage: null,
  saleStartDate: '',
  saleEndDate: ''
})

// Computed
const categories = computed(() => {
  // Solo categorías de productos activos
  const activeProducts = products.value.filter(p => p.is_active !== false && p.is_active !== null)
  const cats = [...new Set(activeProducts.map(p => p.category))]
  return cats.sort()
})

const filteredProducts = computed(() => {
  // Filtrar productos según el estado seleccionado
  // Supabase devuelve is_active (snake_case)
  let filtered = products.value.filter(p => {
    if (productStatusFilter.value === 'inactive') {
      // Si se selecciona inactivos, mostrar solo productos inactivos
      return p.is_active === false;
    } else {
      // Si se selecciona activos, mostrar solo productos activos
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
  if (!categoryName) {
    error('El nombre de la categoría no puede estar vacío')
    return
  }
  
  if (availableCategories.value.includes(categoryName)) {
    error('Esta categoría ya existe')
    return
  }
  
  availableCategories.value.push(categoryName)
  availableCategories.value.sort()
  productForm.value.category = categoryName
  success(`Categoría "${categoryName}" agregada y seleccionada`)
  newCategoryName.value = ''
}

const deleteCategoryFromForm = (categoryName) => {
  if (!canDeleteCategory(categoryName)) {
    const count = getCategoryProductCount(categoryName)
    error(`No se puede eliminar la categoría "${categoryName}" porque tiene ${count} producto(s) activo(s) vinculado(s)`)
    return
  }
  
  if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`)) {
    return
  }
  
  try {
    // Remove from available categories
    availableCategories.value = availableCategories.value.filter(cat => cat !== categoryName)
    
    // Clear selection if this category was selected
    if (productForm.value.category === categoryName) {
      productForm.value.category = ''
    }
    
    success(`Categoría "${categoryName}" eliminada correctamente`)
  } catch (err) {
    error('Error al eliminar la categoría')
  }
}

const addNewCategoryFromManager = () => {
  const categoryName = newCategoryName.value.trim()
  if (!categoryName) {
    error('El nombre de la categoría no puede estar vacío')
    return
  }
  
  if (availableCategories.value.includes(categoryName)) {
    error('Esta categoría ya existe')
    return
  }
  
  availableCategories.value.push(categoryName)
  availableCategories.value.sort()
  success(`Categoría "${categoryName}" agregada correctamente`)
  newCategoryName.value = ''
}

const getCategoryProductCount = (categoryName) => {
  return products.value.filter(p => 
    p.category === categoryName && 
    p.is_active !== false && 
    p.is_active !== null
  ).length
}

const canDeleteCategory = (categoryName) => {
  return getCategoryProductCount(categoryName) === 0
}

const deleteCategory = async (categoryName) => {
  if (!canDeleteCategory(categoryName)) {
    const count = getCategoryProductCount(categoryName)
    error(`No se puede eliminar la categoría "${categoryName}" porque tiene ${count} producto(s) activo(s) vinculado(s)`)
    return
  }
  
  if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`)) {
    return
  }
  
  try {
    // Remove from available categories
    availableCategories.value = availableCategories.value.filter(cat => cat !== categoryName)
    success(`Categoría "${categoryName}" eliminada correctamente`)
    
    // If this category was selected in the product form, clear it
    if (productForm.value.category === categoryName) {
      productForm.value.category = ''
    }
  } catch (err) {
    error('Error al eliminar la categoría')
  }
}

const openCategoryManager = () => {
  showCategoryModal.value = true
  newCategoryName.value = ''
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  newCategoryName.value = ''
}

// Sale Modal Functions
const openSaleModal = (product) => {
  const productId = product._id || product.id
  if (!productId) {
    error('Error: Producto sin ID válido')
    return
  }
  
  currentProductId.value = productId
  
  // Initialize form with current product sale data
  saleForm.value = {
    isOnSale: product.is_on_sale || false,
    discountPercentage: product.discount_percentage || null,
    saleStartDate: product.sale_start_date ? new Date(product.sale_start_date).toISOString().slice(0, 16) : '',
    saleEndDate: product.sale_end_date ? new Date(product.sale_end_date).toISOString().slice(0, 16) : ''
  }
  
  showSaleModal.value = true
}

const closeSaleModal = () => {
  showSaleModal.value = false
  currentProductId.value = null
  saleForm.value = {
    isOnSale: false,
    discountPercentage: null,
    saleStartDate: '',
    saleEndDate: ''
  }
}

const submitSale = async () => {
  // Validate form
  if (saleForm.value.isOnSale) {
    if (!saleForm.value.discountPercentage || saleForm.value.discountPercentage <= 0 || saleForm.value.discountPercentage >= 100) {
      error('El porcentaje de descuento es requerido y debe estar entre 0 y 99.99%')
      return
    }
    
    if (!saleForm.value.saleStartDate || !saleForm.value.saleEndDate) {
      error('Las fechas de inicio y fin de oferta son requeridas')
      return
    }
    
    // Validate dates
    const startDate = new Date(saleForm.value.saleStartDate)
    const endDate = new Date(saleForm.value.saleEndDate)
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      error('Las fechas de oferta no son válidas')
      return
    }
    
    if (startDate >= endDate) {
      error('La fecha de fin de oferta debe ser posterior a la fecha de inicio')
      return
    }
  }
  
  submittingSale.value = true
  try {
    const formData = new FormData()
    formData.append('isOnSale', String(saleForm.value.isOnSale))
    
    if (saleForm.value.isOnSale) {
      // Helper function to format date for API
      const formatDateForAPI = (dateValue) => {
        if (!dateValue || dateValue === '') {
          return ''
        }
        if (typeof dateValue === 'string' && dateValue.includes('T') && (dateValue.includes('Z') || dateValue.includes('+'))) {
          return dateValue
        }
        if (typeof dateValue === 'string' && dateValue.includes('T')) {
          const date = new Date(dateValue)
          if (!isNaN(date.getTime())) {
            return date.toISOString()
          }
        }
        const date = new Date(dateValue)
        if (!isNaN(date.getTime())) {
          return date.toISOString()
        }
        return dateValue
      }
      
      formData.append('discountPercentage', String(saleForm.value.discountPercentage))
      formData.append('saleStartDate', formatDateForAPI(saleForm.value.saleStartDate))
      formData.append('saleEndDate', formatDateForAPI(saleForm.value.saleEndDate))
    } else {
      // If deactivating, clear sale-related fields
      formData.append('discountPercentage', '')
      formData.append('saleStartDate', '')
      formData.append('saleEndDate', '')
    }
    
    const id = parseInt(currentProductId.value)
    if (!id || isNaN(id)) {
      error('Error: ID de producto inválido')
      return
    }
    
    await adminService.updateProduct(id, formData)
    success(saleForm.value.isOnSale ? 'Oferta configurada exitosamente' : 'Oferta desactivada exitosamente')
    await loadProducts()
    closeSaleModal()
  } catch (err) {
    let errorMessage = 'Error al guardar oferta'
    if (err.response?.data?.error) {
      errorMessage = err.response.data.error
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.message) {
      errorMessage = err.message
    }
    error(errorMessage)
    console.error('Error saving sale:', err)
  } finally {
    submittingSale.value = false
  }
}

const loadProducts = async () => {
  loading.value = true
  try {
    const response = await adminService.getAllProducts()
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
    
    products.value = productsArray
  } catch (err) {
    console.error('[AdminProducts] Error loading products:', err);
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
    image: '',
    isFeatured: false,
    isOnSale: false,
    discountPercentage: null,
    saleStartDate: '',
    saleEndDate: ''
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
    image: product.image,
    isFeatured: product.is_featured || false,
    isOnSale: product.is_on_sale || false,
    discountPercentage: product.discount_percentage || null,
    saleStartDate: product.sale_start_date ? new Date(product.sale_start_date).toISOString().slice(0, 16) : '',
    saleEndDate: product.sale_end_date ? new Date(product.sale_end_date).toISOString().slice(0, 16) : ''
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
    // Helper function to format date for API (datetime-local to ISO)
    const formatDateForAPI = (dateValue) => {
      if (!dateValue || dateValue === '') {
        return ''
      }
      // If it's already in ISO format, return as is
      if (typeof dateValue === 'string' && dateValue.includes('T') && (dateValue.includes('Z') || dateValue.includes('+'))) {
        return dateValue
      }
      // If it's in datetime-local format (YYYY-MM-DDTHH:mm), convert to ISO
      if (typeof dateValue === 'string' && dateValue.includes('T')) {
        const date = new Date(dateValue)
        if (!isNaN(date.getTime())) {
          return date.toISOString()
        }
      }
      // Try to parse as date
      const date = new Date(dateValue)
      if (!isNaN(date.getTime())) {
        return date.toISOString()
      }
      return dateValue // Return original if can't parse
    }

    // Crear FormData para enviar archivos
    const formData = new FormData()
    
    // Agregar campos del formulario
    formData.append('name', productForm.value.name)
    formData.append('description', productForm.value.description)
    formData.append('price', String(productForm.value.price))
    formData.append('stock', String(productForm.value.stock))
    formData.append('category', productForm.value.category)
    formData.append('isFeatured', String(productForm.value.isFeatured))
    formData.append('isOnSale', String(productForm.value.isOnSale))
    
    // Agregar campos de oferta si está en oferta
    if (productForm.value.isOnSale) {
      // Validate discount percentage
      if (!productForm.value.discountPercentage || productForm.value.discountPercentage <= 0) {
        throw new Error('El porcentaje de descuento es requerido y debe ser mayor a 0')
      }
      
      // Validate dates
      if (!productForm.value.saleStartDate || !productForm.value.saleEndDate) {
        throw new Error('Las fechas de inicio y fin de oferta son requeridas')
      }
      
      // Format dates to ISO before sending
      const formattedStartDate = formatDateForAPI(productForm.value.saleStartDate)
      const formattedEndDate = formatDateForAPI(productForm.value.saleEndDate)
      
      // Validate that dates are valid
      const startDate = new Date(formattedStartDate)
      const endDate = new Date(formattedEndDate)
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Las fechas de oferta no son válidas')
      }
      if (startDate >= endDate) {
        throw new Error('La fecha de fin de oferta debe ser posterior a la fecha de inicio')
      }
      
      formData.append('discountPercentage', String(productForm.value.discountPercentage))
      formData.append('saleStartDate', formattedStartDate)
      formData.append('saleEndDate', formattedEndDate)
    }
    
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
    // Extract error message from API response if available
    let errorMessage = 'Error al guardar producto'
    if (err.response?.data?.error) {
      errorMessage = err.response.data.error
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.message) {
      errorMessage = err.message
    }
    error(errorMessage)
    console.error('Error saving product:', err)
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

// Helper function to round discount percentage
const roundDiscount = (percentage) => {
  return Math.round(percentage || 0);
};

// Check if product is currently on sale (within date range)
const isProductOnSale = (product) => {
  if (!product.is_on_sale || !product.discount_percentage) {
    return false;
  }
  
  const now = new Date();
  const startDate = product.sale_start_date ? new Date(product.sale_start_date) : null;
  const endDate = product.sale_end_date ? new Date(product.sale_end_date) : null;
  
  if (!startDate || !endDate) {
    return false;
  }
  
  return now >= startDate && now <= endDate;
};

// Toggle featured status
const toggleFeatured = async (productId, currentState) => {
  const id = parseInt(productId);
  if (!id || isNaN(id)) {
    error('Error: ID de producto inválido');
    return;
  }
  
  const newState = !currentState;
  const action = newState ? 'marcar como destacado' : 'quitar de destacados';
  
  if (!confirm(`¿Estás seguro de que quieres ${action} este producto?`)) return;
  
  try {
    const formData = new FormData();
    formData.append('isFeatured', String(newState));
    
    await adminService.updateProduct(id, formData);
    success(newState ? 'Producto marcado como destacado' : 'Producto quitado de destacados');
    await loadProducts();
  } catch (err) {
    error(err.message || 'Error al actualizar estado de destacado');
  }
};

// Toggle on sale status
const toggleOnSale = async (productId, product) => {
  const id = parseInt(productId);
  if (!id || isNaN(id)) {
    error('Error: ID de producto inválido');
    return;
  }
  
  // Check current state - if is_on_sale is true, we're deactivating
  const currentlyOnSale = product.is_on_sale === true;
  const newState = !currentlyOnSale;
  
  // If trying to activate sale, check if product has discount and dates configured
  if (newState) {
    if (!product.discount_percentage || product.discount_percentage <= 0 || product.discount_percentage >= 100) {
      error('Para activar la oferta, primero debes configurar un porcentaje de descuento válido (entre 0 y 99.99%). Por favor, edita el producto primero.');
      return;
    }
    if (!product.sale_start_date || !product.sale_end_date) {
      error('Para activar la oferta, primero debes configurar las fechas de inicio y fin. Por favor, edita el producto primero.');
      return;
    }
  }
  
  const action = newState ? 'activar la oferta' : 'desactivar la oferta';
  
  if (!confirm(`¿Estás seguro de que quieres ${action} para este producto?`)) return;
  
  try {
    const formData = new FormData();
    formData.append('isOnSale', String(newState));
    
    // If deactivating, clear sale-related fields
    if (!newState) {
      formData.append('discountPercentage', '');
      formData.append('saleStartDate', '');
      formData.append('saleEndDate', '');
    } else {
      // If activating, ensure discount and dates are included
      formData.append('discountPercentage', String(product.discount_percentage || 0));
      formData.append('saleStartDate', product.sale_start_date || '');
      formData.append('saleEndDate', product.sale_end_date || '');
    }
    
    await adminService.updateProduct(id, formData);
    success(newState ? 'Oferta activada exitosamente' : 'Oferta desactivada exitosamente');
    await loadProducts();
  } catch (err) {
    // Extract error message from API response if available
    let errorMessage = 'Error al actualizar estado de oferta'
    if (err.response?.data?.error) {
      errorMessage = err.response.data.error
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.message) {
      errorMessage = err.message
    }
    error(errorMessage)
    console.error('Error updating sale status:', err)
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
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
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

.featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #e9ecef;
  color: #6c757d;
  transition: all 0.3s;
}

.featured-badge .badge-icon {
  font-size: 0.75rem;
  color: #6c757d;
}

.featured-active {
  background: #fff3cd;
  color: #856404;
}

.featured-active .badge-icon {
  color: #ffc107;
}

.sale-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #e9ecef;
  color: #6c757d;
  transition: all 0.3s;
}

.sale-badge .badge-icon {
  font-size: 0.75rem;
  color: #6c757d;
}

.sale-active {
  background: #f8d7da;
  color: #721c24;
}

.sale-active .badge-icon {
  color: #dc3545;
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-featured {
  background: #e9ecef;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-featured:hover {
  background: #fff3cd;
  color: #856404;
  border-color: #ffc107;
}

.btn-featured-active {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffc107;
}

.btn-featured-active:hover {
  background: #ffc107;
  color: #856404;
  border-color: #ffc107;
}

.btn-featured .action-icon,
.btn-featured-active .action-icon {
  color: inherit;
}

.btn-sale {
  background: #e9ecef;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-sale:hover {
  background: #f8d7da;
  color: #721c24;
  border-color: #dc3545;
}

.btn-sale-active {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #dc3545;
}

.btn-sale-active:hover {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.btn-sale .action-icon,
.btn-sale-active .action-icon {
  color: inherit;
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
  z-index: var(--z-modal-backdrop);
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: var(--z-modal);
  position: relative;
}

.category-modal {
  max-width: 700px;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #555;
}

.checkbox-label span {
  user-select: none;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #007bff;
}

.sale-fields {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
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
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .header-actions .btn {
    width: 100%;
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
  
  .category-select-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .category-delete-inline {
    width: 100%;
  }
  
  .category-add-input {
    flex-direction: column;
  }
  
  .category-add-input .btn {
    width: 100%;
  }
  
  .new-category-controls {
    flex-direction: column;
  }
  
  .new-category-controls .btn {
    width: 100%;
  }
  
  .category-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .category-delete-btn {
    width: 100%;
  }
}

.category-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-select-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.category-select-row .form-select {
  flex: 1;
}

.category-delete-inline {
  flex-shrink: 0;
}

.new-category-input {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.new-category-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
  font-size: 0.875rem;
}

.new-category-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.new-category-controls input {
  flex: 1;
  margin: 0;
}

.new-category-controls .btn {
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

/* Category Manager Styles */
.category-manager-content {
  padding: 2rem;
}

.category-add-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.category-add-section label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: #555;
}

.category-add-input {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.category-add-input .form-input {
  flex: 1;
}

.categories-list label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #555;
}

.no-categories {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.categories-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s;
}

.category-item:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.category-item.category-has-products {
  background: #e7f3ff;
  border-color: #b3d9ff;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.category-name {
  font-weight: 500;
  color: #333;
  font-size: 1rem;
}

.category-badge-count {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.count-icon {
  font-size: 0.75rem;
}

.category-empty {
  color: #999;
  font-size: 0.875rem;
  font-style: italic;
}

.category-delete-btn {
  opacity: 1;
  transition: all 0.3s;
}

.category-delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.category-delete-btn:disabled:hover {
  background: #dc3545;
  transform: none;
}

.modal-header-icon {
  margin-right: 0.5rem;
  color: #007bff;
}

/* Sale Modal Styles */
.sale-modal {
  max-width: 600px;
}

.sale-form {
  padding: 2rem;
}

.sale-fields {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}
</style> 