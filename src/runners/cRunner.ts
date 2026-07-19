interface TCCModule {
  FS: {
    writeFile: (path: string, content: string) => void
    unlink: (path: string) => void
  }
  callMain: (args: string[]) => void
}

let tccModule: TCCModule | null = null
let loadingPromise: Promise<void> | null = null

let cStdoutBuffer: string[] = []
let cStderrBuffer: string[] = []

async function loadTCC(): Promise<void> {
  if (tccModule) return
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    try {
      const tccUrl = new URL('./tcc/tcc.min.js', window.location.href).href
      const TCC = (await import(/* @vite-ignore */ tccUrl)).default as (opts: Record<string, unknown>) => Promise<TCCModule & Record<string, unknown>>
      const instance = await TCC({
        locateFile: (path: string) => new URL(`./tcc/${path}`, window.location.href).href,
        print: (text: string) => {
          cStdoutBuffer.push(text)
        },
        printErr: (text: string) => {
          cStderrBuffer.push(text)
        }
      }) as unknown as TCCModule

      tccModule = {
        FS: instance.FS,
        callMain: instance.callMain,
      }
    } catch (err) {
      throw new Error(
        `Failed to load C compiler: ${err}\n\n` +
        `Make sure the TCC WASM files are in public/tcc/`
      )
    }
  })()

  return loadingPromise
}

function wrapCCode(code: string): string {
  const normalized = code.trim()
  if (normalized.includes('int main') || normalized.includes('main(')) {
    return code
  }

  const lines = code.split('\n')
  const headers: string[] = []
  const body: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('#include') || trimmed.startsWith('#define')) {
      headers.push(line)
    } else {
      body.push(line)
    }
  }

  const standardHeaders = [
    '#include <stdio.h>',
    '#include <stdlib.h>',
    '#include <string.h>',
    '#include <math.h>'
  ]

  const finalHeaders = [...headers]
  for (const sh of standardHeaders) {
    const headerFile = sh.match(/<([^>]+)>/)?.[1]
    if (!headerFile) continue
    if (!finalHeaders.some(h => h.includes(headerFile))) {
      finalHeaders.push(sh)
    }
  }

  const headerSection = finalHeaders.join('\n')
  const bodySection = body.map(l => `    ${l}`).join('\n')

  return `${headerSection}\n\nint main() {\n${bodySection}\n    return 0;\n}\n`
}

export async function runC(code: string): Promise<{
  stdout: string
  stderr: string
  error: string | null
}> {
  try {
    await loadTCC()
    if (!tccModule) throw new Error('C compiler failed to initialize')

    const wrapped = wrapCCode(code)
    const sourcePath = '/tmp/source.c'
    const outputPath = '/tmp/prog.exe'

    tccModule.FS.writeFile(sourcePath, wrapped)

    cStdoutBuffer = []
    cStderrBuffer = []

    try {
      tccModule.callMain(['-o', outputPath, sourcePath])
    } catch (runErr) {
      const errStr = String(runErr)
      if (!errStr.includes('ExitStatus')) {
        cStderrBuffer.push(`Compiler error: ${runErr}`)
      }
    } finally {
      try { tccModule.FS.unlink(sourcePath) } catch { /* ignore */ }
      try { tccModule.FS.unlink(outputPath) } catch { /* ignore */ }
    }

    const hasCompileError = cStderrBuffer.some(s =>
      s.includes('error:') || s.includes('Error:') || s.includes('warning:') || s.includes('fatal:')
    )

    if (hasCompileError) {
      return {
        stdout: cStdoutBuffer.join('\n'),
        stderr: cStderrBuffer.join('\n'),
        error: null,
      }
    }

    const compileOutput = cStdoutBuffer.join('\n')
    const compileErrors = cStderrBuffer.join('\n')

    return {
      stdout: `${compileOutput ? compileOutput + '\n' : ''}Compilation successful.`,
      stderr: compileErrors,
      error: null,
    }
  } catch (err) {
    return {
      stdout: '',
      stderr: '',
      error: `C compiler error: ${err}`,
    }
  }
}
