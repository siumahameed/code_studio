import { useAppContext } from '../../context/AppContext'

const FEATURES = [
  { id: 'html', icon: '🌐', label: 'HTML', accent: '#e34f26' },
  { id: 'python', icon: '🐍', label: 'Python', accent: '#3776ab' },
  { id: 'sql', icon: '🗄️', label: 'SQL', accent: '#e38c00' },
  { id: 'c', icon: '⚙️', label: 'C', accent: '#555555' },
]

export default function WelcomeFeatures() {
  const { state, setLanguage } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <section>
      <div className="max-w-lg mb-10">
        <h2 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Features</h2>
        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pick a language and start coding instantly.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FEATURES.map((f) => (
          <button
            key={f.id}
            onClick={() => setLanguage(f.id as any)}
            className={`group rounded-xl border text-center transition-all active:scale-[0.98] ${
              isDark
                ? 'border-white/8 bg-white/[0.02] hover:border-brand-400/30'
                : 'border-slate-200 bg-white hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-center" style={{ color: f.accent }}>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl text-3xl transition-transform group-hover:scale-110" style={{ background: `${f.accent}12` }}>
                  {f.icon}
                </div>
              </div>
              <div className={`mt-4 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{f.label}</div>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3" style={{ color: f.accent }}>
                Start coding
                <span className="text-base">→</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
