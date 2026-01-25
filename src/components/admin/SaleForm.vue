<template>
  <Modal
    :show="show"
    title="Gestión de Oferta"
    icon="tag"
    max-width="md"
    @update:show="$emit('update:show', $event)"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="sale-form">
      <div class="form-group">
        <label class="checkbox-label">
          <input 
            :value="saleForm.isOnSale" 
            @input="updateField('isOnSale', $event.target.checked)"
            type="checkbox" 
            class="form-checkbox"
          />
          <span>En Oferta</span>
        </label>
        <small class="form-help">Marca esta opción para poner el producto en oferta</small>
      </div>

      <div v-if="saleForm.isOnSale" class="sale-fields">
        <!-- Price Preview Section -->
        <div v-if="product" class="price-preview-section">
          <div class="price-preview-item">
            <span class="price-label">Precio Original:</span>
            <span class="price-original">${{ formatCLP(product.price) }}</span>
          </div>
          <div class="price-preview-item" v-if="saleForm.discountPercentage && saleForm.discountPercentage > 0">
            <span class="price-label">Descuento:</span>
            <span class="price-discount">-{{ saleForm.discountPercentage }}%</span>
          </div>
          <div class="price-preview-item">
            <span class="price-label">Precio Final:</span>
            <span class="price-final">${{ formatCLP(calculateSalePrice(product.price, saleForm.discountPercentage)) }}</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Porcentaje de Descuento *</label>
          <input 
            :value="saleForm.discountPercentage" 
            @input="updateField('discountPercentage', parseFloat($event.target.value) || null)"
            type="number" 
            step="0.01" 
            min="0" 
            max="99.99"
            :required="saleForm.isOnSale"
            placeholder="Ej: 20 (para 20% de descuento)"
            class="form-input"
          />
          <small class="form-help">Ingresa el porcentaje de descuento (0-99.99%)</small>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Fecha de Inicio de Oferta *</label>
            <input 
              :value="saleForm.saleStartDate" 
              @input="updateField('saleStartDate', $event.target.value)"
              type="datetime-local" 
              :required="saleForm.isOnSale"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Fecha de Fin de Oferta *</label>
            <input 
              :value="saleForm.saleEndDate" 
              @input="updateField('saleEndDate', $event.target.value)"
              type="datetime-local" 
              :required="saleForm.isOnSale"
              class="form-input"
            />
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <button type="button" @click="$emit('close')" class="btn btn-secondary">
        Cancelar
      </button>
      <button type="button" @click="handleSubmit" :disabled="submitting" class="btn btn-primary">
        {{ submitting ? 'Guardando...' : 'Guardar Oferta' }}
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import Modal from '../Modal.vue'
import { formatCLP } from '../../utils/formatters.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: null
  },
  saleForm: {
    type: Object,
    required: true
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'close', 'submit', 'update:saleForm'])

const updateField = (field, value) => {
  emit('update:saleForm', {
    ...props.saleForm,
    [field]: value
  })
}

const calculateSalePrice = (originalPrice, discountPercentage) => {
  if (!discountPercentage || discountPercentage <= 0) {
    return originalPrice
  }
  const discount = discountPercentage / 100
  return originalPrice * (1 - discount)
}

const handleSubmit = () => {
  emit('submit', props.saleForm)
}
</script>

<style scoped>
.sale-form {
  padding: 0;
}

.sale-form .form-label {
  color: var(--color-white);
}

.sale-form .form-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-white);
  border-radius: var(--border-radius-md);
}

.sale-form .form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.sale-form .form-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(253, 179, 28, 0.2);
}

.sale-form .form-help {
  color: rgba(255, 255, 255, 0.6);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
}

.checkbox-label span {
  user-select: none;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-tertiary);
}

.sale-fields {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.price-preview-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.price-preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.price-preview-item:last-child {
  border-bottom: none;
  padding-top: var(--spacing-md);
  margin-top: var(--spacing-xs);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: var(--font-weight-semibold);
}

.price-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  font-size: var(--font-size-sm);
}

.price-original {
  font-weight: var(--font-weight-medium);
  color: rgba(255, 255, 255, 0.6);
  text-decoration: line-through;
  font-size: var(--font-size-sm);
}

.price-discount {
  font-weight: var(--font-weight-semibold);
  color: #ff6b6b;
  font-size: var(--font-size-sm);
}

.price-final {
  font-weight: var(--font-weight-bold);
  color: #90ee90;
  font-size: var(--font-size-lg);
}

.form-row {
  display: flex;
  gap: var(--spacing-lg);
}

.form-row .form-group {
  flex: 1;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
}
</style>

