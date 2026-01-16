<template>
  <div class="contact">
    <div class="container">
      <div class="contact-header">
        <h1>Contáctanos</h1>
        <p class="text-hero-subtitle">Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.</p>
      </div>
    </div>

    <div class="container">
      <div class="form-container">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label for="name">Nombre *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Tu nombre completo"
                required
                :class="{ 'error': errors.name }"
              />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="tu@email.com"
                required
                :class="{ 'error': errors.email }"
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="subject">Asunto *</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                placeholder="¿Sobre qué quieres contactarnos?"
                required
                :class="{ 'error': errors.subject }"
              />
              <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
            </div>

            <div class="form-group">
              <label for="message">Mensaje *</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                placeholder="Escribe tu mensaje aquí..."
                required
                :class="{ 'error': errors.message }"
              ></textarea>
              <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
              <span class="char-count">{{ form.message.length }}/5000</span>
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
  margin-bottom: 3rem;
}

.contact-header h1 {
  font-family: 'Press Start 2P', 'Courier New', monospace;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin: 0 0 1rem 0;
  color: var(--color-white);
  font-weight: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-shadow: 
    3px 3px 0px rgba(0, 0, 0, 0.9),
    6px 6px 0px rgba(0, 0, 0, 0.7),
    -2px -2px 0px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(255, 215, 0, 0.4),
    0 0 60px rgba(255, 215, 0, 0.3),
    0 8px 16px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  -webkit-font-smoothing: none;
  font-smooth: never;
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
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid var(--color-primary);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group label {
  font-weight: 600;
  color: var(--color-white);
  font-size: 0.875rem;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--color-primary);
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-black);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-quaternary);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
}

.form-group input.error,
.form-group textarea.error {
  border-color: #ef4444;
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.error-message {
  color: #ef4444;
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.char-count {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  text-align: right;
  margin-top: var(--spacing-xs);
}

.btn-submit {
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 50px;
  background: var(--color-primary);
  color: var(--color-black);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-quaternary);
  color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
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

