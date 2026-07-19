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
        <div className="text-center mb-10 md:mb-14 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            <span className={isDark ? 'text-white' : 'text-slate-900'}>Learn to Code</span>
            <br />
            <span className="text-brand-500">Free. Easy. Fun.</span>
          </h1>
          <p className={`text-sm sm:text-base max-w-xl mx-auto mt-3 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            CodeStudio is a free online code editor that helps you learn programming.<br />
            No downloads, no setup — just code.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-14">
          {LANGUAGES.map((lang, i) => {
            const accent = langAccents[lang.id]
            return (
              <button key={lang.id} onClick={() => setLanguage(lang.id)}
                className={`animate-pop group relative flex flex-col items-center gap-3 p-5 md:p-6 rounded-xl border-2 text-center transition-all duration-200 active:scale-[0.97] ${isDark ? 'bg-[#25262b] border-[#373a40] hover:border-brand-500/50' : 'bg-white border-slate-200 hover:border-brand-500/50 hover:shadow-md'}`}
                style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-200"
                  style={{ background: `${accent}15` }}>
                  {lang.icon}
                </div>
                <div className="min-w-0 w-full">
                  <div className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{lang.label}</div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lang.tagline}</div>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-brand-500 text-white group-hover:bg-brand-400 transition-colors">
                  Try it Yourself <span className="text-sm">›</span>
                </span>
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

        <div className="mt-10 md:mt-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 rounded-full bg-brand-500" />
            <div>
              <h2 className={`font-bold text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Quick Start Lessons</h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Try a pre-built example</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {LESSONS.map((lesson, i) => (
              <button key={lesson.id} onClick={() => loadLesson(lesson.language, lesson.code)}
                className={`animate-pop group flex items-center gap-3 p-3 md:p-4 rounded-xl border text-left transition-all duration-200 active:scale-[0.98] ${isDark ? 'bg-[#25262b] border-[#373a40] hover:bg-[#2c2e33] hover:border-brand-500/40' : 'bg-white border-slate-200 hover:border-brand-500/40 hover:shadow-sm'}`}
                style={{ animationDelay: `${i * 0.06}s` }}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${isDark ? 'bg-[#2c2e33]' : 'bg-slate-100'}`}>
                  {lesson.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{lesson.title}</div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lesson.description}</div>
                </div>
                <span className="text-brand-500 text-lg group-hover:translate-x-0.5 transition-transform">›</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-12 text-center text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          Built with care for curious learners · Your code saves automatically
        </div>
      </div>
    </div>
  )
}
