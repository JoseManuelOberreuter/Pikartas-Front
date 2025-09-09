<template>
  <div class="payment-success">
    <div class="container">
      <div class="success-content">
        <div class="success-icon">
          <div class="checkmark">✓</div>
        </div>
        
        <h1>¡Pago Exitoso!</h1>
        <p>Tu pago ha sido procesado correctamente</p>
        
        <div class="order-details">
          <div class="detail-card">
            <h2>Detalles del Pedido</h2>
            
            <div class="detail-row">
              <span class="label">Número de Orden:</span>
              <span class="value">{{ orderNumber }}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">ID de Orden:</span>
              <span class="value">{{ orderId }}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Monto Total:</span>
              <span class="value amount">${{ amount?.toFixed(2) }}</span>
            </div>
            
            <div v-if="authorizationCode" class="detail-row">
              <span class="label">Código de Autorización:</span>
              <span class="value">{{ authorizationCode }}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Estado del Pago:</span>
              <span class="value status paid">Pagado</span>
            </div>
          </div>
        </div>

        <div class="next-steps">
          <h3>Próximos Pasos</h3>
          <ul>
            <li>📧 Recibirás un email de confirmación en breve</li>
            <li>📦 Tu pedido será procesado y enviado</li>
            <li>📱 Te notificaremos cuando esté en camino</li>
            <li>📋 Puedes rastrear tu pedido en tu perfil</li>
          </ul>
        </div>

        <div class="success-actions">
          <router-link to="/" class="btn btn-primary">
            Continuar Comprando
          </router-link>
          <router-link to="/profile" class="btn btn-outline">
            Ver Mis Pedidos
          </router-link>
        </div>

        <div class="support-info">
          <h4>¿Necesitas Ayuda?</h4>
          <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos:</p>
          <div class="contact-methods">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <span>soporte@shopvuecore.com</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <span>+56 2 2345 6789</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import transbankService from '../services/transbank.js'

const route = useRoute()

// Order details from route query
const orderId = ref(route.query.orderId)
const orderNumber = ref(route.query.orderNumber)
const amount = ref(parseFloat(route.query.amount))
const authorizationCode = ref(route.query.authorizationCode)

onMounted(() => {
  // If no order data in query, try to get from service
  if (!orderId.value) {
    const paymentData = transbankService.getStoredPaymentData()
    if (paymentData) {
      orderId.value = paymentData.orderId
      orderNumber.value = paymentData.orderNumber
    }
  }

  // Clear payment data from service
  transbankService.clearStoredPaymentData()
})
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.payment-success {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  align-items: center;
}

.success-content {
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.success-icon {
  margin-bottom: 2rem;
}

.checkmark {
  width: 80px;
  height: 80px;
  background: #28a745;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 auto;
  animation: successPulse 0.6s ease-out;
}

@keyframes successPulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-content h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  color: #28a745;
  font-weight: 700;
}

.success-content p {
  color: #666;
  font-size: 1.2rem;
  margin: 0 0 2rem 0;
}

.order-details {
  margin: 2rem 0;
}

.detail-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: left;
}

.detail-card h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #333;
  text-align: center;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.value {
  color: #333;
  font-weight: 500;
}

.value.amount {
  font-size: 1.1rem;
  font-weight: 700;
  color: #28a745;
}

.value.status.paid {
  color: #28a745;
  font-weight: 600;
}

.next-steps {
  margin: 2rem 0;
  text-align: left;
}

.next-steps h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
  text-align: center;
}

.next-steps ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.next-steps li {
  padding: 0.5rem 0;
  color: #666;
  font-size: 0.95rem;
}

.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 1rem;
  display: inline-block;
}

.btn-primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.btn-outline {
  background: transparent;
  color: #6c757d;
  border-color: #6c757d;
}

.btn-outline:hover {
  background: #6c757d;
  color: white;
}

.support-info {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.support-info h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

.support-info p {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.9rem;
}

.contact-methods {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.contact-icon {
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .success-content {
    padding: 2rem 1.5rem;
  }
  
  .success-content h1 {
    font-size: 2rem;
  }
  
  .success-actions {
    flex-direction: column;
  }
  
  .contact-methods {
    flex-direction: column;
    gap: 1rem;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .label {
    font-size: 0.8rem;
  }
}
</style>
