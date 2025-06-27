<template>
  <div class="register-form">
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="name">Nombre completo</label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name" 
          required
          class="form-control"
        >
      </div>
      
      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          required
          class="form-control"
        >
      </div>
      
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input 
          type="password" 
          id="password" 
          v-model="formData.password" 
          required
          class="form-control"
          minlength="8"
        >
        <small class="password-requirements">
          La contraseña debe tener:
          <ul>
            <li>Al menos 8 caracteres</li>
            <li>Al menos una letra mayúscula</li>
            <li>Al menos un carácter especial (!@#$%^&*.)</li>
          </ul>
        </small>
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="btn-submit"
      >
        {{ loading ? 'Registrando...' : 'Crear cuenta' }}
      </button>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        {{ success }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  name: '',
  email: '',
  password: ''
});

const error = ref('');
const success = ref('');
const loading = ref(false);

function validatePassword(password) {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*.]/.test(password);
  
  if (!hasMinLength) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  if (!hasUpperCase) {
    return 'La contraseña debe contener al menos una letra mayúscula';
  }
  if (!hasSpecialChar) {
    return 'La contraseña debe contener al menos un carácter especial (!@#$%^&*.)';
  }
  return null;
}

async function handleSubmit() {
  try {
    loading.value = true;
    error.value = '';
    success.value = '';
    
    // Validar contraseña
    const passwordError = validatePassword(formData.value.password);
    if (passwordError) {
      error.value = passwordError;
      return;
    }
    
    await authStore.register(formData.value);
    success.value = 'Usuario registrado exitosamente. Redirigiendo...';
    
    setTimeout(() => {
      router.push('/');
    }, 2000);
    
  } catch (err) {
    console.error('Registration error:', err);
    error.value = typeof err === 'string' ? err : (err.error || 'Error al registrar usuario');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #4CAF50;
  outline: none;
}

.password-requirements {
  color: #666;
  font-size: 12px;
  margin-top: 5px;
}

.password-requirements ul {
  margin: 5px 0;
  padding-left: 20px;
}

.password-requirements li {
  margin: 2px 0;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #45a049;
}

.btn-submit:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
}

.success-message {
  color: #28a745;
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
}
</style> 