import { reactive, computed } from 'vue'

// Estado global del carrito
const state = reactive({
  items: [],
  isOpen: false
})

// Getters
export const cartItems = computed(() => state.items)
export const cartTotal = computed(() => 
  state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
)
export const cartItemCount = computed(() => 
  state.items.reduce((total, item) => total + item.quantity, 0)
)
export const isCartOpen = computed(() => state.isOpen)

// Actions
export const addToCart = (product) => {
  const existingItem = state.items.find(item => item.id === product.id)
  
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    state.items.push({
      ...product,
      quantity: 1
    })
  }
}

export const removeFromCart = (productId) => {
  const index = state.items.findIndex(item => item.id === productId)
  if (index > -1) {
    state.items.splice(index, 1)
  }
}

export const updateQuantity = (productId, quantity) => {
  const item = state.items.find(item => item.id === productId)
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
    }
  }
}

export const clearCart = () => {
  state.items = []
}

export const toggleCart = () => {
  state.isOpen = !state.isOpen
}

export const openCart = () => {
  state.isOpen = true
}

export const closeCart = () => {
  state.isOpen = false
} 