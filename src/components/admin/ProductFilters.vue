<template>
  <div class="filters">
    <div class="filter-group">
      <label class="form-label">Buscar productos:</label>
      <input 
        :value="searchTerm" 
        @input="$emit('update:searchTerm', $event.target.value)"
        type="text" 
        placeholder="Buscar por nombre, categoría..." 
        class="form-input filter-input"
      />
    </div>
    <div class="filter-group">
      <label class="form-label">Categoría:</label>
      <select 
        :value="selectedCategory" 
        @change="$emit('update:selectedCategory', $event.target.value)"
        class="form-input filter-select"
      >
        <option value="">Todas las categorías</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
    <div class="filter-group">
      <label class="form-label">Estado:</label>
      <select 
        :value="productStatusFilter" 
        @change="$emit('update:productStatusFilter', $event.target.value)"
        class="form-input filter-select"
      >
        <option value="active">Productos activos</option>
        <option value="inactive">Productos inactivos</option>
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
  selectedCategory: {
    type: String,
    default: ''
  },
  productStatusFilter: {
    type: String,
    default: 'active'
  },
  categories: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:searchTerm', 'update:selectedCategory', 'update:productStatusFilter'])
</script>

<style scoped>
.filters {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  flex-wrap: wrap;
  padding: var(--spacing-xl);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.8s ease-out 0.3s both;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-group .form-label {
  color: var(--color-white);
}

.filter-input,
.filter-select {
  min-width: 200px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-white);
}

.filter-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.filter-input:focus,
.filter-select:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--color-primary);
  outline: none;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .filter-input,
  .filter-select {
    min-width: auto;
  }
}
</style>

