<template>
  <div class="profile-page">
    <div class="container">
      <!-- Header del perfil -->
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar-container">
            <img 
              :src="userAvatar" 
              :alt="authStore.user?.name || 'Usuario'"
              class="avatar"
              @error="handleAvatarError"
            />
            <div class="avatar-overlay" @click="openAvatarModal">
              <span class="avatar-edit-icon">📷</span>
              <span class="avatar-edit-text">Cambiar</span>
            </div>
          </div>
          <input 
            ref="avatarInput"
            type="file"
            accept="image/*"
            @change="handleAvatarChange"
            style="display: none"
          />
        </div>
        
        <div class="user-info">
          <h1 class="user-name">{{ authStore.user?.name || 'Usuario' }}</h1>
          <p class="user-email">{{ authStore.user?.email || 'No email' }}</p>
          <div class="user-badges">
            <span class="badge badge-verified" v-if="authStore.user?.isVerified">✓ Verificado</span>
            <span class="badge badge-member">👤 Miembro</span>
          </div>
        </div>
      </div>

      <!-- Navegación de tabs -->
      <div class="profile-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-btn', { 'tab-btn-active': activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-text">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Contenido de tabs -->
      <div class="profile-content">
        
        <!-- Tab: Información Personal -->
        <div v-if="activeTab === 'info'" class="tab-content">
          <div class="content-card">
            <div class="card-header">
              <h2>Información Personal</h2>
              <button 
                v-if="!editMode" 
                @click="enableEditMode" 
                class="btn btn-outline btn-sm"
              >
                ✏️ Editar
              </button>
            </div>
            
            <form @submit.prevent="saveProfile" class="profile-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre completo</label>
                  <input 
                    v-model="profileForm.name"
                    :disabled="!editMode"
                    type="text"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input 
                    v-model="profileForm.email"
                    :disabled="!editMode"
                    type="email"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Teléfono</label>
                  <input 
                    v-model="profileForm.telefono"
                    :disabled="!editMode"
                    type="tel"
                    placeholder="+569 1234 5678"
                  />
                </div>
                <div class="form-group">
                  <label>Fecha de nacimiento</label>
                  <input 
                    v-model="profileForm.fechaNacimiento"
                    :disabled="!editMode"
                    type="date"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Dirección</label>
                <textarea 
                  v-model="profileForm.direccion"
                  :disabled="!editMode"
                  rows="3"
                  placeholder="Av. Las Condes 123, Santiago"
                ></textarea>
              </div>

              <div v-if="editMode" class="form-actions">
                <button type="button" @click="cancelEdit" class="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" :disabled="saving" class="btn btn-primary">
                  <span v-if="saving">💾 Guardando...</span>
                  <span v-else">💾 Guardar cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tab: Seguridad -->
        <div v-if="activeTab === 'security'" class="tab-content">
          <div class="content-card">
            <div class="card-header">
              <h2>🔒 Seguridad de la cuenta</h2>
            </div>
            
            <div class="security-form">
              <div class="security-item">
                <div class="security-info">
                  <h3>
                    <span>🔐</span>
                    Cambiar contraseña
                  </h3>
                  <p>Te enviaremos un enlace seguro a tu email para cambiar tu contraseña</p>
                </div>
                <div class="security-actions">
                  <div class="password-summary">
                    <span class="password-status">••••••••</span>
                    <button 
                      type="button" 
                      @click="changePassword" 
                      :disabled="changingPassword"
                      class="btn btn-primary btn-sm"
                    >
                      <span v-if="changingPassword">📧 Enviando...</span>
                      <span v-else>🔐 Solicitar por email</span>
                    </button>
                  </div>

                </div>
              </div>

              <div class="security-item">
                <div class="security-info">
                  <h3>
                    <span>📧</span>
                    Verificación de email
                  </h3>
                  <p v-if="authStore.user?.isVerified" class="verified-text">
                    ✅ Tu email está verificado
                  </p>
                  <p v-else class="unverified-text">
                    ❌ Tu email no está verificado
                  </p>
                </div>
                <div class="security-actions">
                  <button 
                    v-if="!authStore.user?.isVerified"
                    @click="resendVerification" 
                    :disabled="sendingVerification"
                    class="btn btn-outline btn-sm"
                  >
                    <span v-if="sendingVerification">📧 Enviando...</span>
                    <span v-else>📧 Reenviar verificación</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Pedidos -->
        <div v-if="activeTab === 'orders'" class="tab-content">
          <div class="content-card">
            <div class="card-header">
              <h2>Mis pedidos recientes</h2>
              <router-link to="/orders" class="btn btn-outline btn-sm">
                📦 Ver todos
              </router-link>
            </div>
            
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner">🔄</div>
              <p>Cargando pedidos...</p>
            </div>
            
            <div v-else-if="recentOrders.length === 0" class="empty-state">
              <div class="empty-icon">📦</div>
              <h3>No tienes pedidos aún</h3>
              <p>¡Explora nuestra tienda y haz tu primer pedido!</p>
              <router-link to="/shop" class="btn btn-primary">
                🛍️ Ir a la tienda
              </router-link>
            </div>
            
            <div v-else class="orders-list">
              <div v-for="order in recentOrders" :key="order.id" class="order-item">
                <div class="order-info">
                  <div class="order-number">#{{ order.id }}</div>
                  <div class="order-date">{{ formatDate(order.date) }}</div>
                  <div class="order-status" :class="`status-${order.status}`">
                    {{ getStatusText(order.status) }}
                  </div>
                </div>
                <div class="order-total">${{ order.total.toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Configuración -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <div class="content-card">
            <div class="card-header">
              <h2>Configuración</h2>
            </div>
            
            <div class="settings-list">
              <div class="setting-item">
                <div class="setting-info">
                  <h3>Notificaciones por email</h3>
                  <p>Recibe actualizaciones sobre tus pedidos</p>
                </div>
                <div class="setting-control">
                  <label class="toggle">
                    <input v-model="settings.emailNotifications" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Newsletter</h3>
                  <p>Ofertas especiales y productos nuevos</p>
                </div>
                <div class="setting-control">
                  <label class="toggle">
                    <input v-model="settings.newsletter" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Tema</h3>
                  <p>Personaliza la apariencia</p>
                </div>
                <div class="setting-control">
                  <select v-model="settings.theme" class="theme-select">
                    <option value="light">🌞 Claro</option>
                    <option value="dark">🌙 Oscuro</option>
                    <option value="auto">🔄 Automático</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="danger-zone">
              <h3>Zona de peligro</h3>
              <p>Acciones que no se pueden deshacer</p>
              <button @click="confirmDeleteAccount" class="btn btn-danger">
                🗑️ Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotifications } from '../composables/useNotifications'
import { authService } from '../services/api'

const router = useRouter()
const authStore = useAuthStore()
const { success, error, warning, info } = useNotifications()

// Refs
const avatarInput = ref(null)
const activeTab = ref('info')
const editMode = ref(false)
const saving = ref(false)
const loading = ref(false)

const changingPassword = ref(false)
const sendingVerification = ref(false)

// Tabs configuration
const tabs = [
  { id: 'info', label: 'Información', icon: '👤' },
  { id: 'security', label: 'Seguridad', icon: '🔒' },
  { id: 'orders', label: 'Pedidos', icon: '📦' },
  { id: 'settings', label: 'Configuración', icon: '⚙️' }
]

// Forms
const profileForm = reactive({
  _id: '',
  name: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  direccion: '',
  avatar: '',
  role: ''
})



const settings = reactive({
  emailNotifications: true,
  newsletter: false,
  theme: 'light'
})

// Mock data para pedidos (esto vendría de la API)
const recentOrders = ref([
  { id: '12345', date: new Date('2024-01-15'), status: 'delivered', total: 89.99 },
  { id: '12344', date: new Date('2024-01-10'), status: 'shipped', total: 156.50 },
  { id: '12343', date: new Date('2024-01-05'), status: 'processing', total: 42.30 }
])

// Computed
const userAvatar = computed(() => {
  return authStore.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user?.name || 'Usuario')}&background=ddebc7&color=4a5d23&size=150`
})

// Methods
const loadUserData = () => {
  if (authStore.user) {
    profileForm._id = authStore.user._id || authStore.user.id || ''
    profileForm.name = authStore.user.name || ''
    profileForm.email = authStore.user.email || ''
    profileForm.telefono = authStore.user.telefono || authStore.user.phone || ''
    profileForm.fechaNacimiento = authStore.user.fechaNacimiento || authStore.user.birthDate || ''
    profileForm.direccion = authStore.user.direccion || authStore.user.address || ''
    profileForm.avatar = authStore.user.avatar || ''
    profileForm.role = authStore.user.role || 'user'
  }
}

const enableEditMode = () => {
  editMode.value = true
}

const cancelEdit = () => {
  editMode.value = false
  loadUserData() // Reload original data
}

const saveProfile = async () => {
  saving.value = true
  
  try {
    // Crear objeto con solo los campos editables (sin _id ni role)
    const profileDataToUpdate = {
      name: profileForm.name,
      email: profileForm.email,
      telefono: profileForm.telefono,
      fechaNacimiento: profileForm.fechaNacimiento,
      direccion: profileForm.direccion
    }
    
    const response = await authService.updateProfile(profileDataToUpdate)
    
    // Actualizar el store con los nuevos datos
    Object.assign(authStore.user, profileForm)
    
    success('Perfil actualizado exitosamente')
    editMode.value = false
  } catch (err) {
    error('Error al actualizar el perfil: ' + (err.message || 'Error desconocido'))
  } finally {
    saving.value = false
  }
}

const openAvatarModal = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    error('Por favor selecciona una imagen válida')
    return
  }

  // Validar tamaño (máx 5MB)
  if (file.size > 5 * 1024 * 1024) {
    error('La imagen debe ser menor a 5MB')
    return
  }

  try {
    const formData = new FormData()
    formData.append('avatar', file)

    info('Subiendo avatar...', 2000)
    
    const response = await authService.uploadAvatar(formData)
    
    // Actualizar el avatar en el store si la respuesta incluye la nueva URL
    if (response.avatarUrl) {
      authStore.user.avatar = response.avatarUrl
    }
    
    success('Avatar actualizado exitosamente')
  } catch (err) {
    error('Error al subir el avatar: ' + (err.message || 'Error desconocido'))
  }
}

const handleAvatarError = (event) => {
  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user?.name || 'Usuario')}&background=ddebc7&color=4a5d23&size=150`
}

