const vendehumos_repository = require('../repositories/vendehumos_repository')
const { row_to_vendehumo } = require('../models/vendehumo')
const { validar_vendehumo } = require('../utils/validar_vendehumo')
const { parse_paginacion, construir_pagina } = require('../utils/paginacion')

const list_vendehumos = (query, base_url) => {
  const { errores, page, size } = parse_paginacion(query)
  if (errores) return { errores }

  const items = vendehumos_repository.find_page(size, (page - 1) * size).map(row_to_vendehumo)
  const total = vendehumos_repository.count()
  return { pagina: construir_pagina({ items, total, page, size, base_url }) }
}

const create_vendehumo = (datos) => {
  const errores = validar_vendehumo(datos)
  if (errores.length) return { errores }

  const row = vendehumos_repository.create({
    nombre: datos.nombre.trim(),
    url_foto: datos.urlFoto,
    categoria: datos.categoria,
    descripcion: datos.descripcion.trim(),
  })
  return { vendehumo: row_to_vendehumo(row) }
}

module.exports = { list_vendehumos, create_vendehumo }
