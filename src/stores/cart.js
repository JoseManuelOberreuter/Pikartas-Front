import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { cartService, productService } from '../services/api';
import { useAuthStore } from './auth';
import { useNotifications } from '../composables/useNotifications';

export const useCartStore = defineStore('cart', () => {
  // Estado
  const items = ref([]);
  const isOpen = ref(false);
  const loading = ref(false);
  const error = ref(null);

  // Composables
  const { success, error: errorNotification } = useNotifications();

  // Función para obtener información completa de productos
  async function getProductDetails(productIds) {
    const productDetails = {};
    
    try {
      // Obtener detalles de cada producto
      const promises = productIds.map(async (productId) => {
        try {
          const product = await productService.getProductById(productId);
          if (product.success && product.data) {
            productDetails[productId] = product.data;
          } else if (product.product) {
            productDetails[productId] = product.product;
          } else {
            productDetails[productId] = product;
          }
        } catch (error) {
          console.warn(`No se pudo obtener detalles del producto ${productId}:`, error);
          // Usar datos por defecto si falla
          productDetails[productId] = {
            id: productId,
            name: `Producto ${productId}`,
            image: '/placeholder-product.svg',
            category: 'General',
            rating: 5,
            description: ''
          };
        }
      });
      
      await Promise.all(promises);
      return productDetails;
    } catch (error) {
      console.error('Error obteniendo detalles de productos:', error);
      return {};
    }
  }

  // Computed (mantenemos la misma API que antes)
  const cartItems = computed(() => items.value);
  const cartTotal = computed(() => 
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  );
  const cartItemCount = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  );
  const isCartOpen = computed(() => isOpen.value);

  // Acciones
  async function loadCart() {
    const authStore = useAuthStore();
    
    // Solo cargar si está autenticado
    if (!authStore.isAuthenticated) {
      items.value = [];
      return;
    }

    loading.value = true;
    error.value = null;
    
    try {
      // Intentar obtener el carrito completo primero
      const response = await cartService.getCart();
      
              // Si no hay items en la respuesta principal, intentar con el summary
        if (!response.data || (!response.data.items && !Array.isArray(response.data))) {
          const summaryResponse = await cartService.getCartSummary();
        
        if (summaryResponse.success && summaryResponse.data && summaryResponse.data.items) {
                // Obtener IDs únicos de productos
      const productIds = [...new Set(summaryResponse.data.items.map(item => item.productId))];
      
      // Obtener detalles de productos
      const productDetails = await getProductDetails(productIds);
      
      items.value = summaryResponse.data.items.map(item => {
            
            const productDetail = productDetails[item.productId] || {};
            
            return {
              id: item.productId,
              _id: item.productId,
              name: item.productName,
              price: item.price,
              image: productDetail.image || '/placeholder-product.svg',
              stock: productDetail.stock || 999,
              quantity: item.quantity,
              category: productDetail.category || 'General',
              rating: productDetail.rating || 5,
              description: productDetail.description || '',
              subtotal: item.subtotal
            };
          });
        } else if (summaryResponse.data && Array.isArray(summaryResponse.data)) {
          // Obtener IDs únicos de productos
          const productIds = [...new Set(summaryResponse.data.map(item => item.productId))];
          
          // Obtener detalles de productos
          const productDetails = await getProductDetails(productIds);
          
          items.value = summaryResponse.data.map(item => {
            
            const productDetail = productDetails[item.productId] || {};
            
            return {
              id: item.productId,
              _id: item.productId,
              name: item.productName,
              price: item.price,
              image: productDetail.image || '/placeholder-product.svg',
              stock: productDetail.stock || 999,
              quantity: item.quantity,
              category: productDetail.category || 'General',
              rating: productDetail.rating || 5,
              description: productDetail.description || '',
              subtotal: item.subtotal
            };
          });
        } else {
          items.value = [];
        }
      } else {
      // Mapear la respuesta del backend al formato esperado por el frontend
      if (response.success && response.data && response.data.items) {
          // Obtener IDs únicos de productos
          const productIds = [...new Set(response.data.items.map(item => item.productId))];
          
          // Obtener detalles de productos
          const productDetails = await getProductDetails(productIds);
          
          items.value = response.data.items.map(item => {
            
            const productDetail = productDetails[item.productId] || {};
            
            return {
              id: item.productId,
              _id: item.productId,
              name: item.productName,
              price: item.price,
              image: productDetail.image || '/placeholder-product.svg',
              stock: productDetail.stock || 999,
              quantity: item.quantity,
              category: productDetail.category || 'General',
              rating: productDetail.rating || 5,
              description: productDetail.description || '',
              subtotal: item.subtotal
            };
          });
        } else if (response.data && Array.isArray(response.data)) {
          // Obtener IDs únicos de productos
          const productIds = [...new Set(response.data.map(item => item.productId))];
          
          // Obtener detalles de productos
          const productDetails = await getProductDetails(productIds);
          
          items.value = response.data.map(item => {
            
            const productDetail = productDetails[item.productId] || {};
            
            return {
              id: item.productId,
              _id: item.productId,
              name: item.productName,
              price: item.price,
              image: productDetail.image || '/placeholder-product.svg',
              stock: productDetail.stock || 999,
              quantity: item.quantity,
              category: productDetail.category || 'General',
              rating: productDetail.rating || 5,
              description: productDetail.description || '',
              subtotal: item.subtotal
            };
          });
        } else if (response.success && response.data && response.data.cartItems) {
          // Obtener IDs únicos de productos
          const productIds = [...new Set(response.data.cartItems.map(item => item.productId))];
          
          // Obtener detalles de productos
          const productDetails = await getProductDetails(productIds);
          
          items.value = response.data.cartItems.map(item => {
            
            const productDetail = productDetails[item.productId] || {};
            
            return {
              id: item.productId,
              _id: item.productId,
              name: item.productName,
              price: item.price,
              image: productDetail.image || '/placeholder-product.svg',
              stock: productDetail.stock || 999,
          quantity: item.quantity,
              category: productDetail.category || 'General',
              rating: productDetail.rating || 5,
              description: productDetail.description || '',
              subtotal: item.subtotal
            };
          });
      } else {
        items.value = [];
        }
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      
      // Manejar errores específicos de autenticación
      if (err.status === 401 || err.statusCode === 401) {
        error.value = 'Debes iniciar sesión para ver tu carrito';
        // Limpiar carrito local si no está autenticado
        items.value = [];
      } else {
      error.value = err.message || 'Error al cargar el carrito';
      items.value = [];
      }
    } finally {
      loading.value = false;
    }
  }

  async function addToCart(product) {
    const authStore = useAuthStore();
    
    // Verificar autenticación
    if (!authStore.isAuthenticated) {
      errorNotification('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    loading.value = true;
    error.value = null;
    
    try {
      const productData = {
        productId: product.id,
        quantity: 1
      };
      
      await cartService.addToCart(productData);
      await loadCart(); // Recargar carrito después de agregar
      
      success(`${product.name} agregado al carrito`);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      
      // Manejar errores específicos de autenticación
      if (err.status === 401 || err.statusCode === 401) {
        error.value = 'Debes iniciar sesión para agregar productos al carrito';
        errorNotification(error.value);
      } else {
      error.value = err.message || 'Error al agregar producto al carrito';
      errorNotification(error.value);
      }
    } finally {
      loading.value = false;
    }
  }

  async function removeFromCart(productId) {
    const authStore = useAuthStore();
    
    if (!authStore.isAuthenticated) {
      errorNotification('Debes iniciar sesión para modificar el carrito');
      return;
    }

    loading.value = true;
    error.value = null;
    
    try {
      await cartService.removeFromCart(productId);
      await loadCart(); // Recargar carrito después de eliminar
      
      success('Producto eliminado del carrito');
      
    } catch (err) {
      console.error('Error removing from cart:', err);
      
      // Manejar errores específicos de autenticación
      if (err.status === 401 || err.statusCode === 401) {
        error.value = 'Debes iniciar sesión para modificar el carrito';
        errorNotification(error.value);
      } else {
      error.value = err.message || 'Error al eliminar producto del carrito';
      errorNotification(error.value);
      }
    } finally {
      loading.value = false;
    }
  }

  async function updateQuantity(productId, quantity) {
    const authStore = useAuthStore();
    
    if (!authStore.isAuthenticated) {
      errorNotification('Debes iniciar sesión para modificar el carrito');
      return;
    }

    // Si la cantidad es 0 o menor, eliminar el producto
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    loading.value = true;
    error.value = null;
    
    try {
      const itemData = {
        productId: productId,
        quantity: quantity
      };
      
      await cartService.updateCartItem(itemData);
      await loadCart(); // Recargar carrito después de actualizar
      
    } catch (err) {
      console.error('Error updating cart item:', err);
      
      // Manejar errores específicos de autenticación
      if (err.status === 401 || err.statusCode === 401) {
        error.value = 'Debes iniciar sesión para modificar el carrito';
        errorNotification(error.value);
      } else {
      error.value = err.message || 'Error al actualizar cantidad';
      errorNotification(error.value);
      }
    } finally {
      loading.value = false;
    }
  }

  async function clearCart() {
    const authStore = useAuthStore();
    
    if (!authStore.isAuthenticated) {
      items.value = [];
      return;
    }

    loading.value = true;
    error.value = null;
    
    try {
      await cartService.clearCart();
      items.value = [];
      success('Carrito vaciado');
      
    } catch (err) {
      console.error('Error clearing cart:', err);
      
      // Manejar errores específicos de autenticación
      if (err.status === 401 || err.statusCode === 401) {
        error.value = 'Debes iniciar sesión para vaciar el carrito';
        errorNotification(error.value);
      } else {
      error.value = err.message || 'Error al vaciar el carrito';
      errorNotification(error.value);
      }
    } finally {
      loading.value = false;
    }
  }

  // Funciones de UI (mantener compatibilidad)
  function toggleCart() {
    isOpen.value = !isOpen.value;
  }

  function openCart() {
    isOpen.value = true;
  }

  function closeCart() {
    isOpen.value = false;
  }

  // Inicializar carrito cuando se autentica
  const initializeCart = async () => {
    await loadCart();
  };

  return {
    // Estado
    items,
    isOpen,
    loading,
    error,
    
    // Computed (mantenemos la misma API)
    cartItems,
    cartTotal,
    cartItemCount,
    isCartOpen,
    
    // Acciones
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    initializeCart
  };
});

// Exportar funciones individuales para mantener compatibilidad con el código existente
export { useCartStore as default };

// Crear una instancia del store para las exportaciones individuales
let cartStoreInstance = null;

function getCartStore() {
  if (!cartStoreInstance) {
    cartStoreInstance = useCartStore();
  }
  return cartStoreInstance;
}

// Exportar funciones individuales (compatibilidad backward)
export const cartItems = computed(() => getCartStore().cartItems);
export const cartTotal = computed(() => getCartStore().cartTotal);
export const cartItemCount = computed(() => getCartStore().cartItemCount);
export const isCartOpen = computed(() => getCartStore().isCartOpen);

export const addToCart = (product) => getCartStore().addToCart(product);
export const removeFromCart = (productId) => getCartStore().removeFromCart(productId);
export const updateQuantity = (productId, quantity) => getCartStore().updateQuantity(productId, quantity);
export const clearCart = () => getCartStore().clearCart();
export const toggleCart = () => getCartStore().toggleCart();
export const openCart = () => getCartStore().openCart();
export const closeCart = () => getCartStore().closeCart(); 