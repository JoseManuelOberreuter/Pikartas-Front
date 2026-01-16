<template>
  <section class="newsletter">
    <div class="container">
      <div class="newsletter-content">
        <h2 class="text-title-primary">Mantente al día con nuestras ofertas</h2>
        <p class="text-body-accent">Suscríbete a nuestro newsletter y recibe ofertas exclusivas</p>
        <form @submit.prevent="handleSubscribe" class="newsletter-form">
          <input 
            type="email" 
            v-model="emailSubscription"
            placeholder="tu@email.com" 
            required
          >
          <button type="submit" class="btn btn-primary">
            Suscribirse
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useNotifications } from '../composables/useNotifications'

const { success } = useNotifications()
const emailSubscription = ref('')

const emit = defineEmits(['subscribe'])

const handleSubscribe = () => {
  if (emailSubscription.value) {
    emit('subscribe', emailSubscription.value)
    success(`¡Gracias por suscribirte con ${emailSubscription.value}!`)
    emailSubscription.value = ''
  }
}
</script>

<style scoped>
/* Newsletter Section */
.newsletter {
  background: rgba(0, 0, 0, 0.5);
  padding: var(--spacing-6xl) 0;
  color: var(--color-white);
  position: relative;
  overflow: hidden;
}

.newsletter::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  transform: rotate(45deg);
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.newsletter-content h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-lg) 0;
}

.newsletter-content p {
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-3xl) 0;
  opacity: 0.95;
  line-height: var(--line-height-relaxed);
}

.newsletter-form {
  display: flex;
  max-width: 400px;
  margin: 0 auto;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.newsletter-form input {
  flex: 1;
  min-width: 250px;
  padding: var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  color: var(--color-gray-700);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.newsletter-form input:focus {
  outline: none;
  box-shadow: var(--shadow-md), 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.newsletter-form input::placeholder {
  color: var(--color-gray-400);
}

.newsletter .btn-primary {
  background: var(--color-black);
  color: var(--color-white);
  border-color: var(--color-black);
  font-weight: var(--font-weight-semibold);
  min-width: 140px;
}

.newsletter .btn-primary:hover {
  background: var(--color-white);
  color: var(--color-black);
  border-color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Responsive Design */
@media (max-width: 768px) {
  .newsletter-form {
    flex-direction: column;
    align-items: center;
  }
  
  .newsletter-form input {
    min-width: unset;
    width: 100%;
  }
  
  .newsletter {
    padding: var(--spacing-5xl) 0;
  }
}

@media (max-width: 480px) {
  .newsletter-content h2 {
    font-size: var(--font-size-2xl);
  }
}
</style>
