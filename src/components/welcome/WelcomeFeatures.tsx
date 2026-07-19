import { useAppContext } from '../../context/AppContext'
import { LANGUAGES } from '../../utils/constants'
import type { Language } from '../../types'

const ACCENTS: Record<string, string> = {
  html: '#e34f26', python: '#3776ab', sql: '#e38c00', c: '#555555',
}

const DESCRIPTIONS: Record<string, string> = {
  html: 'Build and preview web pages with HTML, CSS, and JavaScript — see results instantly.',
  python: 'Write scripts, solve problems, and learn programming with a beginner-friendly language.',
  sql: 'Create tables, insert data, and query databases with structured query language.',
  c: 'Learn low-level programming with functions, loops, and memory concepts.',
}

export default function WelcomeFeatures() {
  const { state, setLanguage } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <section className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center py-12 sm:py-20">
      <div className="w-full max-w-2xl mx-auto px-2 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Features</h2>
          <p className={`mt-2 sm:mt-3 text-xs sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pick a language and start coding instantly.</p>
        </div>

        {/* Language cards */}
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {LANGUAGES.map((lang) => {
            const accent = ACCENTS[lang.id] || '#666'
            const desc = DESCRIPTIONS[lang.id] || ''
            return (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id as Language)}
                className={`group text-left rounded-xl border transition-all active:scale-[0.98] ${
                  isDark
                    ? 'border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                    : 'border-slate-200 bg-white hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                <div className="p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
                  <div
                    className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl text-xl sm:text-2xl transition-transform group-hover:scale-110"
                    style={{ background: `${accent}15` }}
                  >
                    {lang.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{lang.label}</div>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{lang.extension}</span>
                    </div>
                    <div className={`mt-1 text-xs leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</div>
                    <div className="mt-2 sm:mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-all group-hover:gap-2.5" style={{ color: accent }}>
                      Start coding
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
