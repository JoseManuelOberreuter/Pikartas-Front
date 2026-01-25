<template>
  <div class="user-orders">
    <!-- Logo Section - Matching Home Hero Style -->
    <div class="hero-logo">
      <img src="@/assets/img/logo.png" alt="Pikartas Logo" class="logo-image" />
    </div>

    <div class="container">
      <div class="orders-header">
        <h1>
          <font-awesome-icon icon="box" class="header-icon" />
          Mis Pedidos
        </h1>
        <button 
          @click="refreshOrders" 
          class="btn-refresh"
          :disabled="loading || refreshing"
          :title="refreshing ? 'Actualizando...' : 'Actualizar pedidos'"
        >
          <font-awesome-icon 
            :icon="refreshing ? 'spinner' : 'sync-alt'" 
            :spin="refreshing"
            class="refresh-icon"
          />
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <font-awesome-icon icon="spinner" spin class="loading-icon" />
        <p>Cargando tus pedidos...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="empty-state">
        <div class="empty-icon">
          <font-awesome-icon icon="box" class="empty-icon-svg" />
        </div>
        <h2>No tienes pedidos aún</h2>
        <p>Cuando realices tu primera compra, aparecerá aquí</p>
        <div class="empty-actions">
          <router-link to="/shop" class="btn btn-primary">
            <font-awesome-icon icon="store" class="btn-icon" />
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
            :key="order.id || order._id" 
            class="order-card"
          >
            <div class="order-header">
              <div class="order-info">
                <h3>Pedido #{{ getOrderNumber(order.id || order._id, order.orderNumber) }}</h3>
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
                  :key="item.id || item._id"
                  class="order-item"
                >
                  <img 
                    :src="item.product?.image || '/placeholder.jpg'" 
                    :alt="item.product?.name || item.productName"
                    @error="handleImageError"
                  />
                  <div class="item-info">
                    <h4>{{ item.product?.name || item.productName }}</h4>
                    <p>Cantidad: {{ item.quantity }}</p>
                    <p class="item-price">${{ formatPrice(item.price) }}</p>
                  </div>
                </div>
              </div>

              <div class="order-summary">
                <div v-if="order.shippingCost > 0" class="summary-line">
                  <span>Envío:</span>
                  <span>${{ formatPrice(order.shippingCost) }}</span>
                </div>
                <hr v-if="order.shippingCost > 0" class="summary-divider">
                <div class="summary-line total-line">
                  <span>Total:</span>
                  <span class="total-amount">${{ formatPrice(order.totalAmount) }}</span>
                </div>
              </div>
            </div>

            <div class="order-actions">
              <button 
                v-if="canCancelOrder(order)" 
                @click="cancelOrder(order.id || order._id)" 
                class="btn btn-danger"
                :disabled="cancellingOrder === (order.id || order._id)"
              >
                {{ cancellingOrder === (order.id || order._id) ? 'Cancelando...' : 'Cancelar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredOrdersCount"
          :items-per-page="itemsPerPage"
          item-label="pedidos"
          @page-change="currentPage = $event"
        />
      </div>

      <!-- Help Banner -->
      <div class="help-banner">
        <div class="help-banner-content">
          <div class="help-banner-icon">
            <font-awesome-icon icon="question-circle" />
          </div>
          <div class="help-banner-text">
            <h3>¿Tienes problemas con tu pedido?</h3>
            <p>Contáctanos y te ayudaremos lo antes posible</p>
          </div>
          <router-link to="/contact" class="btn btn-primary help-banner-btn">
            <font-awesome-icon icon="envelope" />
            Contactar
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNotifications } from '../composables/useNotifications'
import { orderService } from '../services/api.js'
import { formatCLP } from '../utils/formatters.js'
import Pagination from '../components/admin/Pagination.vue'

const { success, error } = useNotifications()
const route = useRoute()

// Reactive data
const orders = ref([])
const loading = ref(false)
const refreshing = ref(false)
const activeFilter = ref('all')
const cancellingOrder = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

// Flag to prevent multiple simultaneous loads
let isLoadingInProgress = false
let hasLoadedOnMount = false

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

  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const filteredOrdersCount = computed(() => {
  if (activeFilter.value === 'all') return orders.value.length
  return orders.value.filter(order => order.status === activeFilter.value).length
})

const totalPages = computed(() => {
  return Math.ceil(filteredOrdersCount.value / itemsPerPage)
})

// Watch for filter changes to reset pagination
watch(activeFilter, () => {
  currentPage.value = 1
})

// Methods
const loadOrders = async (showLoading = true) => {
  if (isLoadingInProgress) return

  isLoadingInProgress = true
  
  if (showLoading) {
    loading.value = true
  } else {
    refreshing.value = true
  }

  try {
    const response = await orderService.getUserOrders()
    
    let newOrders = []
    if (response?.data?.orders && Array.isArray(response.data.orders)) {
      newOrders = response.data.orders
    } else if (response?.orders && Array.isArray(response.orders)) {
      newOrders = response.orders
    } else if (response?.data && Array.isArray(response.data)) {
      newOrders = response.data
    } else if (Array.isArray(response)) {
      newOrders = response
    }

    orders.value = newOrders
  } catch (err) {
    if (showLoading) {
      error('Error al cargar tus pedidos. Por favor, intenta de nuevo.')
      orders.value = []
    }
  } finally {
    loading.value = false
    refreshing.value = false
    isLoadingInProgress = false
  }
}

const refreshOrders = async () => {
  await loadOrders(false)
  success('Pedidos actualizados')
}

const getOrdersByStatus = (status) => {
  if (!Array.isArray(orders.value)) return []
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

const canCancelOrder = (order) => {
  return ['pending', 'processing'].includes(order.status)
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
    error('Error al cancelar el pedido. Por favor, intenta de nuevo.')
  } finally {
    cancellingOrder.value = null
  }
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
    return 'Fecha inválida'
  }
}

