import { useState, useRef, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { LANGUAGES } from '../utils/constants'

export default function LanguageSelector() {
  const { state, setLanguage } = useAppContext()
  const isDark = state.theme === 'dark'
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = LANGUAGES.find(l => l.id === state.language)!

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${isDark ? 'text-slate-200 hover:bg-[#2c2e33]' : 'text-slate-700 hover:bg-slate-100'}`}>
        <span className="text-base">{current.icon}</span>
        <span>{current.label}</span>
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''} ${isDark ? 'text-slate-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`absolute top-full left-0 mt-1 w-40 rounded-lg border shadow-lg overflow-hidden z-50 animate-fade-in ${isDark ? 'bg-[#2c2e33] border-[#373a40]' : 'bg-white border-slate-200'}`}>
          {LANGUAGES.map((lang) => {
            const isActive = state.language === lang.id
            return (
              <button key={lang.id} onClick={() => { setLanguage(lang.id); setOpen(false) }}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-left transition-colors ${isActive
                  ? isDark ? 'bg-brand-500/20 text-brand-300' : 'bg-brand-50 text-brand-700'
                  : isDark ? 'text-slate-300 hover:bg-[#373a40]' : 'text-slate-700 hover:bg-slate-50'}`}>
                <span className="text-base">{lang.icon}</span>
                <span className="font-medium">{lang.label}</span>
                {isActive && <span className="ml-auto text-brand-500">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
