import { useMemo, useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { countWords, countLines, countChars } from '../utils/helpers'

export default function StatusBar() {
  const { state } = useAppContext()
  const isDark = state.theme === 'dark'
  const [cursor, setCursor] = useState({ line: 1, column: 1 })

  useEffect(() => {
    const handleCursorChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ line: number; column: number }>
      if (customEvent?.detail) {
        setCursor(customEvent.detail)
      }
    }
    window.addEventListener('codestudio-cursor-change', handleCursorChange)
    return () => {
      window.removeEventListener('codestudio-cursor-change', handleCursorChange)
    }
  }, [])

  const stats = useMemo(() => ({
    words: countWords(state.code),
    lines: countLines(state.code),
    chars: countChars(state.code),
  }), [state.code])

  return (
    <div className={`flex items-center justify-between px-3.5 py-1.5 text-[11px] border transition-all duration-300 ${
      state.isFullscreen ? 'rounded-none mt-0 border-x-0 border-b-0' : 'rounded-xl mt-1.5'
    } ${
      isDark
        ? 'bg-[#1a1a2e]/55 border-white/[0.04] text-slate-500'
        : 'bg-white/80 border-slate-200/80 text-slate-500 shadow-sm shadow-slate-100/50'
    }`}>
      <div className="flex items-center gap-2 sm:gap-4 select-none">
        <span className="hidden sm:inline">Words <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{stats.words}</span></span>
        <span>Lines <span className={`font-semibold ${isDark ? 'text-slate-350' : 'text-slate-700'}`}>{stats.lines}</span></span>
        <span className="hidden sm:inline">Chars <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{stats.chars}</span></span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 select-none">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shadow-sm shadow-emerald-500/20"></span>
          <span>Saved</span>
        </span>
        <span className={isDark ? 'text-white/[0.06]' : 'text-slate-200'}>|</span>
        <span>Ln {cursor.line}, Col {cursor.column}</span>
        <span className={isDark ? 'text-white/[0.06]' : 'text-slate-200'}>|</span>
        <span>{state.fontSize}px</span>
        <span className={isDark ? 'text-white/[0.06]' : 'text-slate-200'}>|</span>
        <a 
          href="https://github.com/siumbhuyan"
          target="_blank" 
          rel="noopener noreferrer"
          className={`hover:underline font-semibold transition-colors duration-200 ${
            isDark ? 'text-indigo-455 hover:text-indigo-300' : 'text-indigo-650 hover:text-indigo-500'
          }`}
        >
          Sium Bhuyan
        </a>
      </div>
    </div>
  )
}
