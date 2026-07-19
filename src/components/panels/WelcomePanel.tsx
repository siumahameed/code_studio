import { useAppContext } from '../../context/AppContext'
import { LANGUAGES, LESSONS } from '../../utils/constants'

export default function WelcomePanel() {
  const { state, setLanguage, loadLesson } = useAppContext()
  const isDark = state.theme === 'dark'

  const langAccents: Record<string, string> = {
    html: '#e34f26', python: '#3776ab', sql: '#e38c00', c: '#555555',
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-20 md:pb-10 pt-6 md:pt-12">

        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <span className={isDark ? 'text-white' : 'text-slate-900'}>Learn to Code</span>
            <br />
            <span className="text-brand-500">Free. Easy. Fun.</span>
          </h1>
          <p className={`text-sm sm:text-base md:text-lg max-w-xl mx-auto mt-4 leading-relaxed px-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            A free online code editor. No downloads, no setup &mdash; just code.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-12 md:mb-16">
          {LANGUAGES.map((lang, i) => {
            const accent = langAccents[lang.id]
            return (
              <button key={lang.id} onClick={() => setLanguage(lang.id)}
                className={`animate-pop group flex flex-col rounded-xl border-2 text-center transition-all duration-200 active:scale-[0.97] overflow-hidden ${isDark ? 'bg-[#25262b] border-[#373a40] hover:border-brand-500/60' : 'bg-white border-slate-200 hover:border-brand-500/60 hover:shadow-lg'}`}
                style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="flex flex-col items-center gap-3 pt-6 pb-3 px-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-200"
                    style={{ background: `${accent}18` }}>
                    {lang.icon}
                  </div>
                  <div>
                    <div className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{lang.label}</div>
                    <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lang.tagline}</div>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <span className="inline-flex items-center justify-center gap-1 w-full py-2.5 text-sm font-bold rounded-lg text-white transition-colors"
                    style={{ backgroundColor: accent }}>
                    Try it Yourself <span style={{ fontSize: '1.1em' }}>»</span>
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <div className={`rounded-xl border overflow-hidden animate-slide-up ${isDark ? 'bg-[#25262b] border-[#373a40]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className={`px-5 py-3 border-b ${isDark ? 'border-[#373a40]' : 'border-slate-100'}`}>
            <h2 className={`font-bold text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Code Example</h2>
          </div>
          <div className="p-5">
            <pre className={`font-mono text-sm leading-relaxed overflow-x-auto ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <code>
                <span className="text-brand-500">print</span>(<span className={isDark ? 'text-amber-300' : 'text-amber-600'}>"Hello, World!"</span>)
                {'\n'}
                <span className={isDark ? 'text-slate-500' : 'text-slate-400'}># Welcome to CodeStudio</span>
                {'\n'}
                {'\n'}
                name = <span className={isDark ? 'text-amber-300' : 'text-amber-600'}>"Alice"</span>
                {'\n'}
                <span className="text-brand-500">print</span>(<span className={isDark ? 'text-amber-300' : 'text-amber-600'}>f"Hello {name}!"</span>)
              </code>
            </pre>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-brand-500" />
            <div>
              <h2 className={`font-bold text-base ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Quick Start Lessons</h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Try a pre-built example to see how it works</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {LESSONS.map((lesson, i) => {
              const accent = langAccents[lesson.language]
              return (
                <button key={lesson.id} onClick={() => loadLesson(lesson.language, lesson.code)}
                  className={`animate-pop group flex items-center gap-4 p-4 md:p-5 rounded-xl border-2 text-left transition-all duration-200 active:scale-[0.98] ${isDark ? 'bg-[#25262b] border-[#373a40] hover:border-brand-500/50' : 'bg-white border-slate-200 hover:border-brand-500/50 hover:shadow-md'}`}
                  style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-200"
                    style={{ background: `${accent}18` }}>
                    {lesson.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm md:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{lesson.title}</div>
                    <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lesson.description}</div>
                    <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-semibold rounded-full ${isDark ? 'bg-brand-500/15 text-brand-300' : 'bg-brand-50 text-brand-700'}`}>
                      {lesson.language.toUpperCase()}
                    </span>
                  </div>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all duration-200 group-hover:translate-x-0.5 ${isDark ? 'bg-[#2c2e33] text-slate-400 group-hover:bg-brand-500/20 group-hover:text-brand-400' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600'}`}>»</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={`mt-12 text-center text-xs pb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          Built with care for curious learners &middot; Your code saves automatically
        </div>
      </div>
    </div>
  )
}
