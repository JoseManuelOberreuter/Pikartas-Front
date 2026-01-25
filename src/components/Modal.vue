<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
      <div 
        class="modal-content" 
        :class="[`modal-${maxWidth}`]"
        @click.stop
      >
        <div class="modal-header">
          <h2>
            <font-awesome-icon v-if="icon" :icon="icon" class="modal-header-icon" />
            <slot name="header">{{ title }}</slot>
          </h2>
          <button @click="handleClose" class="close-btn" type="button">
            <font-awesome-icon icon="times" class="close-icon" />
          </button>
        </div>
        
        <div class="modal-body">
          <slot></slot>
        </div>
        
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Array],
    default: null
  },
  maxWidth: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'alert'].includes(value)
  }
})

const emit = defineEmits(['update:show', 'close'])

const handleClose = () => {
  emit('update:show', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: var(--z-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn var(--transition-normal) forwards;
}

.modal-content {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-xl);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateY(20px);
  animation: slideUp var(--transition-normal) forwards;
  z-index: var(--z-modal);
  position: relative;
}

.modal-sm {
  max-width: 400px;
}

.modal-md {
  max-width: 600px;
}

.modal-lg {
  max-width: 800px;
}

.modal-xl {
  max-width: 1000px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-2xl);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  margin: 0;
  color: var(--color-white);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.modal-header-icon {
  color: var(--color-primary);
  font-size: 1.2em;
}

.close-btn {
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  transition: all var(--transition-normal);
  border-radius: var(--border-radius-md);
}

.close-btn:hover {
  color: #ff6b6b;
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.close-icon {
  font-size: 1rem;
}

.modal-body {
  padding: var(--spacing-2xl);
  color: var(--color-white);
}

.modal-footer {
  padding: var(--spacing-2xl);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  background: rgba(255, 255, 255, 0.02);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    transform: translateY(20px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: var(--spacing-lg);
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: var(--spacing-xl);
  }
}
</style>

