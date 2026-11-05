import { describe, it, expect } from 'vitest'
import auth_service from '../src/services/auth_service'
import usuarios_repository from '../src/repositories/usuarios_repository'
import { verificar_token } from '../src/utils/jwt'

const datos = (extra = {}) => ({
  nombre: ' Ana ',
  email: 'Ana@X.com',
  password: 'secreto123',
  ...extra,
})

describe('auth_service.registrar_usuario', () => {
  it('devuelve los errores de validación sin crear nada', () => {
    const resultado = auth_service.registrar_usuario({ ...datos(), email: 'malo@', rol: 'admin' })
    expect(resultado.errores).toEqual([
      'email no es válido',
      'rol debe ser uno de: usuario-free, usuario',
    ])
    expect(usuarios_repository.find_by_email('malo@')).toBeUndefined()
  })

  it('crea el usuario normalizado con rol por defecto y devuelve token', () => {
    const { token, usuario } = auth_service.registrar_usuario(datos())
    expect(usuario).toMatchObject({ nombre: 'Ana', email: 'ana@x.com', rol: 'usuario-free' })
    expect(usuario).not.toHaveProperty('passwordHash')
    expect(verificar_token(token)).toMatchObject({ sub: String(usuario.id), rol: 'usuario-free' })
  })

  it('guarda la contraseña hasheada', () => {
    const row = usuarios_repository.find_by_email('ana@x.com')
    expect(row.password_hash).not.toBe('secreto123')
  })

  it('respeta el rol indicado', () => {
    const { usuario } = auth_service.registrar_usuario(datos({ email: 'pro@x.com', rol: 'usuario' }))
    expect(usuario.rol).toBe('usuario')
  })

  it('detecta email duplicado sin distinguir mayúsculas', () => {
    expect(auth_service.registrar_usuario(datos({ email: ' ANA@x.COM ' }))).toEqual({
      conflicto: true,
    })
  })
})

describe('auth_service.login', () => {
  auth_service.registrar_usuario(datos({ email: 'login@x.com', rol: 'usuario' }))

  it('devuelve errores si faltan email o contraseña', () => {
    expect(auth_service.login({})).toEqual({
      errores: ['email es obligatorio', 'password es obligatoria'],
    })
  })

  it('devuelve token y usuario con credenciales correctas (email sin normalizar)', () => {
    const { token, usuario } = auth_service.login({ email: ' LOGIN@x.com', password: 'secreto123' })
    expect(usuario).toMatchObject({ email: 'login@x.com', rol: 'usuario' })
    expect(verificar_token(token)).toMatchObject({ sub: String(usuario.id), rol: 'usuario' })
  })

  it('rechaza una contraseña incorrecta', () => {
    expect(auth_service.login({ email: 'login@x.com', password: 'otra1234' })).toEqual({
      no_autorizado: true,
    })
  })

  it('rechaza un email inexistente', () => {
    expect(auth_service.login({ email: 'nadie@x.com', password: 'secreto123' })).toEqual({
      no_autorizado: true,
    })
  })
})
