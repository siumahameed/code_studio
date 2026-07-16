import { useAppContext } from '../context/AppContext'
import { LANGUAGES } from '../utils/constants'

const accentColors: Record<string, { bg: string; text: string; border: string }> = {
  html: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/20',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/20 dark:border-orange-500/30'
  },
  python: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20 dark:border-blue-500/30'
  },
  sql: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20 dark:border-amber-500/30'
  },
  c: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20 dark:border-emerald-500/30'
  },
}

export default function LanguageDropdown() {
  const { state, setLanguage } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <div className={`flex items-center rounded-2xl p-1 border transition-all duration-300 ${
      isDark
        ? 'bg-[#15152a]/60 border-white/[0.06]'
        : 'bg-slate-100 border-slate-250/60 shadow-sm shadow-slate-100/50'
    }`}>
      {LANGUAGES.map((lang) => {
        const isActive = state.language === lang.id
        const accent = accentColors[lang.id]
        
        return (
          <button
            key={lang.id}
            onClick={() => setLanguage(lang.id)}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
              isActive
                ? `${accent.bg} ${accent.text} ${accent.border} border shadow-sm`
                : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/[0.02] border-transparent'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/[0.6] border-transparent'
            } border`}
          >
            <span className="text-sm sm:text-base flex-shrink-0">{lang.icon}</span>
            <span className="hidden min-[380px]:inline truncate">{lang.label}</span>
          </button>
        )
      })}
    </div>
  )
}
