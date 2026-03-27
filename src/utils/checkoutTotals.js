/** Alineado con Pikartas-back (shippingPricing.js) */
export const TAX_RATE = 0.08

export function computeTaxAmount(subtotal) {
  return Math.round(subtotal * TAX_RATE)
}

/**
 * @param {number} quotedShipping - costo domicilio API
 */
export function effectiveShippingAmount(quotedShipping) {
  return Math.round(quotedShipping)
}

export function computeFinalTotal(subtotal, quotedShipping) {
  const tax = computeTaxAmount(subtotal)
  const ship = effectiveShippingAmount(quotedShipping)
  return subtotal + tax + ship
}
