<template>
  <div class="filters">
    <div class="filter-group">
      <label class="form-label">Buscar:</label>
      <input 
        :value="searchTerm" 
        @input="$emit('update:searchTerm', $event.target.value)"
        type="text" 
        placeholder="ID de orden, email del cliente..." 
        class="form-input filter-input"
      />
    </div>
    <div class="filter-group">
      <label class="form-label">Estado:</label>
      <select 
        :value="selectedStatus" 
        @change="$emit('update:selectedStatus', $event.target.value)"
        class="form-input filter-select"
      >
        <option value="">Todos los estados</option>
        <option value="pending">Pendiente</option>
        <option value="processing">Procesando</option>
        <option value="shipped">Enviado</option>
        <option value="delivered">Entregado</option>
        <option value="cancelled">Cancelado</option>
      </select>
    </div>
    <div class="filter-group">
      <label class="form-label">Pago:</label>
      <select 
        :value="selectedPaymentStatus" 
        @change="$emit('update:selectedPaymentStatus', $event.target.value)"
        class="form-input filter-select"
      >
        <option value="">Todos los pagos</option>
        <option value="pending">Pendiente</option>
        <option value="paid">Pagado</option>
        <option value="failed">Fallido</option>
        <option value="refunded">Reembolsado</option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  searchTerm: {
    type: String,
    default: ''
  },
  selectedStatus: {
    type: String,
    default: ''
  },
  selectedPaymentStatus: {
    type: String,
    default: ''
  }
})

defineEmits(['update:searchTerm', 'update:selectedStatus', 'update:selectedPaymentStatus'])
</script>

<style scoped>
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 1.25rem;
  border-radius: var(--border-radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-md);
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(253, 179, 28, 0.2);
}

.filter-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.filter-select option {
  background: var(--color-black);
  color: var(--color-white);
}

.filter-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

.filter-select:hover {
  border-color: #9ca3af;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    padding: 1rem;
  }
  
  .filter-group {
    min-width: auto;
  }
}
</style>

