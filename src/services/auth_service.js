const usuarios_repository = require('../repositories/usuarios_repository')
const { row_to_usuario } = require('../models/usuario')
const { validar_registro, validar_login } = require('../utils/validar_usuario')
const { hash_password, verificar_password } = require('../utils/password')
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

const login = (datos) => {
  const errores = validar_login(datos)
  if (errores.length) return { errores }

  const row = usuarios_repository.find_by_email(normalizar_email(datos.email))
  if (!row || !verificar_password(datos.password, row.password_hash)) {
    return { no_autorizado: true }
  }
  return respuesta_con_token(row)
}

module.exports = { registrar_usuario, login }
