const { DatabaseSync } = require('node:sqlite');

const CATEGORIAS = ['TECNOLOGIA', 'FINANZAS', 'SALUD', 'MARKETING', 'COACHING', 'OTROS'];

const db = new DatabaseSync(process.env.DB_PATH || 'vendehumos.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS vendehumos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    url_foto TEXT NOT NULL,
    categoria TEXT NOT NULL CHECK (categoria IN (${CATEGORIAS.map((c) => `'${c}'`).join(', ')})),
    descripcion TEXT NOT NULL,
    numero_votos INTEGER NOT NULL DEFAULT 0
  )
`);

module.exports = { db, CATEGORIAS };