const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return '0'
  return formatCLP(price)
}

const getOrderNumber = (orderId, orderNumber) => {
  if (orderNumber) return orderNumber
  if (orderId) {
    if (typeof orderId === 'number') {
      return orderId.toString()
    }
    return orderId.toString().slice(-8)
  }
  return 'N/A'
}

const handleImageError = (event) => {
  event.target.src = '/placeholder.jpg'
}

// Watch route changes
watch(() => route.path, (newPath, oldPath) => {
  if (newPath === '/orders' && oldPath && oldPath !== newPath && hasLoadedOnMount && !isLoadingInProgress) {
    loadOrders()
  }
}, { immediate: false })

// Lifecycle
onMounted(() => {
  if (!isLoadingInProgress) {
    loadOrders().then(() => {
      hasLoadedOnMount = true
    }).catch(() => {
      hasLoadedOnMount = true
    })
  } else {
    hasLoadedOnMount = true
  }
})

onActivated(() => {
  if (hasLoadedOnMount && !isLoadingInProgress) {
    loadOrders()
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.user-orders {
  position: relative;
  padding-top: calc(var(--header-height) + 8rem);
  padding-bottom: 80px;
  min-height: 100vh;
  background: var(--color-black);
  color: var(--color-white);
}

/* Logo Section - Same as Hero */
.hero-logo {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  animation: fadeInDown 1s ease-out;
  filter: drop-shadow(0 12px 40px rgba(0, 0, 0, 0.8));
  transition: transform 0.3s ease;
}

.hero-logo:hover {
  transform: translateX(-50%) scale(1.05);
}

.logo-image {
  height: 180px;
  width: auto;
  object-fit: contain;
  display: block;
}

.orders-header {
  text-align: center;
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.orders-header h1 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  margin: 0 0 0.5rem 0;
  color: var(--color-white);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-refresh {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-white);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-refresh:hover:not(:disabled) {
  background: var(--color-white);
  border-color: var(--color-white);
  color: var(--color-black);
  transform: rotate(180deg);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  font-size: 1.125rem;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-white);
}

.loading-state p {
  color: rgba(255, 255, 255, 0.8);
}

.loading-icon {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin: 0 auto 1rem;
  display: block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 4rem 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon-svg {
  color: var(--icon-orders-empty);
  font-size: 1em;
  transition: all var(--transition-normal);
}

.empty-state h2 {
  margin: 0 0 1rem 0;
  color: var(--color-white);
  font-size: 1.75rem;
}

.empty-state p {
  margin: 0 0 2rem 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.empty-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-white);
}

.tab:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
}

.tab.active {
  background: var(--color-white);
  color: var(--color-black);
  border-color: var(--color-white);
}

.count {
  font-size: 0.875rem;
  opacity: 0.8;
}

.orders-grid {
  display: grid;
  gap: 1rem;
}

.order-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.25rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border-color: var(--color-primary);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.order-info h3 {
  margin: 0 0 0.25rem 0;
  color: var(--color-white);
  font-size: 1.125rem;
  font-weight: 600;
}

.order-date {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8125rem;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid;
}

.status-pending { background: rgba(255, 193, 7, 0.2); color: var(--color-warning); border-color: var(--color-warning); }
.status-processing { background: rgba(59, 130, 246, 0.2); color: #3b82f6; border-color: #3b82f6; }
.status-shipped { background: rgba(16, 185, 129, 0.2); color: #10b981; border-color: #10b981; }
.status-delivered { background: rgba(16, 185, 129, 0.2); color: #10b981; border-color: #10b981; }
.status-cancelled { background: rgba(220, 53, 69, 0.2); color: var(--color-error); border-color: var(--color-error); }

.order-details {
  margin-bottom: 1rem;
}

.order-items {
  margin-bottom: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.order-item:last-child {
  border-bottom: none;
}

.order-item img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 0.125rem 0;
  color: var(--color-white);
  font-size: 0.9375rem;
  font-weight: 600;
}

.item-info p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8125rem;
}

.item-price {
  font-weight: 600;
  color: var(--color-primary);
}

.order-summary {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-white);
}

.summary-divider {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin: 0.5rem 0;
}

.total-line {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0;
  color: var(--color-white);
}

.total-amount {
  color: var(--color-primary);
  font-size: 1.125rem;
}

.order-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.btn-outline {
  background: transparent;
  color: var(--color-gray-600);
  border-color: var(--color-gray-300);
}

.btn-outline:hover:not(:disabled) {
  background: var(--color-gray-100);
  color: var(--color-gray-800);
  border-color: var(--color-gray-400);
}

.btn-danger {
  background: transparent;
  color: var(--color-error);
  border: 2px solid var(--color-error);
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.btn-danger:hover:not(:disabled) {
  background: var(--color-error);
  color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-white);
  color: var(--color-black);
  border: 2px solid var(--color-white);
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.btn-primary:hover:not(:disabled) {
  background: transparent;
  color: var(--color-white);
  border-color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.help-banner {
  margin-top: var(--spacing-3xl);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-2xl);
  padding: var(--spacing-3xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.help-banner-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-2xl);
  flex-wrap: wrap;
}

.help-banner-icon {
  font-size: var(--font-size-4xl);
  color: var(--color-white);
  opacity: 0.9;
}

.help-banner-text {
  flex: 1;
  min-width: 200px;
}

.help-banner-text h3 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-white);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.help-banner-text p {
  margin: 0;
  color: var(--color-white);
  opacity: 0.9;
  font-size: var(--font-size-base);
}

.help-banner-btn {
  background: var(--color-white);
  color: var(--color-black);
  border: 2px solid var(--color-white);
  border-radius: 50px;
  font-weight: var(--font-weight-semibold);
  padding: 1rem 2rem;
  white-space: nowrap;
  font-size: var(--font-size-lg);
}

.help-banner-btn:hover {
  background: transparent;
  color: var(--color-white);
  border-color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .orders-header {
    padding: 1.5rem;
  }

  .orders-header h1 {
    font-size: 2rem;
    padding-right: 3rem;
  }

  .btn-refresh {
    top: 1.5rem;
    right: 1.5rem;
    padding: 0.625rem;
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

  .help-banner {
    margin-top: var(--spacing-3xl);
    padding: var(--spacing-2xl);
  }

  .help-banner-content {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-lg);
  }

  .help-banner-icon {
    font-size: var(--font-size-3xl);
  }

  .help-banner-text h3 {
    font-size: var(--font-size-xl);
  }

  .help-banner-text p {
    font-size: var(--font-size-sm);
  }

  .help-banner-btn {
    width: 100%;
  }
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
