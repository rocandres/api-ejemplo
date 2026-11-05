import { describe, it, expect } from 'vitest'
import auth_controller from '../src/controllers/auth_controller'

const llamar = (handler, body) => {
  const res = {
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    },
  }
  handler({ body }, res)
  return res
}

const registro = { nombre: 'Ana', email: 'ctrl@x.com', password: 'secreto123' }

describe('auth_controller.registro', () => {
  it('201 con token y usuario', () => {
    const res = llamar(auth_controller.registro, registro)
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body.usuario).toMatchObject({ email: 'ctrl@x.com' })
  })

  it('400 con errores de validación', () => {
    const res = llamar(auth_controller.registro, {})
    expect(res.statusCode).toBe(400)
    expect(res.body.errores.length).toBeGreaterThan(0)
  })

  it('409 si el email ya existe', () => {
    const res = llamar(auth_controller.registro, registro)
    expect(res.statusCode).toBe(409)
    expect(res.body).toEqual({ error: 'El email ya está registrado' })
  })
})

describe('auth_controller.login', () => {
  it('200 con token y usuario', () => {
    const res = llamar(auth_controller.login, { email: 'ctrl@x.com', password: 'secreto123' })
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('400 si faltan datos', () => {
    const res = llamar(auth_controller.login, {})
    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('errores')
  })

  it('401 con credenciales inválidas', () => {
    const res = llamar(auth_controller.login, { email: 'ctrl@x.com', password: 'mala1234' })
    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({ error: 'Credenciales inválidas' })
  })
})
