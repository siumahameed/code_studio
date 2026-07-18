import { useAppContext } from '../../context/AppContext'
import { LANGUAGES, LESSONS } from '../../utils/constants'

export default function WelcomePanel() {
  const { state, setLanguage, loadLesson } = useAppContext()
  const isDark = state.theme === 'dark'

  const delays = ['', 'delay-1', 'delay-2', 'delay-3', 'delay-4']

  const languageColors = {
    html: { light: '#ea580c', dark: '#fb923c', bgLight: '#fff7ed', bgDark: '#7c2d12' },
    python: { light: '#0284c7', dark: '#38bdf8', bgLight: '#f0f9ff', bgDark: '#0c4a6e' },
    sql: { light: '#ca8a04', dark: '#eab308', bgLight: '#fefce8', bgDark: '#713f12' },
    c: { light: '#059669', dark: '#34d399', bgLight: '#ecfdf5', bgDark: '#064e3b' },
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 sm:px-6 pb-16 md:pb-8">
      <div className="max-w-3xl w-full mx-auto flex flex-col gap-8 pt-6 md:pt-12">

        <div className="animate-pop text-center flex flex-col items-center gap-4 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-3xl shadow-xl shadow-indigo-500/30 animate-bounce-gentle select-none flex-shrink-0">💻</div>
          <h1 className={`text-3xl md:text-5xl font-extrabold tracking-tight break-words max-w-full ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Welcome to CodeStudio
          </h1>
          <p className={`text-base md:text-lg max-w-md break-words ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            Pick a language, try a lesson, or jump straight into code. No installs needed — everything runs right here.
          </p>
        </div>

        <section className={`animate-pop ${delays[1]}`}>
          <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>What do you want to learn?</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {LANGUAGES.map((lang, i) => {
              const colors = languageColors[lang.id as keyof typeof languageColors]
              const accent = isDark ? colors.dark : colors.light
              const bgColor = isDark ? colors.bgDark : colors.bgLight
              return (
                <button key={lang.id} onClick={() => setLanguage(lang.id)}
                  className={`${delays[Math.min(i + 1, 4)]} relative group flex flex-col items-center gap-4 p-5 rounded-3xl border-2 text-center transition-all active:scale-[0.97] ${isDark
                    ? `bg-slate-800/60 border-slate-700/50 hover:border-indigo-500/50`
                    : `bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow-lg shadow-sm`}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform flex-shrink-0`} style={{ background: bgColor }}>
                    {lang.icon}
                  </div>
                  <div className="min-w-0 max-w-full">
                    <div className={`font-extrabold text-lg truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{lang.label}</div>
                    <div className={`text-xs mt-1 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{lang.tagline}</div>
                  </div>
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: `linear-gradient(135deg, ${accent}15, ${accent}05)` }} />
                </button>
              )
            })}
          </div>
        </section>

        <section className={`animate-pop ${delays[2]}`}>
          <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Quick start lessons</h2>
          <div className="flex flex-col gap-2.5">
            {LESSONS.map((lesson, i) => {
              const colors = languageColors[lesson.language as keyof typeof languageColors]
              const bgColor = isDark ? colors.bgDark : colors.bgLight
              return (
                <button key={lesson.id} onClick={() => loadLesson(lesson.language, lesson.code)}
                  className={`${delays[Math.min(i + 1, 4)]} flex items-center gap-4 p-4 rounded-2xl border text-left transition-all active:scale-[0.98] group ${isDark
                    ? 'bg-slate-800/60 border-slate-700/50 hover:border-indigo-500/50'
                    : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow-md shadow-sm'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`} style={{ background: bgColor }}>
                    {lesson.icon}
                  </div>
                  <div className="flex-1 min-w-0 max-w-full">
                    <div className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{lesson.title}</div>
                    <div className={`text-xs mt-1 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{lesson.description}</div>
                  </div>
                  <svg className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1 ${isDark ? 'text-slate-500' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              )
            })}
          </div>
        </section>

        <div className={`text-center text-xs pb-4 pt-2 break-words ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Built with care for curious learners · Your code saves automatically</div>
      </div>
    </div>
  )
}
