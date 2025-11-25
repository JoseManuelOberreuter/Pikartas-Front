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

      <ProductFilters
        :search-term="searchTerm"
        :selected-category="selectedCategory"
        :product-status-filter="productStatusFilter"
        :categories="categories"
        @update:searchTerm="searchTerm = $event"
        @update:selectedCategory="selectedCategory = $event"
        @update:productStatusFilter="productStatusFilter = $event"
      />

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <font-awesome-icon icon="spinner" spin class="loading-icon" />
        <p>Cargando productos...</p>
      </div>

      <!-- Products Table -->
      <ProductTable
        v-else
        :products="filteredProducts"
        :isProductOnSale="isProductOnSale"
        :getFinalPrice="getFinalPrice"
        :formatCLP="formatCLP"
        :roundDiscount="roundDiscount"
        :sort-column="sortColumn"
        :sort-order="sortOrder"
        @update-stock="updateStock"
        @toggle-featured="toggleFeatured"
        @open-sale="openSaleModal"
        @edit="editProduct"
        @delete="deleteProduct"
        @reactivate="reactivateProduct"
        @create-product="openCreateModal"
        @sort="handleSort"
      />

      <!-- Category Manager Modal -->
      <CategoryManager
        :show="showCategoryModal"
        :available-categories="availableCategories"
        :products="products"
        :new-category-name="newCategoryName"
        @update:show="showCategoryModal = $event"
        @close="closeCategoryModal"
        @add-category="handleAddCategoryFromManager"
        @delete-category="handleDeleteCategory"
        @update:newCategoryName="newCategoryName = $event"
      />

      <!-- Sale Form Modal -->
      <SaleForm
        :show="showSaleModal"
        :product="currentProduct"
        :sale-form="saleForm"
        :submitting="submittingSale"
        @update:show="showSaleModal = $event"
        @close="closeSaleModal"
        @submit="submitSale"
        @update:saleForm="saleForm = $event"
      />

      <!-- Product Form Modal -->
      <ProductForm
        :show="showModal"
        :product-form="productForm"
        :is-editing="isEditing"
        :available-categories="availableCategories"
        :new-category-name="newCategoryName"
        :products="products"
        :submitting="submitting"
        @update:show="showModal = $event"
        @close="closeModal"
        @submit="submitProduct"
        @add-category="handleAddCategory"
        @delete-category="handleDeleteCategoryFromForm"
        @update:newCategoryName="newCategoryName = $event"
        @update:productForm="productForm = $event"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminService, productService } from '../services/api'
import { useNotifications } from '../composables/useNotifications'
import { formatCLP } from '../utils/formatters.js'
import ProductFilters from '../components/admin/ProductFilters.vue'
import ProductTable from '../components/admin/ProductTable.vue'
import CategoryManager from '../components/admin/CategoryManager.vue'
import SaleForm from '../components/admin/SaleForm.vue'
import ProductForm from '../components/admin/ProductForm.vue'

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
const currentProductId = ref(null)
const currentProduct = ref(null)
const sortColumn = ref(null)
const sortOrder = ref('asc')

// Form
const productForm = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  image: '',
  isFeatured: false
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
  const activeProducts = products.value.filter(p => p.is_active !== false && p.is_active !== null)
  const cats = [...new Set(activeProducts.map(p => p.category))]
  return cats.sort()
})