const changePassword = async () => {
  changingPassword.value = true
  
  try {
    // Enviar solicitud de cambio de contraseña por email
    await authService.requestPasswordReset(authStore.user.email)
    
    success('Se ha enviado un enlace de cambio de contraseña a tu email. Revisa tu bandeja de entrada y sigue las instrucciones.')
  } catch (err) {
    error('Error al solicitar cambio de contraseña: ' + (err.message || 'Error desconocido'))
  } finally {
    changingPassword.value = false
  }
}



const resendVerification = async () => {
  sendingVerification.value = true
  
  try {
    // Aquí harías la llamada para reenviar verificación
    await new Promise(resolve => setTimeout(resolve, 1500))
    success('Email de verificación enviado')
  } catch (err) {
    error('Error al enviar verificación')
  } finally {
    sendingVerification.value = false
  }
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const getStatusText = (status) => {
  const statusMap = {
    'processing': '⏳ Procesando',
    'shipped': '🚚 Enviado',
    'delivered': '✅ Entregado',
    'cancelled': '❌ Cancelado'
  }
  return statusMap[status] || status
}

const confirmDeleteAccount = () => {
  if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
    error('Función de eliminación de cuenta no implementada')
  }
}

// Lifecycle
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.profile-page {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fffe 0%, #f0f7f4 100%);
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.avatar-section {
  position: relative;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 0.875rem;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-edit-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--color-gray-800);
}

