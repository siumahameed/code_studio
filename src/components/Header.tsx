import { useAppContext } from '../context/AppContext'
import LanguageDropdown from './LanguageDropdown'

export default function Header({ onRun, isRunning }: { onRun: () => void; isRunning: boolean }) {
  const { state, setTheme } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <header className="flex items-center justify-between gap-3 mb-4 flex-shrink-0">
      {/* Logo + Brand (Interactive & Responsive) */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 sm:gap-2.5 group/brand cursor-pointer select-none">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0 transition-all duration-500 group-hover/brand:rotate-[360deg] group-hover/brand:scale-105">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 opacity-0 group-hover/brand:opacity-100 blur-sm transition-opacity duration-500" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-sm">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <div className="hidden min-[480px]:flex flex-col text-left">
            <span className="font-extrabold tracking-wide text-sm sm:text-base bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent group-hover/brand:from-indigo-300 group-hover/brand:via-purple-300 group-hover/brand:to-pink-400 transition-all duration-300">
              CodeStudio
            </span>
            <span className={`text-[8px] font-bold tracking-wider uppercase -mt-0.5 ${
              isDark ? 'text-slate-500 group-hover/brand:text-slate-400' : 'text-slate-400 group-hover/brand:text-slate-600'
            } transition-colors duration-300`}>
              Online IDE
            </span>
          </div>
        </div>

        <LanguageDropdown />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Desktop: Epic Run Button */}
        <div className="hidden md:block relative group">
          {/* Glow ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-40 group-hover:opacity-70 blur-md transition-all duration-700 animate-pulse group-hover:animate-none" />
          {/* Glow ring 2 (offset for depth) */}
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-40 blur-xl transition-all duration-700" />

          <button
            onClick={onRun}
            disabled={isRunning}
            className="relative flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-400 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-white/10"
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {isRunning ? (
              <span className="relative flex items-center gap-2">
                <span className="loading-dot inline-block w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="loading-dot inline-block w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="loading-dot inline-block w-1.5 h-1.5 rounded-full bg-white"></span>
              </span>
            ) : (
              <span className="relative flex items-center gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M4 2L13 8L4 14V2Z" fill="white"/>
                  </svg>
                </span>
                <span className="tracking-wide">Run Code</span>
                <kbd className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-white/60 font-mono">Ctrl+Enter</kbd>
              </span>
            )}
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-sm sm:text-base border transition-all duration-200 active:scale-90 ${
            isDark 
              ? 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] text-amber-400' 
              : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-indigo-600 shadow-sm'
          }`}
          title="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
