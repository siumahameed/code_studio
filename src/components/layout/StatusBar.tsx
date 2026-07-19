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
    <div className={`panel-shell mt-auto flex flex-wrap items-center justify-between gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-[11px] select-none ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 sm:px-3 py-0.5 sm:py-1 ${isDark ? 'border-white/10 bg-white/3 text-slate-300' : 'border-slate-100 bg-white/90 text-slate-600'}`}>
          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-500" />
          <span className="hidden xs:inline">Saved</span>
          <span className="xs:hidden">OK</span>
        </span>
        <span className={`inline-flex items-center rounded-full border px-2 sm:px-3 py-0.5 sm:py-1 ${isDark ? 'border-white/10 bg-white/5 text-slate-300' : 'border-slate-100 bg-white text-slate-600'}`}>
          Ln {cursor.line}:{cursor.column}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className={`hidden xs:inline-flex items-center rounded-full border px-2 sm:px-3 py-0.5 sm:py-1 ${isDark ? 'border-white/10 bg-white/3 text-slate-300' : 'border-slate-100 bg-white/90 text-slate-600'}`}>
          {stats.lines} lines
        </span>
        <span className={`hidden sm:inline-flex items-center rounded-full border px-2 sm:px-3 py-0.5 sm:py-1 ${isDark ? 'border-white/10 bg-white/5 text-slate-300' : 'border-slate-100 bg-white text-slate-600'}`}>
          {stats.chars} chars
        </span>
        <span className={`inline-flex items-center rounded-full border px-2 sm:px-3 py-0.5 sm:py-1 font-semibold ${isDark ? 'border-brand-400/20 bg-brand-500/8 text-brand-300' : 'border-brand-50 bg-brand-50/50 text-brand-700'} ${langColors[state.language] || ''}`}>
          {state.language.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
