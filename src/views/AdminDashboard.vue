<template>
  <div class="admin-dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1>🛠️ Panel de Administración</h1>
        <p>Gestiona tu tienda online</p>
      </div>

      <div class="dashboard-stats" v-if="stats">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <h3>{{ stats.totalProducts || 0 }}</h3>
            <p>Total Productos</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🛒</div>
          <div class="stat-info">
            <h3>{{ stats.totalOrders || 0 }}</h3>
            <p>Total Órdenes</p>
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
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>{{ stats.totalUsers || 0 }}</h3>
            <p>Total Usuarios</p>
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <div class="action-grid">
          <div class="action-card" @click="navigateTo('/admin/products')">
            <div class="action-icon">📦</div>
            <h3>Gestionar Productos</h3>
            <p>Crear, editar y eliminar productos</p>
            <div class="action-button">Ir a Productos</div>
          </div>

          <div class="action-card" @click="navigateTo('/admin/orders')">
            <div class="action-icon">📋</div>
            <h3>Gestionar Órdenes</h3>
            <p>Ver y actualizar estado de órdenes</p>
            <div class="action-button">Ir a Órdenes</div>
          </div>

          <div class="action-card" @click="navigateTo('/admin/products/new')">
            <div class="action-icon">➕</div>
            <h3>Agregar Producto</h3>
            <p>Crear un nuevo producto rápidamente</p>
            <div class="action-button">Crear Producto</div>
          </div>

          <div class="action-card" @click="navigateTo('/admin/analytics')">
            <div class="action-icon">📊</div>
            <h3>Estadísticas</h3>
            <p>Ver reportes y analíticas</p>
            <div class="action-button">Ver Estadísticas</div>
          </div>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Actividad Reciente</h2>
        <div class="activity-list" v-if="recentOrders.length">
          <div class="activity-item" v-for="order in recentOrders" :key="order._id">
            <div class="activity-icon">🛒</div>
            <div class="activity-info">
              <h4>Nueva orden #{{ order._id?.slice(-8) }}</h4>
              <p>{{ formatDate(order.createdAt) }} - ${{ order.totalAmount }}</p>
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
const loading = ref(false)

const loadDashboardData = async () => {
  loading.value = true
  try {
    // Cargar estadísticas de órdenes
    const [ordersStats, allProducts, orders] = await Promise.all([
      adminService.getOrderStats().catch(() => ({ data: {} })),
      adminService.getAllProducts().catch(() => ({ data: [] })),
      adminService.getAllOrders().catch(() => ({ data: [] }))
    ])

    // 🎯 CONTAR SOLO PRODUCTOS ACTIVOS
    const activeProducts = Array.isArray(allProducts.data) 
      ? allProducts.data.filter(p => p.isActive !== false)
      : []

    stats.value = {
      totalProducts: activeProducts.length,
      totalOrders: ordersStats.data?.totalOrders || 0,
      totalRevenue: ordersStats.data?.totalRevenue || 0,
      totalUsers: ordersStats.data?.totalUsers || 0
    }

    // Obtener órdenes recientes (últimas 5)
    if (Array.isArray(orders.data)) {
      recentOrders.value = orders.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    }

  } catch (err) {
    console.error('Error loading dashboard data:', err)
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
}

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
}

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
  display: inline-block;
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
}
</style> 