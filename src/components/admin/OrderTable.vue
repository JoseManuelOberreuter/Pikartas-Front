<template>
  <div class="orders-table">
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID Orden</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <OrderTableRow
            v-for="order in orders"
            :key="order.id || order._id"
            :order="order"
            :refunding-order="refundingOrder"
            :checking-payment="checkingPayment"
            @update-status="handleUpdateStatus"
            @view="$emit('view', $event)"
            @refund="$emit('refund', $event)"
            @check-payment="$emit('check-payment', $event)"
          />
        </tbody>
      </table>
    </div>
    
    <div v-if="orders.length === 0" class="no-orders">
      <div class="empty-state">
        <div class="empty-icon">
          <font-awesome-icon icon="clipboard-list" class="empty-icon-svg" />
        </div>
        <h3>No hay órdenes</h3>
        <p>No se encontraron órdenes con los filtros seleccionados</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import OrderTableRow from './OrderTableRow.vue'

defineProps({
  orders: {
    type: Array,
    default: () => []
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

// Handler method to properly receive both arguments from the event
const handleUpdateStatus = (orderId, newStatus) => {
  emit('update-status', orderId, newStatus)
}
</script>

<style scoped>
.orders-table {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideInUp 0.8s ease-out 0.5s both;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th, td {
  padding: 1rem 1.25rem;
  text-align: left;
  vertical-align: middle;
}

th {
  background: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  color: var(--color-white);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem 1.25rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
  white-space: nowrap;
}

th:first-child {
  padding-left: 1.5rem;
}

th:last-child {
  padding-right: 1.5rem;
}

tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

tbody tr:last-child {
  border-bottom: none;
}

td {
  font-size: 0.875rem;
  color: var(--color-white);
}

td:first-child {
  padding-left: 1.5rem;
}

td:last-child {
  padding-right: 1.5rem;
}

.no-orders {
  padding: 4rem 2rem;
  text-align: center;
  background: transparent;
}

.empty-state {
  text-align: center;
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
}

.empty-icon-svg {
  font-size: 1em;
  color: var(--color-primary);
  transition: all 0.3s ease;
}

.empty-state:hover .empty-icon-svg {
  transform: scale(1.1) rotate(10deg);
  opacity: 0.7;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-white);
  font-size: 1.125rem;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  th, td {
    padding: 0.75rem 0.875rem;
    font-size: 0.8125rem;
  }
  
  th {
    font-size: 0.6875rem;
  }
  
  th:first-child,
  td:first-child {
    padding-left: 1rem;
  }
  
  th:last-child,
  td:last-child {
    padding-right: 1rem;
  }
  
  .orders-table {
    border-radius: 8px;
  }
}
</style>

