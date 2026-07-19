import { useAppContext } from '../../context/AppContext'
import { LESSONS } from '../../utils/constants'

const ACCENTS: Record<string, string> = {
  html: '#e34f26', python: '#3776ab', sql: '#e38c00', c: '#555555',
}

export default function WelcomeLessons() {
  const { state, loadLesson } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <section>
      <div className="max-w-lg mb-10">
        <h2 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Starter lessons</h2>
        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Open a ready-made example and begin practicing right away.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {LESSONS.map((lesson) => {
          const accent = ACCENTS[lesson.language]
          return (
            <button
              key={lesson.id}
              onClick={() => loadLesson(lesson.language, lesson.code)}
              className={`group flex items-center gap-4 rounded-xl border p-5 text-left transition-all active:scale-[0.98] ${isDark ? 'border-white/8 bg-white/[0.02] hover:border-brand-400/30' : 'border-slate-200 bg-white hover:border-brand-400/40 hover:shadow-lg hover:-translate-y-0.5'}`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl transition-transform group-hover:scale-110" style={{ background: `${accent}15` }}>
                {lesson.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{lesson.title}</div>
                <div className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{lesson.description}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${isDark ? 'bg-brand-500/10 text-brand-300' : 'bg-brand-50 text-brand-700'}`}>{lesson.language.toUpperCase()}</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Ready to run</span>
                </div>
              </div>
              <span className={`shrink-0 text-lg transition-transform group-hover:translate-x-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>→</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
