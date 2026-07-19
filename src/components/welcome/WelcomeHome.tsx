import { useAppContext } from '../../context/AppContext'
import { Play, ArrowRight } from '../../components/icons'

export default function WelcomeHome({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { state, setShowWelcome } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <section className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-5">
        <div className={`w-full rounded-xl border p-6 sm:p-10 text-center ${isDark ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-white'}`}>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${isDark ? 'bg-brand-500/10 text-brand-300' : 'bg-brand-50 text-brand-700'}`}>
            HSC ICT Practice Workspace
          </span>

          <h1 className={`mt-5 sm:mt-6 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] sm:leading-[1.05] ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Practice coding.<br />Right in your browser.
          </h1>

          <p className={`mt-4 sm:mt-5 text-xs sm:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            A clean, focused workspace for HSC ICT students. Write HTML, Python, SQL, and C — no setup, no distractions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowWelcome(false)}
            className="group relative inline-flex w-full sm:w-auto items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/30 active:scale-[0.98]"
          >
            <span className="relative z-10 inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-sm">
              <Play className="h-4 w-4 shrink-0" />
              Open IDE
            </span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full rounded-lg bg-gradient-to-r from-brand-500 to-brand-400 transition-transform duration-300 group-hover:translate-x-0" />
          </button>
          <button
            onClick={() => onNavigate('languages')}
            className={`group relative inline-flex w-full sm:w-auto items-center justify-center rounded-lg border text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
              isDark
                ? 'border-white/15 text-slate-200 hover:border-brand-400 hover:text-brand-300 hover:bg-white/[0.03] hover:shadow-lg hover:shadow-brand-500/10'
                : 'border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50/60 hover:shadow-lg hover:shadow-brand-500/10'
            }`}
          >
            <span className="relative z-10 inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-sm">
              View features
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
