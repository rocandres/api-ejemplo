import { describe, it, expect } from 'vitest'
import { validar_registro, validar_login, ROLES_REGISTRO } from '../src/utils/validar_usuario'

const valido = { nombre: 'Ana', email: 'ana@x.com', password: 'secreto123', rol: 'usuario' }

describe('validar_registro', () => {
  it('acepta datos válidos, con o sin rol', () => {
    expect(validar_registro(valido)).toEqual([])
    expect(validar_registro({ ...valido, rol: undefined })).toEqual([])
  })

  it('ROLES_REGISTRO no incluye admin', () => {
    expect(ROLES_REGISTRO).toEqual(['usuario-free', 'usuario'])
  })

  it('rechaza el rol admin y roles desconocidos', () => {
    const error = 'rol debe ser uno de: usuario-free, usuario'
    expect(validar_registro({ ...valido, rol: 'admin' })).toEqual([error])
    expect(validar_registro({ ...valido, rol: 'otro' })).toEqual([error])
  })

  it('exige nombre no vacío', () => {
    expect(validar_registro({ ...valido, nombre: '   ' })).toEqual(['nombre es obligatorio'])
  })

  it('exige email con formato válido', () => {
    expect(validar_registro({ ...valido, email: undefined })).toEqual(['email es obligatorio'])
    expect(validar_registro({ ...valido, email: 'ana@' })).toEqual(['email no es válido'])
    expect(validar_registro({ ...valido, email: 'ana x@y.com' })).toEqual(['email no es válido'])
  })

  it('exige contraseña de 8 a 128 caracteres', () => {
    const error = 'password debe tener entre 8 y 128 caracteres'
    expect(validar_registro({ ...valido, password: 'abc1234' })).toEqual([error])
    expect(validar_registro({ ...valido, password: 'a1'.repeat(65) })).toEqual([error])
    expect(validar_registro({ ...valido, password: 'a1'.repeat(64) })).toEqual([])
  })

  it('exige al menos una letra y un número en la contraseña', () => {
    const error = 'password debe contener al menos una letra y un número'
    expect(validar_registro({ ...valido, password: 'soloLetras' })).toEqual([error])
    expect(validar_registro({ ...valido, password: '12345678' })).toEqual([error])
  })

  it('exige contraseña', () => {
    expect(validar_registro({ ...valido, password: undefined })).toEqual([
      'password es obligatoria',
    ])
  })

  it('acumula todos los errores a la vez', () => {
    expect(validar_registro({ email: 'malo', password: 'abc', rol: 'admin' })).toEqual([
      'nombre es obligatorio',
      'email no es válido',
      'password debe tener entre 8 y 128 caracteres',
      'password debe contener al menos una letra y un número',
      'rol debe ser uno de: usuario-free, usuario',
    ])
  })

  it('no falla sin cuerpo', () => {
    expect(validar_registro(undefined).length).toBeGreaterThan(0)
  })
})

describe('validar_login', () => {
  it('acepta email y contraseña presentes', () => {
    expect(validar_login({ email: 'ana@x.com', password: 'x' })).toEqual([])
  })

  it('exige email y contraseña', () => {
    expect(validar_login({})).toEqual(['email es obligatorio', 'password es obligatoria'])
    expect(validar_login(undefined)).toEqual(['email es obligatorio', 'password es obligatoria'])
  })
})
