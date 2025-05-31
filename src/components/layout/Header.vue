<template>
  <header class="header">
    <div class="logo">Demoliciones CRRB</div>
    <button class="menu-toggle" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <nav class="nav" :class="{ 'active': isMenuOpen }">
      <a href="#inicio" class="nav-link" @click="closeMenu">Inicio</a>
      <a href="#nosotros" class="nav-link" @click="closeMenu">Sobre Nosotros</a>
      <a href="#proyectos" class="nav-link" @click="closeMenu">Nuestros Proyectos</a>
      <a href="#contacto" class="nav-link" @click="closeMenu">Contáctanos</a>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : '';
};

const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  transition: all 0.3s ease;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffc107;
  z-index: 1001;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.menu-toggle span {
  width: 100%;
  height: 3px;
  background-color: #ffc107;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.menu-toggle.active span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #f5f5f5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #ffc107;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #ffc107;
}

.nav-link:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }
  
  .menu-toggle {
    display: flex;
  }
  
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.95);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
  }
  
  .nav.active {
    transform: translateX(0);
  }
  
  .nav-link {
    font-size: 1.2rem;
  }
  
  .nav-link::after {
    bottom: -8px;
  }
}
</style> 