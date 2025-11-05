import axios from 'axios';
import { useRoutesStore } from '../stores/routes';
import logger from '../utils/logger.js';

// Configuración del interceptor para manejar tokens
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Use secure logger that sanitizes sensitive data
  logger.request(config);
  return config;
});

// Interceptor de respuesta para logs
axios.interceptors.response.use(
  response => {
    // Use secure logger that sanitizes sensitive data
    logger.response(response);
    return response;
  },
  error => {
    logger.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export const authService = {
  async register(userData) {
    try {
      const routesStore = useRoutesStore();
      logger.debug('Sending registration data');
      const response = await axios.post(routesStore.fullUserRoutes.register, userData);
      
      // Tu backend NO devuelve token inmediatamente, requiere verificación
      // No guardamos token aquí porque el usuario no está verificado
      
      return response.data;
    } catch (error) {
      logger.error('Registration error:', error);
      // Propagar el error específico del backend
      throw error.response?.data || { error: error.message };
    }
  },
  
  async login(credentials) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.post(routesStore.fullUserRoutes.login, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      logger.error('Login error:', error);
      throw error.response?.data || { error: error.message };
    }
  },
  
  async verifyEmail(token) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.post(routesStore.fullUserRoutes.verify, { token });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      logger.error('Verification error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async requestPasswordReset(email) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.post(routesStore.fullUserRoutes.resetPasswordRequest, { email });
      return response.data;
    } catch (error) {
      logger.error('Password reset request error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async resetPassword(token, password) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.post(routesStore.getResetPasswordUrl(token), { password });
      return response.data;
    } catch (error) {
      logger.error('Password reset error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getUserProfile(identifier) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.getUserProfileUrl(identifier));
      return response.data;
    } catch (error) {
      logger.error('Get user profile error:', error);
      throw error.response?.data || { error: error.message };
    }
  },


  async updateProfile(profileData) {
    try {
      const routesStore = useRoutesStore();
      // Usando la ruta updateProfile para PUT /users/profile
      const response = await axios.put(routesStore.fullUserRoutes.updateProfile, profileData);
      return response.data;
    } catch (error) {
      logger.error('Update profile error:', error);
      throw error.response?.data || { error: error.message };
    }
  }
};

// Servicios de productos
export const productService = {
  async getAllProducts() {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.fullProductRoutes.getAll);
      return response.data;
    } catch (error) {
      logger.error('Get products error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getProductById(id) {
    try {
      const routesStore = useRoutesStore();
      const url = routesStore.getProductByIdUrl(id);
      logger.debug('Consultando producto', { productId: id });
      
      const response = await axios.get(url);
      
      return response.data;
    } catch (error) {
      logger.error('Error obteniendo producto por ID:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async createProduct(productData) {
    try {
      const routesStore = useRoutesStore();
      logger.debug('Creating product');
      
      // Configurar headers para FormData si es necesario
      const config = {}
      if (productData instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      const response = await axios.post(routesStore.fullProductRoutes.create, productData, config);
      return response.data;
    } catch (error) {
      logger.error('Create product error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async updateProduct(id, productData) {
    try {
      const routesStore = useRoutesStore();
      logger.debug('Updating product', { productId: id });
      
      // Configurar headers para FormData si es necesario
      const config = {}
      if (productData instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      const response = await axios.put(routesStore.getUpdateProductUrl(id), productData, config);
      return response.data;
    } catch (error) {
      logger.error('Update product error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async deleteProduct(id) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.delete(routesStore.getDeleteProductUrl(id));
      return response.data;
    } catch (error) {
      logger.error('Delete product error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async updateStock(id, stock) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.patch(routesStore.getUpdateStockUrl(id), { stock });
      return response.data;
    } catch (error) {
      logger.error('Update stock error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getCategories() {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.fullProductRoutes.getCategories);
      return response.data;
    } catch (error) {
      logger.error('Get categories error:', error);
      throw error.response?.data || { error: error.message };
    }
  }
};

// Servicios de órdenes
export const orderService = {
  async createOrder(orderData) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.post(routesStore.fullOrderRoutes.create, orderData);
      return response.data;
    } catch (error) {
      logger.error('Create order error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getUserOrders() {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.fullOrderRoutes.getUserOrders);
      return response.data;
    } catch (error) {
      logger.error('Get user orders error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getOrderById(orderId) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.getOrderByIdUrl(orderId));
      return response.data;
    } catch (error) {
      logger.error('Get order error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async cancelOrder(orderId) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.patch(routesStore.getCancelOrderUrl(orderId));
      return response.data;
    } catch (error) {
      logger.error('Cancel order error:', error);
      throw error.response?.data || { error: error.message };
    }
  }
};

// Servicios de carrito
export const cartService = {
  async getCart() {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.fullCartRoutes.get);
      return response.data;
    } catch (error) {
      logger.error('Get cart error:', error);
      // Agregar información del status code al error
      const errorWithStatus = error.response?.data || { error: error.message };
      errorWithStatus.status = error.response?.status;
      errorWithStatus.statusCode = error.response?.status;
      throw errorWithStatus;
    }
  },

  async getCartSummary() {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.fullCartRoutes.getSummary);
      return response.data;
    } catch (error) {
      logger.error('Get cart summary error:', error);
      const errorWithStatus = error.response?.data || { error: error.message };
      errorWithStatus.status = error.response?.status;
      errorWithStatus.statusCode = error.response?.status;
      throw errorWithStatus;
    }
  },

  async addToCart(productData) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.post(routesStore.fullCartRoutes.add, productData);
      return response.data;
    } catch (error) {
      logger.error('Add to cart error:', error);
      const errorWithStatus = error.response?.data || { error: error.message };
      errorWithStatus.status = error.response?.status;
      errorWithStatus.statusCode = error.response?.status;
      throw errorWithStatus;
    }
  },

  async updateCartItem(itemData) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.put(routesStore.fullCartRoutes.update, itemData);
      return response.data;
    } catch (error) {
      logger.error('Update cart item error:', error);
      const errorWithStatus = error.response?.data || { error: error.message };
      errorWithStatus.status = error.response?.status;
      errorWithStatus.statusCode = error.response?.status;
      throw errorWithStatus;
    }
  },

  async removeFromCart(productId) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.delete(routesStore.getRemoveFromCartUrl(productId));
      return response.data;
    } catch (error) {
      logger.error('Remove from cart error:', error);
      const errorWithStatus = error.response?.data || { error: error.message };
      errorWithStatus.status = error.response?.status;
      errorWithStatus.statusCode = error.response?.status;
      throw errorWithStatus;
    }
  },

  async clearCart() {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.delete(routesStore.fullCartRoutes.clear);
      return response.data;
    } catch (error) {
      logger.error('Clear cart error:', error);
      const errorWithStatus = error.response?.data || { error: error.message };
      errorWithStatus.status = error.response?.status;
      errorWithStatus.statusCode = error.response?.status;
      throw errorWithStatus;
    }
  }
};

// Servicios de administración
export const adminService = {
  // Gestión de productos
  async createProduct(productData) {
    try {
      const routesStore = useRoutesStore();
      logger.debug('Admin creating product');
      
      // Configurar headers para FormData si es necesario
      const config = {}
      if (productData instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      const response = await axios.post(routesStore.fullProductRoutes.create, productData, config);
      return response.data;
    } catch (error) {
      logger.error('Create product error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async updateProduct(id, productData) {
    try {
      const routesStore = useRoutesStore();
      logger.debug('Admin updating product', { productId: id });
      
      // Configurar headers para FormData si es necesario
      const config = {}
      if (productData instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      const response = await axios.put(routesStore.getUpdateProductUrl(id), productData, config);
      return response.data;
    } catch (error) {
      logger.error('Update product error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async deleteProduct(id) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.delete(routesStore.getDeleteProductUrl(id));
      return response.data;
    } catch (error) {
      logger.error('Delete product error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async updateProductStock(id, stock) {
    try {
      const routesStore = useRoutesStore();
      const url = routesStore.getUpdateStockUrl(id);
      const data = { stock };
      
      logger.debug('Update stock request', { productId: id, stock });
      
      const response = await axios.patch(url, data);
      return response.data;
    } catch (error) {
      logger.error('Update stock error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getAllProducts() {
    try {
      const routesStore = useRoutesStore();
      logger.debug('Admin getting all products');
      const response = await axios.get(routesStore.fullProductRoutes.getAllAdmin);
      return response.data;
    } catch (error) {
      logger.error('Admin get all products error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  // Gestión de órdenes
  async getAllOrders() {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.fullOrderRoutes.getAllAdmin);
      return response.data;
    } catch (error) {
      logger.error('Get all orders error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getOrderStats() {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.fullOrderRoutes.getStatsAdmin);
      return response.data;
    } catch (error) {
      logger.error('Get order stats error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.patch(routesStore.getUpdateOrderStatusUrl(orderId), { status });
      return response.data;
    } catch (error) {
      logger.error('Update order status error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  // Transbank Payment Management
  async getPaymentStatus(orderId) {
    try {
      const response = await axios.get(`/api/payments/status/${orderId}`);
      return response.data;
    } catch (error) {
      logger.error('Get payment status error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async refundPayment(orderId, amount = null) {
    try {
      const body = amount ? { amount } : {};
      const response = await axios.post(`/api/payments/refund/${orderId}`, body);
      return response.data;
    } catch (error) {
      logger.error('Refund payment error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getOrderDetails(orderId) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.getOrderByIdUrl(orderId));
      return response.data;
    } catch (error) {
      logger.error('Get order details error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  // Gestión de usuarios
  async getAllUsers() {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.fullUserRoutes.getAllAdmin);
      return response.data;
    } catch (error) {
      logger.error('Get all users error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getUserById(id) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.getUserByIdUrl(id));
      return response.data;
    } catch (error) {
      logger.error('Get user by ID error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async updateUser(id, userData) {
    try {
      const routesStore = useRoutesStore();
      logger.debug('Admin updating user', { userId: id });
      const response = await axios.put(routesStore.getUpdateUserUrl(id), userData);
      return response.data;
    } catch (error) {
      logger.error('Update user error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async deleteUser(id) {
    try {
      const routesStore = useRoutesStore();
      logger.debug('Admin deleting user', { userId: id });
      const response = await axios.delete(routesStore.getDeleteUserUrl(id));
      return response.data;
    } catch (error) {
      logger.error('Delete user error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async reactivateUser(id) {
    try {
      const routesStore = useRoutesStore();
      logger.debug('Admin reactivating user', { userId: id });
      // Llamar al endpoint dedicado de restauración
      const restoreUrl = `${routesStore.getUpdateUserUrl(id)}/restore`;
      const response = await axios.put(restoreUrl);
      return response.data;
    } catch (error) {
      logger.error('Reactivate user error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getUserStats() {
    try {
      const response = await axios.get('/api/users/stats');
      return response.data;
    } catch (error) {
      logger.error('Get user stats error:', error);
      throw error.response?.data || { error: error.message };
    }
  }
}; 