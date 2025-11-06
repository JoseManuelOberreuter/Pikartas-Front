<template>
  <div class="cart">
    <div class="container">
      <div class="cart-header">
        <h1>
          <font-awesome-icon icon="shopping-cart" class="header-icon" />
          Mi Carrito
        </h1>
        <p v-if="cartItems.length > 0">{{ cartItemCount }} artículos en tu carrito</p>
      </div>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-icon">
          <font-awesome-icon icon="shopping-cart" class="empty-cart-icon-svg" />
        </div>
        <h2>Tu carrito está vacío</h2>
        <p>¡Empieza a agregar productos increíbles!</p>
        <router-link to="/shop" class="btn btn-primary">
          <font-awesome-icon icon="store" class="btn-icon" />
          Ir a la Tienda
        </router-link>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div class="cart-item" v-for="item in cartItems" :key="item.id">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            
            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-category">{{ item.category }}</p>
              <div class="item-rating">
                <span class="stars">{{ getStarRating(item.rating) }}</span>
                <span class="rating-value">({{ item.rating }})</span>
              </div>
              <p class="item-description">{{ item.description }}</p>
            </div>
            
            <div class="item-controls">
              <div class="item-price">
                <span class="price-label">Precio unitario:</span>
                <span class="price">${{ formatCLP(item.price) }}</span>
              </div>
              
              <div class="quantity-controls">
                <label>Cantidad:</label>
                <div class="quantity-input">
                  <button 
                    class="qty-btn" 
                    @click="decreaseQuantity(item.id)" 
                    :disabled="item.quantity <= 1"
                  >
                    <font-awesome-icon icon="minus" class="qty-icon" />
                  </button>
                  <input 
                    type="number" 
                    :value="item.quantity" 
                    @change="updateItemQuantity(item.id, $event.target.value)"
                    min="1"
                    class="qty-input"
                  >
                  <button class="qty-btn" @click="increaseQuantity(item.id)">
                    <font-awesome-icon icon="plus" class="qty-icon" />
                  </button>
                </div>
              </div>
              
              <div class="item-subtotal">
                <span class="subtotal-label">Subtotal:</span>
                <span class="subtotal">${{ formatCLP(item.price * item.quantity) }}</span>
              </div>
              
              <button class="remove-btn" @click="removeFromCart(item.id)">
                <font-awesome-icon icon="trash" class="remove-icon" />
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-card">
            <h3>Resumen del Pedido</h3>
            
            <div class="summary-line">
              <span>Subtotal ({{ cartItemCount }} artículos):</span>
              <span>${{ formatCLP(cartTotal) }}</span>
            </div>
            
            <div class="summary-line">
              <span>Envío:</span>
              <span v-if="cartTotal >= 500" class="free-shipping">Gratis</span>
              <span v-else>${{ formatCLP(25) }}</span>
            </div>
            
            <div class="summary-line">
              <span>Impuestos (estimado):</span>
              <span>${{ formatCLP(tax) }}</span>
            </div>
            
            <hr class="summary-divider">
            
            <div class="summary-line total-line">
              <span>Total:</span>
              <span class="total-amount">${{ formatCLP(finalTotal) }}</span>
            </div>
            
            <div v-if="cartTotal < 500" class="shipping-notice">
              <p>
                <font-awesome-icon icon="lightbulb" class="notice-icon" />
                Agrega ${{ formatCLP(500 - cartTotal) }} más para obtener envío gratis
              </p>
            </div>
            
            <div class="cart-actions">
              <button class="btn btn-outline" @click="clearCart">
                <font-awesome-icon icon="trash" class="btn-icon" />
                Limpiar Carrito
              </button>
              <router-link to="/shop" class="btn btn-secondary">
                <font-awesome-icon icon="store" class="btn-icon" />
                Seguir Comprando
              </router-link>
              <router-link to="/checkout" class="btn btn-primary">
                <font-awesome-icon icon="credit-card" class="btn-icon" />
                Proceder al Pago
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart.js'
import { storeToRefs } from 'pinia'
import { formatCLP } from '../utils/formatters.js'

const cartStore = useCartStore()
const { cartItems, cartTotal, cartItemCount } = storeToRefs(cartStore)

// Computed properties
const tax = computed(() => cartTotal.value * 0.08) // 8% tax
const shipping = computed(() => cartTotal.value >= 500 ? 0 : 25)
const finalTotal = computed(() => cartTotal.value + tax.value + shipping.value)

// Methods
const getStarRating = (rating) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let stars = '★'.repeat(fullStars)
  if (hasHalfStar) stars += '☆'
  return stars
}

const removeFromCart = async (productId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
    await cartStore.removeFromCart(productId)
  }
}

