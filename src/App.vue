<template>
  <div id="app">
    <!-- Header Component -->
    <Header 
      @open-login="openLoginModal"
      @open-register="openRegisterModal"
    />

    <!-- Auth Modal Component -->
    <AuthModal
      :show-login-modal="showLoginModal"
      :show-register-modal="showRegisterModal"
      @close-modals="closeModals"
      @switch-to-register="switchToRegister"
      @switch-to-login="switchToLogin"
    />

    <!-- Main Content - Router View -->
    <main>
      <router-view />
    </main>

    <!-- Cart Sidebar Component -->
    <CartSidebar />

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'
import CartSidebar from './components/CartSidebar.vue'
import AuthModal from './components/AuthModal.vue'
import Footer from './components/Footer.vue'

// Auth modals state
const showLoginModal = ref(false)
const showRegisterModal = ref(false)

// Modal functions
const openLoginModal = () => {
  showLoginModal.value = true
  showRegisterModal.value = false
}

const openRegisterModal = () => {
  showRegisterModal.value = true
  showLoginModal.value = false
}

const closeModals = () => {
  showLoginModal.value = false
  showRegisterModal.value = false
}

const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

const switchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}
</script>

<style>
/* Reset y estilos base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
}
</style>