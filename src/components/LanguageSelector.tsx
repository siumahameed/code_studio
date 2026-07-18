import { useAppContext } from '../context/AppContext'
import { LANGUAGES } from '../utils/constants'

export default function LanguageSelector() {
  const { state, setLanguage } = useAppContext()
  const isDark = state.theme === 'dark'

  const accentColors = {
    html: { light: '#ea580c', dark: '#fb923c' },
    python: { light: '#0284c7', dark: '#38bdf8' },
    sql: { light: '#ca8a04', dark: '#eab308' },
    c: { light: '#059669', dark: '#34d399' },
  } as const

  return (
    <div className="flex items-center gap-1.5 p-0.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
      {LANGUAGES.map((lang) => {
        const isActive = state.language === lang.id
        const accent = isDark ? accentColors[lang.id].dark : accentColors[lang.id].light

        return (
          <button key={lang.id} onClick={() => setLanguage(lang.id)}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap active:scale-[0.97] ${isActive ? 'text-white shadow-lg' : isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
            style={{
              backgroundColor: isActive ? accent : 'transparent',
              transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
            }}
            aria-pressed={isActive}
            aria-label={lang.label}>
            <span className="text-base">{lang.icon}</span>
            <span className="hidden sm:inline">{lang.label}</span>
            {isActive && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/30" />}
          </button>
        )
      })}
    </div>
  )
}