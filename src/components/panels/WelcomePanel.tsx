import { useAppContext } from '../../context/AppContext'
import { LANGUAGES, LESSONS } from '../../utils/constants'

export default function WelcomePanel() {
  const { state, setLanguage, loadLesson } = useAppContext()
  const isDark = state.theme === 'dark'

  const languageColors = {
    html: { light: '#ea580c', dark: '#fb923c', glow: 'rgba(251,146,60,0.15)' },
    python: { light: '#0284c7', dark: '#38bdf8', glow: 'rgba(56,189,248,0.15)' },
    sql: { light: '#ca8a04', dark: '#eab308', glow: 'rgba(234,179,8,0.15)' },
    c: { light: '#059669', dark: '#34d399', glow: 'rgba(52,211,153,0.15)' },
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full ${isDark ? 'bg-indigo-500/8' : 'bg-indigo-400/6'} blur-3xl animate-float`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${isDark ? 'bg-violet-500/8' : 'bg-violet-400/6'} blur-3xl animate-float-delayed`} />
        <div className={`absolute top-1/3 left-1/4 w-64 h-64 rounded-full ${isDark ? 'bg-emerald-500/5' : 'bg-emerald-400/4'} blur-3xl animate-float-slow`} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-8 pb-20 md:pb-10 pt-8 md:pt-20">

        <div className="animate-pop text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border text-xs font-semibold tracking-wide"
            style={{ borderColor: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)', backgroundColor: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)', color: isDark ? '#a5b4fc' : '#6366f1' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Multi-Language Online IDE
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
              Code, Learn, Build
            </span>
            <br />
            <span className={isDark ? 'text-white' : 'text-slate-900'}>Right in Your Browser</span>
          </h1>

          <p className={`text-sm sm:text-base md:text-lg max-w-xl mt-5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Pick a language, try a guided lesson, or jump straight into code.
            <span className="hidden sm:inline"><br /></span>
            No installs, no setup. Everything runs right here.
          </p>

          <div className="flex items-center gap-3 mt-3">
            <div className={`flex -space-x-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className="inline-flex w-8 h-8 rounded-full items-center justify-center text-xs font-bold border-2 border-slate-800 dark:border-slate-900 bg-orange-100 dark:bg-orange-500/20">🌐</span>
              <span className="inline-flex w-8 h-8 rounded-full items-center justify-center text-xs font-bold border-2 border-slate-800 dark:border-slate-900 bg-sky-100 dark:bg-sky-500/20">🐍</span>
              <span className="inline-flex w-8 h-8 rounded-full items-center justify-center text-xs font-bold border-2 border-slate-800 dark:border-slate-900 bg-amber-100 dark:bg-amber-500/20">🗄️</span>
              <span className="inline-flex w-8 h-8 rounded-full items-center justify-center text-xs font-bold border-2 border-slate-800 dark:border-slate-900 bg-emerald-100 dark:bg-emerald-500/20">⚙️</span>
            </div>
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>HTML · Python · SQL · C</span>
          </div>
        </div>

        <div className="mt-16 md:mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-8 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500`} />
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Languages</h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Choose your language to start coding</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
            {LANGUAGES.map((lang, i) => {
              const colors = languageColors[lang.id as keyof typeof languageColors]
              const accent = isDark ? colors.dark : colors.light
              return (
                <button key={lang.id} onClick={() => setLanguage(lang.id)}
                  className={`animate-pop group relative flex flex-col items-center gap-3 p-5 md:p-6 rounded-2xl border-2 text-center transition-all duration-300 active:scale-[0.97] ${isDark
                    ? 'bg-slate-800/40 border-slate-700/50 hover:border-indigo-500/40'
                    : 'bg-white/70 border-slate-200/80 hover:border-indigo-300'}`}
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className={`w-11 h-11 md:w-13 md:h-13 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-sm group-hover:scale-110 transition-all duration-300`}
                    style={{ background: isDark ? `${accent}20` : `${accent}15` }}>
                    {lang.icon}
                  </div>
                  <div className="min-w-0 w-full">
                    <div className={`font-extrabold text-base md:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{lang.label}</div>
                    <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lang.tagline}</div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 2px ${accent}40`, background: `linear-gradient(135deg, ${accent}08, transparent)` }} />
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-14 md:mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-8 w-1 rounded-full bg-gradient-to-b from-violet-500 to-emerald-500`} />
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Quick Start Lessons</h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Try a pre-built example to see how it works</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {LESSONS.map((lesson, i) => {
              const colors = languageColors[lesson.language as keyof typeof languageColors]
              const accent = isDark ? colors.dark : colors.light
              return (
                <button key={lesson.id} onClick={() => loadLesson(lesson.language, lesson.code)}
                  className={`animate-pop group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border text-left transition-all duration-200 active:scale-[0.98] ${isDark
                    ? 'bg-slate-800/30 border-slate-700/40 hover:bg-slate-800/60 hover:border-indigo-500/40'
                    : 'bg-white/50 border-slate-200/70 hover:bg-white hover:border-indigo-300 hover:shadow-md'}`}
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-base md:text-xl flex-shrink-0 shadow-sm group-hover:scale-110 transition-all duration-200`}
                    style={{ background: isDark ? `${accent}20` : `${accent}12` }}>
                    {lesson.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm md:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{lesson.title}</div>
                    <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lesson.description}</div>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5 ${isDark ? 'bg-slate-700/50 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className={`mt-14 md:mt-20 text-center text-xs pb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          Built with care for curious learners · Your code saves automatically
        </div>
      </div>
    </div>
  )
}
