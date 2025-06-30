<template>
  <header class="header">
    <nav class="nav">
      <div class="container">
        <!-- Logo Section -->
        <div class="nav-brand">
          <router-link to="/" class="brand-link">
            <div class="logo">
              <span class="logo-icon">🛒</span>
              <span class="logo-text">ShopNodeCore</span>
            </div>
          </router-link>
        </div>
        
        <!-- Navigation Menu -->
        <div class="nav-center">
          <ul class="nav-menu">
            <li><router-link to="/" class="nav-link">Inicio</router-link></li>
            <li><router-link to="/shop" class="nav-link">Tienda</router-link></li>
          </ul>
        </div>
        
        <!-- Actions Section -->
        <div class="nav-actions">
          <div class="cart-section">
            <button class="cart-button" @click="toggleCart">
              <span class="cart-icon">🛒</span>
              <span class="cart-count" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
            </button>
          </div>
          
          <div class="auth-section">
            <div class="auth-buttons">
              <button class="btn btn-outline btn-sm" @click="openLoginModal">
                <span class="btn-text">Iniciar Sesión</span>
              </button>
              <button class="btn btn-primary btn-sm" @click="openRegisterModal">
                <span class="btn-text">Registrarse</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile Menu Toggle -->
        <div class="mobile-menu-toggle">
          <button class="hamburger" @click="toggleMobileMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" :class="{ 'mobile-menu-open': mobileMenuOpen }">
        <ul class="mobile-nav-menu">
          <li><router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">Inicio</router-link></li>
          <li><router-link to="/shop" class="mobile-nav-link" @click="closeMobileMenu">Tienda</router-link></li>
        </ul>
        <div class="mobile-auth-buttons">
          <button class="btn btn-outline btn-full" @click="openLoginModal(); closeMobileMenu()">
            Iniciar Sesión
          </button>
          <button class="btn btn-primary btn-full" @click="openRegisterModal(); closeMobileMenu()">
            Registrarse
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { cartItemCount, toggleCart } from '../stores/cart.js'

const emit = defineEmits(['open-login', 'open-register'])
const mobileMenuOpen = ref(false)

const openLoginModal = () => {
  emit('open-login')
}

const openRegisterModal = () => {
  emit('open-register')
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<style scoped>
.header {
  background: var(--color-white);
  box-shadow: var(--shadow-md);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  border-bottom: var(--border-width-thin) solid var(--color-gray-200);
}

.nav {
  position: relative;
}

.nav .container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-2xl);
  min-height: var(--header-height);
  gap: var(--spacing-2xl);
}

/* === LOGO SECTION === */
.nav-brand {
  justify-self: start;
}

.brand-link {
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-normal);
}

.brand-link:hover {
  transform: scale(1.02);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo-icon {
  font-size: var(--font-size-2xl);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.logo-text {
  background: linear-gradient(45deg, var(--color-secondary), var(--color-tertiary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.02em;
}

/* === NAVIGATION CENTER === */
.nav-center {
  justify-self: center;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: var(--spacing-4xl);
  margin: 0;
  padding: 0;
  justify-content: center;
}

.nav-link {
  text-decoration: none;
  color: var(--color-gray-700);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-lg);
  transition: all var(--transition-normal);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  position: relative;
  letter-spacing: 0.01em;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
  transition: all var(--transition-normal);
  transform: translateX(-50%);
  border-radius: var(--border-radius-full);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-tertiary);
  background: rgba(221, 235, 157, 0.08);
}

.nav-link:hover::before,
.nav-link.router-link-active::before {
  width: 80%;
}

/* === ACTIONS SECTION === */
.nav-actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: var(--spacing-2xl);
}

.cart-section {
  position: relative;
}

.cart-button {
  position: relative;
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  cursor: pointer;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
  color: var(--color-gray-600);
  border: var(--border-width-thin) solid transparent;
}

.cart-button:hover {
  background: rgba(221, 235, 157, 0.12);
  color: var(--color-tertiary);
  transform: scale(1.05);
  border-color: var(--color-primary);
}

.cart-count {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  background: var(--color-error);
  color: var(--color-white);
  border-radius: var(--border-radius-full);
  width: 22px;
  height: 22px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-white);
  box-shadow: var(--shadow-sm);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.auth-section {
  border-left: var(--border-width-thin) solid var(--color-gray-200);
  padding-left: var(--spacing-xl);
}

.auth-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.btn {
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  transition: all var(--transition-normal);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: var(--border-width-thin) solid transparent;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

.btn-sm {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-sm);
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
  box-shadow: var(--shadow-md);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-quaternary);
  border-color: var(--color-primary);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* === MOBILE MENU === */
.mobile-menu-toggle {
  display: none;
  justify-self: end;
}

.hamburger {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  flex-direction: column;
  gap: 4px;
  display: flex;
}

.hamburger:hover {
  background: var(--color-gray-100);
}

.hamburger span {
  width: 24px;
  height: 3px;
  background: var(--color-gray-700);
  border-radius: var(--border-radius-full);
  transition: all var(--transition-normal);
}

.mobile-menu {
  display: none;
  background: var(--color-white);
  border-top: var(--border-width-thin) solid var(--color-gray-200);
  padding: var(--spacing-xl);
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  box-shadow: var(--shadow-lg);
  transform: translateY(-10px);
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-normal);
}

.mobile-menu-open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-nav-menu {
  list-style: none;
  margin: 0 0 var(--spacing-xl) 0;
  padding: 0;
}

.mobile-nav-menu li {
  margin-bottom: var(--spacing-md);
}

.mobile-nav-link {
  display: block;
  text-decoration: none;
  color: var(--color-gray-700);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-lg);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: var(--color-tertiary);
  background: rgba(221, 235, 157, 0.1);
}

.mobile-auth-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* === RESPONSIVE DESIGN === */
@media (max-width: 1024px) {
  .nav .container {
    grid-template-columns: 1fr auto;
    gap: var(--spacing-xl);
  }
  
  .nav-center {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: block;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .auth-section {
    border-left: none;
    padding-left: 0;
  }
  
  .auth-buttons {
    gap: var(--spacing-sm);
  }
  
  .btn-text {
    display: none;
  }
  
  .btn {
    min-width: 40px;
    padding: var(--spacing-sm);
  }
}

@media (max-width: 768px) {
  .nav .container {
    padding: var(--spacing-md) var(--spacing-lg);
    gap: var(--spacing-lg);
  }
  
  .logo-text {
    font-size: var(--font-size-xl);
  }
  
  .logo-icon {
    font-size: var(--font-size-xl);
  }
  
  .nav-actions {
    gap: var(--spacing-lg);
  }
  
  .cart-button {
    padding: var(--spacing-sm);
    font-size: var(--font-size-xl);
  }
}

@media (max-width: 480px) {
  .nav .container {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .logo-text {
    font-size: var(--font-size-lg);
  }
  
  .logo-icon {
    font-size: var(--font-size-lg);
  }
  
  .auth-buttons {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
}
</style> 