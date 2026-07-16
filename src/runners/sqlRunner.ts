import { SQL_WASM_URL } from '../utils/constants'

interface SqlJsStatic {
  Database: new (data?: ArrayLike<number> | ArrayBuffer) => Database
}
interface Database {
  run(sql: string): void
  prepare(sql: string): Statement
  export(): Uint8Array
}
interface Statement {
  getColumnNames(): string[]
  step(): boolean
  getAsObject(): Record<string, unknown>
  free(): void
}

const DB_KEY = 'codestudio-sql-db'

let sqlInstance: SqlJsStatic | null = null
let db: Database | null = null
let loadingPromise: Promise<void> | null = null

async function loadSQL(): Promise<void> {
  if (sqlInstance) return
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    const initSqlJs = (await import('sql.js')).default
    sqlInstance = (await initSqlJs({ locateFile: () => SQL_WASM_URL })) as unknown as SqlJsStatic

    const saved = localStorage.getItem(DB_KEY)
    if (saved) {
      const buf = Uint8Array.from(atob(saved), c => c.charCodeAt(0))
      db = new sqlInstance.Database(buf)
    } else {
      db = new sqlInstance.Database()
    }
  })()

  return loadingPromise
}

function saveDb(): void {
  if (!db) return
  try {
    const data = db.export()
    const bin = Array.from(data).map(b => String.fromCharCode(b)).join('')
    localStorage.setItem(DB_KEY, btoa(bin))
  } catch { /* ignore */ }
}

function isWriteQuery(sql: string): boolean {
  const s = sql.trim().toLowerCase()
  return s.startsWith('create') || s.startsWith('insert') || s.startsWith('update') || s.startsWith('delete') || s.startsWith('drop') || s.startsWith('alter') || s.startsWith('replace')
}

export async function runSQL(code: string): Promise<{
  stdout: string
  stderr: string
  error: string | null
  table?: { columns: string[]; rows: string[][] }
}> {
  try {
    await loadSQL()
    if (!sqlInstance || !db) throw new Error('SQL failed to initialize')

    const lines = code.split(';').map(s => s.trim()).filter(s => s.length > 0)
    let lastTable: { columns: string[]; rows: string[][] } | undefined

    for (const line of lines) {
      try {
        const stmt = db.prepare(line)
        if (stmt.getColumnNames().length > 0) {
          const columns = stmt.getColumnNames()
          const rows: string[][] = []
          while (stmt.step()) {
            const row = stmt.getAsObject() as Record<string, unknown>
            rows.push(columns.map((col: string) => String(row[col] ?? 'NULL')))
          }
          lastTable = { columns, rows }
        }
        stmt.free()
        if (isWriteQuery(line)) saveDb()
      } catch (runErr) {
        return {
          stdout: '',
          stderr: `SQL Error: ${runErr}`,
          error: null,
          table: lastTable,
        }
      }
    }

    if (lastTable) {
      return { stdout: '', stderr: '', error: null, table: lastTable }
    }

    return {
      stdout: 'Query executed successfully.',
      stderr: '',
      error: null,
    }
  } catch (err) {
    return {
      stdout: '',
      stderr: '',
      error: `SQL runtime error: ${err}`,
    }
  }
}
