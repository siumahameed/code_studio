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
      <div className={`h-screen flex flex-col ${isDark ? 'bg-[#1a1b1e]' : 'bg-slate-50'}`}>
        <div className={`flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 flex-shrink-0 border-b ${isDark ? 'border-[#373a40]' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <svg className={`w-5 h-5 ${isDark ? 'text-brand-400' : 'text-brand-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>CodeStudio</span>
            </div>
          </div>
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`btn-icon ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
            {isDark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        <WelcomePanel />
      </div>
    )
  }

  const isHtml = state.language === 'html'
  const rightPanel = isHtml ? <Preview /> : <Console />

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-[#1a1b1e] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Header onRun={handleRun} isRunning={isRunning} />

      <div className="md:hidden flex-1 flex flex-col min-h-0 pb-16">
        {state.activeMobileTab === 'editor' && (
          <div className="flex-1 flex flex-col min-h-0 p-2 gap-2">
            <Editor />
            <StatusBar />
          </div>
        )}
        {state.activeMobileTab === 'preview' && (
          <div className="flex-1 min-h-0 p-2"><Preview /></div>
        )}
        {state.activeMobileTab === 'console' && (
          <div className="flex-1 min-h-0 p-2"><Console /></div>
        )}
      </div>

      <div ref={splitContainerRef} id="split-container" className="hidden md:flex flex-1 min-h-0 p-2 gap-0">
        <div style={{ width: `${splitPos}%` }} className="flex flex-col min-h-0 min-w-0 pr-1">
          <Editor />
          <StatusBar />
        </div>
        <div onMouseDown={() => { isDragging.current = true }}
          className={`w-1.5 cursor-col-resize flex-shrink-0 flex items-center justify-center transition-colors ${isDark ? 'hover:bg-[#373a40]' : 'hover:bg-slate-200'} active:bg-brand-500/30 rounded-full`}>
          <div className={`w-0.5 h-8 rounded-full ${isDark ? 'bg-[#373a40]' : 'bg-slate-300'}`} />
        </div>
        <div key={state.language} style={{ width: `${100 - splitPos}%` }} className="flex flex-col min-h-0 min-w-0 pl-1 animate-fade-in">
          {rightPanel}
        </div>
      </div>

      <MobileTabBar onRun={handleRun} isRunning={isRunning} />
    </div>
  )
}
