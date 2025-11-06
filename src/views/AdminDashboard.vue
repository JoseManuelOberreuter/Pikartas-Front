<template>

<!-- TODO: los colores de los botones y de los iconos -->

  <div class="admin-dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1>
          <font-awesome-icon icon="tools" class="header-icon" />
          Panel de Administración
        </h1>
        <p>Gestiona tu tienda online</p>
      </div>

      <div class="dashboard-stats" v-if="stats">
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="box" class="stat-icon-svg" />
          </div>
          <div class="stat-info">
            <h3>{{ stats.totalProducts || 0 }}</h3>
            <p>Total Productos</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="shopping-cart" class="stat-icon-svg" />
          </div>
          <div class="stat-info">
            <h3>{{ stats.totalOrders || 0 }}</h3> 
            <p>Total Órdenes</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="dollar-sign" class="stat-icon-svg" />
          </div>
          <div class="stat-info">
            <h3>${{ stats.totalRevenue || 0 }}</h3>
            <p>Ingresos Totales</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="users" class="stat-icon-svg" />
          </div>
          <div class="stat-info">
            <h3>{{ stats.totalUsers || 0 }}</h3>
            <p>Total Usuarios</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="credit-card" class="stat-icon-svg" />
          </div>
          <div class="stat-info">
            <h3>{{ stats.paidOrders || 0 }}</h3>
            <p>Órdenes Pagadas</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="clock" class="stat-icon-svg" />
          </div>
          <div class="stat-info">
            <h3>{{ stats.pendingPayments || 0 }}</h3>
            <p>Pagos Pendientes</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="undo" class="stat-icon-svg" />
          </div>
          <div class="stat-info">
            <h3>{{ stats.refundedOrders || 0 }}</h3>
            <p>Reembolsos</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="chart-line" class="stat-icon-svg" />
          </div>
          <div class="stat-info">
            <h3>{{ stats.conversionRate || 0 }}%</h3>
            <p>Tasa de Conversión</p>
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <div class="action-grid">
          <div class="action-card" @click="navigateTo('/admin/products')">
            <div class="action-icon">
              <font-awesome-icon icon="box" class="action-icon-svg" />
            </div>
            <h3>Gestionar Productos</h3>
            <p>Crear, editar y eliminar productos</p>
            <div class="action-button">
              <font-awesome-icon icon="arrow-right" class="action-btn-icon" />
              Ir a Productos
            </div>
          </div>

          <div class="action-card" @click="navigateTo('/admin/orders')">
            <div class="action-icon">
              <font-awesome-icon icon="clipboard-list" class="action-icon-svg" />
            </div>
            <h3>Gestionar Órdenes</h3>
            <p>Ver y actualizar estado de órdenes</p>
            <div class="action-button">
              <font-awesome-icon icon="arrow-right" class="action-btn-icon" />
              Ir a Órdenes
            </div>
          </div>

          <div class="action-card" @click="navigateTo('/admin/analytics')">
            <div class="action-icon">
              <font-awesome-icon icon="chart-bar" class="action-icon-svg" />
            </div>
            <h3>Estadísticas</h3>
            <p>Ver reportes y analíticas</p>
            <div class="action-button">
              <font-awesome-icon icon="arrow-right" class="action-btn-icon" />
              Ver Estadísticas
            </div>
          </div>

          <div class="action-card" @click="navigateTo('/admin/users')">
            <div class="action-icon">
              <font-awesome-icon icon="users" class="action-icon-svg" />
            </div>
            <h3>Gestionar Usuarios</h3>
            <p>Ver y administrar usuarios registrados</p>
            <div class="action-button">
              <font-awesome-icon icon="arrow-right" class="action-btn-icon" />
              Gestionar Usuarios
            </div>
          </div>

          <div class="action-card" @click="navigateTo('/admin/orders')">
            <div class="action-icon">
              <font-awesome-icon icon="credit-card" class="action-icon-svg" />
            </div>
            <h3>Gestionar Pagos</h3>
            <p>Reembolsos y estado de pagos</p>
            <div class="action-button">
              <font-awesome-icon icon="arrow-right" class="action-btn-icon" />
              Gestionar Pagos
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Alerts -->
      <div class="payment-alerts" v-if="paymentAlerts.length > 0">
        <h2>
          <font-awesome-icon icon="exclamation-triangle" class="alerts-icon" />
          Alertas de Pago
        </h2>
        <div class="alerts-list">
          <div class="alert-item" v-for="alert in paymentAlerts" :key="alert.id" :class="`alert-${alert.type}`">
            <div class="alert-icon">
              <font-awesome-icon :icon="getAlertIcon(alert.type)" class="alert-icon-svg" />
            </div>
            <div class="alert-content">
              <h4>{{ alert.title }}</h4>
              <p>{{ alert.message }}</p>
            </div>
            <div class="alert-actions">
              <button @click="handleAlert(alert)" class="btn btn-sm btn-outline">
                {{ alert.actionText }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Actividad Reciente</h2>
        <div class="activity-list" v-if="recentOrders.length">
          <div class="activity-item" v-for="order in recentOrders" :key="order._id">
            <div class="activity-icon">
              <font-awesome-icon icon="shopping-cart" class="activity-icon-svg" />
            </div>
            <div class="activity-info">
              <h4>Nueva orden #{{ order._id?.slice(-8) }}</h4>
              <p>{{ formatDate(order.createdAt) }} - ${{ order.totalAmount }}</p>
              <div class="payment-info" v-if="order.paymentStatus">
                <span class="payment-badge" :class="`payment-${order.paymentStatus}`">
                  {{ getPaymentStatusText(order.paymentStatus) }}
                </span>
                <span v-if="order.authorizationCode" class="auth-code">
                  Auth: {{ order.authorizationCode }}
                </span>
              </div>
            </div>
            <div class="activity-status" :class="`status-${order.status}`">
              {{ getStatusText(order.status) }}
            </div>
          </div>
        </div>
        <div v-else class="no-activity">
          <p>No hay actividad reciente</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminService, productService } from '../services/api'
