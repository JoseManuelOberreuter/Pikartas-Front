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
  const isInitializing = ref(false);

  // Composables
  const { success, error: errorNotification } = useNotifications();

  const verificationRequiredMessage = 'Debes verificar tu cuenta para usar el carrito. Revisa tu correo electrónico.';

  const resolveCartErrorMessage = (err, fallbackMessage) => {
    if (err?.verificationRequired) {
      return verificationRequiredMessage;
    }
    return err?.message || err?.error || fallbackMessage;
  };

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
          // Handle 404 errors specifically - product doesn't exist or is disabled
          if (error?.status === 404 || error?.response?.status === 404) {
            console.warn(`[Cart Store] Product ${productId} not found (404), will be filtered out`);
            // Don't add to productDetails - product will be filtered out in mapItemsToCartFormat
            // The backend should have already removed inactive products, but if a product
            // was completely deleted, this will handle it gracefully
            return; // Skip this product
          }
          // For other errors, use default data as fallback
          console.error(`[Cart Store] Error obteniendo detalles del producto ${productId}:`, error);
          productDetails[productId] = {
            id: productId,
            name: `Producto ${productId}`,
            image: '/placeholder-product.svg',
            category: 'General',
            rating: 5,
            description: '',
            stock: 0
          };
        }
      });
      
      await Promise.all(promises);
      return productDetails;
    } catch (error) {
      console.error('[Cart Store] Error getting product details:', error);
      return {};
    }
  }

  // Computed properties - Pinia maneja la reactividad automáticamente
  // Estos computed se actualizan automáticamente cuando items.value cambia
  const cartItems = computed(() => items.value);
  
  const cartTotal = computed(() => 
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  );
  
  const cartItemCount = computed(() => 
    items.value.reduce((total, item) => total + (item.quantity || 0), 0)
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

    // Prevent multiple simultaneous loads
    // No verificar isInitializing aquí porque initializeCart lo usa para prevenir múltiples inicializaciones
    if (loading.value) {
      return;
    }
    loading.value = true;
    error.value = null;
    
    try {
      // Intentar obtener el carrito completo primero
      const response = await cartService.getCart();
      
      // Helper function to map items
      const mapItemsToCartFormat = async (itemsArray) => {
        if (!itemsArray || !Array.isArray(itemsArray) || itemsArray.length === 0) {
          return Promise.resolve([]);
        }
        
        const productIds = [...new Set(itemsArray.map(item => item.productId).filter(Boolean))];
        
        if (productIds.length === 0) {
          return Promise.resolve([]);
        }
        
        const productDetails = await getProductDetails(productIds);
        
        const mapped = itemsArray.map(item => {
          if (!item.productId) {
            return null;
          }
          
          // If product details are not available (404 or other error), filter it out
          // The backend should have already removed inactive products, but this is a safety net
          if (!productDetails[item.productId]) {
            console.warn(`[Cart Store] Product ${item.productId} details not available, filtering out`);
            return null;
          }
          
          const productDetail = productDetails[item.productId];
          return {
            id: item.productId,
            _id: item.productId,
            name: item.productName || productDetail.name || `Producto ${item.productId}`,
            price: item.price,
            // Use placeholder if product not found or image missing
            image: productDetail.image || '/placeholder-product.svg',
            stock: productDetail.stock || 999,
            quantity: item.quantity,
            category: productDetail.category || 'General',
            rating: productDetail.rating || 5,
            description: productDetail.description || '',
            subtotal: item.subtotal || (item.price * item.quantity)
          };
        }).filter(Boolean); // Remove null items
        
        return mapped;
      };
      
      let mappedItems = [];
      
      // Check for removed products notification
      let removedProductsInfo = null;
      if (response.success && response.data && response.data.removedProducts) {
        removedProductsInfo = response.data.removedProducts;
      }
      
      // Check response structure and extract items
      if (response.success && response.data) {
        // Case 1: response.data.items (standard format from formatCart)
        if (response.data.items && Array.isArray(response.data.items)) {
          mappedItems = await mapItemsToCartFormat(response.data.items);
        }
        // Case 2: response.data is an array directly
        else if (Array.isArray(response.data)) {
          mappedItems = await mapItemsToCartFormat(response.data);
        }
        // Case 3: response.data.cartItems
        else if (response.data.cartItems && Array.isArray(response.data.cartItems)) {
          mappedItems = await mapItemsToCartFormat(response.data.cartItems);
        }
        // Case 4: Try summary endpoint as fallback
        else {
          const summaryResponse = await cartService.getCartSummary();
          
          // Check for removed products in summary response too
          if (summaryResponse.success && summaryResponse.data && summaryResponse.data.removedProducts) {
            removedProductsInfo = summaryResponse.data.removedProducts;
          }
          
          if (summaryResponse.success && summaryResponse.data) {
            if (summaryResponse.data.items && Array.isArray(summaryResponse.data.items)) {
              mappedItems = await mapItemsToCartFormat(summaryResponse.data.items);
            } else if (Array.isArray(summaryResponse.data)) {
              mappedItems = await mapItemsToCartFormat(summaryResponse.data);
            }
          }
        }
      } else if (response.data && Array.isArray(response.data)) {
        // Direct array response
        mappedItems = await mapItemsToCartFormat(response.data);
      } else {
        // Try summary as fallback
        const summaryResponse = await cartService.getCartSummary();
        
        // Check for removed products in summary response too
        if (summaryResponse.success && summaryResponse.data && summaryResponse.data.removedProducts) {
          removedProductsInfo = summaryResponse.data.removedProducts;
        }
        
        if (summaryResponse.success && summaryResponse.data) {
          if (summaryResponse.data.items && Array.isArray(summaryResponse.data.items)) {
            mappedItems = await mapItemsToCartFormat(summaryResponse.data.items);
          } else if (Array.isArray(summaryResponse.data)) {
            mappedItems = await mapItemsToCartFormat(summaryResponse.data);
          }
        }
      }
      
      // Show notification if products were removed
      if (removedProductsInfo && removedProductsInfo.count > 0) {
        errorNotification('Un artículo ya no existe o no queda stock');
      }
      
      // Actualizar items - Pinia maneja la reactividad automáticamente
      // Al asignar items.value, los computed (cartItemCount, cartTotal, cartItems) se actualizan automáticamente
      if (mappedItems.length > 0) {
        items.value = mappedItems;
      } else {
        items.value = [];
      }
      
    } catch (err) {
      console.error('[Cart Store] Error loading cart:', err);
      // Manejar errores específicos de autenticación
      if (err?.verificationRequired) {
        error.value = resolveCartErrorMessage(err, verificationRequiredMessage);
      } else if (err?.status === 401 || err?.statusCode === 401) {
        error.value = 'Debes iniciar sesión para ver tu carrito';
        // Limpiar carrito local si no está autenticado
        items.value = [];
      } else {
        error.value = resolveCartErrorMessage(err, 'Error al cargar el carrito');
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
      // Siempre recargar el carrito, incluso si falla, para mostrar items existentes
      await loadCart();
      
      if (err?.verificationRequired) {
        const message = resolveCartErrorMessage(err, verificationRequiredMessage);
        error.value = message;
        errorNotification(message);
      } else if (err?.status === 401 || err?.statusCode === 401) {
        error.value = 'Debes iniciar sesión para agregar productos al carrito';
        errorNotification(error.value);
      } else {
        // Extraer mensaje de error del response si está disponible
        const errorMessage = err?.response?.data?.error || 
                            err?.message || 
                            'Error al agregar producto al carrito';
        const message = resolveCartErrorMessage(err, errorMessage);
        error.value = message;
        errorNotification(message);
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
      if (err?.verificationRequired) {
        const message = resolveCartErrorMessage(err, verificationRequiredMessage);
        error.value = message;
        errorNotification(message);
      } else if (err?.status === 401 || err?.statusCode === 401) {
        error.value = 'Debes iniciar sesión para modificar el carrito';
        errorNotification(error.value);
      } else {
        const message = resolveCartErrorMessage(err, 'Error al eliminar producto del carrito');
        error.value = message;
        errorNotification(message);
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
      if (err?.verificationRequired) {
        const message = resolveCartErrorMessage(err, verificationRequiredMessage);
        error.value = message;
        errorNotification(message);
      } else if (err?.status === 401 || err?.statusCode === 401) {
        error.value = 'Debes iniciar sesión para modificar el carrito';
        errorNotification(error.value);
      } else {
        const message = resolveCartErrorMessage(err, 'Error al actualizar cantidad');
        error.value = message;
        errorNotification(message);
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
      if (err?.verificationRequired) {
        const message = resolveCartErrorMessage(err, verificationRequiredMessage);
        error.value = message;
        errorNotification(message);
      } else if (err?.status === 401 || err?.statusCode === 401) {
        error.value = 'Debes iniciar sesión para vaciar el carrito';
        errorNotification(error.value);
      } else {
        const message = resolveCartErrorMessage(err, 'Error al vaciar el carrito');
        error.value = message;
        errorNotification(message);
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
    // Prevent multiple simultaneous initializations
    if (isInitializing.value) {
      return;
    }
    
    // Si ya está cargando, simplemente esperar a que termine
    if (loading.value) {
      // Esperar hasta 5 segundos máximo
      let attempts = 0;
      while (loading.value && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      if (!loading.value) {
        return;
      }
    }
    
    isInitializing.value = true;
    try {
      await loadCart();
    } catch (error) {
      console.error('[Cart Store] Error inicializando carrito:', error);
      // Don't throw - allow app to continue even if cart init fails
    } finally {
      isInitializing.value = false;
    }
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