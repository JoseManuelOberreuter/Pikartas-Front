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
        
        <div v-if="success" class="alert success">
          ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.
        </div>
        
        <div v-if="error" class="alert error">
          Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.
        </div>
        
        <button type="submit" class="submit-button" :disabled="loading">
          {{ loading ? 'Enviando...' : 'Enviar' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import emailjs from '@emailjs/browser';

const formData = ref({
  nombre: '',
  email: '',
  telefono: '',
  mensaje: ''
});

const loading = ref(false);
const success = ref(false);
const error = ref(false);

const submitForm = async () => {
  loading.value = true;
  error.value = false;
  success.value = false;

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        from_name: formData.value.nombre,
        from_email: formData.value.email,
        phone: formData.value.telefono,
        message: formData.value.mensaje
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    success.value = true;
    formData.value = {
      nombre: '',
      email: '',
      telefono: '',
      mensaje: ''
    };
  } catch (err) {
    console.error('Error al enviar el correo:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
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

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  text-align: center;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
}
</style> 