.user-email {
  font-size: 1.1rem;
  color: var(--color-gray-600);
  margin: 0 0 1rem 0;
}

.user-badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-verified {
  background: #d1fae5;
  color: #065f46;
}

.badge-member {
  background: #e0f2fe;
  color: #0c4a6e;
}

/* Tabs */
.profile-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-gray-600);
  font-weight: 500;
}

.tab-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-800);
}

.tab-btn-active {
  background: var(--color-primary);
  color: white;
}

.tab-icon {
  font-size: 1.1rem;
}

/* Content */
.profile-content {
  margin-bottom: 2rem;
}

.content-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid var(--color-gray-200);
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-800);
}

/* Forms */
.profile-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-gray-700);
  font-size: 0.875rem;
}

.form-group input,
.form-group textarea,
.theme-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.theme-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(221, 235, 157, 0.1);
}

.form-group input:disabled,
.form-group textarea:disabled {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-200);
}

/* Security */
.security-form {
  padding: 2rem;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 0;
  border-bottom: 1px solid var(--color-gray-200);
  transition: all 0.3s ease;
}

.security-item:last-child {
  border-bottom: none;
}

.security-item:hover {
  background-color: var(--color-gray-50);
  margin: 0 -2rem;
  padding: 2rem;
  border-radius: 12px;
}

