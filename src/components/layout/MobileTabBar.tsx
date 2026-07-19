import { useAppContext } from '../../context/AppContext'
import { Sun, Moon, Play } from '../icons'

export default function MobileTabBar({ onRun, isRunning }: { onRun: () => void; isRunning: boolean }) {
  const { state, setTheme, setMobileTab } = useAppContext()
  const isDark = state.theme === 'dark'
  const isPreview = state.language === 'html'
  const activeTab = state.activeMobileTab === 'editor' ? 'editor' : 'result'

  const { setShowWelcome } = useAppContext()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
      <div className={`glass-panel mx-auto flex max-w-2xl items-center gap-2 rounded-xl px-3 py-2 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
        <button
          onClick={() => setShowWelcome(true)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all active:scale-90 ${isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`}
          title="Back to home"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all active:scale-90 ${isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className={`flex flex-1 items-center rounded-lg p-0.5 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition ${activeTab === 'editor' ? 'bg-brand-600 text-white shadow-sm' : isDark ? 'text-slate-300' : 'text-slate-600'}`}
          >
            Editor
          </button>
          <button
            onClick={() => setMobileTab(isPreview ? 'preview' : 'console')}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition ${activeTab === 'result' ? 'bg-brand-600 text-white shadow-sm' : isDark ? 'text-slate-300' : 'text-slate-600'}`}
          >
            {isPreview ? 'Preview' : 'Output'}
          </button>
        </div>

        <button
          onClick={onRun}
          disabled={isRunning}
          className={`flex h-9 min-w-[4.5rem] items-center justify-center gap-1.5 rounded-lg px-5 py-2 text-sm font-semibold text-white transition active:scale-[0.98] shadow-sm ${isRunning ? 'bg-slate-500' : 'bg-brand-600 shadow-brand-600/30'}`}
        >
          {isRunning ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 rounded-full bg-white animate-bounce" />
              <span className="text-xs">Run</span>
            </span>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span className="text-xs">Run</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
