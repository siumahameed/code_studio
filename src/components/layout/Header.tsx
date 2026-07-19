import { useAppContext } from '../../context/AppContext'
import LanguageSelector from '../LanguageSelector'
import { Brand, Sun, Moon, Play } from '../icons'

export default function Header({ onRun, isRunning }: { onRun?: () => void; isRunning?: boolean }) {
  const { state, setTheme, setShowWelcome } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <header className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 ${isDark ? 'bg-[#0b0c0f]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4">
        <button onClick={() => setShowWelcome(true)} title="Back to home" className="flex items-center gap-2 shrink-0 group">
          <svg className={`hidden sm:block w-4 h-4 transition-transform group-hover:-translate-x-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-brand-500 text-white shadow-sm">
            <Brand className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>CodeStudio</span>
        </button>

        <div className="hidden md:block">
          <LanguageSelector />
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-lg transition-all active:scale-[0.97] shadow-sm shadow-brand-600/30"
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden xs:inline">{isRunning ? 'Running...' : 'Run'}</span>
            <span className="xs:hidden">{isRunning ? '...' : 'Run'}</span>
          </button>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg transition-all active:scale-90 ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
