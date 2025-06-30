<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>🛒 ShopVue</h3>
          <p>Tu tienda online de tecnología favorita</p>
        </div>
        <div class="footer-section">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><router-link to="/">Inicio</router-link></li>
            <li><router-link to="/shop">Tienda</router-link></li>
            <li><router-link to="/cart">Carrito</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Contacto</h4>
          <p>📧 info@shopvue.com</p>
          <p>📞 +1 (555) 123-4567</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 ShopVue. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No necesita lógica adicional por ahora
</script>

<style scoped>
/* Footer */
.footer {
  background: linear-gradient(135deg, var(--color-quaternary) 0%, var(--color-tertiary) 100%);
  color: var(--color-white);
  padding: var(--spacing-5xl) 0 var(--spacing-lg);
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-3xl);
  margin-bottom: var(--spacing-3xl);
}

.footer-section h3,
.footer-section h4 {
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
}

.footer-section h3 {
  font-size: var(--font-size-xl);
}

.footer-section h4 {
  font-size: var(--font-size-lg);
}

.footer-section p {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-gray-200);
  line-height: var(--line-height-relaxed);
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: var(--spacing-sm);
}

.footer-section ul li a {
  color: var(--color-gray-200);
  text-decoration: none;
  transition: all var(--transition-normal);
  padding: var(--spacing-xs) 0;
  display: inline-block;
}

.footer-section ul li a:hover {
  color: var(--color-primary);
  transform: translateX(var(--spacing-xs));
}

.footer-bottom {
  text-align: center;
  padding-top: var(--spacing-3xl);
  border-top: var(--border-width-thin) solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  margin: 0;
  color: var(--color-gray-300);
  font-size: var(--font-size-sm);
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer {
    padding: var(--spacing-4xl) 0 var(--spacing-lg);
  }
}
</style> 