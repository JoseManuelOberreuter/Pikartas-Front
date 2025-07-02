import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * Store de Pinia para manejar todas las rutas del backend de forma centralizada
 * 
 * CARACTERÍSTICAS:
 * - Organiza las rutas por categorías (usuarios, productos, órdenes, carrito)
 * - Proporciona URLs completas y métodos para URLs dinámicas
 * - Permite cambiar fácilmente la base URL para diferentes ambientes
 * - Todas las rutas están basadas en las backend rules del proyecto
 * 
 * USO BÁSICO:
 * ```javascript
 * import { useRoutesStore } from '@/stores/routes'
 * 
 * // En un componente
 * const routesStore = useRoutesStore()
 * 
 * // Usar rutas completas
 * console.log(routesStore.fullUserRoutes.login) // http://localhost:4005/users/login
 * 
 * // Usar métodos dinámicos
 * const userProfileUrl = routesStore.getUserProfileUrl('123') // http://localhost:4005/users/profile/123
 * 
 * // Cambiar ambiente
 * routesStore.setBaseURL('https://api.tudominio.com')
 * ```
 * 
 * INTEGRACIÓN CON SERVICIOS:
 * Los servicios en api.js ya usan este store automáticamente,
 * por lo que no necesitas cambiar nada en tus componentes existentes.
 */

export const useRoutesStore = defineStore('routes', () => {
  // Base URL del backend
  const baseURL = ref('http://localhost:4005');
  
  // Rutas de usuarios
  const userRoutes = ref({
    register: '/users/register',
    login: '/users/login',
    verify: '/users/verify',
    resetPasswordRequest: '/users/reset-password-request',
    resetPassword: '/users/reset-password',
    profile: '/users/profile',
    updateProfile: '/users/profile', // Ruta PUT para actualizar perfil
    uploadAvatar: '/users/upload-avatar'
  });

  // Rutas de productos
  const productRoutes = ref({
    getAll: '/api/products',
    getById: '/api/products',
    create: '/api/products',
    update: '/api/products',
    delete: '/api/products',
    updateStock: '/api/products',
    getAllAdmin: '/api/products/admin/all'
  });

  // Rutas de órdenes
  const orderRoutes = ref({
    create: '/api/orders',
    getUserOrders: '/api/orders/my-orders',
    getById: '/api/orders',
    cancel: '/api/orders',
    getAllAdmin: '/api/orders/admin/all',
    getStatsAdmin: '/api/orders/admin/stats',
    updateStatusAdmin: '/api/orders/admin'
  });

  // Rutas de carrito
  const cartRoutes = ref({
    get: '/api/cart',
    getSummary: '/api/cart/summary',
    add: '/api/cart/add',
    update: '/api/cart/update',
    remove: '/api/cart/remove',
    clear: '/api/cart/clear'
  });

  // Computed para obtener URLs completas
  const fullUserRoutes = computed(() => {
    const routes = {};
    Object.keys(userRoutes.value).forEach(key => {
      routes[key] = `${baseURL.value}${userRoutes.value[key]}`;
    });
    return routes;
  });

  const fullProductRoutes = computed(() => {
    const routes = {};
    Object.keys(productRoutes.value).forEach(key => {
      routes[key] = `${baseURL.value}${productRoutes.value[key]}`;
    });
    return routes;
  });

  const fullOrderRoutes = computed(() => {
    const routes = {};
    Object.keys(orderRoutes.value).forEach(key => {
      routes[key] = `${baseURL.value}${orderRoutes.value[key]}`;
    });
    return routes;
  });

  const fullCartRoutes = computed(() => {
    const routes = {};
    Object.keys(cartRoutes.value).forEach(key => {
      routes[key] = `${baseURL.value}${cartRoutes.value[key]}`;
    });
    return routes;
  });

  // Métodos para construir URLs dinámicas
  const getUserProfileUrl = (identifier) => {
    return `${baseURL.value}${userRoutes.value.profile}/${identifier}`;
  };

  const getResetPasswordUrl = (token) => {
    return `${baseURL.value}${userRoutes.value.resetPassword}/${token}`;
  };

  const getProductByIdUrl = (id) => {
    return `${baseURL.value}${productRoutes.value.getById}/${id}`;
  };

  const getUpdateProductUrl = (id) => {
    return `${baseURL.value}${productRoutes.value.update}/${id}`;
  };

  const getDeleteProductUrl = (id) => {
    return `${baseURL.value}${productRoutes.value.delete}/${id}`;
  };

  const getUpdateStockUrl = (id) => {
    return `${baseURL.value}${productRoutes.value.updateStock}/${id}/stock`;
  };

  const getOrderByIdUrl = (orderId) => {
    return `${baseURL.value}${orderRoutes.value.getById}/${orderId}`;
  };

  const getCancelOrderUrl = (orderId) => {
    return `${baseURL.value}${orderRoutes.value.cancel}/${orderId}/cancel`;
  };

  const getUpdateOrderStatusUrl = (orderId) => {
    return `${baseURL.value}${orderRoutes.value.updateStatusAdmin}/${orderId}/status`;
  };

  const getRemoveFromCartUrl = (productId) => {
    return `${baseURL.value}${cartRoutes.value.remove}/${productId}`;
  };

  // Método para cambiar la base URL (útil para diferentes ambientes)
  const setBaseURL = (newBaseURL) => {
    baseURL.value = newBaseURL;
  };

  // Método para obtener todas las rutas organizadas
  const getAllRoutes = computed(() => {
    return {
      users: fullUserRoutes.value,
      products: fullProductRoutes.value,
      orders: fullOrderRoutes.value,
      cart: fullCartRoutes.value
    };
  });

  return {
    // Estado
    baseURL,
    userRoutes,
    productRoutes,
    orderRoutes,
    cartRoutes,
    
    // Computed
    fullUserRoutes,
    fullProductRoutes,
    fullOrderRoutes,
    fullCartRoutes,
    getAllRoutes,
    
    // Métodos
    setBaseURL,
    getUserProfileUrl,
    getResetPasswordUrl,
    getProductByIdUrl,
    getUpdateProductUrl,
    getDeleteProductUrl,
    getUpdateStockUrl,
    getOrderByIdUrl,
    getCancelOrderUrl,
    getUpdateOrderStatusUrl,
    getRemoveFromCartUrl
  };
}); 