import { useNotifications } from '../composables/useNotifications'

const router = useRouter()
const { error } = useNotifications()

const stats = ref(null)
const recentOrders = ref([])
const paymentAlerts = ref([])
const loading = ref(false)

const loadDashboardData = async () => {
  loading.value = true
  try {
    // Cargar estadísticas de órdenes y usuarios
    const [ordersStats, allProducts, orders, usersData] = await Promise.all([
      adminService.getOrderStats().catch(() => ({ data: {} })),
      adminService.getAllProducts().catch(() => ({ data: [] })),
      adminService.getAllOrders().catch(() => ({ data: [] })),
      adminService.getAllUsers().catch(() => {
        return { data: [], total: 0 }
      })
    ])

    // Handle new response format: { success: true, data: { products: [...], pagination: {...} } }
    // allProducts is already the response.data from axios, so it's: { success: true, data: { products: [...] } }
    let productsArray = []
    if (allProducts?.success) {
      if (allProducts.data?.products && Array.isArray(allProducts.data.products)) {
        productsArray = allProducts.data.products
      } else if (Array.isArray(allProducts.data)) {
        productsArray = allProducts.data
      }
    }
    
    // 🎯 CONTAR SOLO PRODUCTOS ACTIVOS
    const activeProducts = Array.isArray(productsArray) 
      ? productsArray.filter(p => p.isActive !== false)
      : []

    // Handle orders format: { success: true, data: { orders: [...], pagination: {...} } }
    // orders is already the response.data from axios, so it's: { success: true, data: { orders: [...] } }
    let ordersArray = []
    if (orders?.success) {
      if (orders.data?.orders && Array.isArray(orders.data.orders)) {
        ordersArray = orders.data.orders
      } else if (Array.isArray(orders.data)) {
        ordersArray = orders.data
      }
    }
    
    // Calculate payment statistics
    const allOrders = ordersArray
    const paidOrders = allOrders.filter(order => order.paymentStatus === 'paid').length
    const pendingPayments = allOrders.filter(order => order.paymentStatus === 'pending').length
    const refundedOrders = allOrders.filter(order => order.paymentStatus === 'refunded').length
    const conversionRate = allOrders.length > 0 ? Math.round((paidOrders / allOrders.length) * 100) : 0

    stats.value = {
      totalProducts: activeProducts.length,
      totalOrders: ordersStats.data?.totalOrders || 0,
      totalRevenue: ordersStats.data?.totalRevenue || 0,
      // Handle new response format: { success: true, data: { users: [...], total: ... } }
      // usersData is already the response.data from axios, so it's: { success: true, data: { users: [...], total: ... } }
      totalUsers: usersData?.data?.total || usersData?.total || (Array.isArray(usersData?.data?.users) ? usersData.data.users.length : 0) || 0,
      paidOrders,
      pendingPayments,
      refundedOrders,
      conversionRate
    }

    // Obtener órdenes recientes (últimas 5)
    // orders is already the response.data from axios, so it's: { success: true, data: { orders: [...] } }
    if (Array.isArray(ordersArray) && ordersArray.length > 0) {
      recentOrders.value = ordersArray
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    }

    // Generate payment alerts
    generatePaymentAlerts(allOrders)

  } catch (err) {
    error('Error al cargar datos del dashboard')
  } finally {
    loading.value = false
  }
}

