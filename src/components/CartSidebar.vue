<template>


  <div class="cart-sidebar-overlay" v-show="isCartOpen" @click="closeCart">
    <div class="cart-sidebar" @click.stop :class="{ 'is-open': isCartOpen }" >
      <div class="cart-header">
        <h2><font-awesome-icon icon="shopping-cart" class="cart-title-icon" /> Carrito de Compras</h2>
        <button class="close-btn" @click="closeCart" title="Cerrar carrito">
          <font-awesome-icon icon="times" class="close-icon" />
        </button>
      </div>
      
      <div class="cart-content">
        <div v-if="loading && cartItems.length === 0" class="loading-state">
          <font-awesome-icon icon="spinner" class="loading-spinner" spin />
          <p>Cargando carrito...</p>
        </div>

        <div v-else-if="error && cartItems.length === 0" class="error-state">
          <font-awesome-icon icon="exclamation-triangle" class="error-icon" />
          <p>{{ error }}</p>
          <button class="action-btn retry-btn" @click="retryLoadCart">
            <font-awesome-icon icon="spinner" class="btn-icon" />
            <span class="btn-text">Reintentar</span>
          </button>
        </div>

        <!-- Mensaje cuando no hay items en el carrito -->
        <div v-if="cartItems.length === 0 && !loading && !error" class="empty-cart">
          <font-awesome-icon icon="shopping-cart" class="empty-cart-icon" />
          <p v-if="isAuthenticated">No tienes nada en el carrito. ¡Agrega algo!</p>
          <p v-else>Debes tener sesión iniciada para usar el carrito</p>
          <div class="empty-cart-actions">
            <router-link v-if="isAuthenticated" to="/shop" class="action-btn shop-btn" @click="closeCart">
              <font-awesome-icon icon="store" class="btn-icon" />
              <span class="btn-text">Ir a la tienda</span>
            </router-link>
            <button v-else class="action-btn login-btn" @click="openLoginModal">
              <font-awesome-icon icon="lock" class="btn-icon" />
              <span class="btn-text">Iniciar Sesión</span>
            </button>
          </div>
        </div>
        
        <div v-else class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            
            <div class="item-details">
              <h4 class="item-name">{{ item.name }}</h4>
              <div class="item-price">${{ formatCLP(item.price) }}</div>
              
              <div class="quantity-controls">
                <button class="qty-btn decrease" @click="decreaseQuantity(item.id)" :disabled="item.quantity <= 1">
                  <font-awesome-icon icon="minus" class="qty-icon" />
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button class="qty-btn increase" @click="increaseQuantity(item.id)">
                  <font-awesome-icon icon="plus" class="qty-icon" />
                </button>
              </div>
              
              <div class="item-total">
                Total: ${{ formatCLP(item.price * item.quantity) }}
              </div>
            </div>
            
            <button class="remove-btn" @click="removeFromCart(item.id)" title="Eliminar producto">
              <font-awesome-icon icon="trash" class="remove-icon" />
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="cart-total">
          <div class="total-items">{{ cartItemCount }} artículos</div>
          <div class="total-price">Total: ${{ formatCLP(cartTotal) }}</div>
        </div>
        
        <div class="cart-actions">
          <div class="action-buttons">
            <button class="action-btn clear-btn" @click="clearCart">
              <font-awesome-icon icon="trash" class="btn-icon" />
              <span class="btn-text">Limpiar</span>
          </button>
            <router-link to="/cart" class="action-btn view-btn" @click="closeCart">
              <font-awesome-icon icon="eye" class="btn-icon" />
              <span class="btn-text">Ver Carrito</span>
          </router-link>
            <router-link to="/checkout" class="action-btn checkout-btn" @click="closeCart">
              <font-awesome-icon icon="credit-card" class="btn-icon" />
              <span class="btn-text">Comprar</span>
          </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useCartStore } from '../stores/cart.js'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth.js'
import { formatCLP } from '../utils/formatters.js'

const cartStore = useCartStore()
const authStore = useAuthStore()
const { cartItems, cartTotal, cartItemCount, isCartOpen, loading, error } = storeToRefs(cartStore)
const { isAuthenticated } = storeToRefs(authStore)

// Emits
const emit = defineEmits(['open-login-modal'])

// Recargar carrito cuando se abre el sidebar (si está autenticado)
watch(isCartOpen, async (isOpen) => {
  if (isOpen && isAuthenticated.value && !loading.value) {
    await cartStore.loadCart()
  }
})

const removeFromCart = async (productId) => {
  await cartStore.removeFromCart(productId)
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

const clearCart = async () => {
  if (confirm('¿Estás seguro de que quieres limpiar el carrito?')) {
    await cartStore.clearCart()
  }
}

const closeCart = () => {
  cartStore.closeCart()
}

const retryLoadCart = async () => {
  await cartStore.loadCart()
}

const openLoginModal = () => {
  closeCart() // Cerrar el carrito primero
  // Emitir evento para abrir el modal de login
  emit('open-login-modal')
}
</script>

<style scoped>
.cart-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background: white;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.cart-sidebar.is-open {
  transform: translateX(0);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.cart-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cart-title-icon {
  color: var(--icon-cart);
  font-size: 1.1rem;
  transition: color var(--transition-normal);
}

.cart-header:hover .cart-title-icon {
  color: var(--icon-cart-hover);
}

.close-btn {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
  color: #333;
}

.close-icon {
  font-size: 1.2rem;
  color: var(--icon-close);
  transition: color var(--transition-normal);
}

.close-btn:hover .close-icon {
  color: var(--icon-close-hover);
}

.cart-content {
  flex: 1;
  overflow-y: auto;
}

.loading-state,
.empty-cart,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  gap: 1rem;
}

.loading-spinner {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--icon-loading);
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}

