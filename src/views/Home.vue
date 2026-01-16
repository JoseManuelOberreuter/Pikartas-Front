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

// Cargar productos destacados desde el backend
const loadProducts = async () => {
  loading.value = true
  try {
    // Request featured products for home page
    const response = await productService.getFeaturedProducts({ limit: 4, page: 1 })
    
    // Response from service is: { success: true, data: { products: [...], pagination: {...} } }
    let productsArray = []
    
    if (response?.success) {
      // New format: response.data is an object with products property
      if (response.data?.products && Array.isArray(response.data.products)) {
        productsArray = response.data.products
      }
      // Legacy format: response.data is directly an array
      else if (Array.isArray(response.data)) {
        productsArray = response.data
      }
    }
    
    if (productsArray.length > 0) {
      products.value = productsArray.map(product => ({
        id: product._id || product.id, // Manejar tanto _id como id
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        discount_percentage: product.discount_percentage,
        is_featured: product.is_featured,
        is_on_sale: product.is_on_sale,
        sale_start_date: product.sale_start_date,
        sale_end_date: product.sale_end_date,
        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        description: product.description,
        category: product.category,
        stock: product.stock
      }))
    } else {
      // Si no hay productos destacados, cargar productos regulares como fallback
      console.warn('[Home] No featured products found, loading regular products as fallback')
      const fallbackResponse = await productService.getAllProducts({ limit: 4, page: 1 })
      if (fallbackResponse?.success) {
        let fallbackArray = []
        if (fallbackResponse.data?.products && Array.isArray(fallbackResponse.data.products)) {
          fallbackArray = fallbackResponse.data.products
        } else if (Array.isArray(fallbackResponse.data)) {
          fallbackArray = fallbackResponse.data
        }
        if (fallbackArray.length > 0) {
          products.value = fallbackArray.map(product => ({
            id: product._id || product.id,
            name: product.name,
            price: product.price,
            sale_price: product.sale_price,
            discount_percentage: product.discount_percentage,
            is_featured: product.is_featured,
            is_on_sale: product.is_on_sale,
            sale_start_date: product.sale_start_date,
            sale_end_date: product.sale_end_date,
            image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
            description: product.description,
            category: product.category,
            stock: product.stock
          }))
        }
      }
    }
  } catch (error) {
    console.error('[Home] Error loading featured products:', error);
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
.home {
  position: relative;
}
</style> 