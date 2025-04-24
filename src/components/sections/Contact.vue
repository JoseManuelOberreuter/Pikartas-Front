<template>
  <section id="contacto" class="contact">
    <div class="container">
      <h2 class="section-title">Contáctanos</h2>
      <form class="contact-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model="formData.nombre" required>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="formData.email" required>
        </div>
        
        <div class="form-group">
          <label for="telefono">Teléfono</label>
          <input type="tel" id="telefono" v-model="formData.telefono" required>
        </div>
        
        <div class="form-group">
          <label for="mensaje">Mensaje</label>
          <textarea id="mensaje" v-model="formData.mensaje" rows="5" required></textarea>
        </div>
        
        <button type="submit" class="submit-button">Enviar</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  nombre: '',
  email: '',
  telefono: '',
  mensaje: ''
});

const submitForm = () => {
  alert('Formulario enviado (simulación)');
  // Aquí iría la lógica para enviar el formulario
  formData.value = {
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  };
};
</script>

<style scoped>
.contact {
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

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  color: #333;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ffc107;
  box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.2);
}

.submit-button {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #ffc107;
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #e5ac00;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
}
</style> 