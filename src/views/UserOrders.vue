<template>
  <div class="user-orders">
    <div class="container">
      <div class="orders-header">
        <h1>📦 Mis Pedidos</h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando tus pedidos...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h2>No tienes pedidos aún</h2>
        <p>Cuando realices tu primera compra, aparecerá aquí</p>
        <div class="empty-actions">
          <router-link to="/shop" class="btn btn-primary">
            Ir a la Tienda
          </router-link>
        </div>
      </div>

      <!-- Orders List -->
      <div v-else class="orders-content">
        <!-- Filter Tabs -->
        <div class="filter-tabs">
          <button 
            v-for="status in statusFilters" 
            :key="status.value"
            @click="activeFilter = status.value"
            :class="['tab', { active: activeFilter === status.value }]"
          >
            {{ status.label }}
            <span class="count">({{ getOrdersByStatus(status.value).length }})</span>
          </button>
        </div>

        <!-- Orders Grid -->
        <div class="orders-grid">
          <div 
            v-for="order in filteredOrders" 
            :key="order._id" 
            class="order-card"
          >
            <div class="order-header">
              <div class="order-info">
                <h3>Pedido #{{ getOrderNumber(order._id) }}</h3>
                <p class="order-date">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="order-status">
                <span :class="['status-badge', `status-${order.status}`]">
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
            </div>

            <div class="order-details">
              <div class="order-items">
                <div 
                  v-for="item in order.items" 
                  :key="item._id" 
                  class="order-item"
                >
                  <img 
                    :src="getProductImage(item.product)" 
                    :alt="getProductName(item.product)"
                    @error="handleImageError"
                  />
                  <div class="item-info">
                    <h4>{{ getProductName(item.product) }}</h4>
                    <p>Cantidad: {{ item.quantity }}</p>
                    <p class="item-price">${{ formatPrice(item.price) }}</p>
                  </div>
                </div>
              </div>

              <div class="order-summary">
                <div class="summary-line">
                  <span>Subtotal:</span>
                  <span>${{ formatPrice(order.subtotal) }}</span>
                </div>
                <div class="summary-line">
                  <span>Envío:</span>
                  <span v-if="order.shippingCost > 0">${{ formatPrice(order.shippingCost) }}</span>
                  <span v-else class="free-shipping">Gratis</span>
                </div>
                <div class="summary-line">
                  <span>Impuestos:</span>
                  <span>${{ formatPrice(order.tax) }}</span>
                </div>
                <hr class="summary-divider">
                <div class="summary-line total-line">
                  <span>Total:</span>
                  <span class="total-amount">${{ formatPrice(order.totalAmount) }}</span>
                </div>
              </div>
            </div>

            <div class="order-actions">
              <button 
                @click="viewOrderDetails(order)" 
                class="btn btn-outline"
              >
                Ver Detalles
              </button>
              <button 
                v-if="canCancelOrder(order)" 
                @click="cancelOrder(order._id)" 
                class="btn btn-danger"
                :disabled="cancellingOrder === order._id"
              >
                {{ cancellingOrder === order._id ? 'Cancelando...' : 'Cancelar' }}
              </button>
              <button 
                v-if="canTrackOrder(order)" 
                @click="trackOrder(order)" 
                class="btn btn-primary"
              >
                Rastrear
              </button>
            </div>

            <!-- Payment Info -->
            <div v-if="order.paymentInfo" class="payment-info">
              <div class="payment-status">
                <span class="payment-icon">💳</span>
                <span>Pago: {{ getPaymentStatusLabel(order.paymentInfo.status) }}</span>
              </div>
              <div v-if="order.paymentInfo.authorizationCode" class="auth-code">
                <span>Código: {{ order.paymentInfo.authorizationCode }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            @click="goToPage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="btn btn-outline"
          >
            ← Anterior
          </button>
          <span class="page-info">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
          <button 
            @click="goToPage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="btn btn-outline"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="modal-overlay" @click="closeOrderDetails">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Detalles del Pedido #{{ getOrderNumber(selectedOrder._id) }}</h2>
          <button @click="closeOrderDetails" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="order-details-modal">
            <div class="detail-section">
              <h3>Información del Pedido</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Número:</span>
                  <span class="value">#{{ getOrderNumber(selectedOrder._id) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Fecha:</span>
                  <span class="value">{{ formatDate(selectedOrder.createdAt) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Estado:</span>
                  <span :class="['status-badge', `status-${selectedOrder.status}`]">
                    {{ getStatusLabel(selectedOrder.status) }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="label">Total:</span>
                  <span class="value total">${{ formatPrice(selectedOrder.totalAmount) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>Productos</h3>
              <div class="products-list">
                <div 
                  v-for="item in selectedOrder.items" 
                  :key="item._id" 
                  class="product-item"
                >
                  <img 
                    :src="getProductImage(item.product)" 
                    :alt="getProductName(item.product)"
                    @error="handleImageError"
                  />
                  <div class="product-info">
                    <h4>{{ getProductName(item.product) }}</h4>
                    <p>Cantidad: {{ item.quantity }}</p>
                    <p class="price">${{ formatPrice(item.price) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedOrder.paymentInfo" class="detail-section">
              <h3>Información de Pago</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Estado:</span>
                  <span class="value">{{ getPaymentStatusLabel(selectedOrder.paymentInfo.status) }}</span>
                </div>
                <div v-if="selectedOrder.paymentInfo.authorizationCode" class="detail-item">
                  <span class="label">Código de Autorización:</span>
                  <span class="value">{{ selectedOrder.paymentInfo.authorizationCode }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useNotifications } from '../composables/useNotifications'
import { orderService } from '../services/api.js'

const { success, error } = useNotifications()

// Reactive data
const orders = ref([])
const loading = ref(true)
const activeFilter = ref('all')
const selectedOrder = ref(null)
const cancellingOrder = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

// Status filters
const statusFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'processing', label: 'Procesando' },
  { value: 'shipped', label: 'Enviados' },
  { value: 'delivered', label: 'Entregados' },
  { value: 'cancelled', label: 'Cancelados' }
]

// Computed properties
const filteredOrders = computed(() => {
  let filtered = orders.value

  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(order => order.status === activeFilter.value)
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  let filtered = orders.value
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(order => order.status === activeFilter.value)
  }
  return Math.ceil(filtered.length / itemsPerPage)
})

// Watch for filter changes to reset pagination
watch(activeFilter, () => {
  currentPage.value = 1
})

// Methods
const loadOrders = async () => {
  loading.value = true
  try {
    const response = await orderService.getUserOrders()
    
    // Handle different response structures
    if (response?.data && Array.isArray(response.data)) {
      orders.value = response.data
    } else if (Array.isArray(response)) {
      orders.value = response
    } else {
      orders.value = []
    }
  } catch (err) {
    console.error('Error loading orders:', err)
    error('Error al cargar tus pedidos. Por favor, intenta de nuevo.')
    orders.value = []
  } finally {
    loading.value = false
  }
}

const getOrdersByStatus = (status) => {
  if (!Array.isArray(orders.value)) {
    return []
  }
  if (status === 'all') return orders.value
  return orders.value.filter(order => order.status === status)
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

const getPaymentStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado'
  }
  return labels[status] || status
}

const canCancelOrder = (order) => {
  return ['pending', 'processing'].includes(order.status)
}

const canTrackOrder = (order) => {
  return ['shipped', 'delivered'].includes(order.status)
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
}

const closeOrderDetails = () => {
  selectedOrder.value = null
}

const cancelOrder = async (orderId) => {
  if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
    return
  }

  cancellingOrder.value = orderId
  try {
    await orderService.cancelOrder(orderId)
    success('Pedido cancelado exitosamente')
    await loadOrders()
  } catch (err) {
    console.error('Error cancelling order:', err)
    error('Error al cancelar el pedido. Por favor, intenta de nuevo.')
  } finally {
    cancellingOrder.value = null
  }
}

const trackOrder = (order) => {
  // TODO: Implement order tracking functionality
  alert(`Funcionalidad de rastreo para el pedido #${getOrderNumber(order._id)} estará disponible próximamente.`)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible'
  
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (err) {
    console.error('Error formatting date:', err)
    return 'Fecha inválida'
  }
}

const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return '0.00'
  return price.toFixed(2)
}

const getOrderNumber = (orderId) => {
  if (!orderId) return 'N/A'
  return orderId.slice(-8)
}

const getProductName = (product) => {
  return product?.name || 'Producto no disponible'
}

const getProductImage = (product) => {
  return product?.image || '/placeholder.jpg'
}

const handleImageError = (event) => {
  event.target.src = '/placeholder.jpg'
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Lifecycle
onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.user-orders {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: #f8f9fa;
}

.orders-header {
  text-align: center;
  margin-bottom: 1rem;
}

.orders-header h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  color: #333;
  font-weight: 700;
}

.orders-header p {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
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

.empty-state {
  text-align: center;
  background: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h2 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.75rem;
}

.empty-state p {
  margin: 0 0 2rem 0;
  color: #666;
  font-size: 1.1rem;
}

.empty-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab:hover {
  background: #f8f9fa;
}

.tab.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.count {
  font-size: 0.875rem;
  opacity: 0.8;
}

.orders-grid {
  display: grid;
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.order-card:hover {
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.order-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.25rem;
}

.order-date {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-processing {
  background: #d1ecf1;
  color: #0c5460;
}

.status-shipped {
  background: #d4edda;
  color: #155724;
}

.status-delivered {
  background: #d1ecf1;
  color: #0c5460;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-details {
  margin-bottom: 1.5rem;
}

.order-items {
  margin-bottom: 1.5rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1rem;
}

.item-info p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.item-price {
  font-weight: 600;
  color: #28a745;
}

.order-summary {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.free-shipping {
  color: #28a745;
  font-weight: 600;
}

.summary-divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 0.75rem 0;
}

.total-line {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0;
}

.total-amount {
  color: #007bff;
  font-size: 1.25rem;
}

.order-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.payment-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.payment-icon {
  font-size: 1rem;
}

.auth-code {
  font-size: 0.8rem;
  color: #666;
  font-family: monospace;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-info {
  color: #666;
  font-size: 0.9rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 1rem;
  display: inline-block;
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
}

.btn-outline {
  background: transparent;
  color: #6c757d;
  border-color: #6c757d;
}

.btn-outline:hover:not(:disabled) {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
  border-color: #c82333;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
  border-color: #545b62;
}

/* Modal */
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
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
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

.modal-body {
  padding: 1.5rem;
}

.order-details-modal {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.25rem;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.detail-grid {
  display: grid;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #333;
}

.value.total {
  font-weight: 700;
  color: #007bff;
  font-size: 1.1rem;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.product-item img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1rem;
}

.product-info p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.product-info .price {
  font-weight: 600;
  color: #28a745;
}

/* Responsive Design */
@media (max-width: 768px) {
  .orders-header h1 {
    font-size: 2rem;
  }
  
  .filter-tabs {
    flex-direction: column;
  }
  
  .order-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .order-actions {
    flex-direction: column;
  }
  
  .payment-info {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .product-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
