import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authService } from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const isAuthenticated = ref(false);

  // Verificar si hay un token al iniciar
  const initializeAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Intentar obtener el email del token JWT para hacer la consulta
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const identifier = tokenPayload.email || tokenPayload.id;
        
        if (identifier) {
          const userProfile = await authService.getUserProfile(identifier);
          if (userProfile && userProfile.user) {
            // Asegurar que el objeto usuario tenga todas las propiedades necesarias
            user.value = {
              name: userProfile.user.name || 'Usuario',
              email: userProfile.user.email || 'usuario@ejemplo.com',
              id: userProfile.user.id || null,
              ...userProfile.user
            };
          } else if (userProfile) {
            user.value = {
              name: userProfile.name || 'Usuario',
              email: userProfile.email || 'usuario@ejemplo.com',
              id: userProfile.id || null,
              ...userProfile
            };
          }
        }
        
        isAuthenticated.value = true;
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Si falla, mantener valores por defecto pero seguir autenticado
        isAuthenticated.value = true;
        user.value = {
          name: 'Usuario',
          email: 'usuario@ejemplo.com',
          id: null
        };
      }
    }
  };
  
  // Inicializar la autenticación
  initializeAuth();

  async function register(userData) {
    try {
      loading.value = true;
      error.value = null;
      const response = await authService.register(userData);
      
      // No establecemos usuario como autenticado hasta que verifique email
      // user.value = response.user;
      // isAuthenticated.value = false; // Requiere verificación
      
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function login(credentials) {
    try {
      loading.value = true;
      error.value = null;
      const response = await authService.login(credentials);
      
      console.log('Login response:', response);
      
      // Si el login fue exitoso y tenemos token
      if (response && response.token) {
        isAuthenticated.value = true;
        
        try {
          // Hacer segunda llamada para obtener datos del usuario
          // Usamos el email como identificador
          const userProfile = await authService.getUserProfile(credentials.email);
          console.log('User profile response:', userProfile);
          
          if (userProfile && userProfile.user) {
            // Asegurar que el objeto usuario tenga todas las propiedades necesarias
            user.value = {
              name: userProfile.user.name || 'Usuario',
              email: userProfile.user.email || credentials.email,
              id: userProfile.user.id || null,
              ...userProfile.user
            };
          } else if (userProfile) {
            // Si la respuesta es directamente los datos del usuario
            user.value = {
              name: userProfile.name || 'Usuario',
              email: userProfile.email || credentials.email,
              id: userProfile.id || null,
              ...userProfile
            };
          } else {
            // Fallback si no hay datos
            user.value = {
              name: 'Usuario',
              email: credentials.email,
              id: null
            };
          }
          
          console.log('User set in store:', user.value);
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Aunque falle obtener el perfil, mantenemos autenticado con datos básicos
          user.value = {
            name: 'Usuario',
            email: credentials.email,
            id: null
          };
        }
      } else {
        throw new Error('Login response does not contain token');
      }
      
      return response;
    } catch (err) {
      console.error('Login error in store:', err);
      error.value = err;
      isAuthenticated.value = false;
      user.value = null;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function verifyEmail(token) {
    try {
      loading.value = true;
      error.value = null;
      const response = await authService.verifyEmail(token);
      
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

  async function requestPasswordReset(email) {
    try {
      loading.value = true;
      error.value = null;
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function resetPassword(token, password) {
    try {
      loading.value = true;
      error.value = null;
      const response = await authService.resetPassword(token, password);
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    error,
    loading,
    isAuthenticated,
    register,
    login,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    logout
  };
}); 