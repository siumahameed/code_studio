import { useEffect, useRef, useState, useCallback } from 'react'
import { useAppContext } from './context/AppContext'
import { useAutoSave } from './hooks/useLocalStorage'
import Header from './components/layout/Header'
import Editor from './components/panels/Editor'
import Console from './components/panels/Console'
import StatusBar from './components/layout/StatusBar'
import Preview from './components/panels/Preview'
import MobileTabBar from './components/layout/MobileTabBar'
import WelcomePanel from './components/panels/WelcomePanel'

const GRADIENT = 'bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_30%)]'

export default function App() {
  const { state, addOutput, clearOutput, setLoading, setMobileTab } = useAppContext()
  useAutoSave()

  const [isRunning, setIsRunning] = useState(false)
  const [splitPos, setSplitPos] = useState(55)
  const isDragging = useRef(false)
  const splitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark')
  }, [state.theme])

  useEffect(() => {
    const handler = () => handleRun()
    window.addEventListener('codestudio-run', handler)
    return () => window.removeEventListener('codestudio-run', handler)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current || !splitRef.current) return
      const rect = splitRef.current.getBoundingClientRect()
      setSplitPos(Math.min(80, Math.max(20, ((e.clientX - rect.left) / rect.width) * 100)))
    }
    const onUp = () => { isDragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  const handleRun = useCallback(async () => {
    clearOutput()
    setIsRunning(true)
    setLoading(true)
    setMobileTab(state.language === 'html' ? 'preview' : 'console')

    if (state.language === 'html') {
      setLoading(false)
      setIsRunning(false)
      return
    }

    try {
      let result: { stdout: string; stderr: string; error: string | null; table?: { columns: string[]; rows: string[][] } }
      switch (state.language) {
        case 'python': {
          const { runPython } = await import('./runners/pythonRunner')
          result = await runPython(state.code)
          break
        }
        case 'sql': {
          const { runSQL } = await import('./runners/sqlRunner')
          result = await runSQL(state.code)
          break
        }
        case 'c': {
          const { runC } = await import('./runners/cRunner')
          result = await runC(state.code)
          break
        }
        default: throw new Error(`Unknown language: ${state.language}`)
      }

      if (result.error) addOutput({ type: 'error', content: result.error, timestamp: Date.now() })
      if (result.stderr) addOutput({ type: 'stderr', content: result.stderr, timestamp: Date.now() })
      if (result.stdout) addOutput({ type: 'stdout', content: result.stdout, timestamp: Date.now() })
      if (result.table) addOutput({ type: 'table', content: JSON.stringify(result.table), timestamp: Date.now() })
      if (!result.error && !result.stderr) addOutput({ type: 'success', content: '', timestamp: Date.now() })
    } catch (err) {
      addOutput({ type: 'error', content: String(err), timestamp: Date.now() })
    } finally {
      setLoading(false)
      setIsRunning(false)
    }
  }, [state.language, state.code, addOutput, clearOutput, setLoading, setMobileTab])

  const isDark = state.theme === 'dark'
  const textClass = isDark ? 'text-white' : 'text-slate-900'

  if (state.showWelcome) {
    return (
        <div className={`relative h-screen overflow-hidden px-4 ${textClass}`}>
        <div className={`pointer-events-none absolute inset-0 ${GRADIENT}`} />
        <div className="relative z-10 flex h-full flex-col">
          <WelcomePanel />
        </div>
      </div>
    )
  }

  const isHtml = state.language === 'html'
  const rightPanel = isHtml ? <Preview /> : <Console />
  const mobilePanel = state.activeMobileTab === 'editor' ? <Editor /> : rightPanel

  return (
    <div className={`relative h-screen overflow-hidden px-4 ${textClass}`}>
      <div className={`pointer-events-none absolute inset-0 ${GRADIENT}`} />
      <div className="relative z-10 flex h-full flex-col">
        <Header onRun={handleRun} isRunning={isRunning} />

        <div ref={splitRef} className="hidden md:flex flex-1 min-h-0 p-4 gap-3">
          <div style={{ width: `${splitPos}%` }} className="flex flex-col min-h-0 min-w-0 gap-3">
            <Editor />
            <StatusBar />
          </div>

          <div
            onMouseDown={() => { isDragging.current = true }}
            className={`w-1.5 cursor-col-resize flex-shrink-0 flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200/80'} active:bg-brand-500/30 rounded-full`}
          >
            <div className={`w-0.5 h-10 rounded-full ${isDark ? 'bg-white/12' : 'bg-slate-300'}`} />
          </div>

          <div key={state.language} style={{ width: `${100 - splitPos}%` }} className="flex flex-col min-h-0 min-w-0 animate-fade-in gap-3">
            {rightPanel}
          </div>
        </div>

        <div className="md:hidden flex-1 flex flex-col min-h-0 px-4 pt-4 pb-24 gap-3">
          <div className={`rounded-xl border glass-panel px-3 py-2.5 flex items-center justify-between gap-2 ${isDark ? 'border-white/10' : 'border-white/70'}`}>
            <div className="min-w-0">
              <div className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{state.activeMobileTab === 'editor' ? 'Editor' : (isHtml ? 'Preview' : 'Output')}</div>
              <div className={`text-[10px] truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Tap bottom bar to switch</div>
            </div>
            <div className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-medium ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              {state.language.toUpperCase()}
            </div>
          </div>

          <div key={`${state.language}-${state.activeMobileTab}`} className="flex flex-col min-h-0 flex-1 animate-fade-in">
            {mobilePanel}
          </div>
        </div>

        <MobileTabBar onRun={handleRun} isRunning={isRunning} />
      </div>
    </div>
  )
}
