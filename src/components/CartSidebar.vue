<template>
  <div class="cart-sidebar-overlay" v-show="isCartOpen" @click="closeCart">
    <div class="cart-sidebar" @click.stop :class="{ 'is-open': isCartOpen }" >
      <div class="cart-header">
        <h2>🛒 Carrito de Compras</h2>
        <button class="close-btn" @click="closeCart">&times;</button>
      </div>
      
      <div class="cart-content">
        <div v-if="loading && cartItems.length === 0" class="loading-state">
          <div class="loading-spinner">🔄</div>
          <p>Cargando carrito...</p>
        </div>

        <div v-else-if="cartItems.length === 0" class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <p>Tu carrito está vacío</p>
          <router-link to="/shop" class="btn btn-primary" @click="closeCart">
            Ir a la tienda
          </router-link>
        </div>
        
        <div v-else class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            
            <div class="item-details">
              <h4 class="item-name">{{ item.name }}</h4>
              <div class="item-price">${{ item.price.toFixed(2) }}</div>
              
              <div class="quantity-controls">
                <button class="qty-btn" @click="decreaseQuantity(item.id)" :disabled="item.quantity <= 1">-</button>
                <span class="quantity">{{ item.quantity }}</span>
                <button class="qty-btn" @click="increaseQuantity(item.id)">+</button>
              </div>
              
              <div class="item-total">
                Total: ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
            
            <button class="remove-btn" @click="removeFromCart(item.id)">
              🗑️
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="cart-total">
          <div class="total-items">{{ cartItemCount }} artículos</div>
          <div class="total-price">Total: ${{ cartTotal.toFixed(2) }}</div>
        </div>
        
        <div class="cart-actions">
          <button class="btn btn-outline" @click="clearCart">
            Limpiar Carrito
          </button>
          <router-link to="/cart" class="btn btn-primary" @click="closeCart">
            Ver Carrito
          </router-link>
          <router-link to="/checkout" class="btn btn-success" @click="closeCart">
            Finalizar Compra
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart.js'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()
const { cartItems, cartTotal, cartItemCount, isCartOpen, loading } = storeToRefs(cartStore)

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
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.cart-content {
  flex: 1;
  overflow-y: auto;
}

.loading-state,
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  font-size: 2rem;
  margin-bottom: 1rem;
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
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-cart p {
  margin: 0 0 1.5rem 0;
  color: #666;
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
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s;
}

.qty-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #007bff;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
}

.item-total {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.remove-btn {
  position: absolute;
  top: 1rem;
  right: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #dc3545;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.remove-btn:hover {
  background: rgba(220, 53, 69, 0.1);
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

.btn {
  padding: 0.75rem 1rem;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
  display: block;
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

.btn-primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.btn-success:hover {
  background: #1e7e34;
  border-color: #1e7e34;
}

@media (max-width: 480px) {
  .cart-sidebar {
    width: 100%;
  }
}
</style> 