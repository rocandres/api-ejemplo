import { describe, it, expect } from 'vitest'
import { hash_password, verificar_password } from '../src/utils/password'

describe('password', () => {
  it('hash_password guarda salt:hash y no el texto plano', () => {
    const hash = hash_password('secreto123')
    expect(hash).not.toBe('secreto123')
    expect(hash).toMatch(/^[0-9a-f]+:[0-9a-f]+$/)
  })

  it('la misma contraseña produce hashes distintos', () => {
    expect(hash_password('secreto123')).not.toBe(hash_password('secreto123'))
  })

  it('verificar_password acepta la contraseña correcta', () => {
    expect(verificar_password('secreto123', hash_password('secreto123'))).toBe(true)
  })

  it('verificar_password rechaza una contraseña incorrecta', () => {
    expect(verificar_password('otra1234', hash_password('secreto123'))).toBe(false)
  })

  it('verificar_password rechaza un hash mal formado', () => {
    expect(verificar_password('secreto123', 'basura')).toBe(false)
  })
})
