const usuarios_repository = require('../repositories/usuarios_repository')
const { row_to_usuario } = require('../models/usuario')
const { validar_registro } = require('../utils/validar_usuario')
const { hash_password } = require('../utils/password')
const { firmar_token } = require('../utils/jwt')

const ROL_POR_DEFECTO = 'usuario-free'

const normalizar_email = (email) => email.trim().toLowerCase()

const respuesta_con_token = (row) => {
  const usuario = row_to_usuario(row)
  return { token: firmar_token(usuario), usuario }
}

const registrar_usuario = (datos) => {
  const errores = validar_registro(datos)
  if (errores.length) return { errores }

  const email = normalizar_email(datos.email)
  if (usuarios_repository.find_by_email(email)) return { conflicto: true }

  const row = usuarios_repository.create({
    nombre: datos.nombre.trim(),
    email,
    password_hash: hash_password(datos.password),
    rol: datos.rol ?? ROL_POR_DEFECTO,
  })
  return respuesta_con_token(row)
}

module.exports = { registrar_usuario }
