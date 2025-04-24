<template>
  <section id="contacto" class="contact">
    <div class="container">
      <h2 class="section-title">Contáctanos</h2>
      <form class="contact-form" @submit.prevent="submitForm">
        <div class="form-group" v-for="field in formFields" :key="field.id">
          <label :for="field.id">{{ field.label }}</label>
          <component
            :is="field.type === 'textarea' ? 'textarea' : 'input'"
            :id="field.id"
            :type="field.type"
            v-model="formData[field.id]"
            :rows="field.rows"
            required
          />
        </div>
        <button type="submit" class="submit-button">Enviar</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const formFields = [
  { id: 'nombre', label: 'Nombre', type: 'text' },
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'telefono', label: 'Teléfono', type: 'tel' },
  { id: 'mensaje', label: 'Mensaje', type: 'textarea', rows: 5 }
];

const formData = ref({
  nombre: '',
  email: '',
  telefono: '',
  mensaje: ''
});

const submitForm = () => {
  alert('Formulario enviado (simulación)');
  formData.value = {
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  };
};
</script>

<style scoped>
/* Copiar los estilos del formulario desde App.vue */
</style> 