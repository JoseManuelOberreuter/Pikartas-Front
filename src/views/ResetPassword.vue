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
  background-color: #f8f9fa;
  padding: 2rem;
}

.reset-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.reset-card h2 {
  margin-bottom: 1rem;
  color: #333;
}

.reset-card p {
  margin-bottom: 2rem;
  color: #666;
  line-height: 1.6;
}

.reset-form {
  text-align: left;
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.875rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  margin: 0.5rem;
  transition: all 0.3s;
  border: 1px solid;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: #ff6b35;
  color: white;
  border-color: #ff6b35;
}

.btn-primary:hover:not(:disabled) {
  background: #e55a2b;
  border-color: #e55a2b;
}

.btn-primary:disabled {
  background: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  color: #666;
  border-color: #666;
}

.btn-outline:hover {
  background: #666;
  color: white;
}

.btn-full {
  width: 100%;
  margin: 1rem 0;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #ff6b35;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success {
  color: #28a745;
}

.error {
  color: #dc3545;
}

.loading {
  color: #ff6b35;
}

.invalid-token {
  color: #dc3545;
}

@media (max-width: 768px) {
  .reset-card {
    padding: 2rem;
    margin: 1rem;
  }
  
  .btn {
    width: 100%;
    margin: 0.5rem 0;
  }
}
</style> 