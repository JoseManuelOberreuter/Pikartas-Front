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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Footer */
.footer {
  background: #333;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin: 0 0 1rem 0;
  color: #fff;
}

.footer-section p {
  margin: 0 0 0.5rem 0;
  color: #ccc;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #007bff;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #555;
}

.footer-bottom p {
  margin: 0;
  color: #999;
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style> 