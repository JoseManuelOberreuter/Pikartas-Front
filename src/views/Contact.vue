<template>
  <div class="contact">
    <div class="container">
      <div class="contact-header">
        <h1 class="text-hero-title">Contáctanos</h1>
        <p class="text-hero-subtitle">Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.</p>
      </div>
    </div>

    <div class="container">
      <div class="form-container">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label for="name" class="text-body-accent">Nombre *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Tu nombre completo"
                required
                :class="{ 'error': errors.name }"
              />
              <span v-if="errors.name" class="error-message text-body-accent">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="email" class="text-body-accent">Email *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="tu@email.com"
                required
                :class="{ 'error': errors.email }"
              />
              <span v-if="errors.email" class="error-message text-body-accent">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="subject" class="text-body-accent">Asunto *</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                placeholder="¿Sobre qué quieres contactarnos?"
                required
                :class="{ 'error': errors.subject }"
              />
              <span v-if="errors.subject" class="error-message text-body-accent">{{ errors.subject }}</span>
            </div>

            <div class="form-group">
              <label for="message" class="text-body-accent">Mensaje *</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                placeholder="Escribe tu mensaje aquí..."
                required
                :class="{ 'error': errors.message }"
              ></textarea>
              <span v-if="errors.message" class="error-message text-body-accent">{{ errors.message }}</span>
              <span class="char-count text-body-accent">{{ form.message.length }}/5000</span>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary btn-submit"
              :disabled="loading"
            >
              <font-awesome-icon 
                v-if="loading" 
                icon="spinner" 
                :spin="loading" 
                class="btn-icon" 
              />
              <font-awesome-icon 
                v-else 
                icon="envelope" 
                class="btn-icon" 
              />
              {{ loading ? 'Enviando...' : 'Enviar Mensaje' }}
            </button>
          </form>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { contactService } from '../services/api'
import { useNotificationStore } from '../stores/notifications'

const notificationStore = useNotificationStore()
const { success, error, warning } = notificationStore

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // Validate name
  if (!form.name.trim()) {
    errors.name = 'El nombre es requerido'
    isValid = false
  } else if (form.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres'
    isValid = false
  } else if (form.name.trim().length > 100) {
    errors.name = 'El nombre no puede exceder 100 caracteres'
    isValid = false
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'El email es requerido'
    isValid = false
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = 'El formato del email no es válido'
    isValid = false
  }

  // Validate subject
  if (!form.subject.trim()) {
    errors.subject = 'El asunto es requerido'
    isValid = false
  } else if (form.subject.trim().length < 3) {
    errors.subject = 'El asunto debe tener al menos 3 caracteres'
    isValid = false
  } else if (form.subject.trim().length > 200) {
    errors.subject = 'El asunto no puede exceder 200 caracteres'
    isValid = false
  }

  // Validate message
  if (!form.message.trim()) {
    errors.message = 'El mensaje es requerido'
    isValid = false
  } else if (form.message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres'
    isValid = false
  } else if (form.message.trim().length > 5000) {
    errors.message = 'El mensaje no puede exceder 5000 caracteres'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    warning('Por favor, corrige los errores en el formulario')
    return
  }

  loading.value = true

  try {
    const response = await contactService.submitContactForm({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim()
    })

    success(response.message || 'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.')

    // Reset form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    Object.keys(errors).forEach(key => {
      errors[key] = ''
    })
  } catch (err) {
    const errorMessage = err.error || err.message || 'Error al enviar el mensaje. Por favor, intenta de nuevo.'
    error(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact {
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

.contact-header {
  text-align: center;
  margin-bottom: 4rem;
}

.contact-header h1 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.contact-header p {
  font-size: 1.1rem;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.form-container {
  max-width: 700px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border: 2px solid var(--color-primary);
  position: relative;
  overflow: hidden;
}

.form-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--color-primary);
  opacity: 0.8;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  position: relative;
}

.form-group label {
  font-size: var(--font-size-sm);
  margin-bottom: 0.5rem;
  display: block;
}

.form-group input,
.form-group textarea {
  padding: 0.875rem 1rem;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  font-size: var(--font-size-base);
  font-family: inherit;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  color: var(--color-white) !important;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
  opacity: 1;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-quaternary);
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
  color: var(--color-white);
}

.form-group input:hover:not(:focus),
.form-group textarea:hover:not(:focus) {
  border-color: var(--color-primary-light);
  background: rgba(0, 0, 0, 0.45);
}

/* CAMBIO: El borde NO debe ser rojo cuando hay error */
.form-group input.error,
.form-group textarea.error {
  /* border-color: var(--color-quaternary);  Eliminado el borde rojo */
  border-color: var(--color-primary);  /* Mantiene el borde normal */
  background: rgba(255, 0, 0, 0.1);
  color: var(--color-white) !important;
}

.form-group input.error:focus,
.form-group textarea.error:focus {
  /* box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.2);   Eliminado el borde rojo en focus */
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);   /* Igual que focus normal */
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.error-message {
  color: var(--color-quaternary);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.char-count {
  font-size: var(--font-size-xs);
  text-align: right;
  margin-top: var(--spacing-xs);
  opacity: 0.7;
}

.btn-submit {
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 56px;
  background: var(--color-primary);
  color: var(--color-black);
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-normal);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(253, 179, 28, 0.3);
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-quaternary);
  color: var(--color-white);
  border-color: var(--color-quaternary);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1em;
}

@media (max-width: 768px) {
  .contact {
    padding-top: 100px;
  }
  .contact-header h1 {
    font-size: 2rem;
  }
  .contact-header p {
    font-size: 1rem;
  }
  .form-container {
    padding: 2rem;
  }
  .contact-form {
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .contact {
    padding-top: 90px;
    padding-bottom: 60px;
  }
  .container {
    padding: 0 1rem;
  }
  .contact-header {
    margin-bottom: 2rem;
  }
  .contact-header h1 {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 0.25rem;
  }
  .contact-header p {
    font-size: 0.9rem;
    padding: 0 1rem;
  }
  .form-container {
    padding: 1.5rem;
    border-radius: 8px;
  }
  .contact-form {
    gap: 1rem;
  }
  .form-group {
    gap: 0.5rem;
  }
  .form-group label {
    font-size: 0.875rem;
  }
  .form-group input,
  .form-group textarea {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }
  .form-group textarea {
    min-height: 120px;
  }
  .error-message {
    font-size: 0.75rem;
  }
  .char-count {
    font-size: 0.75rem;
  }
  .btn-submit {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    width: 100%;
    min-height: 44px;
  }
}
</style>

