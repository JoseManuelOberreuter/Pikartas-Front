<template>
  <header class="header">
    <nav class="nav">
      <div class="container">
        <div class="nav-brand">
          <router-link to="/" class="brand-link">
            <h1>🛒 ShopVue</h1>
          </router-link>
        </div>
        
        <ul class="nav-menu">
          <li><router-link to="/">Inicio</router-link></li>
          <li><router-link to="/shop">Tienda</router-link></li>
        </ul>
        
        <div class="nav-actions">
          <button class="cart-button" @click="toggleCart">
            <span class="cart-icon">🛒</span>
            <span class="cart-count" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
          </button>
          <div class="auth-buttons">
            <button class="btn btn-outline" @click="openLoginModal">Iniciar Sesión</button>
            <button class="btn btn-primary" @click="openRegisterModal">Registrarse</button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { cartItemCount, toggleCart } from '../stores/cart.js'

const emit = defineEmits(['open-login', 'open-register'])

const openLoginModal = () => {
  emit('open-login')
}

const openRegisterModal = () => {
  emit('open-register')
}
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav {
  padding: 1rem 0;
}

.nav .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand .brand-link {
  text-decoration: none;
  color: inherit;
}

.nav-brand h1 {
  color: #007bff;
  font-size: 1.5rem;
  margin: 0;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-menu a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
  padding: 0.5rem;
  border-radius: 4px;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  color: #007bff;
  background: rgba(0, 123, 255, 0.1);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-button {
  position: relative;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s;
}

.cart-button:hover {
  background: rgba(0, 123, 255, 0.1);
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.auth-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-outline {
  background: transparent;
  color: #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .nav .container {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: center;
  }
  
  .auth-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.875rem;
  }
}
</style> 