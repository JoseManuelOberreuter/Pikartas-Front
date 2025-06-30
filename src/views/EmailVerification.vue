<template>
  <div class="verification-container">
    <div class="verification-card">
      <div v-if="!verifying && !verified && !token" class="check-email">
        <h2>📧 Revisa tu Correo</h2>
        <p>Te hemos enviado un email de verificación. Haz clic en el enlace para activar tu cuenta.</p>
        <router-link to="/" class="btn btn-primary">Volver al Inicio</router-link>
      </div>
      
      <div v-if="verifying" class="verifying">
        <div class="spinner"></div>
        <h2>⏳ Verificando...</h2>
        <p>Estamos verificando tu cuenta, por favor espera.</p>
      </div>
      
      <div v-if="verified" class="success">
        <h2>✅ ¡Cuenta Verificada!</h2>
        <p>Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar sesión.</p>
        <router-link to="/" class="btn btn-primary">Ir al Inicio</router-link>
      </div>
      
      <div v-if="error" class="error">
        <h2>❌ Error de Verificación</h2>
        <p>{{ error }}</p>
        <router-link to="/" class="btn btn-outline">Volver al Inicio</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const verifying = ref(false)
const verified = ref(false)
const error = ref(null)
const token = ref(null)

onMounted(async () => {
  token.value = route.query.token
  
  if (token.value) {
    try {
      verifying.value = true
      await authStore.verifyEmail(token.value)
      verified.value = true
    } catch (err) {
      error.value = err.error || 'Error al verificar la cuenta'
    } finally {
      verifying.value = false
    }
  }
})
</script>

<style scoped>
.verification-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 2rem;
}

.verification-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.verification-card h2 {
  margin-bottom: 1rem;
  color: #333;
}

.verification-card p {
  margin-bottom: 2rem;
  color: #666;
  line-height: 1.6;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: 1px solid #007bff;
}

.btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.btn-outline {
  background: transparent;
  color: #666;
  border: 1px solid #666;
}

.btn-outline:hover {
  background: #666;
  color: white;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #007bff;
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

.verifying {
  color: #007bff;
}

@media (max-width: 768px) {
  .verification-card {
    padding: 2rem;
    margin: 1rem;
  }
}
</style> 