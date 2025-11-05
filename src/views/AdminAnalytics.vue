<template>
  <div class="admin-analytics">
    <div class="container">
      <div class="analytics-header">
        <h1>
          <font-awesome-icon icon="chart-bar" class="header-icon" />
          Estadísticas y Análisis
        </h1>
        <div class="header-actions">
          <router-link to="/admin" class="btn btn-outline">
            <font-awesome-icon icon="arrow-left" class="btn-icon" />
            Volver al Dashboard
          </router-link>
        </div>
      </div>

      <!-- Coming Soon Message -->
      <div class="coming-soon">
        <div class="coming-soon-content">
          <div class="coming-soon-icon">
            <font-awesome-icon icon="chart-line" class="coming-soon-icon-svg" />
          </div>
          <h2>Panel de Análisis</h2>
          <p>Esta sección estará disponible próximamente con:</p>
          
          <div class="features-list">
            <div class="feature-item">
              <font-awesome-icon icon="chart-line" class="feature-icon" />
              <span>Gráficos de ventas por período</span>
            </div>
            <div class="feature-item">
              <font-awesome-icon icon="dollar-sign" class="feature-icon" />
              <span>Análisis de ingresos y ganancias</span>
            </div>
            <div class="feature-item">
              <font-awesome-icon icon="users" class="feature-icon" />
              <span>Comportamiento de usuarios</span>
            </div>
            <div class="feature-item">
              <font-awesome-icon icon="box" class="feature-icon" />
              <span>Productos más vendidos</span>
            </div>
            <div class="feature-item">
              <font-awesome-icon icon="globe" class="feature-icon" />
              <span>Análisis geográfico de ventas</span>
            </div>
            <div class="feature-item">
              <font-awesome-icon icon="calendar-alt" class="feature-icon" />
              <span>Reportes personalizados</span>
            </div>
          </div>

          <div class="temp-stats" v-if="stats">
            <h3>Estadísticas Actuales:</h3>
            <div class="temp-stats-grid">
              <div class="temp-stat">
                <strong>{{ stats.totalProducts || 0 }}</strong>
                <span>Productos</span>
              </div>
              <div class="temp-stat">
                <strong>{{ stats.totalOrders || 0 }}</strong>
                <span>Órdenes</span>
              </div>
              <div class="temp-stat">
                <strong>${{ stats.totalRevenue || 0 }}</strong>
                <span>Ingresos</span>
              </div>
              <div class="temp-stat">
                <strong>{{ stats.totalUsers || 0 }}</strong>
                <span>Usuarios</span>
              </div>
            </div>
          </div>

          <div class="actions">
            <router-link to="/admin/products" class="btn btn-primary">
              <font-awesome-icon icon="box" class="btn-icon" />
              Gestionar Productos
            </router-link>
            <router-link to="/admin/orders" class="btn btn-outline">
              <font-awesome-icon icon="clipboard-list" class="btn-icon" />
              Ver Órdenes
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminService, productService } from '../services/api'

// State
const stats = ref(null)

// Methods
const loadAnalytics = async () => {
  try {
    // Cargar estadísticas básicas
    const [ordersStats, allProducts] = await Promise.all([
      adminService.getOrderStats().catch(() => ({ data: {} })),
      adminService.getAllProducts().catch(() => ({ data: [] }))
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
  } catch (err) {
    // Error loading analytics - stats will remain empty
  }
}

// Lifecycle
onMounted(() => {
  loadAnalytics()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.admin-analytics {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: #f8f9fa;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.analytics-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  color: var(--icon-admin-analytics-header);
  font-size: 1.2em;
  transition: all var(--transition-normal);
}

.analytics-header:hover .header-icon {
  transform: scale(1.1) rotate(5deg);
}

.coming-soon {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.coming-soon-content {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.coming-soon-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coming-soon-icon-svg {
  font-size: 1em;
  color: var(--icon-admin-analytics-chart);
  transition: all var(--transition-normal);
}

.coming-soon-content:hover .coming-soon-icon-svg {
  transform: scale(1.1) rotate(10deg);
}

.coming-soon-content h2 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 2rem;
}

.coming-soon-content p {
  margin: 0 0 2rem 0;
  color: #666;
  font-size: 1.1rem;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #555;
}

.feature-icon {
  font-size: 1.25rem;
  transition: all var(--transition-normal);
}

.feature-item:hover .feature-icon {
  transform: scale(1.1);
}

/* Colores específicos para cada característica */
.feature-item:nth-child(1) .feature-icon { color: var(--icon-admin-analytics-sales); }
.feature-item:nth-child(2) .feature-icon { color: var(--icon-admin-analytics-revenue); }
.feature-item:nth-child(3) .feature-icon { color: var(--icon-admin-analytics-users); }
.feature-item:nth-child(4) .feature-icon { color: var(--icon-admin-analytics-products); }
.feature-item:nth-child(5) .feature-icon { color: var(--icon-admin-analytics-globe); }
.feature-item:nth-child(6) .feature-icon { color: var(--icon-admin-analytics-calendar); }

.temp-stats {
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.05));
  border-radius: 8px;
  border: 1px solid rgba(0, 123, 255, 0.2);
}

.temp-stats h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.temp-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.temp-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.temp-stat strong {
  font-size: 1.5rem;
  color: #007bff;
  font-weight: 600;
}

.temp-stat span {
  font-size: 0.875rem;
  color: #666;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  gap: 0.5rem;
}

.btn-icon {
  font-size: 0.875rem;
  transition: all var(--transition-normal);
}

.btn:hover .btn-icon {
  transform: scale(1.1);
}

.btn-primary .btn-icon {
  color: var(--icon-admin-analytics-products-btn);
}

.btn-outline .btn-icon {
  color: var(--icon-admin-analytics-orders-btn);
}

.btn-primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-outline {
  background: white;
  color: #007bff;
  border-color: #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .analytics-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .coming-soon-content {
    padding: 2rem 1.5rem;
  }
  
  .features-list {
    grid-template-columns: 1fr;
  }
  
  .temp-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .temp-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> 