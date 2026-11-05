const { ROLES } = require('../db')

const ROLES_REGISTRO = ROLES.filter((rol) => rol !== 'admin')
const PASSWORD_MIN = 8
const PASSWORD_MAX = 128
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const is_non_empty_string = (v) => typeof v === 'string' && v.trim() !== ''

const validar_email = (email, errores) => {
  if (!is_non_empty_string(email)) errores.push('email es obligatorio')
  else if (!EMAIL_REGEX.test(email.trim())) errores.push('email no es válido')
}

const validar_password = (password, errores) => {
  if (typeof password !== 'string' || password === '') {
    errores.push('password es obligatoria')
    return
  }
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    errores.push(`password debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres`)
  }
  if (!/\p{L}/u.test(password) || !/\d/.test(password)) {
    errores.push('password debe contener al menos una letra y un número')
  }
}

const validar_registro = ({ nombre, email, password, rol } = {}) => {
  const errores = []

  if (!is_non_empty_string(nombre)) errores.push('nombre es obligatorio')
  validar_email(email, errores)
  validar_password(password, errores)
  if (rol !== undefined && !ROLES_REGISTRO.includes(rol)) {
    errores.push(`rol debe ser uno de: ${ROLES_REGISTRO.join(', ')}`)
  }

  return errores
}

const validar_login = ({ email, password } = {}) => {
  const errores = []

  if (!is_non_empty_string(email)) errores.push('email es obligatorio')
  if (typeof password !== 'string' || password === '') errores.push('password es obligatoria')

  return errores
}

module.exports = { validar_registro, validar_login, ROLES_REGISTRO }
