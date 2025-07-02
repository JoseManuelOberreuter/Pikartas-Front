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
                  <div class="actions">
                    <button @click="viewOrderDetails(order)" class="btn btn-sm btn-outline">
                      👁️ Ver
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
const searchTerm = ref('')

// Computed
const filteredOrders = computed(() => {
  let filtered = orders.value

  if (selectedStatus.value) {
    filtered = filtered.filter(order => order.status === selectedStatus.value)
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
  // TODO: Implementar modal de detalles de orden
  console.log('View order details:', order)
  alert(`Ver detalles de orden #${order._id?.slice(-8)}`)
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
}
</style> 