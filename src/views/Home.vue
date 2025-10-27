<template>
  <div class="home">
    <Hero />
    <Features />
    <FeaturedProducts 
      :products="products"
      @view-product="viewProduct"
    />
    <Newsletter @subscribe="subscribeNewsletter" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productService } from '../services/api'
import { useNotifications } from '../composables/useNotifications'
import Hero from '../components/Hero.vue'
import Features from '../components/Features.vue'
import FeaturedProducts from '../components/FeaturedProducts.vue'
import Newsletter from '../components/Newsletter.vue'

const router = useRouter()
const { success } = useNotifications()

// Referencias reactivas para productos
const products = ref([])
const loading = ref(false)

// Cargar productos desde el backend
const loadProducts = async () => {
  loading.value = true
  try {
    const response = await productService.getAllProducts()
    
    if (response.success && response.data) {
      products.value = response.data.map(product => ({
        id: product._id || product.id, // Manejar tanto _id como id
        name: product.name,
        price: product.price,
        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        description: product.description,
        category: product.category,
        stock: product.stock
      }))
    }
  } catch (error) {
    console.error('Error loading products:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

const viewProduct = (productId) => {
  console.log('🔍 Home: Navegando a producto con ID:', productId)
  router.push(`/product/${productId}`)
}

const subscribeNewsletter = () => {
  success('¡Gracias por suscribirte a nuestro newsletter!')
}

// Cargar productos al montar el componente
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
/* Home component - Todos los estilos se manejan en los componentes hijos */
</style> 