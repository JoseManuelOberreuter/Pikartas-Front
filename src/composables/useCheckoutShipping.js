import { ref, computed, watch } from 'vue'
import { shippingService } from '../services/api.js'
import { effectiveShippingAmount, computeFinalTotal } from '../utils/checkoutTotals.js'

let destinationsPromise = null

function loadDestinationsOnce() {
  if (!destinationsPromise) {
    destinationsPromise = shippingService.getDestinations().catch((e) => {
      destinationsPromise = null
      throw e
    })
  }
  return destinationsPromise
}

/**
 * @param {import('vue').Ref<number>} cartTotalRef
 */
export function useCheckoutShipping(cartTotalRef) {
  const cityOptions = ref([])
  const selectedCodigoCiudad = ref('')
  const quotedShippingRaw = ref(null)
  const loadingDestinations = ref(false)
  const loadingQuote = ref(false)
  const quoteError = ref('')

  const displayShippingAmount = computed(() => {
    if (quotedShippingRaw.value === null || quotedShippingRaw.value === undefined) return null
    return effectiveShippingAmount(quotedShippingRaw.value)
  })

  const finalTotal = computed(() => {
    if (quotedShippingRaw.value === null || quotedShippingRaw.value === undefined) return null
    return computeFinalTotal(cartTotalRef.value, quotedShippingRaw.value)
  })

  const fetchDestinations = async () => {
    loadingDestinations.value = true
    quoteError.value = ''
    try {
      const data = await loadDestinationsOnce()
      const flat = data?.flat || []
      const seen = new Map()
      for (const row of flat) {
        const id = row.codigoCiudad
        if (id != null && !seen.has(id)) {
          seen.set(id, row.nombreCiudad || `Ciudad ${id}`)
        }
      }
      cityOptions.value = [...seen.entries()]
        .map(([codigoCiudad, nombreCiudad]) => ({ codigoCiudad, nombreCiudad }))
        .sort((a, b) => a.nombreCiudad.localeCompare(b.nombreCiudad, 'es'))
    } catch (e) {
      quoteError.value = e.message || 'No se pudieron cargar las ciudades de envío.'
      cityOptions.value = []
    } finally {
      loadingDestinations.value = false
    }
  }

  const runQuote = async (codigo) => {
    if (codigo === '' || codigo == null) {
      quotedShippingRaw.value = null
      return
    }
    loadingQuote.value = true
    quoteError.value = ''
    try {
      const res = await shippingService.getQuote({ codigoCiudadDestino: Number(codigo) })
      const cost = res?.shippingCost
      if (typeof cost !== 'number') {
        throw new Error('Respuesta de cotización inválida')
      }
      quotedShippingRaw.value = cost
    } catch (e) {
      quotedShippingRaw.value = null
      quoteError.value = e.message || 'No se pudo cotizar el envío.'
    } finally {
      loadingQuote.value = false
    }
  }

  let debounceTimer = null
  watch(
    () => [selectedCodigoCiudad.value, cartTotalRef.value],
    () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      const cod = selectedCodigoCiudad.value
      if (cod === '' || cod === null || cod === undefined) {
        quotedShippingRaw.value = null
        return
      }
      debounceTimer = setTimeout(() => runQuote(cod), 350)
    }
  )

  return {
    cityOptions,
    selectedCodigoCiudad,
    quotedShippingRaw,
    loadingDestinations,
    loadingQuote,
    quoteError,
    displayShippingAmount,
    finalTotal,
    fetchDestinations
  }
}
