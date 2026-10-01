import { readFile, writeFile, mkdir, rename } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'

const here = path.dirname(fileURLToPath(import.meta.url))
const file = process.env.PNG_DATA_FILE ? path.resolve(process.env.PNG_DATA_FILE) : path.join(here, 'data', 'store.json')
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null
let state
let writes = Promise.resolve()

async function initialState() {
  const source = JSON.parse(await readFile(path.resolve(here, '../public/data/assistencias-2026.json'), 'utf8'))
  return { version: 1, players: source.map(item => ({ id: String(item.id), nome: item.nome, apelido: '', foto: '', nota: null, ativo: true })), matches: [] }
}

function validate(value) {
  if (!value || !Array.isArray(value.players) || !Array.isArray(value.matches)) throw new Error('Dados administrativos inválidos')
  return value
}

async function readDatabase() {
  const rows = await sql`SELECT revision, data FROM png_state WHERE id = 1`
  if (rows.length !== 1) throw new Error('Armazenamento administrativo não inicializado')
  return { revision: Number(rows[0].revision), data: validate(rows[0].data) }
}

export async function initStore() {
  if (state) return
  if (sql) {
    await sql`CREATE TABLE IF NOT EXISTS png_state (id integer PRIMARY KEY CHECK (id = 1), revision bigint NOT NULL DEFAULT 0, data jsonb NOT NULL)`
    const seed = await initialState()
    await sql`INSERT INTO png_state (id, revision, data) VALUES (1, 0, CAST(${JSON.stringify(seed)} AS jsonb)) ON CONFLICT (id) DO NOTHING`
    state = (await readDatabase()).data
    return
  }
  try { state = validate(JSON.parse(await readFile(file, 'utf8'))) }
  catch (error) {
    if (error.code !== 'ENOENT') throw error
    state = await initialState()
    await persist()
  }
}

async function persist() {
  await mkdir(path.dirname(file), { recursive: true })
  const temporary = `${file}.${process.pid}.tmp`
  await writeFile(temporary, JSON.stringify(state, null, 2), 'utf8')
  await rename(temporary, file)
}

export async function snapshot() {
  if (sql) return structuredClone((await readDatabase()).data)
  return structuredClone(state)
}

export function updateStore(change) {
  const operation = writes.then(async () => {
    if (sql) {
      for (let attempt = 0; attempt < 6; attempt++) {
        const current = await readDatabase()
        const next = structuredClone(current.data)
        const result = change(next)
        const updated = await sql`UPDATE png_state SET revision = revision + 1, data = CAST(${JSON.stringify(next)} AS jsonb) WHERE id = 1 AND revision = ${current.revision} RETURNING revision`
        if (updated.length) { state = next; return result }
      }
      throw new Error('Dados alterados simultaneamente. Tente novamente.')
    }
    const next = structuredClone(state)
    const result = change(next)
    const before = state
    state = next
    try { await persist() } catch (error) { state = before; throw error }
    return result
  })
  writes = operation.catch(() => {})
  return operation
}
