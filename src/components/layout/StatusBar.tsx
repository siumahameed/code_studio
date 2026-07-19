import { useMemo, useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { countWords, countLines, countChars } from '../../utils/helpers'

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

  const stats = useMemo(() => ({ words: countWords(state.code), lines: countLines(state.code), chars: countChars(state.code) }), [state.code])

  const langColors: Record<string, string> = {
    html: 'text-orange-500', python: 'text-blue-500', sql: 'text-amber-500', c: 'text-slate-500',
  }

  return (
    <div className={`flex items-center justify-between px-3 py-1 text-xs select-none ${isDark ? 'bg-[#1a1b1e] text-slate-500 border-t border-[#373a40]' : 'bg-slate-100 text-slate-400 border-t border-slate-200'}`}>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          Saved
        </span>
        <span>Ln {cursor.line}, Col {cursor.column}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline">{stats.lines} lines</span>
        <span className="hidden md:inline">{stats.chars} chars</span>
        <span className={`font-medium ${langColors[state.language] || ''}`}>{state.language.toUpperCase()}</span>
      </div>
    </div>
  )
}
