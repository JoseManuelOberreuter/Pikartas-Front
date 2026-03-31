/**
 * ID canónico de fila de producto (Supabase usa `id`; `_id` es compat. Mongo).
 * No usar `a || b`: evita priorizar un `_id` vacío/incorrecto sobre `id`.
 */
export function getProductRowId(product) {
  if (!product || typeof product !== 'object') return undefined
  const raw = product.id ?? product._id
  if (raw === undefined || raw === null) return undefined
  const s = String(raw).trim()
  return s.length > 0 ? raw : undefined
}
