import { describe, it, expect } from 'vitest'
import { db, ROLES } from '../src/db'

const insertar = (email, rol) =>
  db
    .prepare('INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)')
    .run('Ana', email, 'hash', rol)

describe('db: tabla usuarios', () => {
  it('exporta ROLES', () => {
    expect(ROLES).toEqual(['admin', 'usuario-free', 'usuario'])
  })

  it('crea la tabla usuarios con sus columnas', () => {
    const columnas = db.prepare('PRAGMA table_info(usuarios)').all().map((c) => c.name)
    expect(columnas).toEqual(['id', 'nombre', 'email', 'password_hash', 'rol', 'created_at'])
  })

  it('rellena created_at por defecto', () => {
    const { lastInsertRowid } = insertar('fecha@x.com', 'usuario')
    const row = db.prepare('SELECT created_at FROM usuarios WHERE id = ?').get(lastInsertRowid)
    expect(row.created_at).toBeTruthy()
  })

  it('rechaza un rol fuera de ROLES', () => {
    expect(() => insertar('rol@x.com', 'superadmin')).toThrow(/CHECK/)
  })

  it('rechaza emails duplicados', () => {
    insertar('dup@x.com', 'usuario')
    expect(() => insertar('dup@x.com', 'usuario')).toThrow(/UNIQUE/)
  })
})
