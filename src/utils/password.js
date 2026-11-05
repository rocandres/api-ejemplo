const { randomBytes, scryptSync, timingSafeEqual } = require('node:crypto')

const LONGITUD_SALT = 16
const LONGITUD_HASH = 64

const hash_password = (password) => {
  const salt = randomBytes(LONGITUD_SALT).toString('hex')
  const hash = scryptSync(password, salt, LONGITUD_HASH).toString('hex')
  return `${salt}:${hash}`
}

const verificar_password = (password, guardado) => {
  const [salt, hash] = String(guardado).split(':')
  if (!salt || !hash) return false

  const esperado = Buffer.from(hash, 'hex')
  if (esperado.length !== LONGITUD_HASH) return false

  const calculado = scryptSync(password, salt, LONGITUD_HASH)
  return timingSafeEqual(calculado, esperado)
}

module.exports = { hash_password, verificar_password }
