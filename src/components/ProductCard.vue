<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" />
      <div class="product-actions">
        <button class="quick-view-btn" @click="viewProduct">
          👁️ Ver
        </button>
        <button class="add-to-cart-btn" @click="addToCart" :disabled="product.stock === 0">
          {{ product.stock === 0 ? 'Sin Stock' : '🛒 Agregar' }}
        </button>
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-category">{{ product.category }}</p>
      <div class="product-price">
        ${{ product.price.toFixed(2) }}
      </div>
      <div class="product-stock" v-if="product.stock <= 10">
        <span class="stock-warning" v-if="product.stock > 0">
          Solo quedan {{ product.stock }} unidades
        </span>
        <span class="out-of-stock" v-else>
          Sin stock
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart.js'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view-product'])
const cartStore = useCartStore()

const addToCart = async () => {
  if (props.product.stock > 0) {
    await cartStore.addToCart(props.product)
    // Aquí podrías agregar una notificación o feedback visual
  }
}

const viewProduct = () => {
  console.log('🔍 ProductCard: Producto completo:', props.product);
  console.log('🎯 ProductCard: ID del producto:', props.product.id);
  emit('view-product', props.product.id)
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  overflow: hidden;
  height: 240px;
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
}

.quick-view-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.quick-view-btn:hover {
  background: white;
}

.add-to-cart-btn {
  background: #007bff;
  color: white;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #0056b3;
}

.add-to-cart-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.product-info {
  padding: 1.25rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-category {
  font-size: 0.875rem;
  color: #007bff;
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #28a745;
  margin-bottom: 0.5rem;
}

.product-stock {
  font-size: 0.875rem;
}

.stock-warning {
  color: #ffc107;
  font-weight: 500;
}

.out-of-stock {
  color: #dc3545;
  font-weight: 500;
}

@media (max-width: 768px) {
  .product-image {
    height: 200px;
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