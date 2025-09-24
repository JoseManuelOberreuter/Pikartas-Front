<template>
  <div class="admin-users">
    <div class="container">
      <div class="users-header">
        <h1>👥 Gestión de Usuarios</h1>
        <div class="header-actions">
          <button @click="exportUsers" class="btn btn-export" :disabled="loading || filteredUsers.length === 0">
            <span class="btn-icon">📊</span>
            <span class="btn-text">Exportar CSV</span>
            <span class="btn-count" v-if="filteredUsers.length > 0">({{ filteredUsers.length }})</span>
          </button>
          <router-link to="/admin" class="btn btn-back">
            <span class="btn-icon">←</span>
            <span class="btn-text">Dashboard</span>
          </router-link>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" v-if="stats">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>{{ stats.totalUsers || 0 }}</h3>
            <p>Total Usuarios</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <h3>{{ stats.verifiedUsers || 0 }}</h3>
            <p>Verificados</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🆕</div>
          <div class="stat-info">
            <h3>{{ stats.newUsersThisMonth || 0 }}</h3>
            <p>Este Mes</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🕒</div>
          <div class="stat-info">
            <h3>{{ stats.activeUsers || 0 }}</h3>
            <p>Activos (30 días)</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <label>Buscar usuarios:</label>
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Nombre, email, dirección..." 
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label>Rol:</label>
          <select v-model="roleFilter" class="filter-select">
            <option value="">Todos los roles</option>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Ordenar por:</label>
          <select v-model="sortBy" class="filter-select">
            <option value="name">Nombre</option>
            <option value="email">Email</option>
            <option value="created_at">Fecha de Registro</option>
            <option value="last_login">Última Actividad</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Dirección:</label>
          <select v-model="sortOrder" class="filter-select">
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>

      <!-- Users Table -->
      <div v-else class="users-table">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Registro</th>
                <th>Última Actividad</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <div class="user-info">
                    <div class="user-avatar">
                      <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                      <div v-else class="avatar-placeholder">
                        {{ user.name?.charAt(0)?.toUpperCase() }}
                      </div>
                    </div>
                    <div class="user-details">
                      <h4>{{ user.name || 'Sin nombre' }}</h4>
                      <p v-if="user.telefono">{{ user.telefono }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="user-email">{{ user.email }}</span>
                </td>
                <td>
                  <span class="role-badge" :class="`role-${user.role}`">
                    {{ user.role === 'admin' ? 'Admin' : 'Usuario' }}
                  </span>
                </td>
                <td>
                  <span class="contact-info">{{ user.telefono || 'No disponible' }}</span>
                </td>
                <td>
                  <span class="address-info">{{ user.direccion || 'No disponible' }}</span>
                </td>
                <td>
                  <span class="date-info">{{ formatDate(user.created_at) }}</span>
                </td>
                <td>
                  <span class="date-info">{{ formatDate(user.last_login) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="filteredUsers.length === 0" class="no-users">
          <div class="empty-state">
            <div class="empty-icon">👥</div>
            <h3>No hay usuarios</h3>
            <p>No se encontraron usuarios con los filtros seleccionados</p>
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
const users = ref([])
const stats = ref(null)
const loading = ref(false)
const searchTerm = ref('')
const roleFilter = ref('')
const sortBy = ref('created_at')
const sortOrder = ref('desc')

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.telefono?.toLowerCase().includes(term) ||
      user.direccion?.toLowerCase().includes(term)
    )
  }


  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  // Ordenar los resultados
  filtered.sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy.value) {
      case 'name':
        aValue = (a.name || '').toLowerCase()
        bValue = (b.name || '').toLowerCase()
        break
      case 'email':
        aValue = (a.email || '').toLowerCase()
        bValue = (b.email || '').toLowerCase()
        break
      case 'created_at':
        aValue = new Date(a.created_at || 0)
        bValue = new Date(b.created_at || 0)
        break
      case 'last_login':
        aValue = new Date(a.last_login || 0)
        bValue = new Date(b.last_login || 0)
        break
      default:
        aValue = a[sortBy.value] || ''
        bValue = b[sortBy.value] || ''
    }

    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })

  return filtered
})

// Methods
const loadUsers = async () => {
  loading.value = true
  try {
    const response = await adminService.getAllUsers()
    users.value = response.data || []
    
    // Calcular estadísticas
    calculateStats()
  } catch (err) {
    console.error('Error loading users:', err)
    error('Error al cargar usuarios')
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const totalUsers = users.value.length
  const verifiedUsers = users.value.filter(u => u.is_verified).length
  
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  const newUsersThisMonth = users.value.filter(u => {
    const userDate = new Date(u.created_at)
    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
  }).length

  const activeUsers = users.value.filter(u => {
    if (!u.last_login) return false
    const lastLogin = new Date(u.last_login)
    return lastLogin >= thirtyDaysAgo
  }).length

  stats.value = {
    totalUsers,
    verifiedUsers,
    newUsersThisMonth,
    activeUsers
  }
}





const exportUsers = () => {
  if (filteredUsers.value.length === 0) {
    error('No hay usuarios para exportar')
    return
  }
  
  try {
    const csvContent = generateCSV(filteredUsers.value)
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `usuarios_${timestamp}.csv`
    downloadCSV(csvContent, filename)
    success(`✅ Exportados ${filteredUsers.value.length} usuarios exitosamente`)
  } catch (err) {
    console.error('Error exporting users:', err)
    error('❌ Error al exportar la lista de usuarios')
  }
}

const generateCSV = (users) => {
  const headers = ['Nombre', 'Email', 'Rol', 'Teléfono', 'Dirección', 'Verificado', 'Fecha Registro', 'Última Actividad']
  const rows = users.map(user => [
    user.name || '',
    user.email || '',
    user.role || '',
    user.telefono || '',
    user.direccion || '',
    user.is_verified ? 'Sí' : 'No',
    formatDate(user.created_at),
    formatDate(user.last_login)
  ])
  
  return [headers, ...rows].map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n')
}

const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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
  loadUsers()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.admin-users {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: #f8f9fa;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.users-header h1 {
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

.users-table {
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

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.user-details h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 0.95rem;
}

.user-details p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.user-email {
  color: #666;
  font-size: 0.875rem;
}

.role-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  display: inline-block;
  min-width: 60px;
}

.role-badge.role-admin {
  background: #dc3545;
  color: white;
}

.role-badge.role-user {
  background: #28a745;
  color: white;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}


.contact-info {
  color: #666;
  font-size: 0.875rem;
}

.address-info {
  color: #666;
  font-size: 0.875rem;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date-info {
  color: #666;
  font-size: 0.875rem;
}

.btn-export {
  background: #28a745;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-export:hover:not(:disabled) {
  background: #218838;
}

.btn-export:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-back {
  background: #6c757d;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.2s;
  text-decoration: none;
}

.btn-back:hover {
  background: #5a6268;
  color: white;
  text-decoration: none;
}

.btn-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-left: 0.25rem;
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


.no-users {
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
  .users-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    display: flex;
    gap: 0.75rem;
  }
  
  .btn-export, .btn-back {
    flex: 1;
    padding: 0.6rem 1rem;
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
