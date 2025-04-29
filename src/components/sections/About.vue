<template>
  <section id="nosotros" class="about">
    <div class="container">
      <h2 class="section-title">Sobre Nosotros</h2>
      <div class="about-content">
        <div class="about-text">
          <p>Somos una empresa dedicada a satisfacer la necesidad del cliente. Buscamos mantener una excelente relación con los vecinos. Para ello cumplimos con todas las normativas municipales, 
            como referente a cierres y aislación acústica.
          </p>
          <p>
            En terreno en todo momento se encuentra un profesional de obra atendiendo cualquier solicitud de nuestro mandante o vecinos colindantes al proyecto a demoler.
          </p>
          <p>
            Adicionalmente cumplimos con todas las normas de seguridad y leyes sociales respecto al personal que se encuentra en obra.
          </p>
          <h3>Nuestros Servicios</h3>
          <ul class="services-list">
            <li>
              <span class="icon">🏠</span>
              <span class="service-text">Demolición residencial controlada</span>
            </li>
            <li>
              <span class="icon">🏗️</span>
              <span>Demolición de estructuras industriales</span>
            </li>
            <li>
              <span class="icon">🏢</span>
              <span>Demolición de edificios comerciales</span>
            </li>
            <li>
              <span class="icon">♻️</span>
              <span>Gestión y reciclaje de escombros</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No se necesita lógica adicional por ahora
</script>

<style scoped>
.about {
  padding: 6rem 0;
  background-color: #f0f0f0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #111;
  position: relative;
  padding-bottom: 1rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background-color: #ffc107;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 10rem;
  padding: 2rem 4rem;
}

.about-text {
  flex: 1;
}

.about-text p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: #333;
  text-align: justify;
}

.services-list {
  list-style: none;
  margin-top: 1.5rem;
}

.services-list li {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #333;
}

.icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #ffc107;
}

.service-text {
  font-weight: bold;
  
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .about-content {
    margin: 0 1rem;
    padding: 1rem;
  }
}
</style> 