const navigateTo = (path) => {
  router.push(path)
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

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }
  return statusMap[status] || status
}

const getPaymentStatusText = (status) => {
  const statusMap = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado'
  }
  return statusMap[status] || status
}

const getAlertIcon = (type) => {
  const iconMap = {
    warning: 'exclamation-triangle',
    info: 'info-circle',
    danger: 'times-circle'
  }
  return iconMap[type] || 'info-circle'
}

const generatePaymentAlerts = (orders) => {
  const alerts = []
  
  // Check for failed payments
  const failedPayments = orders.filter(order => order.paymentStatus === 'failed')
  if (failedPayments.length > 0) {
    alerts.push({
      id: 'failed-payments',
      type: 'warning',
      icon: '⚠️',
      title: 'Pagos Fallidos',
      message: `${failedPayments.length} órdenes con pagos fallidos requieren atención`,
      actionText: 'Ver Órdenes',
      action: () => navigateTo('/admin/orders?filter=failed')
    })
  }
  
  // Check for pending payments older than 1 hour
  const oldPendingPayments = orders.filter(order => {
    if (order.paymentStatus !== 'pending') return false
    const orderDate = new Date(order.createdAt)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return orderDate < oneHourAgo
  })
  
  if (oldPendingPayments.length > 0) {
    alerts.push({
      id: 'old-pending-payments',
      type: 'info',
      icon: '⏰',
      title: 'Pagos Pendientes Antiguos',
      message: `${oldPendingPayments.length} órdenes con pagos pendientes por más de 1 hora`,
      actionText: 'Revisar',
      action: () => navigateTo('/admin/orders?filter=pending')
    })
  }
  
  // Check for high refund rate
  const totalOrders = orders.length
  const refundedOrders = orders.filter(order => order.paymentStatus === 'refunded').length
  const refundRate = totalOrders > 0 ? (refundedOrders / totalOrders) * 100 : 0
  
  if (refundRate > 10 && totalOrders > 10) {
    alerts.push({
      id: 'high-refund-rate',
      type: 'danger',
      icon: '📉',
      title: 'Alta Tasa de Reembolsos',
      message: `Tasa de reembolsos del ${refundRate.toFixed(1)}% - Revisar calidad del servicio`,
      actionText: 'Analizar',
      action: () => navigateTo('/admin/analytics')
    })
  }
  
  paymentAlerts.value = alerts
}

