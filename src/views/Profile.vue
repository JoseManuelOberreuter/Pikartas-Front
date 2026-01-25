<template>
  <div class="profile-page">
    <div class="container">
      <!-- Header del perfil -->
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar-container">
            <font-awesome-icon icon="user" class="avatar-icon" />
          </div>
        </div>
        
        <div class="user-info">
          <h1 class="user-name">{{ authStore.user?.name || 'Usuario' }}</h1>
          <p class="user-email">{{ authStore.user?.email || 'No email' }}</p>
          <div class="user-badges">
            <span class="badge badge-verified" v-if="authStore.user?.isVerified">
              <font-awesome-icon icon="check-circle" class="badge-icon" />
              Verificado
            </span>
            <span class="badge badge-admin" v-if="authStore.user?.role === 'admin'">
              <font-awesome-icon icon="crown" class="badge-icon" />
              Admin
            </span>
            <span class="badge badge-member" v-else>
              <font-awesome-icon icon="user" class="badge-icon" />
              Miembro
            </span>
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
                <font-awesome-icon icon="edit" class="btn-icon" />
                Editar
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
                  <font-awesome-icon 
                    :icon="saving ? 'spinner' : 'save'" 
                    :spin="saving" 
                    class="btn-icon" 
                  />
                  {{ saving ? 'Guardando...' : 'Guardar cambios' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Seguridad -->
        <div class="tab-content"> 
          <div class="content-card">
            <div class="card-header">
              <h2>
                <font-awesome-icon icon="shield-alt" class="security-icon" />
                Seguridad de la cuenta
              </h2>
            </div>
            
            <div class="security-form">
              <div class="security-item">
                <div class="security-info">
                  <h3>
                    <font-awesome-icon icon="lock" class="lock-icon" />
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
                      <font-awesome-icon 
                        :icon="changingPassword ? 'envelope' : 'lock'" 
                        :spin="changingPassword" 
                        class="btn-icon btn-icon-profile" 
                      />
                      {{ changingPassword ? 'Enviando...' : 'Solicitar por email' }}
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
  role: ''
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
  position: relative;
  padding-top: calc(var(--header-height) + 8rem);
  padding-bottom: 80px;
  min-height: 100vh;
  background: var(--color-black);
  color: var(--color-white);
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.avatar-section {
  position: relative;
}

.avatar-container {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
  border: 4px solid var(--color-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all var(--transition-normal);
}

.avatar-container:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
}

.avatar-icon {
  font-size: 4rem;
  color: white;
  transition: all var(--transition-normal);
}

.avatar-container:hover .avatar-icon {
  transform: scale(1.1);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--color-white);
}

.user-email {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
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
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.badge-icon {
  font-size: 0.75rem;
  transition: all var(--transition-normal);
}

.badge-verified .badge-icon {
  color: var(--icon-profile-verified);
}

.badge-admin .badge-icon {
  color: var(--icon-profile-admin);
}

.badge-member .badge-icon {
  color: var(--icon-profile-member);
}

.badge:hover .badge-icon {
  transform: scale(1.1);
}

.badge-verified {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid #10b981;
}

.badge-member {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.badge-admin {
  background: rgba(253, 179, 28, 0.2);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-white);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.security-icon {
  color: var(--icon-profile-lock);
  font-size: 1.2em;
  transition: all var(--transition-normal);
}

.card-header:hover .security-icon {
  transform: scale(1.1);
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
  color: var(--color-white);
  font-size: 0.875rem;
}

.form-group input,
.form-group textarea,
.theme-select {
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group textarea {
  border-radius: 16px;
  min-height: 100px;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-group input:focus,
.form-group textarea:focus,
.theme-select:focus {
  outline: none;
  border-color: var(--color-white);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.form-group input:disabled,
.form-group textarea:disabled {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
  opacity: 0.6;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: 2px solid;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.btn-sm {
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-base);
}

.btn-icon {
  font-size: 0.875rem;
  transition: all var(--transition-normal);
}

.btn:hover .btn-icon {
  transform: scale(1.1);
}

.btn-outline {
  background: transparent;
  color: var(--color-white);
  border-color: var(--color-white);
}

.btn-outline:hover {
  background: var(--color-white);
  color: var(--color-black);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.btn-outline:hover .btn-icon {
  color: var(--color-black);
}

.btn-primary {
  background: var(--color-white);
  color: var(--color-black);
  border-color: var(--color-white);
}

.btn-primary:hover {
  background: transparent;
  color: var(--color-white);
  border-color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.btn-primary:hover .btn-icon {
  color: var(--color-white);
}

.btn-primary .btn-icon {
  color: var(--color-black);
}

.btn-outline .btn-icon {
  color: var(--color-white);
}

/* Iconos específicos para botones de perfil */
.btn-icon-profile {
  color: var(--icon-profile-btn-lock) !important;
}

.btn-primary:hover .btn-icon-profile {
  color: var(--icon-profile-btn-lock) !important;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.security-item:last-child {
  border-bottom: none;
}

.security-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  margin: 0 -2rem;
  padding: 2rem;
  border-radius: 12px;
  border-color: var(--color-primary);
}

.security-info {
  flex: 1;
}

.security-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-white);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lock-icon {
  color: var(--icon-profile-lock);
  font-size: 1em;
  transition: all var(--transition-normal);
}

.security-item:hover .lock-icon {
  transform: scale(1.1);
}

.security-info p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
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
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
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