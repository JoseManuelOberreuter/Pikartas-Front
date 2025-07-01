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
              _id: userProfile.user._id || userProfile.user.id || null,
              name: userProfile.user.name || 'Usuario',
              email: userProfile.user.email || 'usuario@ejemplo.com',
              telefono: userProfile.user.telefono || userProfile.user.phone || '',
              fechaNacimiento: userProfile.user.fechaNacimiento || userProfile.user.birthDate || '',
              direccion: userProfile.user.direccion || userProfile.user.address || '',
              avatar: userProfile.user.avatar || '',
              role: userProfile.user.role || 'user',
              ...userProfile.user
            };
            isAuthenticated.value = true;
          } else if (userProfile) {
            user.value = {
              _id: userProfile._id || userProfile.id || null,
              name: userProfile.name || 'Usuario',
              email: userProfile.email || 'usuario@ejemplo.com',
              telefono: userProfile.telefono || userProfile.phone || '',
              fechaNacimiento: userProfile.fechaNacimiento || userProfile.birthDate || '',
              direccion: userProfile.direccion || userProfile.address || '',
              avatar: userProfile.avatar || '',
              role: userProfile.role || 'user',
              ...userProfile
            };
            isAuthenticated.value = true;
          } else {
            // Si no hay datos del usuario, limpiar autenticación
            localStorage.removeItem('token');
            user.value = null;
            isAuthenticated.value = false;
          }
        } else {
          // Si no hay identificador en el token, limpiar autenticación
          localStorage.removeItem('token');
          user.value = null;
          isAuthenticated.value = false;
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Si falla la verificación, limpiar autenticación
        localStorage.removeItem('token');
        user.value = null;
        isAuthenticated.value = false;
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
              _id: userProfile.user._id || userProfile.user.id || null,
              name: userProfile.user.name || 'Usuario',
              email: userProfile.user.email || credentials.email,
              telefono: userProfile.user.telefono || userProfile.user.phone || '',
              fechaNacimiento: userProfile.user.fechaNacimiento || userProfile.user.birthDate || '',
              direccion: userProfile.user.direccion || userProfile.user.address || '',
              avatar: userProfile.user.avatar || '',
              role: userProfile.user.role || 'user',
              ...userProfile.user
            };
          } else if (userProfile) {
            // Si la respuesta es directamente los datos del usuario
            user.value = {
              _id: userProfile._id || userProfile.id || null,
              name: userProfile.name || 'Usuario',
              email: userProfile.email || credentials.email,
              telefono: userProfile.telefono || userProfile.phone || '',
              fechaNacimiento: userProfile.fechaNacimiento || userProfile.birthDate || '',
              direccion: userProfile.direccion || userProfile.address || '',
              avatar: userProfile.avatar || '',
              role: userProfile.role || 'user',
              ...userProfile
            };
          } else {
            // Fallback si no hay datos
            user.value = {
              _id: null,
              name: 'Usuario',
              email: credentials.email,
              telefono: '',
              fechaNacimiento: '',
              direccion: '',
              avatar: '',
              role: 'user'
            };
          }
          
          console.log('User set in store:', user.value);
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Aunque falle obtener el perfil, mantenemos autenticado con datos básicos
          user.value = {
            _id: null,
            name: 'Usuario',
            email: credentials.email,
            telefono: '',
            fechaNacimiento: '',
            direccion: '',
            avatar: '',
            role: 'user'
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