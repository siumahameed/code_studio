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

  return (
    <div className={`flex items-center justify-between px-4 py-1.5 mt-1.5 text-xs rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700/60 text-slate-500' : 'bg-white/70 border-slate-200/80 text-slate-400'}`}>
      <div className="flex items-center gap-3 select-none">
        <span className="flex items-center gap-1.5 text-emerald-500"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Saved</span>
        <span className="flex items-center gap-1">Lines <b className={isDark ? 'text-slate-300' : 'text-slate-600'}>{stats.lines}</b></span>
        <span className="hidden sm:inline flex items-center gap-1">Words <b className={isDark ? 'text-slate-300' : 'text-slate-600'}>{stats.words}</b></span>
        <span className="hidden md:inline flex items-center gap-1">Chars <b className={isDark ? 'text-slate-300' : 'text-slate-600'}>{stats.chars}</b></span>
      </div>
      <div className="flex items-center gap-3 select-none">
        <span className="flex items-center gap-1">Ln <b className={isDark ? 'text-slate-300' : 'text-slate-600'}>{cursor.line}</b>, Col <b className={isDark ? 'text-slate-300' : 'text-slate-600'}>{cursor.column}</b></span>
        <span className="hidden sm:inline flex items-center gap-1">{state.fontSize}px</span>
        <span className="hidden md:inline flex items-center gap-1">{state.language.toUpperCase()}</span>
      </div>
    </div>
  )
}
