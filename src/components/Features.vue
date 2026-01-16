<template>
  <section class="features">
    <div class="container">
      <h2 class="section-title text-title-primary">¿Por qué elegir Pikartas?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <font-awesome-icon icon="truck" class="feature-icon" />
          <h3 class="text-body-primary">Envío Rápido</h3>
          <p class="text-body-accent">Envío gratuito en compras mayores a $500. Entrega en 24-48 horas.</p>
        </div>
        <div class="feature-card">
          <font-awesome-icon icon="shield-alt" class="feature-icon" />
          <h3 class="text-body-primary">Compra Segura</h3>
          <p class="text-body-accent">Pagos 100% seguros con encriptación SSL y múltiples métodos de pago.</p>
        </div>
        <div class="feature-card">
          <font-awesome-icon icon="star" class="feature-icon" />
          <h3 class="text-body-primary">Calidad Garantizada</h3>
          <p class="text-body-accent">Productos originales con garantía oficial y soporte técnico especializado.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Features component - No necesita lógica adicional
</script>

<style scoped>
/* Features Section */
.features {
  padding: var(--spacing-6xl) 0;
  background: rgba(0, 0, 0, 0.5);
}

.section-title {
  text-align: center;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-5xl) 0;
  color: var(--color-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-3xl);
}

.feature-card {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: var(--spacing-3xl);
  border-radius: var(--border-radius-xl);
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  border: var(--border-width-thin) solid var(--color-primary);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--color-quaternary);
  transform: translateX(-100%);
  transition: transform var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-var(--spacing-sm));
  box-shadow: var(--shadow-lg);
}

.feature-card:hover::before {
  transform: translateX(0);
}

.feature-icon {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
  transition: all var(--transition-normal);
  display: block;
}

.feature-card:hover .feature-icon {
  color: var(--color-quaternary);
  transform: scale(1.1);
}

.feature-card h3 {
  margin: 0 0 var(--spacing-lg) 0;
}

.feature-card p {
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-title {
    font-size: var(--font-size-2xl);
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .features {
    padding: var(--spacing-5xl) 0;
  }
}

@media (max-width: 480px) {
  .feature-card {
    padding: var(--spacing-xl);
  }
}
</style>
