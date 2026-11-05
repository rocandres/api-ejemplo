import { describe, it, expect } from 'vitest'
import { spawnSync } from 'node:child_process'
import jwt from 'jsonwebtoken'
import { firmar_token, verificar_token } from '../src/utils/jwt'

const usuario = { id: 7, nombre: 'Ana', email: 'ana@x.com', rol: 'usuario' }

describe('jwt', () => {
  it('firmar_token incluye sub, email y rol y caduca en 24 h', () => {
    const payload = jwt.verify(firmar_token(usuario), process.env.JWT_SECRET)
    expect(payload).toMatchObject({ sub: '7', email: 'ana@x.com', rol: 'usuario' })
    expect(payload).not.toHaveProperty('nombre')
    expect(payload.exp - payload.iat).toBe(86400)
  })

  it('verificar_token devuelve el payload de un token válido', () => {
    expect(verificar_token(firmar_token(usuario))).toMatchObject({ sub: '7', rol: 'usuario' })
  })

  it('verificar_token lanza con un token firmado con otro secreto', () => {
    const falso = jwt.sign({ sub: '7' }, 'otro-secreto')
    expect(() => verificar_token(falso)).toThrow()
  })

  it('falla al cargar si falta JWT_SECRET', () => {
    const env = { ...process.env }
    delete env.JWT_SECRET
    const { status, stderr } = spawnSync(process.execPath, ['-e', "require('./src/utils/jwt')"], {
      env,
      encoding: 'utf8',
    })
    expect(status).not.toBe(0)
    expect(stderr).toMatch(/JWT_SECRET/)
  })
})
