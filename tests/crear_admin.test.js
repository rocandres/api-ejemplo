import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

let dir
let db_path

const crear_admin = (vars) => {
  const env = { ...process.env, DB_PATH: db_path, ...vars }
  for (const [k, v] of Object.entries(env)) if (v === undefined) delete env[k]
  return spawnSync(process.execPath, ['scripts/crear_admin.js'], { env, encoding: 'utf8' })
}

const admin = {
  ADMIN_NOMBRE: 'Root',
  ADMIN_EMAIL: 'Root@X.com',
  ADMIN_PASSWORD: 'superSecreto1',
}

describe('npm run crear-admin', () => {
  beforeAll(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'crear-admin-'))
    db_path = path.join(dir, 'test.db')
  })

  afterAll(() => rmSync(dir, { recursive: true, force: true }))

  it('falla si faltan variables', () => {
    const res = crear_admin({ ...admin, ADMIN_PASSWORD: undefined })
    expect(res.status).not.toBe(0)
    expect(res.stderr).toMatch(/ADMIN_PASSWORD/)
  })

  it('falla si la contraseña no es válida', () => {
    const res = crear_admin({ ...admin, ADMIN_PASSWORD: 'corta' })
    expect(res.status).not.toBe(0)
    expect(res.stderr).toMatch(/password debe tener entre 8 y 128 caracteres/)
  })

  it('crea un admin que puede hacer login', () => {
    const res = crear_admin(admin)
    expect(res.stdout).toMatch(/Admin creado: root@x.com/)
    expect(res.status).toBe(0)

    const comprobar = spawnSync(
      process.execPath,
      [
        '-e',
        `const r = require('./src/services/auth_service').login({ email: 'root@x.com', password: 'superSecreto1' })
         console.log(JSON.stringify(r.usuario))`,
      ],
      { env: { ...process.env, DB_PATH: db_path, JWT_SECRET: 'test' }, encoding: 'utf8' }
    )
    expect(JSON.parse(comprobar.stdout)).toMatchObject({ email: 'root@x.com', rol: 'admin' })
  })

  it('falla si el email ya existe', () => {
    const res = crear_admin({ ...admin, ADMIN_EMAIL: 'root@x.com' })
    expect(res.status).not.toBe(0)
    expect(res.stderr).toMatch(/El email ya está registrado/)
  })
})
