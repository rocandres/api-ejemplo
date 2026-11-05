const row_to_vendehumo = (row) => ({
  id: row.id,
  nombre: row.nombre,
  urlFoto: row.url_foto,
  categoria: row.categoria,
  descripcion: row.descripcion,
  numeroVotos: row.numero_votos,
})

module.exports = { row_to_vendehumo }
