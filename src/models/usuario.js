const row_to_usuario = (row) => ({
  id: row.id,
  nombre: row.nombre,
  email: row.email,
  rol: row.rol,
  createdAt: row.created_at,
})

module.exports = { row_to_usuario }
