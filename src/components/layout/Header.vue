<template>
  <header class="header">
    <div class="logo">Demoliciones CRRB</div>
    <nav class="nav">
      <a href="#inicio" class="nav-link">Inicio</a>
      <a href="#nosotros" class="nav-link">Sobre Nosotros</a>
      <a href="#proyectos" class="nav-link">Nuestros Proyectos</a>
      <a href="#contacto" class="nav-link">Contáctanos</a>
    </nav>
  </header>
</template>

<script setup>
// No se necesita lógica adicional por ahora
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
    flex-direction: column;
  }
  
  .logo {
    margin-bottom: 1rem;
  }
  
  .nav {
    gap: 1rem;
  }
}
</style> 