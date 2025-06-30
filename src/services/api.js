import axios from 'axios';
import { useRoutesStore } from '../stores/routes';

// Configuración del interceptor para manejar tokens
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request Config:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  });
  return config;
});

// Interceptor de respuesta para logs
axios.interceptors.response.use(
  response => {
    console.log('Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', {
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
      console.log('Sending registration data:', userData);
      const response = await axios.post(routesStore.fullUserRoutes.register, userData);
      
      // Tu backend NO devuelve token inmediatamente, requiere verificación
      // No guardamos token aquí porque el usuario no está verificado
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
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
      console.error('Login error:', error);
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
      console.error('Verification error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async requestPasswordReset(email) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.post(routesStore.fullUserRoutes.resetPasswordRequest, { email });
      return response.data;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async resetPassword(token, password) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.post(routesStore.getResetPasswordUrl(token), { password });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getUserProfile(identifier) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.getUserProfileUrl(identifier));
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async uploadAvatar(formData) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.post(routesStore.fullUserRoutes.uploadAvatar, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async updateProfile(profileData) {
    try {
      const routesStore = useRoutesStore();
      // Usando la misma ruta de profile pero con método PUT/PATCH
      const response = await axios.put(routesStore.getUserProfileUrl('me'), profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
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
      console.error('Get products error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getProductById(id) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.getProductByIdUrl(id));
      return response.data;
    } catch (error) {
      console.error('Get product error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async createProduct(productData) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.post(routesStore.fullProductRoutes.create, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async updateProduct(id, productData) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.put(routesStore.getUpdateProductUrl(id), productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async deleteProduct(id) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.delete(routesStore.getDeleteProductUrl(id));
      return response.data;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async updateStock(id, stock) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.patch(routesStore.getUpdateStockUrl(id), { stock });
      return response.data;
    } catch (error) {
      console.error('Update stock error:', error);
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
      console.error('Create order error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getUserOrders() {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.fullOrderRoutes.getUserOrders);
      return response.data;
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getOrderById(orderId) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.getOrderByIdUrl(orderId));
      return response.data;
    } catch (error) {
      console.error('Get order error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async cancelOrder(orderId) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.patch(routesStore.getCancelOrderUrl(orderId));
      return response.data;
    } catch (error) {
      console.error('Cancel order error:', error);
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
      console.error('Get cart error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async getCartSummary() {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.get(routesStore.fullCartRoutes.getSummary);
      return response.data;
    } catch (error) {
      console.error('Get cart summary error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async addToCart(productData) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.post(routesStore.fullCartRoutes.add, productData);
      return response.data;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async updateCartItem(itemData) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.put(routesStore.fullCartRoutes.update, itemData);
      return response.data;
    } catch (error) {
      console.error('Update cart item error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async removeFromCart(productId) {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.delete(routesStore.getRemoveFromCartUrl(productId));
      return response.data;
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async clearCart() {
    try {
      const routesStore = useRoutesStore();
      const response = await axios.delete(routesStore.fullCartRoutes.clear);
      return response.data;
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error.response?.data || { error: error.message };
    }
  }
}; 