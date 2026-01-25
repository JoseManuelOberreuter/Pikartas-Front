<template>
  <section class="verification-hero">
    <div class="verification-container">
      <div class="verification-content">
        <div v-if="!verifying && !verified && !token" class="check-email">
          <h1 class="verification-title">
            <font-awesome-icon icon="envelope" class="section-icon" />
            Revisa tu Correo
          </h1>
          <p class="verification-description">Te hemos enviado un email de verificación. Haz clic en el enlace para activar tu cuenta.</p>
          <div class="verification-actions">
            <router-link to="/" class="btn btn-primary">
              <font-awesome-icon icon="home" class="btn-icon" />
              Volver al Inicio
            </router-link>
          </div>
        </div>
        
        <div v-if="verifying" class="verifying">
          <div class="spinner-container">
            <font-awesome-icon icon="spinner" class="spinner-icon" :spin="true" />
          </div>
          <h1 class="verification-title">
            <font-awesome-icon icon="clock" class="section-icon" />
            Verificando...
          </h1>
          <p class="verification-description">Estamos verificando tu cuenta, por favor espera.</p>
        </div>
        
        <div v-if="verified && !alreadyVerified" class="success">
          <h1 class="verification-title">
            <font-awesome-icon icon="check-circle" class="section-icon" />
            ¡Cuenta Verificada!
          </h1>
          <p class="verification-description">{{ successMessage || 'Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar sesión.' }}</p>
          <div class="verification-actions">
            <router-link to="/" class="btn btn-primary">
              <font-awesome-icon icon="home" class="btn-icon" />
              Ir al Inicio
            </router-link>
          </div>
        </div>
        
        <div v-if="alreadyVerified" class="info">
          <h1 class="verification-title">
            <font-awesome-icon icon="info-circle" class="section-icon" />
            Cuenta Ya Verificada
          </h1>
          <p class="verification-description">{{ successMessage || 'Tu cuenta ya estaba verificada anteriormente. Puedes iniciar sesión directamente.' }}</p>
          <div class="verification-actions">
            <router-link to="/" class="btn btn-primary">
              <font-awesome-icon icon="home" class="btn-icon" />
              Ir al Inicio
            </router-link>
          </div>
        </div>
        
        <div v-if="error" class="error">
          <h1 class="verification-title">
            <font-awesome-icon icon="times-circle" class="section-icon" />
            Error de Verificación
          </h1>
          <p class="verification-description">{{ error }}</p>
          <div v-if="showResendForm" class="resend-form">
            <h3 class="resend-title">
              <font-awesome-icon icon="envelope" class="section-icon" />
              Solicitar Nuevo Correo
            </h3>
            <p class="resend-description">Puedes solicitar un nuevo correo de verificación:</p>
            <form @submit.prevent="handleResendVerification" class="resend-form-content">
              <input 
                type="email" 
                v-model="emailInput" 
                placeholder="tu@email.com" 
                required
                class="email-input"
              />
              <button type="submit" :disabled="resending" class="btn btn-primary">
                <font-awesome-icon 
                  :icon="resending ? 'spinner' : 'paper-plane'" 
                  :spin="resending"
                  class="btn-icon" 
                />
                {{ resending ? 'Enviando...' : 'Solicitar Correo' }}
              </button>
            </form>
            <p v-if="resendMessage" :class="resendSuccess ? 'success-message' : 'error-message'">
              {{ resendMessage }}
            </p>
          </div>
          <div class="verification-actions">
            <router-link to="/" class="btn btn-outline">
              <font-awesome-icon icon="home" class="btn-icon" />
              Volver al Inicio
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/api'
import { useNotifications } from '../composables/useNotifications'

const route = useRoute()
const authStore = useAuthStore()
const { success, error: showError } = useNotifications()

const verifying = ref(false)
const verified = ref(false)
const alreadyVerified = ref(false)
const error = ref(null)
const successMessage = ref(null)
const token = ref(null)
const showResendForm = ref(false)
const emailInput = ref('')
const resending = ref(false)
const resendMessage = ref('')
const resendSuccess = ref(false)

const handleResendVerification = async () => {
  if (!emailInput.value) {
    resendMessage.value = 'Por favor ingresa tu correo electrónico'
    resendSuccess.value = false
    return
  }

  try {
    resending.value = true
    resendMessage.value = ''
    
    await authService.resendVerification(emailInput.value)
    
    resendMessage.value = 'Correo de verificación enviado. Revisa tu bandeja de entrada.'
    resendSuccess.value = true
    success('Correo de verificación enviado exitosamente')
  } catch (err) {
    resendMessage.value = err.error || err.message || 'Error al enviar el correo'
    resendSuccess.value = false
    showError(resendMessage.value)
  } finally {
    resending.value = false
  }
}