const handleAlert = (alert) => {
  if (alert.action) {
    alert.action()
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.admin-dashboard {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: #f8f9fa;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  color: #333;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.header-icon {
  color: var(--icon-admin-tools);
  font-size: 1.2em;
  transition: all var(--transition-normal);
}

.dashboard-header:hover .header-icon {
  transform: scale(1.1) rotate(5deg);
}

.dashboard-header p {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-icon {
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-svg {
  font-size: 1em;
  transition: all var(--transition-normal);
}

.stat-card:hover .stat-icon-svg {
  transform: scale(1.1);
}

/* Colores específicos para cada tipo de estadística */
.stat-card:nth-child(1) .stat-icon-svg { color: var(--icon-admin-products); }
.stat-card:nth-child(2) .stat-icon-svg { color: var(--icon-admin-orders); }
.stat-card:nth-child(3) .stat-icon-svg { color: var(--icon-admin-revenue); }
.stat-card:nth-child(4) .stat-icon-svg { color: var(--icon-admin-users); }
.stat-card:nth-child(5) .stat-icon-svg { color: var(--icon-admin-payments); }
.stat-card:nth-child(6) .stat-icon-svg { color: var(--icon-admin-pending); }
.stat-card:nth-child(7) .stat-icon-svg { color: var(--icon-admin-refunds); }
.stat-card:nth-child(8) .stat-icon-svg { color: var(--icon-admin-analytics); }

.stat-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.stat-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.dashboard-actions {
  margin-bottom: 3rem;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon-svg {
  font-size: 1em;
  color: var(--icon-admin-products);
  transition: all var(--transition-normal);
}

.action-card:hover .action-icon-svg {
  transform: scale(1.1);
}

/* Colores específicos para cada acción */
.action-card:nth-child(1) .action-icon-svg { color: var(--icon-admin-products); }
.action-card:nth-child(2) .action-icon-svg { color: var(--icon-admin-orders); }
.action-card:nth-child(3) .action-icon-svg { color: var(--icon-admin-analytics); }
.action-card:nth-child(4) .action-icon-svg { color: var(--icon-admin-users); }
.action-card:nth-child(5) .action-icon-svg { color: var(--icon-admin-payments); }

.action-card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.25rem;
}

.action-card p {
  margin: 0 0 1.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.action-button {
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all var(--transition-normal);
}

.action-btn-icon {
  font-size: 0.875rem;
  color: var(--icon-admin-action);
  transition: all var(--transition-normal);
}

.action-card:hover .action-btn-icon {
  transform: translateX(3px);
}

.recent-activity {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.recent-activity h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alerts-icon {
  color: var(--icon-admin-alerts);
  font-size: 1.2em;
  transition: all var(--transition-normal);
}

.payment-alerts:hover .alerts-icon {
  transform: scale(1.1);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
}

.activity-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon-svg {
  font-size: 1em;
  color: var(--icon-admin-cart);
  transition: all var(--transition-normal);
}

.activity-item:hover .activity-icon-svg {
  transform: scale(1.1);
}

.alert-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-icon-svg {
  font-size: 1em;
  transition: all var(--transition-normal);
}

.alert-item.alert-warning .alert-icon-svg { color: var(--icon-admin-pending); }
.alert-item.alert-info .alert-icon-svg { color: var(--icon-admin-clock); }
.alert-item.alert-danger .alert-icon-svg { color: var(--icon-admin-chart); }

.alert-item:hover .alert-icon-svg {
  transform: scale(1.1);
}

.activity-info {
  flex: 1;
}

.activity-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1rem;
}

.activity-info p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.activity-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
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
  background: #d1f2eb;
  color: #00695c;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.no-activity {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* Payment Alerts */
.payment-alerts {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.payment-alerts h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-item.alert-warning {
  background: #fff3cd;
  border-left-color: #ffc107;
}

.alert-item.alert-info {
  background: #d1ecf1;
  border-left-color: #17a2b8;
}

.alert-item.alert-danger {
  background: #f8d7da;
  border-left-color: #dc3545;
}

.alert-icon {
  font-size: 1.5rem;
}

.alert-content {
  flex: 1;
}

.alert-content h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1rem;
}

.alert-content p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
}

/* Payment Info in Activity */
.payment-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.payment-badge {
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  display: inline-block;
  min-width: 50px;
}

.payment-badge.payment-pending { background: #fff3cd; color: #856404; }
.payment-badge.payment-paid { background: #d4edda; color: #155724; }
.payment-badge.payment-failed { background: #f8d7da; color: #721c24; }
.payment-badge.payment-refunded { background: #d1ecf1; color: #0c5460; }

.auth-code {
  font-size: 0.7rem;
  color: #666;
  font-family: monospace;
}

/* Button Styles */
.btn {
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 0.875rem;
  display: inline-block;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.btn-outline {
  background: transparent;
  color: #6c757d;
  border-color: #6c757d;
}

.btn-outline:hover {
  background: #6c757d;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .action-card {
    padding: 1.5rem;
  }
  
  .alert-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .alert-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .payment-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style> 