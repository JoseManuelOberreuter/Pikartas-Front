import axios from 'axios';

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
      console.log('Sending registration data:', userData);
      const response = await axios.post('/users/register', userData);
      
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
      const response = await axios.post('/users/login', credentials);
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
      const response = await axios.post('/users/verify', { token });
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
      const response = await axios.post('/users/reset-password-request', { email });
      return response.data;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error.response?.data || { error: error.message };
    }
  },

  async resetPassword(token, password) {
    try {
      const response = await axios.post(`/users/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error.response?.data || { error: error.message };
    }
  }
}; 