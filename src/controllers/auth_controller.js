const auth_service = require('../services/auth_service')

const registro = (req, res) => {
  const { errores, conflicto, token, usuario } = auth_service.registrar_usuario(req.body)
  if (errores) return res.status(400).json({ errores })
  if (conflicto) return res.status(409).json({ error: 'El email ya está registrado' })
  res.status(201).json({ token, usuario })
}

const login = (req, res) => {
  const { errores, no_autorizado, token, usuario } = auth_service.login(req.body)
  if (errores) return res.status(400).json({ errores })
  if (no_autorizado) return res.status(401).json({ error: 'Credenciales inválidas' })
  res.status(200).json({ token, usuario })
}

module.exports = { registro, login }
