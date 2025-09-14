<template>
  <div class="admin-orders">
    <div class="container">
      <div class="orders-header">
        <h1>📋 Gestión de Órdenes</h1>
        <div class="header-actions">
          <router-link to="/admin" class="btn btn-outline">
            ← Volver al Dashboard
          </router-link>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" v-if="stats">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <h3>{{ stats.totalOrders || 0 }}</h3>
            <p>Total Órdenes</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <h3>{{ stats.pendingOrders || 0 }}</h3>
            <p>Pendientes</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <h3>{{ stats.completedOrders || 0 }}</h3>
            <p>Completadas</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>${{ stats.totalRevenue || 0 }}</h3>
            <p>Ingresos Totales</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💳</div>
          <div class="stat-info">
            <h3>{{ stats.paidOrders || 0 }}</h3>
            <p>Pagadas</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔄</div>
          <div class="stat-info">
            <h3>{{ stats.refundedOrders || 0 }}</h3>
            <p>Reembolsadas</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <label>Estado:</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="processing">Procesando</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Pago:</label>
          <select v-model="selectedPaymentStatus" class="filter-select">
            <option value="">Todos los pagos</option>
            <option value="pending">Pendiente</option>
            <option value="paid">Pagado</option>
            <option value="failed">Fallido</option>
            <option value="refunded">Reembolsado</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Buscar:</label>
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="ID de orden, email del cliente..." 
            class="filter-input"
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando órdenes...</p>
      </div>

      <!-- Orders Table -->
      <div v-else class="orders-table">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order._id">
                <td>
                  <span class="order-id">#{{ order._id?.slice(-8) }}</span>
                </td>
                <td>
                  <div class="customer-info">
                    <h4>{{ order.customerName || 'Cliente' }}</h4>
                    <p>{{ order.customerEmail || 'No disponible' }}</p>
                  </div>
                </td>
                <td>
                  <span class="order-date">{{ formatDate(order.createdAt) }}</span>
                </td>
                <td>
                  <span class="order-total">${{ order.totalAmount }}</span>
                </td>
                <td>
                  <select 
                    :value="order.status" 
                    @change="updateOrderStatus(order._id, $event.target.value)"
                    class="status-select"
                    :class="`status-${order.status}`"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="processing">Procesando</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </td>
                <td>
                  <div class="payment-status">
                    <span 
                      class="payment-badge" 
                      :class="`payment-${order.paymentStatus || 'pending'}`"
                    >
                      {{ getPaymentStatusLabel(order.paymentStatus) }}
                    </span>
                    <div v-if="order.paymentStatus === 'paid'" class="payment-details">
                      <small v-if="order.authorizationCode">
                        Auth: {{ order.authorizationCode }}
                      </small>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="actions">
                    <button @click="viewOrderDetails(order)" class="btn btn-sm btn-outline">
                      👁️ Ver
                    </button>
                    <button 
                      v-if="order.paymentStatus === 'paid' && order.status !== 'cancelled'"
                      @click="refundOrder(order)" 
                      class="btn btn-sm btn-warning"
                      :disabled="refundingOrder === order._id"
                    >
                      {{ refundingOrder === order._id ? '⏳' : '🔄' }} Reembolsar
                    </button>
                    <button 
                      @click="checkPaymentStatus(order)" 
                      class="btn btn-sm btn-info"
                      :disabled="checkingPayment === order._id"
                    >
                      {{ checkingPayment === order._id ? '⏳' : '💳' }} Estado Pago
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="filteredOrders.length === 0" class="no-orders">
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>No hay órdenes</h3>
            <p>No se encontraron órdenes con los filtros seleccionados</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="modal-overlay" @click="closeOrderDetails">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Detalles de la Orden #{{ selectedOrder._id?.slice(-8) }}</h2>
          <button @click="closeOrderDetails" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <!-- Order Info -->
          <div class="order-info-section">
            <h3>Información de la Orden</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>ID de Orden:</label>
                <span>{{ selectedOrder._id }}</span>
              </div>
              <div class="info-item">
                <label>Fecha de Creación:</label>
                <span>{{ formatDate(selectedOrder.createdAt) }}</span>
              </div>
              <div class="info-item">
                <label>Estado:</label>
                <span class="status-badge" :class="`status-${selectedOrder.status}`">
                  {{ getStatusLabel(selectedOrder.status) }}
                </span>
              </div>
              <div class="info-item">
                <label>Total:</label>
                <span class="amount">${{ selectedOrder.totalAmount }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="customer-info-section">
            <h3>Información del Cliente</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Nombre:</label>
                <span>{{ selectedOrder.customerName || 'No disponible' }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ selectedOrder.customerEmail || 'No disponible' }}</span>
              </div>
              <div class="info-item">
                <label>Teléfono:</label>
                <span>{{ selectedOrder.customerPhone || 'No disponible' }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Info -->
          <div class="payment-info-section">
            <h3>Información de Pago</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Estado del Pago:</label>
                <span class="payment-badge" :class="`payment-${selectedOrder.paymentStatus || 'pending'}`">
                  {{ getPaymentStatusLabel(selectedOrder.paymentStatus) }}
                </span>
              </div>
              <div class="info-item" v-if="selectedOrder.authorizationCode">
                <label>Código de Autorización:</label>
                <span>{{ selectedOrder.authorizationCode }}</span>
              </div>
              <div class="info-item" v-if="selectedOrder.transactionId">
                <label>ID de Transacción:</label>
                <span>{{ selectedOrder.transactionId }}</span>
              </div>
              <div class="info-item" v-if="selectedOrder.paymentMethod">
                <label>Método de Pago:</label>
                <span>{{ selectedOrder.paymentMethod }}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="shipping-info-section" v-if="selectedOrder.shippingAddress">
            <h3>Información de Envío</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Dirección:</label>
                <span>{{ selectedOrder.shippingAddress.address }}</span>
              </div>
              <div class="info-item">
                <label>Ciudad:</label>
                <span>{{ selectedOrder.shippingAddress.city }}</span>
              </div>
              <div class="info-item">
                <label>Código Postal:</label>
                <span>{{ selectedOrder.shippingAddress.zipCode }}</span>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="order-items-section" v-if="selectedOrder.items && selectedOrder.items.length > 0">
            <h3>Productos</h3>
            <div class="items-list">
              <div v-for="item in selectedOrder.items" :key="item._id" class="order-item">
                <img :src="item.image" :alt="item.name" class="item-image" />
                <div class="item-details">
                  <h4>{{ item.name }}</h4>
                  <p>Cantidad: {{ item.quantity }}</p>
                  <p>Precio: ${{ item.price }}</p>
                </div>
                <div class="item-total">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeOrderDetails" class="btn btn-outline">Cerrar</button>
          <button 
            v-if="selectedOrder.paymentStatus === 'paid' && selectedOrder.status !== 'cancelled'"
            @click="refundOrder(selectedOrder)" 
            class="btn btn-warning"
            :disabled="refundingOrder === selectedOrder._id"
          >
            {{ refundingOrder === selectedOrder._id ? 'Procesando...' : 'Reembolsar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminService } from '../services/api'
import { useNotifications } from '../composables/useNotifications'

const { success, error } = useNotifications()

// State
const orders = ref([])
const stats = ref(null)
const loading = ref(false)
const selectedStatus = ref('')
const selectedPaymentStatus = ref('')
const searchTerm = ref('')
const selectedOrder = ref(null)
const refundingOrder = ref(null)
const checkingPayment = ref(null)

// Computed
const filteredOrders = computed(() => {
  let filtered = orders.value

  if (selectedStatus.value) {
    filtered = filtered.filter(order => order.status === selectedStatus.value)
  }

  if (selectedPaymentStatus.value) {
    filtered = filtered.filter(order => (order.paymentStatus || 'pending') === selectedPaymentStatus.value)
  }

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(order => 
      order._id?.toLowerCase().includes(term) ||
      order.customerEmail?.toLowerCase().includes(term) ||
      order.customerName?.toLowerCase().includes(term)
    )
  }

  return filtered
})

// Methods
const loadOrders = async () => {
  loading.value = true
  try {
    const [ordersResponse, statsResponse] = await Promise.all([
      adminService.getAllOrders(),
      adminService.getOrderStats()
    ])
    
    orders.value = ordersResponse.data || []
    stats.value = statsResponse.data || {}
  } catch (err) {
    console.error('Error loading orders:', err)
    error('Error al cargar órdenes')
  } finally {
    loading.value = false
  }
}

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await adminService.updateOrderStatus(orderId, newStatus)
    success('Estado de orden actualizado')
    await loadOrders()
  } catch (err) {
    console.error('Error updating order status:', err)
    error('Error al actualizar estado de orden')
  }
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
}

