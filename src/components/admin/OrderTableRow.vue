<template>
  <tr class="order-row">
    <td>
      <span class="order-id">#{{ order.id?.toString().slice(-8) || order._id?.slice(-8) }}</span>
    </td>
    <td>
      <div class="customer-info">
        <h4>{{ order.customerName || order.user?.name || 'Cliente' }}</h4>
        <p>{{ order.customerEmail || order.user?.email || 'No disponible' }}</p>
      </div>
    </td>
    <td>
      <span class="order-date">{{ formatDate(order.createdAt || order.created_at) }}</span>
    </td>
    <td>
      <span class="order-total">${{ formatCLP(order.totalAmount || order.total_amount) }}</span>
    </td>
    <td>
      <select 
        :value="order.status" 
        @change="handleStatusChange($event.target.value)"
        class="status-select"
        :class="`status-${order.status}`"
      >
        <option value="pending">Pendiente</option>
        <option value="processing">Procesando</option>
        <option value="shipped">Enviado</option>
        <option value="delivered">Entregado</option>
        <option value="cancelled">Cancelado</option>
      </select>
    </td>
    <td>
      <div class="payment-status">
        <span 
          class="payment-badge" 
          :class="`payment-${order.paymentStatus || order.payment_status || 'pending'}`"
        >
          {{ getPaymentStatusLabel(order.paymentStatus || order.payment_status) }}
        </span>
        <div v-if="(order.paymentStatus || order.payment_status) === 'paid'" class="payment-details">
          <small v-if="order.authorizationCode || order.authorization_code">
            Auth: {{ order.authorizationCode || order.authorization_code }}
          </small>
        </div>
      </div>
    </td>
    <td>
      <div class="actions">
        <button @click="$emit('view', order)" class="btn btn-sm btn-outline">
          <font-awesome-icon icon="eye" class="action-icon" />
          Ver
        </button>
        <button 
          v-if="(order.paymentStatus || order.payment_status) === 'paid' && order.status !== 'cancelled'"
          @click="handleRefund"
          class="btn btn-sm btn-warning"
          :disabled="refundingOrder === (order.id || order._id)"
        >
          <font-awesome-icon 
            :icon="refundingOrder === (order.id || order._id) ? 'spinner' : 'undo'" 
            :spin="refundingOrder === (order.id || order._id)"
            class="action-icon" 
          />
          Reembolsar
        </button>
        <button 
          @click="handleCheckPayment"
          class="btn btn-sm btn-info"
          :disabled="checkingPayment === (order.id || order._id)"
        >
          <font-awesome-icon 
            :icon="checkingPayment === (order.id || order._id) ? 'spinner' : 'credit-card'" 
            :spin="checkingPayment === (order.id || order._id)"
            class="action-icon" 
          />
          Estado Pago
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { formatCLP } from '../../utils/formatters.js'

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  refundingOrder: {
    type: [String, Number],
    default: null
  },
  checkingPayment: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['update-status', 'view', 'refund', 'check-payment'])

// Helper function to get order ID safely
const getOrderId = () => {
  const id = props.order?.id || props.order?._id
  if (!id) {
    console.error('Order ID is missing:', props.order)
    return null
  }
  return id
}

// Handle status change with validation
const handleStatusChange = (newStatus) => {
  const orderId = getOrderId()
  if (!orderId) {
    console.error('Cannot update status: Order ID is missing')
    return
  }
  emit('update-status', orderId, newStatus)
}

// Handle refund with validation
const handleRefund = () => {
  const orderId = getOrderId()
  if (!orderId) {
    console.error('Cannot refund: Order ID is missing')
    return
  }
  emit('refund', props.order)
}

// Handle check payment with validation
const handleCheckPayment = () => {
  const orderId = getOrderId()
  if (!orderId) {
    console.error('Cannot check payment: Order ID is missing')
    return
  }
  emit('check-payment', props.order)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPaymentStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado'
  }
  return labels[status] || status || 'Pendiente'
}
</script>

