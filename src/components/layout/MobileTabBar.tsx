import { useAppContext } from '../../context/AppContext'

export default function MobileTabBar({ onRun, isRunning }: { onRun: () => void; isRunning: boolean }) {
  const { state, setMobileTab } = useAppContext()
  const isDark = state.theme === 'dark'
  const isHtml = state.language === 'html'
  const secondTabId = isHtml ? 'preview' : 'console'
  const secondTabName = isHtml ? 'Preview' : 'Output'
  const activeTab = state.activeMobileTab

  const TabBtn = ({ active, children }: { active: boolean; children: React.ReactNode }) => (
    <div className={`flex flex-col items-center justify-center gap-1.5 w-16 py-2 rounded-xl transition active:scale-90 ${active ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>{children}</div>
  )

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-end justify-around px-4 pb-[env(safe-area-inset-bottom)] pt-3 ${isDark ? 'bg-slate-900/95 border-t border-slate-800' : 'bg-white/95 border-t border-slate-200/80'} backdrop-blur-xl`}>
      <button onClick={() => setMobileTab('editor')} className="flex flex-col items-center active:scale-90 transition">
        <TabBtn active={activeTab === 'editor'}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          <span className="text-[10px] font-bold">Code</span>
        </TabBtn>
      </button>

      <div className="flex flex-col items-center -mt-5">
        <button onClick={onRun} disabled={isRunning} aria-label="Run Code"
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl border-[3px] transition-all active:scale-90 ${isRunning ? 'bg-slate-500 border-white dark:border-slate-900' : 'bg-gradient-to-br from-indigo-500 to-violet-500 border-white dark:border-slate-900 animate-run-glow'}`}>
          {isRunning ? (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
            </span>
          ) : (
            <svg className="w-7 h-7 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <span className={`text-[9px] font-bold mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{isRunning ? 'Running' : 'Run'}</span>
      </div>

      <button onClick={() => setMobileTab(secondTabId)} className="flex flex-col items-center active:scale-90 transition">
        <TabBtn active={activeTab === secondTabId}>
          {isHtml ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          )}
          <span className="text-[10px] font-bold">{secondTabName}</span>
        </TabBtn>
      </button>
    </div>
  )
}
