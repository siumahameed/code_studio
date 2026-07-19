import { useAppContext } from '../../context/AppContext'

export default function MobileTabBar({ onRun, isRunning }: { onRun: () => void; isRunning: boolean }) {
  const { state, setMobileTab } = useAppContext()
  const isDark = state.theme === 'dark'
  const isHtml = state.language === 'html'
  const secondTabId = isHtml ? 'preview' : 'console'
  const secondTabName = isHtml ? 'Preview' : 'Output'
  const activeTab = state.activeMobileTab

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-4 pb-[env(safe-area-inset-bottom)] pt-2 ${isDark ? 'bg-[#25262b]/95 border-t border-[#373a40]' : 'bg-white/95 border-t border-slate-200'} backdrop-blur-xl`}>
      <button onClick={() => setMobileTab('editor')} className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-lg transition active:scale-90 ${activeTab === 'editor' ? (isDark ? 'text-brand-400' : 'text-brand-600') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <span className="text-[10px] font-semibold">Code</span>
      </button>

      <button onClick={onRun} disabled={isRunning} aria-label="Run Code"
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white border-[3px] transition-all active:scale-90 -mt-3 ${isRunning ? 'bg-slate-500 border-white dark:border-[#25262b]' : 'bg-brand-600 border-white dark:border-[#25262b] shadow-lg shadow-brand-600/30'}`}>
        {isRunning ? (
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 rounded-full bg-white animate-bounce" />
          </span>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>

      <button onClick={() => setMobileTab(secondTabId)} className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-lg transition active:scale-90 ${activeTab === secondTabId ? (isDark ? 'text-brand-400' : 'text-brand-600') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
        {isHtml ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        <span className="text-[10px] font-semibold">{secondTabName}</span>
      </button>
    </div>
  )
}
