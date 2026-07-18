import { useAppContext } from '../../context/AppContext'
import LanguageSelector from '../LanguageSelector'

export default function Header({ onRun, isRunning }: { onRun?: () => void; isRunning?: boolean }) {
  const { state, setTheme, setShowWelcome } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <header className={`sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b backdrop-blur-xl transition-colors ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/80 border-slate-200'}`}>
      <button onClick={() => setShowWelcome(true)} className="flex items-center gap-2.5 group flex-shrink-0 active:scale-[0.97] transition-transform p-1 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50" aria-label="Home">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
        </div>
        <span className="hidden sm:block font-extrabold text-sm bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">CodeStudio</span>
      </button>

      <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar"><LanguageSelector /></div>

      <div className="hidden md:flex items-center gap-2 flex-shrink-0">
        <button onClick={onRun} disabled={isRunning} aria-label={isRunning ? 'Running...' : 'Run code (Ctrl+Enter)'}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${isRunning ? 'bg-slate-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 shadow-lg shadow-indigo-500/30'}`}>
          {isRunning ? (
            <span className="flex items-center gap-1.5">
              <span className="loading-dot w-1.5 h-1.5 rounded-full bg-white" />
              <span className="loading-dot w-1.5 h-1.5 rounded-full bg-white" />
              <span className="loading-dot w-1.5 h-1.5 rounded-full bg-white" />
              <span>Running...</span>
            </span>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              <span>Run</span>
            </>
          )}
        </button>
        <button onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label="Toggle theme"
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all active:scale-95 ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-100 text-slate-700 shadow-sm border border-slate-200'}`}>
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
