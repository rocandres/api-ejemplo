const { db } = require('../db')

const select_page = db.prepare('SELECT * FROM vendehumos ORDER BY id LIMIT ? OFFSET ?')
const count_all = db.prepare('SELECT COUNT(*) AS total FROM vendehumos')
const select_by_id = db.prepare('SELECT * FROM vendehumos WHERE id = ?')
const insert_one = db.prepare(
  'INSERT INTO vendehumos (nombre, url_foto, categoria, descripcion) VALUES (?, ?, ?, ?)'
)

const find_page = (limit, offset) => select_page.all(limit, offset)

const count = () => count_all.get().total

const find_by_id = (id) => select_by_id.get(id)

const create = ({ nombre, url_foto, categoria, descripcion }) => {
  const { lastInsertRowid } = insert_one.run(nombre, url_foto, categoria, descripcion)
  return find_by_id(lastInsertRowid)
}

module.exports = { find_page, count, find_by_id, create }