onMounted(async () => {
  token.value = route.query.token
  
  if (token.value) {
    try {
      verifying.value = true
      const response = await authStore.verifyEmail(token.value)
      
      // Manejar diferentes tipos de respuesta
      if (response.type === 'ALREADY_VERIFIED') {
        alreadyVerified.value = true
        verified.value = true
        successMessage.value = response.message || 'Tu cuenta ya estaba verificada'
      } else if (response.type === 'VERIFIED') {
        verified.value = true
        successMessage.value = response.message || 'Cuenta verificada exitosamente'
        success('¡Cuenta verificada exitosamente!')
      }
    } catch (err) {
      const errorData = err.response?.data || err
      
      // Determinar el tipo de error y mostrar mensaje apropiado
      if (errorData.type === 'TOKEN_EXPIRED') {
        error.value = errorData.message || 'El enlace de verificación ha expirado'
        showResendForm.value = true
      } else if (errorData.type === 'USER_NOT_FOUND') {
        error.value = errorData.message || 'Usuario no encontrado'
        showResendForm.value = true
      } else if (errorData.type === 'INVALID_TOKEN') {
        error.value = errorData.message || 'Token inválido'
        showResendForm.value = true
      } else {
        error.value = errorData.message || errorData.error || 'Error al verificar la cuenta'
        showResendForm.value = true
      }
      
      showError(error.value)
    } finally {
      verifying.value = false
    }
  }
})
</script>

<style scoped>
/* Verification Hero Section - Following Home Hero Style */
.verification-hero {
  position: relative;
  min-height: calc(100vh - var(--header-height));
  margin-top: var(--header-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-top: 4rem;
  color: var(--color-white);
  overflow: hidden;
}

.verification-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  z-index: 2;
}

.verification-content {
  position: relative;
  text-align: center;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.verification-title {
  font-size: clamp(1.8rem, 4vw, 3rem);
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
}

.verification-description {
  font-size: var(--font-size-xl);
  margin: 0 0 2rem 0;
  opacity: 1;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: var(--line-height-relaxed);
  color: var(--color-white);
}

.section-icon {
  font-size: 1.2em;
  transition: all var(--transition-normal);
  color: var(--color-white);
}

.check-email .section-icon {
  color: var(--color-white);
}

.verifying .section-icon {
  color: var(--color-white);
}

.success .section-icon {
  color: var(--color-white);
}

.error .section-icon {
  color: var(--color-white);
}

.verification-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.verification-actions .btn {
  padding: 1rem 2rem;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 180px;
  justify-content: center;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.verification-actions .btn-primary {
  background: var(--color-white);
  color: var(--color-black);
  border: 2px solid var(--color-white);
}

.verification-actions .btn-primary:hover {
  background: transparent;
  color: var(--color-white);
  border-color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.verification-actions .btn-outline {
  background: transparent;
  color: var(--color-white);
  border: 2px solid var(--color-white);
}

.verification-actions .btn-outline:hover {
  background: var(--color-white);
  color: var(--color-black);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.btn-icon {
  font-size: 0.875rem;
  transition: all var(--transition-normal);
}

/* Spinner Container */
.spinner-container {
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-icon {
  font-size: 3rem;
  color: var(--color-white);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Resend Form */
.resend-form {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-xl);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.resend-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: var(--font-weight-semibold);
}

.resend-description {
  margin-bottom: var(--spacing-lg);
  color: var(--color-white);
  opacity: 0.9;
}

.resend-form-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.resend-form-content .btn {
  padding: 1rem 2rem;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 180px;
  justify-content: center;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  border: 2px solid var(--color-white);
  background: var(--color-white);
  color: var(--color-black);
  cursor: pointer;
}

.resend-form-content .btn:hover:not(:disabled) {
  background: transparent;
  color: var(--color-white);
  border-color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.resend-form-content .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.email-input {
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  transition: all var(--transition-normal);
  text-align: center;
}

.email-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.email-input:focus {
  outline: none;
  border-color: var(--color-white);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.success-message {
  color: var(--color-white);
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm);
  background: rgba(0, 184, 148, 0.2);
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(0, 184, 148, 0.3);
}

.error-message {
  color: var(--color-white);
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm);
  background: rgba(231, 76, 60, 0.2);
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(231, 76, 60, 0.3);
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

/* Responsive Design */
@media (max-width: 768px) {
  .verification-hero {
    padding: 1.5rem;
    padding-top: 3rem;
  }
  
  .verification-title {
    font-size: clamp(1.2rem, 6vw, 2rem);
    line-height: 1.4;
    letter-spacing: 0.3px;
  }
  
  .verification-description {
    font-size: var(--font-size-lg);
  }
  
  .verification-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .verification-actions .btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .verification-hero {
    padding: 1rem;
    padding-top: 2rem;
  }
  
  .verification-title {
    font-size: clamp(1rem, 8vw, 1.5rem);
    line-height: 1.6;
  }
  
  .verification-description {
    font-size: var(--font-size-base);
  }
}
</style> 