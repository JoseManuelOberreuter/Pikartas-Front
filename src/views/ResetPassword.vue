<template>
  <!-- TODO: verify password security and improve UI -->
  <div class="reset-container">
    <div class="reset-card">
      <div v-if="!validToken && !loading" class="invalid-token">
        <div class="reset-header">
          <h1 class="text-title-primary">
            <font-awesome-icon icon="shopping-cart" class="brand-icon" />
            Pikartas
          </h1>
        </div>
        <h2 class="text-body-primary">
          <font-awesome-icon icon="times-circle" class="error-icon" />
          Token Inválido
        </h2>
        <p class="text-body-accent">El enlace de recuperación es inválido o ha expirado.</p>
        <div class="reset-warning-box">
          <p class="text-body-accent">
            <font-awesome-icon icon="exclamation-triangle" class="warning-icon" />
            <strong>Importante:</strong> Los enlaces de recuperación son válidos por 1 hora solamente.
          </p>
        </div>
        <router-link to="/" class="btn btn-outline">
          <font-awesome-icon icon="home" class="btn-icon" />
          Volver al Inicio
        </router-link>
      </div>

      <div v-if="loading" class="loading">
        <font-awesome-icon icon="spinner" spin class="loading-icon" />
        <h2 class="text-body-primary">Cargando...</h2>
      </div>

      <div v-if="validToken && !resetSuccess && !loading" class="reset-form-container">
        <div class="reset-header">
          <h1 class="text-title-primary">
            <font-awesome-icon icon="shopping-cart" class="brand-icon" />
            Pikartas
          </h1>
          <h2 class="text-body-primary">
            <font-awesome-icon icon="lock" class="lock-icon" />
            Restablecer Contraseña
          </h2>
        </div>
        <p class="text-body-accent">Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.</p>

        <form @submit.prevent="handleResetPassword" class="reset-form">
          <div class="form-group">
            <label for="newPassword" class="form-label-reset">Nueva Contraseña</label>
            <div class="password-input-wrapper">
              <input
                :type="showNewPassword ? 'text' : 'password'"
                id="newPassword"
                v-model="resetForm.password"
                placeholder="Mínimo 6 caracteres"
                required
                minlength="6"
                class="reset-input"
              >
              <button
                type="button"
                class="password-toggle-btn"
                @mousedown.prevent="showNewPassword = true"
                @mouseup="showNewPassword = false"
                @mouseleave="showNewPassword = false"
                @touchstart.prevent="showNewPassword = true"
                @touchend="showNewPassword = false"
                title="Mantén presionado para ver la contraseña"
                aria-label="Toggle password visibility"
              >
                <font-awesome-icon :icon="showNewPassword ? 'eye-slash' : 'eye'" class="password-icon" />
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmNewPassword" class="form-label-reset">Confirmar Nueva Contraseña</label>
            <div class="password-input-wrapper">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmNewPassword"
                v-model="resetForm.confirmPassword"
                placeholder="Repite tu nueva contraseña"
                required
                class="reset-input"
              >
              <button
                type="button"
                class="password-toggle-btn"
                @mousedown.prevent="showConfirmPassword = true"
                @mouseup="showConfirmPassword = false"
                @mouseleave="showConfirmPassword = false"
                @touchstart.prevent="showConfirmPassword = true"
                @touchend="showConfirmPassword = false"
                title="Mantén presionado para ver la contraseña"
                aria-label="Toggle confirm password visibility"
              >
                <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" class="password-icon" />
              </button>
            </div>
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
        <div class="reset-header">
          <h1 class="text-title-primary">
            <font-awesome-icon icon="shopping-cart" class="brand-icon" />
            Pikartas
          </h1>
        </div>
        <h2 class="text-body-primary">
          <font-awesome-icon icon="check-circle" class="success-icon" />
          ¡Contraseña Restablecida!
        </h2>
        <p class="text-body-accent">Tu contraseña ha sido restablecida exitosamente en <strong>Pikartas</strong>. Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <router-link to="/" class="btn btn-primary">
          <font-awesome-icon icon="home" class="btn-icon" />
          Ir al Inicio
        </router-link>
      </div>

      <div v-if="error" class="error">
        <h2 class="text-title-quaternary">
          <font-awesome-icon icon="times-circle" class="error-icon" />
          Error
        </h2>
        <p class="text-body-accent">{{ error }}</p>
        <button @click="tryAgain" class="btn btn-outline">
          <font-awesome-icon icon="redo" class="btn-icon" />
          Intentar Nuevamente
        </button>
        <router-link to="/" class="btn btn-primary">
          <font-awesome-icon icon="home" class="btn-icon" />
          Volver al Inicio
        </router-link>
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

