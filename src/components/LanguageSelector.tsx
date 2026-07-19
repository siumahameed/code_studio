import { useAppContext } from '../context/AppContext'
import { LANGUAGES } from '../utils/constants'

export default function LanguageSelector() {
  const { state, setLanguage } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <div className="flex items-center">
      {LANGUAGES.map((lang) => {
        const isActive = state.language === lang.id

        return (
          <button key={lang.id} onClick={() => setLanguage(lang.id)}
            className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-all active:scale-[0.97] ${isActive
              ? isDark ? 'text-white bg-[#2c2e33]' : 'text-white bg-brand-600'
              : isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-[#2c2e33]/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            aria-pressed={isActive}
            aria-label={lang.label}>
            <span className="text-base">{lang.icon}</span>
            <span className="hidden sm:inline">{lang.label}</span>
            {isActive && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? 'bg-brand-400' : 'bg-white'}`} />
            )}
          </button>
        )
      })}
    </div>
  )
}
