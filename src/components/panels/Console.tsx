import { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import { copyToClipboard } from '../../utils/helpers'

const TIPS: Record<string, string[]> = {
  html: ["Try adding a <style> block for colors!", "Use target='_blank' for new tabs.", "Challenge: make a hover button!", "Try CSS flexbox: display: flex;"],
  python: ["Spacing matters! Use 4 spaces.", "Try: for i in range(10): print(i*i)", "Named after Monty Python!", "Use f-strings: f'Hello {name}!'"],
  sql: ["Write SQL keywords in CAPS.", "Try: ORDER BY grade DESC", "Your data stays in browser!", "Use WHERE to filter results"],
  c: ["Every C program starts at main().", "Use printf(\"%d\", num) for numbers.", "C uses semicolons ; at line end!", "Always #include <stdio.h>"],
}

export default function Console() {
  const { state, clearOutput } = useAppContext()
  const terminalRef = useRef<HTMLDivElement>(null)
  const isDark = state.theme === 'dark'

  const randomTip = useMemo(() => {
    const tips = TIPS[state.language] || []
    return tips[Math.floor(Math.random() * tips.length)]
  }, [state.language])

  const hasOutput = state.output.length > 0
  const hasError = state.output.some(e => e.type === 'error')
  const hasSuccess = state.output.some(e => e.type === 'success')
  const showBanner = hasSuccess && !hasError

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight
  }, [state.output, state.isLoading])

  const handleCopy = useCallback(async () => {
    await copyToClipboard(state.output.map(e => e.content).join('\n'))
  }, [state.output])

  const renderEntry = (entry: { type: string; content: string; timestamp: number }) => {
    switch (entry.type) {
      case 'stdout':
        return <div key={entry.timestamp} className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-brand-300">{entry.content}</div>
      case 'stderr':
        return <div key={entry.timestamp} className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-amber-300">{entry.content}</div>
      case 'error':
        return (
          <div key={entry.timestamp} className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <span className="text-rose-400 font-bold flex-shrink-0">!</span>
            <div className="text-rose-300 text-sm font-mono whitespace-pre-wrap break-words">{entry.content}</div>
          </div>
        )
      case 'table':
        try {
          const t = JSON.parse(entry.content) as { columns: string[]; rows: string[][] }
          return (
            <div key={entry.timestamp} className="overflow-x-auto py-1">
              <table className="w-full border-collapse text-sm rounded-lg overflow-hidden bg-[#2c2e33]">
                <thead><tr>{t.columns.map((c, i) => <th key={i} className="text-left px-3 py-2 font-bold text-xs uppercase tracking-wider text-brand-300 bg-brand-500/10 border-b border-brand-500/20 whitespace-nowrap">{c}</th>)}</tr></thead>
                <tbody>{t.rows.map((r, i) => <tr key={i} className="even:bg-white/5">{r.map((c, j) => <td key={j} className="px-3 py-2 border-b border-[#373a40] whitespace-nowrap text-slate-300">{c}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )
        } catch { return <div key={entry.timestamp} className="whitespace-pre-wrap text-brand-300">{entry.content}</div> }
      default:
        return <div key={entry.timestamp} className="whitespace-pre-wrap text-slate-400">{entry.content}</div>
    }
  }

  return (
    <div className={`flex flex-col flex-1 min-h-0 rounded-lg border overflow-hidden transition-colors ${isDark ? 'bg-[#25262b] border-[#373a40]' : 'bg-white border-slate-200'}`}>
      <div className={`flex items-center justify-between px-3 py-1.5 border-b ${isDark ? 'border-[#373a40] bg-[#25262b]' : 'border-slate-100 bg-slate-50/50'}`}>
        <div className="flex items-center gap-2">
          <svg className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Output</span>
          {state.isLoading && (
            <span className="flex items-center gap-1 ml-1">
              <span className="loading-dot w-1 h-1 rounded-full bg-brand-400" />
              <span className="loading-dot w-1 h-1 rounded-full bg-brand-400" />
              <span className="loading-dot w-1 h-1 rounded-full bg-brand-400" />
            </span>
          )}
        </div>
        {hasOutput && (
          <div className="flex items-center gap-1">
            <button onClick={clearOutput} className="px-2 py-1 rounded-md text-[10px] font-semibold transition active:scale-95 text-rose-400 hover:bg-rose-500/10">Clear</button>
            <button onClick={handleCopy} className="px-2 py-1 rounded-md text-[10px] font-semibold transition active:scale-95 text-brand-400 hover:bg-brand-500/10">Copy</button>
          </div>
        )}
      </div>

      <div ref={terminalRef} className={`flex-1 overflow-y-auto p-3 font-mono text-sm leading-relaxed ${isDark ? 'bg-[#1a1b1e] text-slate-300' : 'bg-slate-50 text-slate-800'}`}>
        {hasOutput ? (
          <div className="flex flex-col gap-1.5">
            {showBanner && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-brand-500/10 border border-brand-500/20 mb-1">
                <span className="text-brand-400 font-bold text-xs">✓</span>
                <span className="text-brand-300 text-xs font-medium">Code executed successfully</span>
              </div>
            )}
            {state.output.filter(e => e.type !== 'success').map(renderEntry)}
          </div>
        ) : state.isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <span className="flex items-center gap-1">
              <span className="loading-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
              <span className="loading-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
              <span className="loading-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Running...</span>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4">
            <svg className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ready to go!</p>
              <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Press Run to execute your code</p>
            </div>
            <div className={`max-w-xs p-2.5 rounded-lg border text-[10px] ${isDark ? 'bg-[#2c2e33] border-[#373a40] text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
              {randomTip}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
