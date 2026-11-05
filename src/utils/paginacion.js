const PAGE_POR_DEFECTO = 1
const SIZE_POR_DEFECTO = 10
const SIZE_MAXIMO = 100

const parse_entero_positivo = (valor, por_defecto) => {
  if (valor === undefined) return por_defecto
  return /^\d+$/.test(valor) ? Number(valor) : NaN
}

const parse_paginacion = (query) => {
  const page = parse_entero_positivo(query.page, PAGE_POR_DEFECTO)
  const size = parse_entero_positivo(query.size, SIZE_POR_DEFECTO)
  const errores = []

  if (!(page >= 1)) errores.push('page debe ser un entero mayor o igual a 1')
  if (!(size >= 1 && size <= SIZE_MAXIMO)) {
    errores.push(`size debe ser un entero entre 1 y ${SIZE_MAXIMO}`)
  }

  return errores.length ? { errores } : { page, size }
}

const construir_pagina = ({ items, total, page, size, base_url }) => {
  const last = Math.max(1, Math.ceil(total / size))
  const link = (p) => `${base_url}?page=${p}&size=${size}`

  const pagina = { self: link(page), first: link(1) }
  if (page > 1) pagina.prev = link(Math.min(page - 1, last))
  if (page < last) pagina.next = link(page + 1)
  pagina.last = link(last)
  pagina.items = items
  return pagina
}

module.exports = { parse_paginacion, construir_pagina }