<style scoped>
.order-row {
  transition: background-color 0.15s ease;
}

.order-id {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-weight: 600;
  color: var(--color-primary);
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  background: rgba(253, 179, 28, 0.1);
  border: 1px solid rgba(253, 179, 28, 0.3);
  padding: 0.375rem 0.625rem;
  border-radius: 6px;
  display: inline-block;
}

.customer-info {
  min-width: 200px;
}

.customer-info h4 {
  margin: 0 0 0.25rem 0;
  color: var(--color-white);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.customer-info p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8125rem;
  line-height: 1.4;
  word-break: break-word;
}

.order-date {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  white-space: nowrap;
}

.order-total {
  font-weight: 700;
  color: #90ee90;
  font-size: 0.9375rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.status-select {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23FDB31C' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  padding-right: 2rem;
}

.status-select option {
  background: var(--color-black);
  color: var(--color-white);
}

.status-select:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.status-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.status-select.status-pending { 
  background-color: rgba(255, 193, 7, 0.2); 
  color: #ffc107; 
  border-color: rgba(255, 193, 7, 0.3);
}
.status-select.status-processing { 
  background-color: rgba(59, 130, 246, 0.2); 
  color: #60a5fa; 
  border-color: rgba(59, 130, 246, 0.3);
}
.status-select.status-shipped { 
  background-color: rgba(34, 197, 94, 0.2); 
  color: #4ade80; 
  border-color: rgba(34, 197, 94, 0.3);
}
.status-select.status-delivered { 
  background-color: rgba(34, 197, 94, 0.2); 
  color: #4ade80; 
  border-color: rgba(34, 197, 94, 0.3);
}
.status-select.status-cancelled { 
  background-color: rgba(220, 53, 69, 0.2); 
  color: #ff6b6b; 
  border-color: rgba(220, 53, 69, 0.3);
}

.payment-status {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  align-items: flex-start;
}

.payment-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  display: inline-block;
  min-width: 85px;
  letter-spacing: 0.025em;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.payment-badge.payment-pending { 
  background: rgba(255, 193, 7, 0.2); 
  color: #ffc107; 
  border: 1px solid rgba(255, 193, 7, 0.3);
}
.payment-badge.payment-paid { 
  background: rgba(34, 197, 94, 0.2); 
  color: #4ade80; 
  border: 1px solid rgba(34, 197, 94, 0.3);
}
.payment-badge.payment-failed { 
  background: rgba(220, 53, 69, 0.2); 
  color: #ff6b6b; 
  border: 1px solid rgba(220, 53, 69, 0.3);
}
.payment-badge.payment-refunded { 
  background: rgba(59, 130, 246, 0.2); 
  color: #60a5fa; 
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.payment-details {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.btn {
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.8125rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-sm {
  padding: 0.4375rem 0.75rem;
  font-size: 0.75rem;
}

.btn-outline {
  background: white;
  color: #2563eb;
  border: 1.5px solid #2563eb;
}

.btn-outline:hover:not(:disabled) {
  background: #2563eb;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.btn-warning {
  background: #fbbf24;
  color: #78350f;
  border: 1.5px solid #fbbf24;
}

.btn-warning:hover:not(:disabled) {
  background: #f59e0b;
  border-color: #f59e0b;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

.btn-info {
  background: #0ea5e9;
  color: white;
  border: 1.5px solid #0ea5e9;
}

.btn-info:hover:not(:disabled) {
  background: #0284c7;
  border-color: #0284c7;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(2, 132, 199, 0.3);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.action-icon {
  font-size: 0.8125rem;
  width: 14px;
  height: 14px;
}

@media (max-width: 768px) {
  .actions {
    flex-direction: column;
    gap: 0.375rem;
    width: 100%;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .status-select {
    min-width: auto;
    width: 100%;
  }
  
  .customer-info {
    min-width: auto;
  }
}
</style>

