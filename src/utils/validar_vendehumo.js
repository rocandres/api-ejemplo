const { CATEGORIAS } = require('../db')

const is_non_empty_string = (v) => typeof v === 'string' && v.trim() !== ''

const is_valid_url = (v) => {
  try {
    new URL(v)
    return true
  } catch {
    return false
  }
}

const validar_vendehumo = ({ nombre, urlFoto, categoria, descripcion } = {}) => {
  const errores = []

  if (!is_non_empty_string(nombre)) errores.push('nombre es obligatorio')
  if (!is_non_empty_string(urlFoto)) {
    errores.push('urlFoto es obligatoria')
  } else if (!is_valid_url(urlFoto)) {
    errores.push('urlFoto no es una URL válida')
  }
  if (!CATEGORIAS.includes(categoria)) {
    errores.push(`categoria debe ser una de: ${CATEGORIAS.join(', ')}`)
  }
  if (!is_non_empty_string(descripcion)) errores.push('descripcion es obligatoria')

  return errores
}

module.exports = { validar_vendehumo }
