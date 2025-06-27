import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'

// Configuración global de axios
axios.defaults.baseURL = 'http://localhost:4005'
axios.defaults.headers.common['Content-Type'] = 'application/json'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Hacer que axios esté disponible globalmente
app.config.globalProperties.$axios = axios

app.mount('#app')