.empty-cart-icon {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  color: var(--icon-cart);
  opacity: 0.5;
  transition: color var(--transition-normal);
}

.empty-cart:hover .empty-cart-icon {
  color: var(--icon-cart-hover);
  opacity: 0.7;
}

.empty-cart p {
  margin: 0;
  color: #666;
  font-size: 1rem;
  line-height: 1.4;
}

.empty-cart-actions {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--icon-warning);
  opacity: 0.7;
}

.error-state p {
  margin: 0 0 1.5rem 0;
  color: #dc3545;
  font-size: 1.1rem;
}



.cart-items {
  padding: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  position: relative;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-price {
  color: #28a745;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  background: #f8f9fa;
  border-radius: 20px;
  padding: 0.25rem;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.qty-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.qty-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.qty-btn.decrease:hover:not(:disabled) {
  background: #ff6b6b;
  color: white;
}

.qty-btn.increase:hover:not(:disabled) {
  background: #4ecdc4;
  color: white;
}

.qty-icon {
  font-size: 0.9rem;
  color: var(--icon-plus);
  transition: color var(--transition-normal);
}

.qty-btn.decrease .qty-icon {
  color: var(--icon-minus);
}

.qty-btn.increase .qty-icon {
  color: var(--icon-plus);
}

.qty-btn.decrease:hover:not(:disabled) .qty-icon {
  color: var(--icon-minus-hover);
}

.qty-btn.increase:hover:not(:disabled) .qty-icon {
  color: var(--icon-plus-hover);
}

.quantity {
  min-width: 40px;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: #333;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-total {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.remove-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.5rem;
  background: rgba(220, 53, 69, 0.1);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.remove-btn:hover {
  background: rgba(220, 53, 69, 0.2);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.remove-icon {
  font-size: 0.9rem;
  color: var(--icon-trash);
  transition: color var(--transition-normal);
}

.remove-btn:hover .remove-icon {
  color: var(--icon-trash-hover);
}

.cart-footer {
  border-top: 1px solid #eee;
  padding: 1.5rem;
  background: #f8f9fa;
}

.cart-total {
  margin-bottom: 1rem;
}

.total-items {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.total-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 0;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  position: relative;
  overflow: hidden;
  min-height: 44px;
  max-width: 200px;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.action-btn:hover::before {
  left: 100%;
}

.btn-icon {
  font-size: 0.9rem;
  line-height: 1;
  transition: color var(--transition-normal);
}

/* Colores específicos para cada tipo de botón */
.clear-btn .btn-icon {
  color: var(--icon-trash);
}

.clear-btn:hover .btn-icon {
  color: var(--icon-trash-hover);
}

.view-btn .btn-icon {
  color: var(--icon-view);
}

.view-btn:hover .btn-icon {
  color: var(--icon-view-hover);
}

.checkout-btn .btn-icon {
  color: var(--icon-checkout);
}

.checkout-btn:hover .btn-icon {
  color: var(--icon-checkout-hover);
}

.shop-btn .btn-icon {
  color: var(--icon-shop);
}

.shop-btn:hover .btn-icon {
  color: var(--icon-shop-hover);
}

.login-btn .btn-icon {
  color: var(--icon-login);
}

.login-btn:hover .btn-icon {
  color: var(--icon-login-hover);
}

.retry-btn .btn-icon {
  color: var(--icon-retry);
}

.retry-btn:hover .btn-icon {
  color: var(--icon-retry-hover);
}

.btn-text {
  font-weight: 600;
}

/* Botón Limpiar */
.clear-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.clear-btn:hover {
  background: linear-gradient(135deg, #ff5252, #d32f2f);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

/* Botón Ver Carrito */
.view-btn {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
}

.view-btn:hover {
  background: linear-gradient(135deg, #26a69a, #00897b);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
}

/* Botón Comprar */
.checkout-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.checkout-btn:hover {
  background: linear-gradient(135deg, #5a6fd8, #6a4c93);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Botón Ir a la tienda */
.shop-btn {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
}

.shop-btn:hover {
  background: linear-gradient(135deg, #e91e63, #c2185b);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
}

/* Botón Iniciar Sesión */
.login-btn {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

.login-btn:hover {
  background: linear-gradient(135deg, #2196f3, #00bcd4);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

/* Botón Reintentar */
.retry-btn {
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  color: #333;
  box-shadow: 0 4px 15px rgba(255, 236, 210, 0.3);
}

.retry-btn:hover {
  background: linear-gradient(135deg, #ffd89b, #19547b);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 236, 210, 0.4);
}

@media (max-width: 480px) {
  .cart-sidebar {
    width: 100%;
  }
}
</style> 