import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// Importar estilos globales
import './assets/styles/colors.css'
import './assets/styles/variables.css'
import './assets/styles/icons.css'
import './assets/styles/buttons.css'
// Font Awesome
import { FontAwesomeIcon } from './plugins/fontawesome'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
