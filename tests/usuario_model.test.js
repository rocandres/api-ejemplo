import { describe, it, expect } from 'vitest'
import { row_to_usuario } from '../src/models/usuario'

describe('row_to_usuario', () => {
  const row = {
    id: 1,
    nombre: 'Ana',
    email: 'ana@x.com',
    password_hash: 'salt:hash',
    rol: 'usuario',
    created_at: '2026-11-05 10:00:00',
  }

  it('convierte la fila a camelCase', () => {
    expect(row_to_usuario(row)).toEqual({
      id: 1,
      nombre: 'Ana',
      email: 'ana@x.com',
      rol: 'usuario',
      createdAt: '2026-11-05 10:00:00',
    })
  })

  it('nunca expone la contraseña', () => {
    const usuario = row_to_usuario(row)
    expect(usuario).not.toHaveProperty('password_hash')
    expect(usuario).not.toHaveProperty('passwordHash')
    expect(usuario).not.toHaveProperty('password')
  })
})
