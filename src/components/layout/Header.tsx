import { useAppContext } from '../../context/AppContext'
import LanguageSelector from '../LanguageSelector'

export default function Header({ onRun, isRunning }: { onRun?: () => void; isRunning?: boolean }) {
  const { state, setTheme, setShowWelcome } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <header className={`flex items-center gap-2 px-3 py-1.5 select-none ${isDark ? 'bg-[#25262b] border-b border-[#373a40]' : 'bg-white border-b border-slate-200'}`}>
      <button onClick={() => setShowWelcome(true)} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-bold transition-colors ${isDark ? 'text-brand-400 hover:text-brand-300' : 'text-brand-600 hover:text-brand-500'}`} aria-label="Home">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <span className="hidden sm:inline">CodeStudio</span>
      </button>

      <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1" />

      <div className="flex-1 flex items-center">
        <div className={`inline-flex rounded-md overflow-hidden border ${isDark ? 'border-[#373a40]' : 'border-slate-200'}`}>
          <LanguageSelector />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={onRun} disabled={isRunning} aria-label={isRunning ? 'Running...' : 'Run code (Ctrl+Enter)'}
          className="btn-run text-xs">
          {isRunning ? (
            <span className="flex items-center gap-1.5">
              <span className="loading-dot w-1.5 h-1.5 rounded-full bg-white" />
              <span className="loading-dot w-1.5 h-1.5 rounded-full bg-white" />
              <span className="loading-dot w-1.5 h-1.5 rounded-full bg-white" />
              <span>Running</span>
            </span>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              <span className="hidden sm:inline">Run</span>
            </>
          )}
        </button>
        <button onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label="Toggle theme"
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
    </header>
  )
}
