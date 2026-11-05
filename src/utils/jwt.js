const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('Falta la variable de entorno JWT_SECRET')
}

const CADUCIDAD = '24h'

const firmar_token = (usuario) =>
  jwt.sign({ sub: String(usuario.id), email: usuario.email, rol: usuario.rol }, JWT_SECRET, {
    expiresIn: CADUCIDAD,
  })

const verificar_token = (token) => jwt.verify(token, JWT_SECRET)

module.exports = { firmar_token, verificar_token }
