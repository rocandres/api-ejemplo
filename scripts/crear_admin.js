const VARIABLES = ['ADMIN_NOMBRE', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']

const salir_con_error = (mensajes) => {
  for (const mensaje of mensajes) console.error(mensaje)
  process.exit(1)
}

const faltan = VARIABLES.filter((nombre) => !process.env[nombre])
if (faltan.length) salir_con_error([`Faltan las variables de entorno: ${faltan.join(', ')}`])

// JWT_SECRET no hace falta para crear usuarios, pero auth_service carga utils/jwt
process.env.JWT_SECRET ||= 'crear-admin'

const auth_service = require('../src/services/auth_service')

const { errores, conflicto, usuario } = auth_service.crear_admin({
  nombre: process.env.ADMIN_NOMBRE,
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
})

if (errores) salir_con_error(errores)
if (conflicto) salir_con_error(['El email ya está registrado'])

console.log(`Admin creado: ${usuario.email} (id ${usuario.id})`)