const closeOrderDetails = () => {
  selectedOrder.value = null
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

const refundOrder = async (order) => {
  if (!confirm(`¿Estás seguro de que quieres reembolsar la orden #${order._id?.slice(-8)}?`)) {
    return
  }

  refundingOrder.value = order._id
  try {
    await adminService.refundPayment(order._id)
    success('Reembolso procesado exitosamente')
    await loadOrders()
    if (selectedOrder.value && selectedOrder.value._id === order._id) {
      selectedOrder.value.paymentStatus = 'refunded'
    }
  } catch (err) {
    console.error('Error processing refund:', err)
    error('Error al procesar el reembolso: ' + (err.message || 'Error desconocido'))
  } finally {
    refundingOrder.value = null
  }
}

const checkPaymentStatus = async (order) => {
  checkingPayment.value = order._id
  try {
    const response = await adminService.getPaymentStatus(order._id)
    success('Estado de pago actualizado')
    await loadOrders()
  } catch (err) {
    console.error('Error checking payment status:', err)
    error('Error al verificar el estado del pago: ' + (err.message || 'Error desconocido'))
  } finally {
    checkingPayment.value = null
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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

.admin-orders {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: #f8f9fa;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.orders-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.stat-info p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
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

.orders-table {
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

.order-id {
  font-family: monospace;
  font-weight: 600;
  color: #007bff;
}

.customer-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
}

.customer-info p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.order-date {
  color: #666;
  font-size: 0.875rem;
}

.order-total {
  font-weight: 600;
  color: #28a745;
}

.status-select {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 0.875rem;
}

.status-select.status-pending { background: #fff3cd; color: #856404; }
.status-select.status-processing { background: #d1ecf1; color: #0c5460; }
.status-select.status-shipped { background: #d4edda; color: #155724; }
.status-select.status-delivered { background: #d1f2eb; color: #00695c; }
.status-select.status-cancelled { background: #f8d7da; color: #721c24; }

.payment-status {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.payment-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  display: inline-block;
  min-width: 60px;
}

.payment-badge.payment-pending { background: #fff3cd; color: #856404; }
.payment-badge.payment-paid { background: #d4edda; color: #155724; }
.payment-badge.payment-failed { background: #f8d7da; color: #721c24; }
.payment-badge.payment-refunded { background: #d1ecf1; color: #0c5460; }

.payment-details {
  font-size: 0.7rem;
  color: #666;
  text-align: center;
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

.btn-outline {
  background: white;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
  border-color: #ffc107;
}

.btn-warning:hover:not(:disabled) {
  background: #e0a800;
  border-color: #d39e00;
}

.btn-info {
  background: #17a2b8;
  color: white;
  border-color: #17a2b8;
}

.btn-info:hover:not(:disabled) {
  background: #138496;
  border-color: #117a8b;
}

.no-orders {
  padding: 4rem;
  text-align: center;
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
  margin: 0;
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
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 2rem;
}

.modal-body h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f8f9fa;
}

.order-info-section,
.customer-info-section,
.payment-info-section,
.shipping-info-section,
.order-items-section {
  margin-bottom: 2rem;
}

.order-items-section:last-child {
  margin-bottom: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item label {
  font-weight: 600;
  color: #666;
  font-size: 0.875rem;
}

.info-item span {
  color: #333;
  font-size: 0.95rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  display: inline-block;
  min-width: 80px;
}

.status-badge.status-pending { background: #fff3cd; color: #856404; }
.status-badge.status-processing { background: #d1ecf1; color: #0c5460; }
.status-badge.status-shipped { background: #d4edda; color: #155724; }
.status-badge.status-delivered { background: #d1f2eb; color: #00695c; }
.status-badge.status-cancelled { background: #f8d7da; color: #721c24; }

.amount {
  font-weight: 700;
  color: #28a745;
  font-size: 1.1rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

.item-details p {
  margin: 0 0 0.25rem 0;
  color: #666;
  font-size: 0.875rem;
}

.item-total {
  font-weight: 700;
  color: #28a745;
  font-size: 1.1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 0 0 12px 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .orders-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .filter-input, .filter-select {
    min-width: auto;
  }
  
  .modal-content {
    margin: 10px;
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style> 