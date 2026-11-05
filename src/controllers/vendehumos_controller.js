const vendehumos_service = require('../services/vendehumos_service')

const list_vendehumos = (req, res) => {
  const { errores, pagina } = vendehumos_service.list_vendehumos(req.query, req.baseUrl)
  if (errores) return res.status(400).json({ errores })
  res.status(200).json(pagina)
}

const create_vendehumo = (req, res) => {
  const { errores, vendehumo } = vendehumos_service.create_vendehumo(req.body)
  if (errores) return res.status(400).json({ errores })
  res.status(201).json(vendehumo)
}

module.exports = { list_vendehumos, create_vendehumo }
