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

export default function App() {
  const { state, addOutput, clearOutput, setLoading, setMobileTab, setTheme } = useAppContext()
  useAutoSave()

  const [isRunning, setIsRunning] = useState(false)
  const [splitPos, setSplitPos] = useState(55)
  const isDragging = useRef(false)
  const splitContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark')
  }, [state.theme])

  useEffect(() => {
    const handler = () => { handleRun() }
    window.addEventListener('codestudio-run', handler)
    return () => window.removeEventListener('codestudio-run', handler)
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !splitContainerRef.current) return
      const rect = splitContainerRef.current.getBoundingClientRect()
      setSplitPos(Math.min(80, Math.max(20, ((e.clientX - rect.left) / rect.width) * 100)))
    }
    const onMouseUp = () => { isDragging.current = false }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const handleRun = useCallback(async () => {
    clearOutput()
    setIsRunning(true)
    setLoading(true)

    if (state.language === 'html') {
      setMobileTab('preview')
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

  if (state.showWelcome) {
    return (
      <div className={`h-screen flex flex-col ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/20 flex-shrink-0"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg></div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 bg-clip-text text-transparent truncate">CodeStudio</span>
          </div>
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition active:scale-90 flex-shrink-0 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white/80 hover:bg-white shadow-sm border border-slate-200/60'}`}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="flex-1 min-h-0">
          <WelcomePanel />
        </div>
      </div>
    )
  }

  const isHtml = state.language === 'html'
  const rightPanel = isHtml ? <Preview /> : <Console />

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Header onRun={handleRun} isRunning={isRunning} />

      <div className="md:hidden flex-1 flex flex-col min-h-0 pb-20">
        {state.activeMobileTab === 'editor' && (
          <div className="flex-1 flex flex-col min-h-0 p-3 gap-3">
            <Editor />
            <StatusBar />
          </div>
        )}
        {state.activeMobileTab === 'preview' && (
          <div className="flex-1 min-h-0 p-3"><Preview /></div>
        )}
        {state.activeMobileTab === 'console' && (
          <div className="flex-1 min-h-0 p-3"><Console /></div>
        )}
      </div>

      <div ref={splitContainerRef} id="split-container" className="hidden md:flex flex-1 min-h-0 p-3 gap-0">
        <div style={{ width: `${splitPos}%` }} className="flex flex-col min-h-0 min-w-0 pr-1.5">
          <div className="flex-1 min-h-0" style={{ minHeight: 0 }}><Editor /></div>
          <StatusBar />
        </div>
        <div onMouseDown={() => { isDragging.current = true }}
          className={`w-2 cursor-col-resize flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-200/50'} active:bg-slate-300/30`}>
          <div className={`w-0.5 h-10 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
        </div>
        <div key={state.language} style={{ width: `${100 - splitPos}%` }} className="flex flex-col min-h-0 min-w-0 pl-1.5 animate-fade-in">
          {rightPanel}
        </div>
      </div>

      <MobileTabBar onRun={handleRun} isRunning={isRunning} />
    </div>
  )
}