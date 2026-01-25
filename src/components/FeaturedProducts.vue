<template>
  <section class="featured-products">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title text-title-quaternary">Productos Destacados</h2>
        <router-link to="/shop" class="view-all-link">
          Ver todos <font-awesome-icon icon="chevron-down" class="arrow-icon" />
        </router-link>
      </div>
      
      <div class="products-grid" :class="{ 'single-product': featuredProducts.length === 1, 'few-products': featuredProducts.length === 2 }">
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
  background: transparent;
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
  color: var(--color-white);
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
}

.view-all-link {
  color: var(--color-white);
  text-decoration: none;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  transition: all var(--transition-normal);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  border: var(--border-width-thin) solid var(--color-white);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

.view-all-link:hover {
  color: var(--color-primary);
  background: rgba(0, 0, 0, 0.6);
  border-color: var(--color-primary);
  transform: translateX(var(--spacing-xs));
}

.arrow-icon {
  color: var(--color-white);
  font-size: 0.8em;
  transition: all var(--transition-normal);
  transform: rotate(-90deg);
}

.view-all-link:hover .arrow-icon {
  color: var(--color-white);
  transform: rotate(-90deg) translateX(2px);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-3xl);
  justify-items: center;
}

/* Center content when there's only 1 product */
.products-grid.single-product {
  grid-template-columns: 1fr;
  justify-content: center;
  max-width: 350px;
  margin: 0 auto;
  place-items: center;
}

/* Center content when there are 2 products */
.products-grid.few-products {
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  max-width: calc(350px * 2 + var(--spacing-3xl));
  margin: 0 auto;
  place-items: center;
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
  
  .products-grid.single-product {
    max-width: 100%;
  }
  
  .products-grid.few-products {
    grid-template-columns: repeat(2, 1fr);
    max-width: 100%;
  }
  
  .featured-products {
    padding: var(--spacing-5xl) 0;
  }
}

@media (max-width: 640px) {
  .products-grid.few-products {
    grid-template-columns: 1fr;
    max-width: 100%;
  }
}
</style>
