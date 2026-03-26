/** Alineado con Pikartas-back (shippingPricing.js) */
export const TAX_RATE = 0.08
export const FREE_SHIPPING_MIN_SUBTOTAL = 500

export function computeTaxAmount(subtotal) {
  return Math.round(subtotal * TAX_RATE)
}

/**
 * @param {number} quotedShipping - costo domicilio API (antes regla gratis)
 * @param {number} subtotal
 */
export function effectiveShippingAmount(quotedShipping, subtotal) {
  if (subtotal >= FREE_SHIPPING_MIN_SUBTOTAL) return 0
  return Math.round(quotedShipping)
}

export function computeFinalTotal(subtotal, quotedShipping) {
  const tax = computeTaxAmount(subtotal)
  const ship = effectiveShippingAmount(quotedShipping, subtotal)
  return subtotal + tax + ship
}
