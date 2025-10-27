<template>
  <section class="featured-products">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Productos Destacados</h2>
        <router-link to="/shop" class="view-all-link">
          Ver todos <font-awesome-icon icon="chevron-down" class="arrow-icon" />
        </router-link>
      </div>
      
      <div class="products-grid">
        <ProductCard 
          v-for="product in featuredProducts" 
          :key="product.id" 
          :product="product"
          @view-product="handleViewProduct"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['view-product'])

const featuredProducts = computed(() => {
  return props.products.slice(0, 4)
})

const handleViewProduct = (productId) => {
  emit('view-product', productId)
}
</script>

<style scoped>
/* Featured Products Section */
.featured-products {
  padding: var(--spacing-6xl) 0;
  background: var(--color-black);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-5xl);
}

.section-title {
  text-align: center;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  color: var(--color-primary);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: var(--color-quaternary);
  border-radius: var(--border-radius-full);
}

.view-all-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
  transition: all var(--transition-normal);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  border: var(--border-width-thin) solid transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-all-link:hover {
  color: var(--color-black);
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateX(var(--spacing-xs));
}

.arrow-icon {
  color: var(--color-primary);
  font-size: 0.8em;
  transition: all var(--transition-normal);
  transform: rotate(-90deg);
}

.view-all-link:hover .arrow-icon {
  color: var(--color-black);
  transform: rotate(-90deg) translateX(2px);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-3xl);
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: var(--spacing-lg);
    text-align: center;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-xl);
  }
  
  .featured-products {
    padding: var(--spacing-5xl) 0;
  }
}
</style>
