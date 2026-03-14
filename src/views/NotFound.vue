<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-card">
        <div class="not-found-icon">
          <font-awesome-icon icon="map-marker-alt" class="icon-svg" />
        </div>
        <h1 class="not-found-title">Página no encontrada</h1>
        <p class="not-found-code">404</p>
        <p class="not-found-message">Lo sentimos, esa página no existe.</p>
        <router-link to="/" class="btn btn-primary btn-home">
          <font-awesome-icon icon="home" class="btn-icon" />
          Ir al inicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No business logic required; route and link handle navigation
</script>

<style scoped>
.not-found {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: transparent;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.not-found-card {
  max-width: 560px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border: 2px solid var(--color-primary);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.not-found-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--color-primary);
  opacity: 0.8;
}

.not-found-icon {
  width: 80px;
  height: 80px;
  background: var(--color-primary);
  color: var(--color-black);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-2xl);
}

.icon-svg {
  font-size: 2rem;
}

.not-found-title {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  margin: 0 0 var(--spacing-sm);
}

.not-found-code {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-xl);
  opacity: 0.9;
}

.not-found-message {
  font-size: var(--font-size-lg);
  color: var(--color-white);
  margin: 0 0 var(--spacing-3xl);
  opacity: 0.9;
}

.btn-home {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  transition: all var(--transition-normal);
}

.btn-home:hover {
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1em;
}

@media (max-width: 768px) {
  .not-found {
    padding-top: 100px;
  }

  .not-found-card {
    padding: 2rem 1.5rem;
  }
}
</style>
