import { useAppContext } from '../../context/AppContext'

export default function MobileTabBar({ onRun, isRunning }: { onRun: () => void; isRunning: boolean }) {
  const { state } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center pb-[env(safe-area-inset-bottom)] ${isDark ? 'bg-[#1a1b1e]' : 'bg-slate-50'}`}>
      <button onClick={onRun} disabled={isRunning} aria-label="Run Code"
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white border-[3px] transition-all active:scale-90 shadow-lg ${isRunning ? 'bg-slate-500 border-white/50' : 'bg-brand-600 border-white/80 shadow-brand-600/40'}`}>
        {isRunning ? (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
          </span>
        ) : (
          <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>
    </div>
  )
}
