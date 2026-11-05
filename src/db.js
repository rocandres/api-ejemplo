const { DatabaseSync } = require('node:sqlite')

const CATEGORIAS = ['TECNOLOGIA', 'FINANZAS', 'SALUD', 'MARKETING', 'COACHING', 'OTROS']
const ROLES = ['admin', 'usuario-free', 'usuario']

const lista_sql = (valores) => valores.map((v) => `'${v}'`).join(', ')

const db = new DatabaseSync(process.env.DB_PATH || 'vendehumos.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS vendehumos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    url_foto TEXT NOT NULL,
    categoria TEXT NOT NULL CHECK (categoria IN (${lista_sql(CATEGORIAS)})),
    descripcion TEXT NOT NULL,
    numero_votos INTEGER NOT NULL DEFAULT 0
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN (${lista_sql(ROLES)})),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

module.exports = { db, CATEGORIAS, ROLES }