const filteredProducts = computed(() => {
  let filtered = products.value.filter(p => {
    if (productStatusFilter.value === 'inactive') {
      return p.is_active === false
    } else {
      const isActive = p.is_active !== false && p.is_active !== null
      return isActive
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

  // Apply sorting
  if (sortColumn.value) {
    filtered = [...filtered].sort((a, b) => {
      let aValue, bValue

      switch (sortColumn.value) {
        case 'name':
          aValue = (a.name || '').toLowerCase()
          bValue = (b.name || '').toLowerCase()
          break
        case 'price':
          aValue = getFinalPrice(a)
          bValue = getFinalPrice(b)
          break
        case 'offer':
          aValue = isProductOnSale(a) ? (a.discount_percentage || 0) : 0
          bValue = isProductOnSale(b) ? (b.discount_percentage || 0) : 0
          break
        case 'stock':
          aValue = a.stock || 0
          bValue = b.stock || 0
          break
        case 'featured':
          aValue = a.is_featured ? 1 : 0
          bValue = b.is_featured ? 1 : 0
          break
        default:
          return 0
      }

      if (typeof aValue === 'string') {
        return sortOrder.value === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortOrder.value === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }
    })
  }

  return filtered
})

// Methods
const loadCategories = async () => {
  try {
    const response = await productService.getCategories()
    if (response.success && response.data) {
      availableCategories.value = response.data
    } else {
      await loadCategoriesFromProducts()
    }
  } catch (err) {
    await loadCategoriesFromProducts()
  }
}

const loadCategoriesFromProducts = async () => {
  try {
    const response = await adminService.getAllProducts()
    let productsArray = []
    
    if (response?.success) {
      if (response.data?.products && Array.isArray(response.data.products)) {
        productsArray = response.data.products
      } else if (Array.isArray(response.data)) {
        productsArray = response.data
      }
    }
    
    if (productsArray.length > 0) {
      const categories = [...new Set(productsArray.map(p => p.category).filter(Boolean))]
      availableCategories.value = categories.sort()
    } else {
      // No hay productos, lista de categorías vacía
      availableCategories.value = []
    }
  } catch (err) {
    console.error('[AdminProducts] Error loading categories from products:', err)
    // En caso de error, retornar lista vacía en lugar de datos hardcodeados
    availableCategories.value = []
    error('Error al cargar categorías. Puedes continuar creando productos sin categorías.')
  }
}

const handleAddCategory = (categoryName) => {
  if (!categoryName || !categoryName.trim()) {
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

const handleAddCategoryFromManager = (categoryName) => {
  if (!categoryName || !categoryName.trim()) {
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

const handleDeleteCategory = (categoryName) => {
  if (!canDeleteCategory(categoryName)) {
    const count = getCategoryProductCount(categoryName)
    error(`No se puede eliminar la categoría "${categoryName}" porque tiene ${count} producto(s) activo(s) vinculado(s)`)
    return
  }
  
  if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`)) {
    return
  }
  
  try {
    availableCategories.value = availableCategories.value.filter(cat => cat !== categoryName)
    success(`Categoría "${categoryName}" eliminada correctamente`)
    
    if (productForm.value.category === categoryName) {
      productForm.value.category = ''
    }
  } catch (err) {
    error('Error al eliminar la categoría')
  }
}

const handleDeleteCategoryFromForm = (categoryName) => {
  if (!canDeleteCategory(categoryName)) {
    const count = getCategoryProductCount(categoryName)
    error(`No se puede eliminar la categoría "${categoryName}" porque tiene ${count} producto(s) activo(s) vinculado(s)`)
    return
  }
  
  if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`)) {
    return
  }
  
  try {
    availableCategories.value = availableCategories.value.filter(cat => cat !== categoryName)
    
    if (productForm.value.category === categoryName) {
      productForm.value.category = ''
    }
    
    success(`Categoría "${categoryName}" eliminada correctamente`)
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
  currentProduct.value = product
  
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
  currentProduct.value = null
  saleForm.value = {
    isOnSale: false,
    discountPercentage: null,
    saleStartDate: '',
    saleEndDate: ''
  }
}

const submitSale = async (formData) => {
  if (formData.isOnSale) {
    if (!formData.discountPercentage || formData.discountPercentage <= 0 || formData.discountPercentage >= 100) {
      error('El porcentaje de descuento es requerido y debe estar entre 0 y 99.99%')
      return
    }
    
    if (!formData.saleStartDate || !formData.saleEndDate) {
      error('Las fechas de inicio y fin de oferta son requeridas')
      return
    }
    
    const startDate = new Date(formData.saleStartDate)
    const endDate = new Date(formData.saleEndDate)
    
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
    const formDataToSend = new FormData()
    formDataToSend.append('isOnSale', String(formData.isOnSale))
    
    if (formData.isOnSale) {
      const formatDateForAPI = (dateValue) => {
        if (!dateValue || dateValue === '') return ''
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
      
      formDataToSend.append('discountPercentage', String(formData.discountPercentage))
      formDataToSend.append('saleStartDate', formatDateForAPI(formData.saleStartDate))
      formDataToSend.append('saleEndDate', formatDateForAPI(formData.saleEndDate))
    } else {
      formDataToSend.append('discountPercentage', '')
      formDataToSend.append('saleStartDate', '')
      formDataToSend.append('saleEndDate', '')
    }
    
    const id = parseInt(currentProductId.value)
    if (!id || isNaN(id)) {
      error('Error: ID de producto inválido')
      return
    }
    
    await adminService.updateProduct(id, formDataToSend)
    success(formData.isOnSale ? 'Oferta configurada exitosamente' : 'Oferta desactivada exitosamente')
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
    let productsArray = []
    
    if (response?.success) {
      if (response.data?.products && Array.isArray(response.data.products)) {
        productsArray = response.data.products
      } else if (Array.isArray(response.data)) {
        productsArray = response.data
      }
    }
    
    products.value = productsArray
  } catch (err) {
    console.error('[AdminProducts] Error loading products:', err)
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
    image: '',
    isFeatured: false
  }
  newCategoryName.value = ''
  showModal.value = true
}

const editProduct = (product) => {
  const productId = product._id || product.id
  if (!productId) {
    error('Error: Producto sin ID válido')
    return
  }
  
  isEditing.value = true
  
  productForm.value = {
    _id: productId,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    image: product.image,
    isFeatured: product.is_featured || false
  }
  
  newCategoryName.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  newCategoryName.value = ''
}

const submitProduct = async (formData) => {
  submitting.value = true
  try {
    const formDataToSend = new FormData()
    
    formDataToSend.append('name', formData.name)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('price', String(formData.price))
    formDataToSend.append('stock', String(formData.stock))
    formDataToSend.append('category', formData.category)
    formDataToSend.append('isFeatured', String(formData.isFeatured))
    
    if (formData.selectedImage) {
      formDataToSend.append('image', formData.selectedImage)
    } else if (formData.image && !isEditing.value) {
      formDataToSend.append('image', formData.image)
    }
    
    if (isEditing.value) {
      if (!formData._id) {
        throw new Error('ID de producto no encontrado')
      }
      
      await adminService.updateProduct(formData._id, formDataToSend)
      success('Producto actualizado correctamente')
    } else {
      await adminService.createProduct(formDataToSend)
      success('Producto creado correctamente')
    }
    
    await loadProducts()
    closeModal()
  } catch (err) {
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
    if (!productId) {
      error('Error: ID de producto inválido')
      return
    }
    
    // Validate and parse stock value
    const stockValue = parseInt(newStock)
    if (isNaN(stockValue) || stockValue < 0) {
      error('El stock debe ser un número válido mayor o igual a 0')
      await loadProducts() // Reload to reset the input value
      return
    }
    
    await adminService.updateProductStock(productId, stockValue)
    
    success('Stock actualizado')
    await loadProducts()
  } catch (err) {
    const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Error al actualizar stock'
    error(errorMessage)
    await loadProducts() // Reload to reset the input value on error
  }
}

const deleteProduct = async (productId) => {
  const id = parseInt(productId)
  if (!id || isNaN(id)) {
    error('Error: ID de producto inválido')
    return
  }
  
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return
  
  try {
    await adminService.deleteProduct(id)
    success('Producto eliminado')
    await loadProducts()
  } catch (err) {
    error(err.message || 'Error al eliminar producto')
  }
}

const reactivateProduct = async (productId) => {
  const id = parseInt(productId)
  if (!id || isNaN(id)) {
    error('Error: ID de producto inválido')
    return
  }
  
  if (!confirm('¿Estás seguro de que quieres reactivar este producto?')) return
  
  try {
    const formData = new FormData()
    formData.append('is_active', 'true')
    
    await adminService.updateProduct(id, formData)
    success('Producto reactivado exitosamente')
    await loadProducts()
  } catch (err) {
    error(err.message || 'Error al reactivar producto')
  }
}

// Helper functions
const roundDiscount = (percentage) => {
  return Math.round(percentage || 0)
}

const isProductOnSale = (product) => {
  if (!product.is_on_sale || !product.discount_percentage) {
    return false
  }
  
  const now = new Date()
  const startDate = product.sale_start_date ? new Date(product.sale_start_date) : null
  const endDate = product.sale_end_date ? new Date(product.sale_end_date) : null
  
  if (!startDate || !endDate) {
    return false
  }
  
  return now >= startDate && now <= endDate
}

const getFinalPrice = (product) => {
  if (isProductOnSale(product) && product.discount_percentage) {
    const discount = product.discount_percentage / 100
    return product.price * (1 - discount)
  }
  return product.price
}

const toggleFeatured = async (productId, currentState) => {
  const id = parseInt(productId)
  if (!id || isNaN(id)) {
    error('Error: ID de producto inválido')
    return
  }
  
  const newState = !currentState
  const action = newState ? 'marcar como destacado' : 'quitar de destacados'
  
  if (!confirm(`¿Estás seguro de que quieres ${action} este producto?`)) return
  
  try {
    const formData = new FormData()
    formData.append('isFeatured', String(newState))
    
    await adminService.updateProduct(id, formData)
    success(newState ? 'Producto marcado como destacado' : 'Producto quitado de destacados')
    await loadProducts()
  } catch (err) {
    error(err.message || 'Error al actualizar estado de destacado')
  }
}

const handleSort = (column) => {
  if (sortColumn.value === column) {
    // Toggle order if same column
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // New column, default to ascending
    sortColumn.value = column
    sortOrder.value = 'asc'
  }
}

// Lifecycle
onMounted(async () => {
  await loadProducts()
  await loadCategories()
})
</script>

<style scoped>
.admin-products {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: var(--color-gray-100);
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
  gap: var(--spacing-lg);
}

.header-actions {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}

.products-header h1 {
  margin: 0;
  font-size: var(--font-size-3xl);
  color: var(--color-gray-700);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.header-icon {
  color: var(--color-admin-products);
  font-size: 1.2em;
  transition: all var(--transition-normal);
}

.products-header:hover .header-icon {
  transform: scale(1.1) rotate(5deg);
}

.loading {
  text-align: center;
  padding: var(--spacing-6xl);
}

.loading-icon {
  font-size: var(--font-size-4xl);
  color: var(--color-admin-products);
  margin: 0 auto var(--spacing-lg);
  display: block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .products-header {
    flex-direction: column;
    gap: var(--spacing-lg);
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .header-actions .btn {
    width: 100%;
  }
}
</style>
