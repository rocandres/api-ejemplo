import { describe, it, expect } from 'vitest'
import usuarios_repository from '../src/repositories/usuarios_repository'

const datos = { nombre: 'Ana', email: 'ana@x.com', password_hash: 'salt:hash', rol: 'usuario' }

describe('usuarios_repository', () => {
  it('create inserta y devuelve la fila', () => {
    const row = usuarios_repository.create(datos)
    expect(row).toMatchObject(datos)
    expect(row.id).toBeTypeOf('number')
    expect(row.created_at).toBeTruthy()
  })

  it('find_by_email encuentra la fila o devuelve undefined', () => {
    expect(usuarios_repository.find_by_email('ana@x.com')).toMatchObject(datos)
    expect(usuarios_repository.find_by_email('nadie@x.com')).toBeUndefined()
  })

  it('find_by_id encuentra la fila o devuelve undefined', () => {
    const { id } = usuarios_repository.find_by_email('ana@x.com')
    expect(usuarios_repository.find_by_id(id)).toMatchObject(datos)
    expect(usuarios_repository.find_by_id(9999)).toBeUndefined()
  })
})
