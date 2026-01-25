<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" />
      <div class="product-badges">
        <span class="badge badge-sale" v-if="isOnSale">
          <font-awesome-icon icon="tag" class="badge-icon" />
          {{ discountPercentage }}% OFF
        </span>
      </div>
      <div class="product-actions">
        <button class="quick-view-btn" @click="viewProduct">
          <font-awesome-icon icon="eye" class="btn-icon" />
          Ver
        </button>
        <button class="add-to-cart-btn" @click="addToCart" :disabled="product.stock === 0">
          <font-awesome-icon icon="shopping-cart" class="btn-icon" :class="{ 'btn-icon-disabled': product.stock === 0 }" />
          {{ product.stock === 0 ? 'Sin Stock' : 'Agregar' }}
        </button>
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-category">{{ product.category }}</p>
      <div class="product-price">
        <span v-if="isOnSale" class="price-original">${{ formatCLP(product.price) }}</span>
        <span :class="{ 'price-sale': isOnSale, 'price-normal': !isOnSale }">
          ${{ formatCLP(displayPrice) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart.js'
import { formatCLP } from '../utils/formatters.js'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view-product'])
const cartStore = useCartStore()

// Check if product is currently on sale (within date range)
const isOnSale = computed(() => {
  if (!props.product.is_on_sale || !props.product.discount_percentage) {
    return false
  }
  
  const now = new Date()
  const startDate = props.product.sale_start_date ? new Date(props.product.sale_start_date) : null
  const endDate = props.product.sale_end_date ? new Date(props.product.sale_end_date) : null
  
  if (!startDate || !endDate) {
    return false
  }
  
  return now >= startDate && now <= endDate
})

// Calculate discount percentage
const discountPercentage = computed(() => {
  if (!isOnSale.value || !props.product.discount_percentage) {
    return 0
  }
  return Math.round(props.product.discount_percentage)
})

// Calculate display price (sale price if on sale, otherwise regular price)
const displayPrice = computed(() => {
  if (isOnSale.value && props.product.discount_percentage) {
    return props.product.price * (1 - props.product.discount_percentage / 100)
  }
  return props.product.price
})

const addToCart = async () => {
  if (props.product.stock > 0) {
    await cartStore.addToCart(props.product)
    // Aquí podrías agregar una notificación o feedback visual
  }
}

const viewProduct = () => {
  emit('view-product', props.product.id)
}
</script>

<style scoped>
.product-card {
  background: var(--color-white);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--color-gray-200);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary);
}

.product-image {
  position: relative;
  overflow: hidden;
  height: 320px;
  flex-shrink: 0;
}

.product-badges {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 6px;
  padding: 0.375rem 0.625rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
}

.badge-sale {
  color: #dc3545;
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.95) 0%, rgba(255, 0, 0, 0.95) 100%);
  color: white;
}

.badge-sale .badge-icon {
  color: white;
}

.badge-icon {
  font-size: 0.7rem;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .product-actions {
  opacity: 1;
}

.quick-view-btn,
.add-to-cart-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quick-view-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.quick-view-btn:hover {
  background: white;
}

.quick-view-btn .btn-icon {
  color: var(--icon-view);
  transition: color var(--transition-normal);
}

.quick-view-btn:hover .btn-icon {
  color: var(--icon-view-hover);
}

.add-to-cart-btn {
  background: var(--color-primary);
  color: var(--color-black);
}

.add-to-cart-btn:hover:not(:disabled) {
  background: var(--color-quaternary);
  color: var(--color-white);
}

.add-to-cart-btn:disabled {
  background: var(--color-gray-500);
  cursor: not-allowed;
}

.add-to-cart-btn .btn-icon {
  color: var(--icon-add-cart);
  transition: color var(--transition-normal);
}

.add-to-cart-btn:hover:not(:disabled) .btn-icon {
  color: var(--icon-add-cart-hover);
}

.add-to-cart-btn .btn-icon-disabled {
  color: var(--icon-add-cart-disabled);
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--color-black);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-category {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin: 0 0 0.75rem 0;
  font-weight: 500;
  text-transform: capitalize;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0;
  flex-wrap: wrap;
}

.price-normal {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 0.5rem;
}

.price-sale {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-quaternary);
}

.price-original {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-gray-500);
  text-decoration: line-through;
}

@media (max-width: 768px) {
  .product-image {
    height: 280px;
  }
  
  .product-info {
    padding: 1rem;
  }
  
  .product-name {
    font-size: 1rem;
  }
  
  .product-price {
    font-size: 1.1rem;
  }
}
</style> 