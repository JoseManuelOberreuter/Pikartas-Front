<template>
  <div class="offers">
    <div class="container">
      <div class="offers-header">
        <h1><font-awesome-icon icon="fire" class="offers-header-icon" /> Ofertas Especiales</h1>
        <p>Descubre las mejores ofertas en cartas Pokémon</p>
      </div>

      <div class="offers-filters">
        <div class="filter-group">
          <label>Tipo de Oferta:</label>
          <select v-model="selectedOfferType" @change="filterOffers">
            <option value="all">Todas las Ofertas</option>
            <option value="discount">Descuentos</option>
            <option value="bundle">Paquetes</option>
            <option value="flash">Flash Sale</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Ordenar por:</label>
          <select v-model="sortBy" @change="sortOffers">
            <option value="discount">Mayor Descuento</option>
            <option value="price">Precio</option>
            <option value="name">Nombre</option>
            <option value="expires">Expira Pronto</option>
          </select>
        </div>
      </div>

      <div class="offers-grid">
        <!-- Oferta Flash Sale -->
        <div class="offer-card flash-sale" v-if="showFlashSale">
          <div class="offer-badge">
            <font-awesome-icon icon="bolt" class="badge-icon" />
            <span>FLASH SALE</span>
          </div>
          <div class="offer-content">
            <h3>Booster Pack Especial</h3>
            <p>Cartas holográficas y rarezas únicas</p>
            <div class="offer-price">
              <span class="original-price">$50.00</span>
              <span class="discount-price">$25.00</span>
              <span class="discount-percent">50% OFF</span>
            </div>
            <div class="offer-timer">
              <font-awesome-icon icon="clock" class="timer-icon" />
              <span>Termina en: 2h 15m</span>
            </div>
            <button class="btn btn-primary">
              <font-awesome-icon icon="shopping-cart" />
              Comprar Ahora
            </button>
          </div>
        </div>

        <!-- Ofertas de Descuento -->
        <div class="offer-card discount" v-for="offer in discountOffers" :key="offer.id">
          <div class="offer-badge">
            <font-awesome-icon icon="percent" class="badge-icon" />
            <span>{{ offer.discount }}% OFF</span>
          </div>
          <div class="offer-content">
            <h3>{{ offer.title }}</h3>
            <p>{{ offer.description }}</p>
            <div class="offer-price">
              <span class="original-price">${{ offer.originalPrice }}</span>
              <span class="discount-price">${{ offer.discountPrice }}</span>
            </div>
            <button class="btn btn-primary">
              <font-awesome-icon icon="shopping-cart" />
              Ver Oferta
            </button>
          </div>
        </div>

        <!-- Paquetes Especiales -->
        <div class="offer-card bundle" v-for="bundle in bundleOffers" :key="bundle.id">
          <div class="offer-badge">
            <font-awesome-icon icon="gift" class="badge-icon" />
            <span>PAQUETE</span>
          </div>
          <div class="offer-content">
            <h3>{{ bundle.title }}</h3>
            <p>{{ bundle.description }}</p>
            <div class="bundle-items">
              <span v-for="item in bundle.items" :key="item" class="bundle-item">
                {{ item }}
              </span>
            </div>
            <div class="offer-price">
              <span class="bundle-price">${{ bundle.price }}</span>
              <span class="bundle-value">Valor: ${{ bundle.originalValue }}</span>
            </div>
            <button class="btn btn-primary">
              <font-awesome-icon icon="shopping-cart" />
              Comprar Paquete
            </button>
          </div>
        </div>
      </div>

      <!-- Newsletter de Ofertas -->
      <div class="offers-newsletter">
        <div class="newsletter-content">
          <h3><font-awesome-icon icon="envelope" class="newsletter-icon" /> No te pierdas ninguna oferta</h3>
          <p>Suscríbete para recibir las mejores ofertas directamente en tu correo</p>
          <div class="newsletter-form">
            <input 
              type="email" 
              v-model="emailSubscription" 
              placeholder="Tu correo electrónico"
              class="newsletter-input"
            >
            <button @click="subscribeNewsletter" class="btn btn-primary">
              Suscribirse
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNotifications } from '../composables/useNotifications'

const { success } = useNotifications()

// Referencias reactivas
const selectedOfferType = ref('all')
const sortBy = ref('discount')
const emailSubscription = ref('')
const showFlashSale = ref(true)

// Ofertas de descuento
const discountOffers = ref([
  {
    id: 1,
    title: 'Cartas Raras - 30% OFF',
    description: 'Selección de cartas raras con descuento especial',
    originalPrice: 100,
    discountPrice: 70,
    discount: 30
  },
  {
    id: 2,
    title: 'Booster Packs - 25% OFF',
    description: 'Paquetes de cartas con descuento limitado',
    originalPrice: 40,
    discountPrice: 30,
    discount: 25
  },
  {
    id: 3,
    title: 'Coleccionables - 40% OFF',
    description: 'Figuras y accesorios coleccionables',
    originalPrice: 80,
    discountPrice: 48,
    discount: 40
  }
])

