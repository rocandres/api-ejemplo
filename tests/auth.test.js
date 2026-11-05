import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app'

const nuevo_usuario = (extra = {}) => ({
  nombre: 'Ana',
  email: `ana${Math.random().toString(36).slice(2)}@x.com`,
  password: 'secreto123',
  ...extra,
})

describe('rutas /auth montadas', () => {
  it('POST /auth/registro responde 201', async () => {
    const res = await request(app).post('/auth/registro').send(nuevo_usuario())
    expect(res.status).toBe(201)
  })

  it('POST /auth/login responde 200', async () => {
    const datos = nuevo_usuario()
    await request(app).post('/auth/registro').send(datos)
    const res = await request(app)
      .post('/auth/login')
      .send({ email: datos.email, password: datos.password })
    expect(res.status).toBe(200)
  })

  it('las rutas de /vendehumos siguen funcionando', async () => {
    const creado = await request(app).post('/vendehumos').send({
      nombre: 'Gurú',
      urlFoto: 'https://x.com/foto.png',
      categoria: 'COACHING',
      descripcion: 'Vende cursos',
    })
    expect(creado.status).toBe(201)
    const lista = await request(app).get('/vendehumos')
    expect(lista.status).toBe(200)
    expect(lista.body.items).toHaveLength(1)
  })
})
