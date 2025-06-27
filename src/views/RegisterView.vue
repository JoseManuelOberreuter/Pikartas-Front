<template>
  <div class="register-view">
    <div class="register-container">
      <h1>Crear cuenta</h1>
      <p class="subtitle">Únete a nuestra tienda para comenzar a comprar</p>
      <RegisterForm />
      <div class="login-link">
        ¿Ya tienes una cuenta? 
        <router-link to="/login">Iniciar sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import RegisterForm from '../components/RegisterForm.vue';
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 500px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 2em;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

.login-link {
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}
</style> 