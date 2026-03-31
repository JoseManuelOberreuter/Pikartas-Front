/**
 * Totales de checkout (sin impuesto; precios con IVA incluido).
 */

/**
 * @param {number} quotedShipping - costo domicilio API
 */
export function effectiveShippingAmount(quotedShipping) {
  return Math.round(quotedShipping)
}

export function computeFinalTotal(subtotal, quotedShipping) {
  const ship = effectiveShippingAmount(quotedShipping)
  return subtotal + ship
}
