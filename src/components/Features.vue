<template>
  <section class="features">
    <div class="container">
      <h2 class="section-title">¿Por qué elegir Pikartas?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <font-awesome-icon icon="truck" class="feature-icon" />
          <h3>Envío Rápido</h3>
          <p>Envío gratuito en compras mayores a $500. Entrega en 24-48 horas.</p>
        </div>
        <div class="feature-card">
          <font-awesome-icon icon="shield-alt" class="feature-icon" />
          <h3>Compra Segura</h3>
          <p>Pagos 100% seguros con encriptación SSL y múltiples métodos de pago.</p>
        </div>
        <div class="feature-card">
          <font-awesome-icon icon="star" class="feature-icon" />
          <h3>Calidad Garantizada</h3>
          <p>Productos originales con garantía oficial y soporte técnico especializado.</p>
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
  background: var(--color-black);
}

.section-title {
  text-align: center;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-5xl) 0;
  color: var(--color-primary);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: var(--color-quaternary);
  border-radius: var(--border-radius-full);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-3xl);
}

.feature-card {
  background: var(--color-white);
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
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--color-primary);
}

.feature-card p {
  color: var(--color-black);
  line-height: var(--line-height-relaxed);
  margin: 0;
  font-size: var(--font-size-base);
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
