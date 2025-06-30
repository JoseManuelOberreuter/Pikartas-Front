<template>
  <div class="reset-container">
    <div class="reset-card">
      <div v-if="!validToken && !loading" class="invalid-token">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333; margin-bottom: 10px;">🛒 ShopNodeCore</h1>
        </div>
        <h2>❌ Token Inválido</h2>
        <p>El enlace de recuperación es inválido o ha expirado.</p>
        <div style="background: #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #e74c3c; margin: 0;">
            ⚠️ <strong>Importante:</strong> Los enlaces de recuperación son válidos por 1 hora solamente.
          </p>
        </div>
        <router-link to="/" class="btn btn-outline">Volver al Inicio</router-link>
      </div>
      
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <h2>⏳ Cargando...</h2>
      </div>
      
      <div v-if="validToken && !resetSuccess && !loading" class="reset-form-container">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333; margin-bottom: 10px;">🛒 ShopNodeCore</h1>
          <h2 style="color: #ff6b35;">🔐 Restablecer Contraseña</h2>
        </div>
        <p>Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.</p>
        
        <form @submit.prevent="handleResetPassword" class="reset-form">
          <div class="form-group">
            <label for="newPassword">Nueva Contraseña</label>
            <input 
              type="password" 
              id="newPassword"
              v-model="resetForm.password" 
              placeholder="Mínimo 6 caracteres" 
              required
              minlength="6"
            >
          </div>
          
          <div class="form-group">
            <label for="confirmNewPassword">Confirmar Nueva Contraseña</label>
            <input 
              type="password" 
              id="confirmNewPassword"
              v-model="resetForm.confirmPassword" 
              placeholder="Repite tu nueva contraseña" 
              required
            >
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary btn-full"
            :disabled="authStore.loading"
          >
            {{ authStore.loading ? 'Restableciendo...' : 'Restablecer Contraseña' }}
          </button>
        </form>
      </div>
      
      <div v-if="resetSuccess" class="success">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333; margin-bottom: 10px;">🛒 ShopNodeCore</h1>
        </div>
        <h2>✅ ¡Contraseña Restablecida!</h2>
        <p>Tu contraseña ha sido restablecida exitosamente en <strong>ShopNodeCore</strong>. Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <router-link to="/" class="btn btn-primary">Ir al Inicio</router-link>
      </div>
      
      <div v-if="error" class="error">
        <h2>❌ Error</h2>
        <p>{{ error }}</p>
        <button @click="tryAgain" class="btn btn-outline">Intentar Nuevamente</button>
        <router-link to="/" class="btn btn-primary">Volver al Inicio</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const validToken = ref(false)
const resetSuccess = ref(false)
const error = ref(null)
const token = ref(null)

const resetForm = reactive({
  password: '',
  confirmPassword: ''
})

onMounted(async () => {
  token.value = route.query.token
  
  if (!token.value) {
    loading.value = false
    validToken.value = false
    return
  }

  // Simular verificación del token (opcional, o puedes validar directamente al enviar)
  setTimeout(() => {
    loading.value = false
    validToken.value = true
  }, 1000)
})

const handleResetPassword = async () => {
  // Validaciones
  if (!resetForm.password || !resetForm.confirmPassword) {
    error.value = 'Por favor completa todos los campos'
    return
  }
  
  if (resetForm.password !== resetForm.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  
  if (resetForm.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  try {
    error.value = null
    const response = await authStore.resetPassword(token.value, resetForm.password)
    
    resetSuccess.value = true
    
    // Opcional: redirigir automáticamente después de 3 segundos
    setTimeout(() => {
      router.push('/')
    }, 3000)
    
  } catch (err) {
    error.value = err.error || err.message || 'Error al restablecer la contraseña'
  }
}

const tryAgain = () => {
  error.value = null
  resetForm.password = ''
  resetForm.confirmPassword = ''
}
</script>

<style scoped>
.reset-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-gray-100) 0%, var(--color-primary-light) 100%);
  padding: var(--spacing-3xl);
}

.reset-card {
  background: var(--color-white);
  padding: var(--spacing-5xl);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-lg);
  text-align: center;
  max-width: 500px;
  width: 100%;
  border: var(--border-width-thin) solid var(--color-gray-200);
}

.reset-card h1 {
  color: var(--color-tertiary);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
}

.reset-card h2 {
  margin-bottom: var(--spacing-lg);
  color: var(--color-tertiary);
  font-weight: var(--font-weight-semibold);
}

.reset-card p {
  margin-bottom: var(--spacing-3xl);
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-base);
}

.reset-form {
  text-align: left;
  margin-top: var(--spacing-3xl);
}

.form-group {
  margin-bottom: var(--spacing-xl);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
}

.form-group input {
  width: 100%;
  padding: var(--spacing-md);
  border: var(--border-width-thin) solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-gray-700);
  background-color: var(--color-white);
  transition: all var(--transition-normal);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(221, 235, 157, 0.15);
}

.form-group input::placeholder {
  color: var(--color-gray-400);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  margin: var(--spacing-sm);
  transition: all var(--transition-normal);
  border: var(--border-width-thin) solid;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-quaternary);
  border-color: var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  background: var(--color-gray-400);
  border-color: var(--color-gray-400);
  color: var(--color-gray-600);
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-outline {
  background: transparent;
  color: var(--color-tertiary);
  border-color: var(--color-tertiary);
}

.btn-outline:hover {
  background: var(--color-tertiary);
  color: var(--color-white);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-full {
  width: 100%;
  margin: var(--spacing-lg) 0;
}

.spinner {
  border: 3px solid var(--color-gray-200);
  border-radius: var(--border-radius-full);
  border-top: 3px solid var(--color-primary);
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-lg);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success {
  color: var(--color-success);
}

.success h2 {
  color: var(--color-success);
}

.error {
  color: var(--color-error);
}

.error h2 {
  color: var(--color-error);
}

.loading {
  color: var(--color-tertiary);
}

.loading h2 {
  color: var(--color-tertiary);
}

.invalid-token {
  color: var(--color-error);
}

.invalid-token h2 {
  color: var(--color-error);
}

@media (max-width: 768px) {
  .reset-container {
    padding: var(--spacing-lg);
  }
  
  .reset-card {
    padding: var(--spacing-3xl);
    margin: var(--spacing-lg);
  }
  
  .btn {
    width: 100%;
    margin: var(--spacing-sm) 0;
  }
}
</style> 