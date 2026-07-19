import { useMemo, useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { countWords, countLines, countChars } from '../../utils/helpers'
import { Check } from '../icons'

export default function StatusBar() {
  const { state } = useAppContext()
  const isDark = state.theme === 'dark'
  const [cursor, setCursor] = useState({ line: 1, column: 1 })

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ line: number; column: number }>).detail
      if (detail) setCursor(detail)
    }
    window.addEventListener('codestudio-cursor-change', handler)
    return () => window.removeEventListener('codestudio-cursor-change', handler)
  }, [])

  const stats = useMemo(() => ({
    words: countWords(state.code),
    lines: countLines(state.code),
    chars: countChars(state.code)
  }), [state.code])

  const langColors: Record<string, string> = {
    html: 'text-orange-500', python: 'text-blue-500', sql: 'text-amber-500', c: 'text-slate-500',
  }

  return (
    <div className={`panel-shell mt-auto flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-[11px] select-none ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 ${isDark ? 'border-white/10 bg-white/3 text-slate-300' : 'border-slate-100 bg-white/90 text-slate-600'}`}>
          <Check className="w-3 h-3 text-brand-500" />
          Saved
        </span>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 ${isDark ? 'border-white/10 bg-white/5 text-slate-300' : 'border-slate-100 bg-white text-slate-600'}`}>
          Ln {cursor.line}, Col {cursor.column}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`hidden sm:inline-flex items-center rounded-full border px-3 py-1 ${isDark ? 'border-white/10 bg-white/3 text-slate-300' : 'border-slate-100 bg-white/90 text-slate-600'}`}>
          {stats.lines} lines
        </span>
        <span className={`hidden md:inline-flex items-center rounded-full border px-3 py-1 ${isDark ? 'border-white/10 bg-white/5 text-slate-300' : 'border-slate-100 bg-white text-slate-600'}`}>
          {stats.chars} chars
        </span>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 font-semibold ${isDark ? 'border-brand-400/20 bg-brand-500/8 text-brand-300' : 'border-brand-50 bg-brand-50/50 text-brand-700'} ${langColors[state.language] || ''}`}>
          {state.language.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
