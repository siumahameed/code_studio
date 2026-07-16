import { PYODIDE_URL } from '../utils/constants'

let pyodideInstance: {
  runPythonAsync: (code: string) => Promise<unknown>
  runPython: (code: string) => unknown
} | null = null
let loadingPromise: Promise<void> | null = null

let pyodideStdoutBuffer: string[] = []
let pyodideStderrBuffer: string[] = []

async function loadPyodide(): Promise<void> {
  if (pyodideInstance) return
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    const script = document.createElement('script')
    script.src = PYODIDE_URL
    document.head.appendChild(script)
    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Pyodide'))
    })
    const loadPyodideFn = (window as unknown as Record<string, unknown>).loadPyodide as (opts: Record<string, unknown>) => Promise<{
      runPythonAsync: (code: string) => Promise<unknown>
      runPython: (code: string) => unknown
    }>
    pyodideInstance = await loadPyodideFn({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.4/full/',
      stdout: (text: string) => {
        pyodideStdoutBuffer.push(text)
      },
      stderr: (text: string) => {
        pyodideStderrBuffer.push(text)
      }
    })
  })().catch(() => {
    pyodideInstance = null
    loadingPromise = null
  })

  return loadingPromise
}

function setupStdin(): void {
  if (!pyodideInstance) return
  // Replace input() with one that uses browser prompt dialog
  pyodideInstance.runPython(`
import js as _js
def _cs_input(prompt_text=""):
    result = _js.prompt(prompt_text or "")
    return result if result is not None else ""
import builtins
builtins.input = _cs_input
  `)
}

export async function runPython(code: string): Promise<{
  stdout: string
  stderr: string
  error: string | null
}> {
  try {
    await loadPyodide()
    if (!pyodideInstance) throw new Error('Pyodide failed to initialize')

    setupStdin()

    const stdout: string[] = []
    const stderr: string[] = []

    pyodideStdoutBuffer = []
    pyodideStderrBuffer = []

    try {
      const result = await pyodideInstance.runPythonAsync(code)
      
      // Capture print stdout
      if (pyodideStdoutBuffer.length > 0) {
        stdout.push(...pyodideStdoutBuffer)
      }

      // Capture return result if any and if not None
      if (result !== undefined && result !== null) {
        let isNone = false
        if (typeof result === 'object' && 'type' in result && (result as any).type === 'NoneType') {
          isNone = true
        }
        
        if (!isNone) {
          let outputVal = ''
          if (typeof result === 'object' && 'toJs' in result && typeof (result as any).toJs === 'function') {
            try {
              const jsVal = (result as any).toJs()
              outputVal = typeof jsVal === 'object' ? JSON.stringify(jsVal) : String(jsVal)
            } catch {
              outputVal = String(result)
            }
            try { (result as any).destroy() } catch { /* ignore */ }
          } else {
            outputVal = String(result)
          }
          
          if (outputVal !== 'None' && outputVal !== 'undefined' && outputVal.trim() !== '') {
            stdout.push(outputVal)
          }
        }
      }
    } catch (err) {
      stderr.push(String(err))
    }

    if (pyodideStderrBuffer.length > 0) {
      stderr.push(...pyodideStderrBuffer)
    }

    return {
      stdout: stdout.join('\n'),
      stderr: stderr.join('\n'),
      error: null, // Let syntax/runtime errors act as standard console stderr streams
    }
  } catch (err) {
    return {
      stdout: '',
      stderr: '',
      error: `Python runtime error: ${err}`,
    }
  }
}
