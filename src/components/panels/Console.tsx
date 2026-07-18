import { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import { copyToClipboard } from '../../utils/helpers'

const TIPS: Record<string, string[]> = {
  html: ["Try adding a <style> block for colors!", "Use target='_blank' for new tabs.", "Challenge: make a hover button!", "Try CSS flexbox: display: flex;"],
  python: ["Spacing matters! Use 4 spaces.", "Try: for i in range(10): print(i*i)", "Named after Monty Python!", "Use f-strings: f'Hello {name}!'"],
  sql: ["Write SQL keywords in CAPS.", "Try: ORDER BY grade DESC", "Your data stays in browser!", "Use WHERE to filter results"],
  c: ["Every C program starts at main().", "Use printf(\"%d\", num) for numbers.", "C uses semicolons ; at line end!", "Always #include <stdio.h>"],
}

const SUCCESS_MSGS = ["Nice work! Your code ran! 🎉", "It works! Keep going! 🚀", "Awesome! That compiled perfectly! ⚡", "Great job! Your output looks good! ✨"]

export default function Console() {
  const { state, clearOutput } = useAppContext()
  const terminalRef = useRef<HTMLDivElement>(null)
  const isDark = state.theme === 'dark'
  const [showConfetti, setShowConfetti] = useState(false)

  const randomTip = useMemo(() => {
    const tips = TIPS[state.language] || []
    return tips[Math.floor(Math.random() * tips.length)]
  }, [state.language])

  const [successMsg] = useState(() => SUCCESS_MSGS[Math.floor(Math.random() * SUCCESS_MSGS.length)])

  const hasSuccess = state.output.some(e => e.type === 'success')
  const hasError = state.output.some(e => e.type === 'error')

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight
  }, [state.output, state.isLoading])

  useEffect(() => {
    if (!hasSuccess) return
    setShowConfetti(true)
    const t = setTimeout(() => setShowConfetti(false), 1200)
    return () => clearTimeout(t)
  }, [hasSuccess])

  const handleCopy = useCallback(async () => {
    await copyToClipboard(state.output.map(e => e.content).join('\n'))
  }, [state.output])

  const renderEntry = (entry: { type: string; content: string; timestamp: number }) => {
    const key = entry.timestamp
    if (entry.type === 'success') {
      return (
        <div key={key} className="relative animate-pop">
          {showConfetti && <div className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none">
            <span className="confetti-1 absolute w-2 h-2 rounded-full bg-indigo-400" /><span className="confetti-2 absolute w-2 h-2 rounded-full bg-violet-400" />
            <span className="confetti-3 absolute w-2 h-2 rounded-full bg-emerald-400" /><span className="confetti-4 absolute w-2 h-2 rounded-full bg-amber-400" />
          </div>}
          <div className={`flex items-center gap-3 p-4 rounded-2xl border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
            <span className="text-2xl">✅</span>
            <div><p className={`font-bold text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{successMsg}</p><p className={`text-xs mt-0.5 ${isDark ? 'text-emerald-400/70' : 'text-emerald-600/70'}`}>No errors found</p></div>
          </div>
        </div>
      )
    }
    switch (entry.type) {
      case 'stdout': return <div key={key} className={`whitespace-pre-wrap break-words leading-relaxed font-mono text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{entry.content}</div>
      case 'stderr': return <div key={key} className={`whitespace-pre-wrap break-words leading-relaxed font-mono text-sm ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>{entry.content}</div>
      case 'error': return (
        <div key={key} className={`animate-shake rounded-2xl p-4 border flex items-start gap-3 ${isDark ? 'text-rose-300 bg-rose-500/10 border-rose-500/20' : 'text-rose-700 bg-rose-50 border-rose-200'}`}>
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div><p className="font-bold text-sm">Oops! Something's not right</p><pre className="whitespace-pre-wrap break-words text-xs mt-1 opacity-80 font-mono">{entry.content}</pre></div>
        </div>
      )
      case 'table':
        try {
          const t = JSON.parse(entry.content) as { columns: string[]; rows: string[][] }
          return (
            <div key={key} className="overflow-x-auto py-1">
              <table className={`w-full border-collapse text-sm rounded-xl overflow-hidden ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <thead><tr>{t.columns.map((c, i) => <th key={i} className={`text-left px-3 py-2 font-bold text-xs uppercase tracking-wider border-b whitespace-nowrap ${isDark ? 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20' : 'text-indigo-600 bg-indigo-50 border-indigo-200'}`}>{c}</th>)}</tr></thead>
                <tbody>{t.rows.map((r, i) => <tr key={i} className={isDark ? 'hover:bg-white/5' : 'hover:bg-indigo-50/50'}>{r.map((c, j) => <td key={j} className={`px-3 py-2 border-b whitespace-nowrap ${isDark ? 'text-slate-300 border-slate-700/50' : 'text-slate-700 border-slate-100'}`}>{c}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )
        } catch { return <div key={key} className={`whitespace-pre-wrap ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{entry.content}</div> }
      default: return <div key={key} className={`whitespace-pre-wrap leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{entry.content}</div>
    }
  }

  const hasOutput = state.output.length > 0
  const showBanner = hasSuccess && !hasError

  return (
    <div className={`flex flex-col flex-1 min-h-0 rounded-2xl border overflow-hidden transition-colors ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm shadow-slate-200/50'}`}>
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDark ? 'border-slate-700/80 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📤</span>
          <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Output</span>
          {state.isLoading && <span className="flex items-center gap-1 ml-1"><span className="loading-dot w-1.5 h-1.5 rounded-full bg-indigo-400" /><span className="loading-dot w-1.5 h-1.5 rounded-full bg-indigo-400" /><span className="loading-dot w-1.5 h-1.5 rounded-full bg-indigo-400" /></span>}
        </div>
        {hasOutput && <div className="flex items-center gap-1.5">
          <button onClick={clearOutput} className="px-2.5 py-1 rounded-lg text-xs font-bold active:scale-95 transition bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-500/25">Clear</button>
          <button onClick={handleCopy} className="px-2.5 py-1 rounded-lg text-xs font-bold active:scale-95 transition bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-500/25">Copy</button>
        </div>}
      </div>

      <div ref={terminalRef} className={`flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed transition-colors ${isDark ? 'bg-slate-900/50 text-slate-100' : 'bg-slate-50/60 text-slate-800'}`} style={{ fontFamily: "'JetBrains Mono', 'Consolas', monospace" }}>
        {hasOutput ? (
          <div className="flex flex-col gap-2">
            {showBanner && <div className={`mb-2 rounded-2xl overflow-hidden ${showConfetti ? 'animate-pop' : ''}`}>{renderEntry({ type: 'success', content: '', timestamp: 0 })}</div>}
            {state.output.filter(e => e.type !== 'success').map(renderEntry)}
          </div>
        ) : state.isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <span className="flex items-center gap-1.5"><span className="loading-dot w-2.5 h-2.5 rounded-full bg-indigo-400" /><span className="loading-dot w-2.5 h-2.5 rounded-full bg-violet-400" /><span className="loading-dot w-2.5 h-2.5 rounded-full bg-indigo-400" /></span>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Running your code…</span>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-5 py-8">
            <div className="text-5xl animate-bounce-gentle select-none">💡</div>
            <div>
              <p className={`text-base font-extrabold ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>Ready to go!</p>
              <p className={`text-sm mt-1.5 max-w-xs mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Press the <strong className={isDark ? 'text-indigo-300' : 'text-indigo-600'}>Run</strong> button to see your code come alive.</p>
            </div>
            <div className={`max-w-xs p-4 rounded-2xl border text-sm font-medium leading-relaxed ${isDark ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}>
              💡 {randomTip}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
