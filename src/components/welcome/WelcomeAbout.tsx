import { useAppContext } from '../../context/AppContext'

const INFO = [
  { icon: '👤', label: 'Developer', value: 'Sium Ahameed Bhuyan' },
  { icon: '💻', label: 'Platform', value: 'Desktop & Mobile' },
  { icon: '🎯', label: 'Purpose', value: 'HSC ICT practice' },
  { icon: '⚡', label: 'Setup', value: 'None required' },
]

const LANGUAGES = [
  { id: 'html', icon: '🌐', name: 'HTML', desc: 'Build web pages with markup and styling' },
  { id: 'python', icon: '🐍', name: 'Python', desc: 'Write scripts with a simple syntax' },
  { id: 'sql', icon: '🗄️', name: 'SQL', desc: 'Query and manage structured data' },
  { id: 'c', icon: '⚙️', name: 'C', desc: 'Learn low-level programming fundamentals' },
]

export default function WelcomeAbout() {
  const { state, setShowWelcome } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <section className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center py-12 sm:py-20">
      <div className="w-full max-w-2xl mx-auto px-2 space-y-6 sm:space-y-8">
        {/* Hero card */}
        <div className={`rounded-xl border p-6 sm:p-10 text-center ${isDark ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-white'}`}>
          <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-4 sm:mb-5 ${isDark ? 'bg-brand-500/10' : 'bg-brand-50'}`}>
            <span className="text-xl sm:text-2xl">✦</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>About CodeStudio</h2>
          <p className={`mt-3 sm:mt-4 text-xs sm:text-base leading-relaxed max-w-lg mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            A browser-based coding workspace built for HSC ICT students. Write and run HTML, Python, SQL, and C directly in your browser — no installation, no accounts, no distractions.
          </p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
          {INFO.map(item => (
            <div key={item.label} className={`flex items-center gap-3 sm:gap-4 rounded-xl border px-4 sm:px-5 py-3 sm:py-4 ${isDark ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-white'}`}>
              <span className="text-lg sm:text-xl shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <div className={`text-[10px] sm:text-xs font-medium tracking-wider uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</div>
                <div className={`mt-0.5 text-xs sm:text-sm font-semibold truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Languages card */}
        <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-white'}`}>
          <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Supported languages</h3>
            <p className={`mt-0.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Run code in four languages from a single workspace</p>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2">
            {LANGUAGES.map((lang, i) => (
              <div
                key={lang.id}
                className={`flex items-start gap-3 px-4 sm:px-6 py-3 sm:py-4 ${
                  i < 2 ? `border-b ${isDark ? 'border-white/5' : 'border-slate-100'}` : ''
                } ${i === 0 || i === 2 ? 'xs:border-r xs:border-b-0' : ''} ${isDark ? 'xs:border-white/5' : 'xs:border-slate-100'}`}
              >
                <span className="text-base sm:text-lg shrink-0 mt-0.5">{lang.icon}</span>
                <div className="min-w-0">
                  <div className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{lang.name}</div>
                  <div className={`mt-0.5 text-xs leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lang.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`rounded-xl border p-6 sm:p-8 text-center ${isDark ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-white'}`}>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Start coding now — no sign-up needed.
          </p>
          <button
            onClick={() => setShowWelcome(false)}
            className="group relative overflow-hidden mt-4 sm:mt-5 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-6 sm:px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/30 active:scale-[0.98]"
          >
            <span className="relative z-10">Open IDE</span>
            <span className="absolute inset-0 -translate-x-full rounded-lg bg-gradient-to-r from-brand-500 to-brand-400 transition-transform duration-300 group-hover:translate-x-0" />
          </button>
        </div>
      </div>
    </section>
  )
}
