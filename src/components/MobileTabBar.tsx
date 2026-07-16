import { useAppContext } from '../context/AppContext'

interface MobileTabBarProps {
  onRun: () => void
  isRunning: boolean
}

export default function MobileTabBar({ onRun, isRunning }: MobileTabBarProps) {
  const { state, setMobileTab } = useAppContext()
  const isDark = state.theme === 'dark'

  const isHtml = state.language === 'html'
  const secondTabId = isHtml ? ('preview' as const) : ('console' as const)
  const secondTabName = isHtml ? 'Preview' : 'Output'

  const activeTab = state.activeMobileTab

  return (
    <div className={`fixed bottom-5 left-5 right-5 z-40 h-16 flex items-center justify-between px-8 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all duration-300 ${
      isDark 
        ? 'bg-[#121226]/90 border-white/[0.08] shadow-black/50' 
        : 'bg-white/90 border-slate-200 shadow-slate-300/40'
    }`}>
      {/* Code Tab */}
      <button
        onClick={() => setMobileTab('editor')}
        className={`flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-xl transition-all duration-200 active:scale-90 ${
          activeTab === 'editor'
            ? isDark
              ? 'text-indigo-400 font-semibold'
              : 'text-indigo-600 font-semibold'
            : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <span className="text-[10px] tracking-wide font-medium">Code</span>
      </button>

      {/* Center Action (Run) Button */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-5">
        <div className="relative group">
          {/* Neon Glow background */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-md transition-all duration-500 animate-pulse" />
          <button
            onClick={onRun}
            disabled={isRunning}
            className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-95 hover:scale-105 shadow-xl border border-white/20 ${
              isRunning
                ? 'bg-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500'
            }`}
            aria-label="Run Code"
          >
            {isRunning ? (
              <span className="flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
              </span>
            ) : (
              <svg className="w-6 h-6 ml-0.5 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Output / Preview Tab */}
      <button
        onClick={() => setMobileTab(secondTabId)}
        className={`flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-xl transition-all duration-200 active:scale-90 ${
          activeTab === secondTabId
            ? isDark
              ? 'text-indigo-400 font-semibold'
              : 'text-indigo-600 font-semibold'
            : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {isHtml ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        <span className="text-[10px] tracking-wide font-medium">{secondTabName}</span>
      </button>
    </div>
  )
}
