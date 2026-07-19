import { useAppContext } from '../../context/AppContext'

const STUDENT_GOALS = [
  { title: 'Class revision', description: 'Use short examples before exams.' },
  { title: 'Daily practice', description: 'Solve one small task each day.' },
  { title: 'Project building', description: 'Grow ideas step by step.' },
  { title: 'Code understanding', description: 'Learn by changing sample code.' },
]

const STUDY_TIPS = [
  'Start with one language and stay focused.',
  'Run code after each small change.',
  'Use lessons first, then try your own ideas.',
  'Practice a little every day instead of one long session.',
]

export default function WelcomeTips() {
  const { state } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className={`rounded-xl border overflow-hidden ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white'}`}>
        <div className="grid lg:grid-cols-[1fr_1fr]">
          <div className="p-5 sm:p-8">
            <h2 className={`text-lg sm:text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>How students use CodeStudio</h2>
            <p className={`mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              The site is arranged in small steps so learners can move through practice without confusion.
            </p>
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2">
              {['Plan', 'Code', 'Run', 'Review', 'Repeat'].map(item => (
                <span key={item} className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className={`border-t lg:border-t-0 lg:border-l p-5 sm:p-8 ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/30'}`}>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2">
              {STUDENT_GOALS.map(goal => (
                <div key={goal.title} className={`rounded-lg border px-4 sm:px-5 py-3 sm:py-4 ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-white'}`}>
                  <div className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{goal.title}</div>
                  <div className={`mt-1 text-xs leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{goal.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`rounded-xl border overflow-hidden ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white'}`}>
        <div className="grid lg:grid-cols-[1fr_1fr]">
          <div className="p-5 sm:p-8">
            <h2 className={`text-lg sm:text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Why it stays easy</h2>
            <p className={`mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Each part of the layout has one job only, so students can focus on coding instead of hunting for controls.
            </p>
          </div>
          <div className={`border-t lg:border-t-0 lg:border-l p-5 sm:p-8 ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/30'}`}>
            <div className="grid gap-3">
              {STUDY_TIPS.map((tip, index) => (
                <div key={tip} className={`flex items-start gap-3 sm:gap-4 rounded-lg border px-4 sm:px-5 py-3 sm:py-4 ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-white'}`}>
                  <span className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg text-[10px] sm:text-xs font-bold ${isDark ? 'bg-brand-500/15 text-brand-300' : 'bg-brand-50 text-brand-700'}`}>
                    {index + 1}
                  </span>
                  <div className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{tip}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
