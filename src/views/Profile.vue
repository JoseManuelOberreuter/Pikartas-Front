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
            <span class="badge badge-admin" v-if="authStore.user?.role === 'admin'">👑 Admin</span>
            <span class="badge badge-member" v-else>👤 Miembro</span>
          </div>
        </div>
      </div>

      <!-- Contenido del perfil -->
      <div class="profile-content">
        
        <!-- Información Personal -->
        <div class="tab-content">
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

        <!-- Seguridad -->
        <div class="tab-content"> 
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
const editMode = ref(false)
const saving = ref(false)

const changingPassword = ref(false)

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

.badge-admin {
  background: #fef3c7;
  color: #92400e;
  font-weight: 600;
}


/* Content */
.profile-content {
  margin-bottom: 2rem;
}

.tab-content {
  margin-bottom: 3rem;
}

.tab-content:last-child {
  margin-bottom: 0;
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

  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .password-form-fields {
    min-width: auto;
    width: 100%;
  }
}
</style> 