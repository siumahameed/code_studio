import { useEffect, useRef, useState } from 'react'
import { useAppContext } from './context/AppContext'
import { useAutoSave } from './hooks/useLocalStorage'
import Header from './components/Header'
import Editor from './components/Editor'
import Console from './components/Console'
import StatusBar from './components/StatusBar'
import Preview from './components/Preview'
import MobileTabBar from './components/MobileTabBar'

const runtimeStatus = { python: false, sql: false, c: false }

export default function App() {
  const { state, addOutput, clearOutput, setLoading, setMobileTab } = useAppContext()
  useAutoSave()
  const preloadStarted = useRef<Record<string, boolean>>({})
  const runningRef = useRef(false)
  const isDark = state.theme === 'dark'

  const containerRef = useRef<HTMLDivElement>(null)
  const [splitPercent, setSplitPercent] = useState(state.language === 'html' ? 40 : 65)

  // Reset split percentage when language changes
  useEffect(() => {
    setSplitPercent(state.language === 'html' ? 40 : 65)
  }, [state.language])

  // Split-pane resizing logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const container = containerRef.current
    if (!container) return
    const containerWidth = container.clientWidth
    const initialPercent = splitPercent

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaPercent = (deltaX / containerWidth) * 100
      let newPercent = initialPercent + deltaPercent
      
      // Keep split ratio within reasonable bounds (20% - 80%)
      if (newPercent < 20) newPercent = 20
      if (newPercent > 80) newPercent = 80
      setSplitPercent(newPercent)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Pre-load active language runtime on demand
  useEffect(() => {
    const loadOne = async (lang: string) => {
      if (lang === 'html') return
      if (runtimeStatus[lang as keyof typeof runtimeStatus]) return
      if (preloadStarted.current[lang]) return
      preloadStarted.current[lang] = true

      try {
        let ok = true
        switch (lang) {
          case 'python': {
            const { runPython } = await import('./runners/pythonRunner')
            const r = await runPython('print("ready")')
            if (r.error) ok = false
            break
          }
          case 'sql': {
            const { runSQL } = await import('./runners/sqlRunner')
            const r = await runSQL('SELECT 1')
            if (r.error) ok = false
            break
          }
          case 'c': {
            const { runC } = await import('./runners/cRunner')
            const r = await runC('int main(){return 0;}')
            if (r.error) ok = false
            break
          }
        }
        if (ok) runtimeStatus[lang as keyof typeof runtimeStatus] = true
        else preloadStarted.current[lang] = false
      } catch {
        preloadStarted.current[lang] = false
      }
    }

    loadOne(state.language)
  }, [state.language])

  const handleRun = async () => {
    if (runningRef.current) {
      setLoading(false)
      runningRef.current = false
    }
    runningRef.current = true
    clearOutput()

    if (state.language === 'html') {
      setMobileTab('preview')
      runningRef.current = false
      return
    }

    setMobileTab('console') // Switch tab to Console immediately so students see the active running state
    setLoading(true, 'Running...')

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
      }

      if (!result) throw new Error('No result returned')

      if (result.stdout) addOutput({ type: 'stdout', content: result.stdout, timestamp: Date.now() })
      if (result.stderr) addOutput({ type: 'stderr', content: result.stderr, timestamp: Date.now() })
      if (result.error) addOutput({ type: 'error', content: result.error, timestamp: Date.now() })
      if (result.table) addOutput({ type: 'table', content: JSON.stringify(result.table), timestamp: Date.now() })
    } catch (err) {
      addOutput({ type: 'error', content: `Error: ${err}`, timestamp: Date.now() })
    } finally {
      setLoading(false)
      runningRef.current = false
    }
  }

  // Synchronize theme state with the html root class for Tailwind variants
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.theme])

  const handleRunRef = useRef(handleRun)
  useEffect(() => {
    handleRunRef.current = handleRun
  })

  useEffect(() => {
    const handleRunEvent = () => {
      handleRunRef.current()
    }
    window.addEventListener('codestudio-run', handleRunEvent)
    return () => {
      window.removeEventListener('codestudio-run', handleRunEvent)
    }
  }, [])

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col transition-colors duration-300 relative select-none ${
      isDark ? 'bg-[#0d0d1a] text-slate-100' : 'bg-[#f4f4fa] text-slate-800'
    }`}>
      {/* Glow blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-colors duration-500 ${
          isDark ? 'bg-indigo-500/5' : 'bg-indigo-500/10'
        }`} />
        <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-colors duration-500 ${
          isDark ? 'bg-purple-500/5' : 'bg-purple-500/10'
        }`} />
      </div>

      <div className={`relative z-10 h-full flex flex-col w-full transition-all duration-300 ${
        state.isFullscreen 
          ? 'p-0 max-w-none' 
          : 'max-w-7xl mx-auto px-3 sm:px-5 py-3 sm:py-4'
      }`}>
        {!state.isFullscreen && (
          <Header onRun={handleRun} isRunning={state.isLoading} />
        )}

        {/* Desktop layout */}
        <div ref={containerRef} className="hidden md:flex flex-1 gap-0 min-h-0 relative select-none">
          <div 
            className="flex flex-col min-w-0" 
            style={{ width: `${splitPercent}%` }}
          >
            <Editor />
            <StatusBar />
          </div>

          {/* Resize Handle */}
          <div 
            onMouseDown={handleMouseDown}
            className="w-3 cursor-col-resize flex items-center justify-center group/resize self-stretch select-none z-20 relative"
          >
            <div className={`w-[1px] h-full transition-colors duration-200 ${
              isDark ? 'bg-white/[0.05]' : 'bg-slate-200'
            } group-hover/resize:bg-indigo-500/80`} />
            <div className={`absolute w-1.5 h-12 rounded-full opacity-0 group-hover/resize:opacity-100 transition-all duration-200 ${
              isDark ? 'bg-indigo-500/40 border border-indigo-500/60' : 'bg-indigo-500/30 border border-indigo-500/50'
            }`} />
          </div>

          <div 
            className="flex flex-col min-h-0" 
            style={{ width: `${100 - splitPercent}%` }}
          >
            {state.language === 'html' ? (
              <Preview />
            ) : (
              <div className="flex-1 min-h-0">
                <Console />
              </div>
            )}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex-1 flex flex-col min-h-0 gap-3">
          {!state.isFullscreen && (
            <MobileTabBar onRun={handleRun} isRunning={state.isLoading} />
          )}
          <>
            <div className={`flex-1 min-h-0 ${state.activeMobileTab === 'editor' ? 'block' : 'hidden'}`}>
              <Editor />
            </div>
            <div className={`flex-1 min-h-0 ${state.activeMobileTab === 'preview' ? 'block' : 'hidden'}`}>
              <Preview />
            </div>
            <div className={`flex-1 min-h-0 ${state.activeMobileTab === 'console' ? 'block' : 'hidden'}`}>
              <Console />
            </div>
          </>
          {!state.isFullscreen && <div className="h-16 flex-shrink-0" />}
        </div>

        {/* Mobile credit */}
        {!state.isFullscreen && (
          <div className="md:hidden flex items-center justify-center pb-1 flex-shrink-0 select-none">
            <a 
              href="https://github.com/siumbhuyan"
              target="_blank" 
              rel="noopener noreferrer"
              className={`group/credit flex items-center gap-1 px-3 py-1 rounded-full border text-[10px] transition-all duration-200 active:scale-95 ${
                isDark 
                  ? 'bg-[#15152a]/60 border-white/[0.04] text-slate-500 hover:text-slate-350' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'
              }`}
            >
              <span>Developed by</span>
              <span className={`font-semibold ${isDark ? 'text-indigo-450 group-hover/credit:text-pink-400' : 'text-indigo-650 group-hover/credit:text-purple-650'}`}>
                Sium Ahameed Bhuyan
              </span>
            </a>
          </div>
        )}

        {/* Desktop: bottom bar */}
        {!state.isFullscreen && (
          <div className="hidden md:flex items-center justify-end mt-3 flex-shrink-0 select-none">
            <a 
              href="https://github.com/siumbhuyan"
              target="_blank" 
              rel="noopener noreferrer"
              className={`group/credit flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] transition-all duration-200 active:scale-95 ${
                isDark 
                  ? 'bg-[#15152a]/60 border-white/[0.04] text-slate-550 hover:text-slate-350 hover:border-white/[0.1] hover:bg-white/[0.02]' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-350 hover:bg-slate-50/50 shadow-sm shadow-slate-100/50'
              }`}
            >
              <span>Developed by</span>
              <span className={`font-semibold transition-all duration-200 ${isDark ? 'text-indigo-400 group-hover/credit:text-pink-400' : 'text-indigo-650 group-hover/credit:text-purple-650'}`}>
                Sium Ahameed Bhuyan
              </span>
              <span className="opacity-0 group-hover/credit:opacity-100 transition-opacity duration-200 text-[9px] ml-0.5">⚡</span>
            </a>
          </div>
        )}

      </div>
    </div>
  )
}