.security-info {
  flex: 1;
}

.security-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-gray-800);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.security-info p {
  margin: 0;
  color: var(--color-gray-600);
  font-size: 0.9rem;
  line-height: 1.5;
}

.security-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.verified-text {
  color: var(--color-success) !important;
  font-weight: 500;
}

.unverified-text {
  color: var(--color-error) !important;
  font-weight: 500;
}

.password-summary {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.password-status {
  font-family: monospace;
  color: var(--color-gray-400);
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  background: var(--color-gray-100);
  border-radius: 8px;
  border: 1px solid var(--color-gray-200);
}

/* Settings */
.settings-list {
  padding: 2rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-gray-200);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-800);
}

.setting-info p {
  margin: 0;
  color: var(--color-gray-600);
  font-size: 0.875rem;
}

/* Toggle Switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-gray-300);
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: var(--color-primary);
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* Danger Zone */
.danger-zone {
  margin-top: 3rem;
  padding: 2rem;
  border-top: 1px solid var(--color-gray-200);
  background: #fef2f2;
}

.danger-zone h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-error);
  font-size: 1.1rem;
  font-weight: 600;
}

.danger-zone p {
  margin: 0 0 1.5rem 0;
  color: var(--color-gray-600);
  font-size: 0.875rem;
}

/* Orders */
.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.loading-spinner {
  font-size: 2rem;
  margin-bottom: 1rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-gray-700);
}

.empty-state p {
  margin: 0 0 2rem 0;
  color: var(--color-gray-600);
}

.orders-list {
  padding: 2rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: transform 0.2s ease;
}

.order-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.order-info {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.order-number {
  font-weight: 600;
  color: var(--color-gray-800);
}

.order-date {
  color: var(--color-gray-600);
  font-size: 0.875rem;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-processing {
  background: #fef3c7;
  color: #92400e;
}

.status-shipped {
  background: #dbeafe;
  color: #1e40af;
}

.status-delivered {
  background: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.order-total {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-gray-800);
}

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .profile-tabs {
    flex-wrap: wrap;
  }

  .tab-btn {
    flex: 1;
    min-width: 0;
  }

  .security-item,
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .password-form-fields {
    min-width: auto;
    width: 100%;
  }

  .order-info {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style> 