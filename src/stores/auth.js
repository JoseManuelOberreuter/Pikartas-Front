import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authService } from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const isAuthenticated = ref(false);

  // Verificar si hay un token al iniciar
  const token = localStorage.getItem('token');
  if (token) {
    isAuthenticated.value = true;
  }

  async function register(userData) {
    try {
      loading.value = true;
      error.value = null;
      const response = await authService.register(userData);
      user.value = response.user;
      isAuthenticated.value = true;
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    user.value = null;
    isAuthenticated.value = false;
  }

  return {
    user,
    error,
    loading,
    isAuthenticated,
    register,
    logout
  };
}); 