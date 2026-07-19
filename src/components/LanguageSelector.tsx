import { useState, useRef, useEffect, useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { LANGUAGES } from '../utils/constants'
import { ChevronDown, Search } from './icons'

export default function LanguageSelector() {
  const { state, setLanguage } = useAppContext()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isDark = state.theme === 'dark'

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = LANGUAGES.find(l => l.id === state.language)!

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return LANGUAGES
    return LANGUAGES.filter(l =>
      l.label.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q) ||
      (l.tagline || '').toLowerCase().includes(q)
    )
  }, [query])

  useEffect(() => {
    if (open) {
      setActiveIndex(filtered.findIndex(l => l.id === state.language))
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setActiveIndex(null)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') { setOpen(false); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => i === null ? 0 : Math.min(filtered.length - 1, i + 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => i === null ? 0 : Math.max(0, i - 1)) }
      if (e.key === 'Enter' && activeIndex !== null) {
        const lang = filtered[activeIndex]
        if (lang) { setLanguage(lang.id); setOpen(false) }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, activeIndex, setLanguage])

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`inline-flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all min-w-[140px] active:scale-[0.98] ${isDark ? 'border-white/10 bg-white/[0.04] text-slate-100 hover:border-white/20' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
      >
        <span className="flex items-center gap-2">
          <span>{current.icon}</span>
          <span>{current.label}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute top-full left-0 mt-1.5 w-56 sm:w-64 rounded-lg border shadow-xl overflow-hidden z-50 ${isDark ? 'bg-[#1a1b1e] border-white/10' : 'bg-white border-slate-200'}`}>
          <div className={`p-2 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
            <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'}`}>
              <Search className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 min-w-0"
              />
            </div>
          </div>
          <div className="p-1.5 max-h-60 overflow-y-auto">
            {filtered.map((lang, idx) => {
              const isActive = state.language === lang.id
              const isFocused = idx === activeIndex
              return (
                <button
                  key={lang.id}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => { setLanguage(lang.id); setOpen(false) }}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-left text-xs sm:text-sm transition-all active:scale-[0.98] ${
                    isActive
                      ? isDark ? 'bg-brand-500/15 text-brand-300' : 'bg-brand-50 text-brand-700'
                      : isFocused
                        ? isDark ? 'bg-white/5' : 'bg-slate-50'
                        : ''
                  } ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span className="text-base sm:text-lg">{lang.icon}</span>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{lang.label}</div>
                    <div className={`text-[10px] sm:text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lang.tagline}</div>
                  </div>
                  {isActive && <span className={`ml-auto w-1.5 h-1.5 shrink-0 rounded-full ${isDark ? 'bg-brand-400' : 'bg-brand-500'}`} />}
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div className={`px-3 py-4 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No languages found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
