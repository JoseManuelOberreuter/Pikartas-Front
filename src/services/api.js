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
      // Ya no necesitamos la URL completa porque está en la configuración global
      const response = await axios.post('/users/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || error.message;
    }
  }
}; 