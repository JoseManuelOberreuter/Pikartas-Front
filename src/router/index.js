import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import RegisterView from '../views/RegisterView.vue'
import EmailVerification from '../views/EmailVerification.vue'
import ResetPassword from '../views/ResetPassword.vue'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AdminProducts from '../views/AdminProducts.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Shop
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/verify-email',
    name: 'EmailVerification',
    component: EmailVerification
  },
  {
    path: '/resetpassword',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: AdminProducts,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products/new',
    name: 'AdminCreateProduct',
    component: AdminProducts,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: () => import('../views/AdminOrders.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/analytics',
    name: 'AdminAnalytics',
    component: () => import('../views/AdminAnalytics.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/AdminUsers.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  // Transbank Payment Routes
  {
    path: '/payment/processing',
    name: 'PaymentProcessing',
    component: () => import('../views/PaymentProcessing.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: () => import('../views/PaymentSuccess.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/error',
    name: 'PaymentError',
    component: () => import('../views/PaymentError.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/return',
    name: 'PaymentReturn',
    component: () => import('../views/PaymentReturn.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'UserOrders',
    component: () => import('../views/UserOrders.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard para rutas que requieren autenticación
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      // Redirigir al home si no está autenticado
      next('/')
      return
    }
    
    // Si requiere permisos de admin
    if (to.meta.requiresAdmin) {
      try {
        // Importar dinámicamente el store de auth
        const { useAuthStore } = await import('../stores/auth')
        const authStore = useAuthStore()
        
        // Verificar si el usuario es admin
        if (!authStore.user || authStore.user.role !== 'admin') {
          // Redirigir al home si no es admin
          next('/')
          return
        }
      } catch (error) {
        console.error('Error checking admin permissions:', error)
        next('/')
        return
      }
    }
  }
  next()
})

export default router 