const increaseQuantity = async (productId) => {
  const item = cartItems.value.find(item => item.id === productId)
  if (item) {
    await cartStore.updateQuantity(productId, item.quantity + 1)
  }
}

const decreaseQuantity = async (productId) => {
  const item = cartItems.value.find(item => item.id === productId)
  if (item && item.quantity > 1) {
    await cartStore.updateQuantity(productId, item.quantity - 1)
  }
}

const updateItemQuantity = async (productId, newQuantity) => {
  const quantity = parseInt(newQuantity)
  if (quantity > 0) {
    await cartStore.updateQuantity(productId, quantity)
  }
}

const clearCart = async () => {
  if (confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) {
    await cartStore.clearCart()
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.cart {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: #f8f9fa;
}

.cart-header {
  text-align: center;
  margin-bottom: 3rem;
}

.cart-header h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  color: #333;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.header-icon {
  color: var(--icon-cart-header);
  font-size: 1.2em;
  transition: all var(--transition-normal);
}

.cart-header:hover .header-icon {
  transform: scale(1.1) rotate(10deg);
}

.cart-header p {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.empty-cart {
  text-align: center;
  background: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.empty-cart-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-cart-icon-svg {
  font-size: 1em;
  color: var(--icon-cart-empty);
  transition: all var(--transition-normal);
}

.empty-cart:hover .empty-cart-icon-svg {
  transform: scale(1.1) rotate(-10deg);
  opacity: 0.8;
}

.empty-cart h2 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.75rem;
}

.empty-cart p {
  margin: 0 0 2rem 0;
  color: #666;
  font-size: 1.1rem;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr 250px;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.item-category {
  color: #007bff;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.item-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.stars {
  color: #ffc107;
}

.rating-value {
  color: #666;
  font-size: 0.875rem;
}

.item-description {
  color: #666;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-price {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-label {
  font-size: 0.875rem;
  color: #666;
}

.price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #28a745;
}

.quantity-controls label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
  display: block;
}

.quantity-input {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f8f9fa;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-icon {
  font-size: 0.875rem;
  color: var(--icon-cart-quantity-minus);
  transition: all var(--transition-normal);
}

.qty-btn:hover:not(:disabled) .qty-icon {
  color: var(--icon-cart-quantity-plus);
  transform: scale(1.1);
}

.qty-btn:disabled .qty-icon {
  color: var(--icon-cart-quantity-disabled);
}

.qty-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-input {
  width: 60px;
  text-align: center;
  border: none;
  padding: 0.5rem;
  font-weight: 600;
}

.qty-input:focus {
  outline: none;
}

.item-subtotal {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.subtotal-label {
  font-size: 0.875rem;
  color: #666;
}

.subtotal {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.remove-btn {
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-icon {
  font-size: 0.875rem;
  color: var(--icon-cart-remove);
  transition: all var(--transition-normal);
}

.remove-btn:hover .remove-icon {
  color: var(--icon-cart-remove-hover);
  transform: scale(1.1);
}

.remove-btn:hover {
  background: #dc3545;
  color: white;
}

.cart-summary {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.free-shipping {
  color: #28a745;
  font-weight: 600;
}

.summary-divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 1.5rem 0;
}

.total-line {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.total-amount {
  font-size: 1.5rem;
  color: #007bff;
}

.shipping-notice {
  background: #e7f3ff;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #007bff;
}

.shipping-notice p {
  margin: 0;
  color: #0056b3;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notice-icon {
  color: var(--icon-cart-shipping-notice);
  font-size: 1rem;
  transition: all var(--transition-normal);
}

.shipping-notice:hover .notice-icon {
  transform: scale(1.1) rotate(15deg);
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem 1rem;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-icon {
  font-size: 0.875rem;
  transition: all var(--transition-normal);
}

.btn:hover .btn-icon {
  transform: scale(1.1);
}

.btn-primary .btn-icon {
  color: var(--icon-cart-shop-btn);
}

.btn-secondary .btn-icon {
  color: var(--icon-cart-continue-btn);
}

.btn-outline .btn-icon {
  color: var(--icon-cart-clear-btn);
}

.btn-outline:hover .btn-icon {
  color: var(--icon-cart-remove-hover);
}

.btn-outline {
  background: transparent;
  color: #6c757d;
  border-color: #6c757d;
}

.btn-outline:hover {
  background: #6c757d;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background: #5a6268;
  border-color: #5a6268;
}

.btn-primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .item-image {
    width: 100%;
    height: 200px;
  }
  
  .cart-header h1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }
  
  .cart-items,
  .summary-card {
    padding: 1rem;
  }
}
</style> 