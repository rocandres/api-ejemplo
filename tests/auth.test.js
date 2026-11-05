import { describe, it, expect } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../src/app'
import { createRequire } from 'node:module'

// require nativo: comparte la instancia de la BD con la que usa la app (CommonJS)
const { db } = createRequire(import.meta.url)('../src/db')

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

const registrar = (datos) => request(app).post('/auth/registro').send(datos)
const contar_usuarios = () => db.prepare('SELECT COUNT(*) AS n FROM usuarios').get().n

describe('POST /auth/registro', () => {
  it('201 con token y usuario sin contraseña', async () => {
    const datos = nuevo_usuario({ rol: 'usuario' })
    const res = await registrar(datos)

    expect(res.status).toBe(201)
    expect(Object.keys(res.body.usuario).sort()).toEqual(
      ['createdAt', 'email', 'id', 'nombre', 'rol'].sort()
    )
    expect(res.body.usuario).toMatchObject({ nombre: 'Ana', email: datos.email, rol: 'usuario' })
    expect(JSON.stringify(res.body)).not.toMatch(/password|secreto123/i)

    const payload = jwt.verify(res.body.token, process.env.JWT_SECRET)
    expect(payload).toMatchObject({ sub: String(res.body.usuario.id), email: datos.email, rol: 'usuario' })
  })

  it('sin rol crea el usuario como usuario-free', async () => {
    const res = await registrar(nuevo_usuario())
    expect(res.status).toBe(201)
    expect(res.body.usuario.rol).toBe('usuario-free')
  })

  it('400 con rol admin y no crea el usuario', async () => {
    const antes = contar_usuarios()
    const res = await registrar(nuevo_usuario({ rol: 'admin' }))
    expect(res.status).toBe(400)
    expect(res.body.errores).toEqual(['rol debe ser uno de: usuario-free, usuario'])
    expect(contar_usuarios()).toBe(antes)
  })

  it.each(['soloLetras', '12345678'])('400 si la contraseña %s no tiene letra y número', async (password) => {
    const res = await registrar(nuevo_usuario({ password }))
    expect(res.status).toBe(400)
    expect(res.body.errores).toEqual(['password debe contener al menos una letra y un número'])
  })

  it('400 con todos los errores a la vez', async () => {
    const res = await registrar({ nombre: 'Ana', email: 'malo', password: 'a1' })
    expect(res.status).toBe(400)
    expect(res.body.errores).toEqual([
      'email no es válido',
      'password debe tener entre 8 y 128 caracteres',
    ])
  })

  it('409 si el email ya existe, sin distinguir mayúsculas', async () => {
    const datos = nuevo_usuario()
    await registrar(datos)
    const res = await registrar({ ...datos, email: datos.email.toUpperCase() })
    expect(res.status).toBe(409)
    expect(res.body).toEqual({ error: 'El email ya está registrado' })
  })

  it('guarda la contraseña hasheada y con salt distinto por usuario', async () => {
    const a = (await registrar(nuevo_usuario())).body.usuario
    const b = (await registrar(nuevo_usuario())).body.usuario
    const hash = (id) => db.prepare('SELECT password_hash FROM usuarios WHERE id = ?').get(id).password_hash

    expect(hash(a.id)).not.toBe('secreto123')
    expect(hash(a.id)).not.toBe(hash(b.id))
  })
})
