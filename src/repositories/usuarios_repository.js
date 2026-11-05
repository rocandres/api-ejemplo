const { db } = require('../db')

const select_by_id = db.prepare('SELECT * FROM usuarios WHERE id = ?')
const select_by_email = db.prepare('SELECT * FROM usuarios WHERE email = ?')
const insert_one = db.prepare(
  'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)'
)

const find_by_id = (id) => select_by_id.get(id)

const find_by_email = (email) => select_by_email.get(email)

const create = ({ nombre, email, password_hash, rol }) => {
  const { lastInsertRowid } = insert_one.run(nombre, email, password_hash, rol)
  return find_by_id(lastInsertRowid)
}

module.exports = { create, find_by_email, find_by_id }
