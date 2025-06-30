<template>
  <!-- Login Modal -->
  <div v-if="showLoginModal" class="modal-overlay" @click="closeModals">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>Iniciar Sesión</h2>
        <button class="close-btn" @click="closeModals">&times;</button>
      </div>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="loginEmail">Email</label>
          <input 
            type="email" 
            id="loginEmail"
            v-model="loginForm.email" 
            placeholder="tu@email.com" 
            required
          >
        </div>
        <div class="form-group">
          <label for="loginPassword">Contraseña</label>
          <input 
            type="password" 
            id="loginPassword"
            v-model="loginForm.password" 
            placeholder="Tu contraseña" 
            required
          >
        </div>
        <button type="submit" class="btn btn-primary btn-full">Iniciar Sesión</button>
        <p class="forgot-password">
          <a href="#" @click.prevent="switchToForgotPassword">¿Olvidaste tu contraseña?</a>
        </p>
        <p class="auth-switch">
          ¿No tienes cuenta? 
          <a href="#" @click.prevent="switchToRegister">Regístrate aquí</a>
        </p>
      </form>
    </div>
  </div>

  <!-- Register Modal -->
  <div v-if="showRegisterModal" class="modal-overlay" @click="closeModals">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>Registrarse</h2>
        <button class="close-btn" @click="closeModals">&times;</button>
      </div>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="registerName">Nombre Completo</label>
          <input 
            type="text" 
            id="registerName"
            v-model="registerForm.name" 
            placeholder="Tu nombre completo" 
            required
          >
        </div>
        <div class="form-group">
          <label for="registerEmail">Email</label>
          <input 
            type="email" 
            id="registerEmail"
            v-model="registerForm.email" 
            placeholder="tu@email.com" 
            required
          >
        </div>
        <div class="form-group">
          <label for="registerPassword">Contraseña</label>
          <input 
            type="password" 
            id="registerPassword"
            v-model="registerForm.password" 
            placeholder="Mínimo 6 caracteres" 
            required
            minlength="6"
          >
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input 
            type="password" 
            id="confirmPassword"
            v-model="registerForm.confirmPassword" 
            placeholder="Repite tu contraseña" 
            required
          >
        </div>
        <button 
          type="submit" 
          class="btn btn-primary btn-full"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Registrando...' : 'Registrarse' }}
        </button>
        <p class="auth-switch">
          ¿Ya tienes cuenta? 
          <a href="#" @click.prevent="switchToLogin">Inicia sesión aquí</a>
        </p>
      </form>
    </div>
  </div>

  <!-- Forgot Password Modal -->
  <div v-if="showForgotPasswordModal" class="modal-overlay" @click="closeModals">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>Recuperar Contraseña</h2>
        <button class="close-btn" @click="closeModals">&times;</button>
      </div>
      <form @submit.prevent="handleForgotPassword" class="auth-form">
        <div class="form-group">
          <label for="forgotEmail">Email</label>
          <input 
            type="email" 
            id="forgotEmail"
            v-model="forgotPasswordForm.email" 
            placeholder="tu@email.com" 
            required
          >
        </div>
        <button 
          type="submit" 
          class="btn btn-primary btn-full"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Enviando...' : 'Enviar Email de Recuperación' }}
        </button>
        <p class="auth-switch">
          ¿Recordaste tu contraseña? 
          <a href="#" @click.prevent="switchToLogin">Inicia sesión aquí</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

// Props
defineProps({
  showLoginModal: {
    type: Boolean,
    default: false
  },
  showRegisterModal: {
    type: Boolean,
    default: false
  },
  showForgotPasswordModal: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close-modals', 'switch-to-register', 'switch-to-login', 'switch-to-forgot-password'])

// Store
const authStore = useAuthStore()

// Auth forms data
const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const forgotPasswordForm = reactive({
  email: ''
})

// Modal functions
const closeModals = () => {
  emit('close-modals')
  // Reset forms
  Object.assign(loginForm, { email: '', password: '' })
  Object.assign(registerForm, { name: '', email: '', password: '', confirmPassword: '' })
  Object.assign(forgotPasswordForm, { email: '' })
}

const switchToRegister = () => {
  emit('switch-to-register')
}

const switchToLogin = () => {
  emit('switch-to-login')
}

const switchToForgotPassword = () => {
  emit('switch-to-forgot-password')
}

// Auth form handlers
const handleLogin = async () => {
  // Basic validation
  if (!loginForm.email || !loginForm.password) {
    alert('Por favor completa todos los campos')
    return
  }
  
  try {
    const response = await authStore.login({
      email: loginForm.email,
      password: loginForm.password
    })
    
    alert(`¡Bienvenido ${response.user.name}! Has iniciado sesión exitosamente.`)
    closeModals()
  } catch (error) {
    // Mostrar el error específico del backend
    const errorMessage = error.error || error.message || 'Error al iniciar sesión'
    alert('Error: ' + errorMessage)
  }
}

const handleRegister = async () => {
  // Basic validation
  if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
    alert('Por favor completa todos los campos')
    return
  }
  
  if (registerForm.password !== registerForm.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }
  
  if (registerForm.password.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres')
    return
  }
  
  try {
    const response = await authStore.register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password
    })
    
    // Mensaje específico para verificación de email
    alert(`¡Registro exitoso! ${response.message}\n\nRevisa tu correo electrónico para verificar tu cuenta.`)
    closeModals()
  } catch (error) {
    // Mostrar el error específico del backend
    const errorMessage = error.error || error.message || 'Error en el registro'
    alert('Error: ' + errorMessage)
  }
}

const handleForgotPassword = async () => {
  // Basic validation
  if (!forgotPasswordForm.email) {
    alert('Por favor ingresa tu email')
    return
  }

  try {
    const response = await authStore.requestPasswordReset(forgotPasswordForm.email)
    alert(response.message)
    closeModals()
  } catch (error) {
    const errorMessage = error.error || error.message || 'Error al solicitar recuperación'
    alert('Error: ' + errorMessage)
  }
}
</script>

<style scoped>
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: translateY(20px);
  animation: slideUp 0.3s forwards;
}

@keyframes slideUp {
  to {
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.auth-form {
  padding: 2rem;
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
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #007bff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
}

.btn-full {
  width: 100%;
  margin-bottom: 1rem;
}

.auth-switch {
  text-align: center;
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.auth-switch a {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.auth-switch a:hover {
  text-decoration: underline;
}

.forgot-password {
  text-align: center;
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.875rem;
}

.forgot-password a {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.forgot-password a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal {
    width: 95%;
    margin: 1rem;
  }
  
  .auth-form {
    padding: 1.5rem;
  }
}
</style> 