// Password visibility (hold to show, like login)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

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
/* Same feel as Home: video background shows through, card like Features section */
.reset-container {
  min-height: calc(100vh - var(--header-height));
  margin-top: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  padding: var(--spacing-3xl);
}

.reset-card {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: var(--spacing-5xl);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  text-align: center;
  max-width: 500px;
  width: 100%;
  border: var(--border-width-thin) solid var(--color-primary);
  position: relative;
  overflow: hidden;
}

.reset-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--color-quaternary);
  transform: translateX(-100%);
  transition: transform var(--transition-normal);
}

.reset-card:hover::before {
  transform: translateX(0);
}

.reset-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.reset-header h1 {
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.reset-header h2 {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.brand-icon {
  color: var(--color-primary);
  font-size: 1.2em;
  transition: all var(--transition-normal);
}

.reset-card:hover .brand-icon {
  transform: scale(1.1) rotate(5deg);
}

.error-icon {
  color: var(--color-quaternary);
  font-size: 1.1em;
  transition: all var(--transition-normal);
}

.warning-icon {
  color: var(--color-warning);
  font-size: 1em;
  margin-right: 0.5rem;
  transition: all var(--transition-normal);
}

.lock-icon {
  color: var(--color-primary);
  font-size: 1.1em;
  transition: all var(--transition-normal);
}

.success-icon {
  color: var(--color-success);
  font-size: 1.1em;
  transition: all var(--transition-normal);
}

.reset-card:hover .error-icon,
.reset-card:hover .warning-icon,
.reset-card:hover .lock-icon,
.reset-card:hover .success-icon {
  transform: scale(1.1);
}

.reset-card p {
  margin-bottom: var(--spacing-3xl);
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-base);
}

.reset-warning-box {
  background: rgba(253, 179, 28, 0.2);
  border: 1px solid var(--color-primary);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  margin: var(--spacing-2xl) 0;
}

.reset-form {
  text-align: left;
  margin-top: var(--spacing-3xl);
}

.form-group {
  margin-bottom: var(--spacing-xl);
}

.form-label-reset {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
}

.reset-input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  color: var(--color-white);
  background: rgba(0, 0, 0, 0.4);
  transition: all var(--transition-normal);
}

.reset-input::placeholder {
  color: var(--color-gray-400);
}

.reset-input:focus {
  outline: none;
  border-color: var(--color-quaternary);
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.2);
}

.password-input-wrapper {
  position: relative;
}

.password-input-wrapper .reset-input {
  padding-right: 2.75rem;
}

.password-toggle-btn {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-400);
  transition: color var(--transition-normal);
  z-index: 10;
}

.password-toggle-btn:hover {
  color: var(--color-primary);
}

.password-icon {
  font-size: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-sm);
  transition: all 0.3s ease;
  border: 2px solid;
  cursor: pointer;
  gap: 0.5rem;
}

.btn-icon {
  font-size: 0.875rem;
  transition: all var(--transition-normal);
}

.btn:hover .btn-icon {
  transform: scale(1.1);
}

.btn-primary {
  background: var(--color-white);
  color: var(--color-black);
  border-color: var(--color-white);
}

.btn-primary:hover:not(:disabled) {
  background: transparent;
  color: var(--color-white);
  border-color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.btn-primary:hover:not(:disabled) .btn-icon {
  color: var(--color-white);
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

.btn-full {
  width: 100%;
  margin: var(--spacing-lg) 0;
}

.loading-icon {
  font-size: 2rem;
  color: var(--color-primary);
  margin: 0 auto var(--spacing-lg);
  display: block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success h2 {
  margin-bottom: var(--spacing-lg);
}

.error h2 {
  margin-bottom: var(--spacing-lg);
}

.loading h2 {
  margin-top: var(--spacing-lg);
}

.invalid-token h2 {
  margin-bottom: var(--spacing-lg);
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