// Paquetes especiales
const bundleOffers = ref([
  {
    id: 1,
    title: 'Paquete Iniciador',
    description: 'Perfecto para comenzar tu colección',
    items: ['5 Booster Packs', '1 Carta Rara', '1 Estuche'],
    price: 75,
    originalValue: 120
  },
  {
    id: 2,
    title: 'Paquete Avanzado',
    description: 'Para coleccionistas experimentados',
    items: ['10 Booster Packs', '3 Cartas Raras', '2 Estuches', '1 Figura'],
    price: 150,
    originalValue: 250
  }
])

// Computed properties
const filteredOffers = computed(() => {
  let offers = []
  
  if (selectedOfferType.value === 'all' || selectedOfferType.value === 'discount') {
    offers = [...offers, ...discountOffers.value]
  }
  
  if (selectedOfferType.value === 'all' || selectedOfferType.value === 'bundle') {
    offers = [...offers, ...bundleOffers.value]
  }
  
  if (selectedOfferType.value === 'flash') {
    offers = showFlashSale.value ? [{ id: 'flash', type: 'flash' }] : []
  }
  
  return offers
})

// Methods
const filterOffers = () => {
  // La función se ejecuta cuando cambian los filtros
}

const sortOffers = () => {
  // La función se ejecuta cuando cambia el ordenamiento
}

const subscribeNewsletter = () => {
  success(`¡Gracias por suscribirte con ${emailSubscription.value}!`)
  emailSubscription.value = ''
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.offers {
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: transparent;
}

.offers-header {
  text-align: center;
  margin-bottom: 3rem;
}

.offers-header h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  color: var(--color-primary);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.offers-header-icon {
  color: var(--color-primary);
  font-size: 0.9em;
  transition: all var(--transition-normal);
}

.offers-header h1:hover .offers-header-icon {
  transform: scale(1.1);
}

.offers-header p {
  font-size: 1.1rem;
  color: var(--color-white);
  margin: 0;
}

.offers-filters {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: var(--color-white);
  font-size: 0.875rem;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  background: var(--color-white);
  color: var(--color-black);
  font-size: 0.875rem;
  min-width: 150px;
}

.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.offer-card {
  background: var(--color-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  border: 2px solid transparent;
}

.offer-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.offer-card.flash-sale {
  border-color: var(--color-quaternary);
  background: linear-gradient(135deg, var(--color-white) 0%, #fff5f5 100%);
}

.offer-card.discount {
  border-color: var(--color-primary);
}

.offer-card.bundle {
  border-color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-white) 0%, #fffbf0 100%);
}

.offer-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-quaternary);
  color: var(--color-white);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 2;
}

.offer-card.discount .offer-badge {
  background: var(--color-primary);
  color: var(--color-black);
}

.offer-card.bundle .offer-badge {
  background: var(--color-primary);
  color: var(--color-black);
}

.badge-icon {
  font-size: 0.8em;
}

.offer-content {
  padding: 2rem;
  padding-top: 3rem;
}

.offer-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-black);
  margin: 0 0 0.5rem 0;
}

.offer-content p {
  color: var(--color-black);
  margin: 0 0 1.5rem 0;
  opacity: 0.8;
}

.offer-price {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.original-price {
  text-decoration: line-through;
  color: #666;
  font-size: 1rem;
}

.discount-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-quaternary);
}

.discount-percent {
  background: var(--color-quaternary);
  color: var(--color-white);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}

.bundle-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.bundle-value {
  color: #666;
  font-size: 0.9rem;
}

.bundle-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.bundle-item {
  background: var(--color-primary);
  color: var(--color-black);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.offer-timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-quaternary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.timer-icon {
  font-size: 0.9em;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  font-size: 1rem;
  justify-content: center;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-black);
  width: 100%;
}

.btn-primary:hover {
  background: var(--color-quaternary);
  color: var(--color-white);
  transform: translateY(-2px);
}

.offers-newsletter {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-quaternary) 100%);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  margin-top: 4rem;
}

.newsletter-content h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-black);
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.newsletter-icon {
  color: var(--color-black);
}

.newsletter-content p {
  color: var(--color-black);
  margin: 0 0 2rem 0;
  opacity: 0.9;
}

.newsletter-form {
  display: flex;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.newsletter-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-black);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--color-white);
  color: var(--color-black);
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--color-quaternary);
  box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .offers {
    padding-top: 100px;
  }
  
  .offers-header h1 {
    font-size: 2rem;
  }
  
  .offers-filters {
    flex-direction: column;
    align-items: center;
  }
  
  .offers-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .offers-newsletter {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .offers-header h1 {
    font-size: 1.8rem;
  }
  
  .offer-content {
    padding: 1.5rem;
    padding-top: 2.5rem;
  }
  
  .newsletter-content h3 {
    font-size: 1.5rem;
  }
}
</style>
