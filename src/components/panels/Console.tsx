import { useRef, useEffect, useMemo, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import { copyToClipboard } from '../../utils/helpers'
import { Terminal } from '../icons'
import { TableRenderer } from './TableRenderer'

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

  return (
    <div className={`panel-shell flex flex-col flex-1 min-h-0`}>
      <div className={`flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Terminal className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={`text-[10px] sm:text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Output</span>
          {state.isLoading && <LoadingDots />}
        </div>
        {hasOutput && (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={clearOutput} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-semibold transition-all active:scale-90 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300">Clear</button>
            <button onClick={handleCopy} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-semibold transition-all active:scale-90 text-brand-400 hover:bg-brand-500/10 hover:text-brand-300">Copy</button>
          </div>
        )}
      </div>

      <div ref={terminalRef} className={`flex-1 overflow-y-auto p-2 sm:p-3 font-mono text-xs sm:text-sm leading-relaxed ${isDark ? 'bg-[#0b0c0e] text-slate-300' : 'bg-white text-slate-800'}`}>
        {hasOutput ? <OutputContent output={state.output} showBanner={showBanner} />
        : state.isLoading ? <LoadingState />
        : <EmptyState tip={randomTip} isDark={isDark} />}
      </div>
    </div>
  )
}

function LoadingDots() {
  return (
    <span className="flex items-center gap-1 ml-1">
      <span className="loading-dot w-1 h-1 rounded-full bg-brand-400" />
      <span className="loading-dot w-1 h-1 rounded-full bg-brand-400" />
      <span className="loading-dot w-1 h-1 rounded-full bg-brand-400" />
    </span>
  )
}

function LoadingState() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2">
      <LoadingDots />
      <span className="text-xs text-slate-500">Running...</span>
    </div>
  )
}

function EmptyState({ tip, isDark }: { tip: string; isDark: boolean }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center gap-3 sm:gap-4">
      <Terminal className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
      <div>
        <p className={`text-[10px] sm:text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ready to go!</p>
        <p className={`text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Press Run to execute your code</p>
      </div>
      <div className={`max-w-xs p-2 sm:p-2.5 rounded-lg border text-[9px] sm:text-[10px] ${isDark ? 'bg-[#2c2e33] border-[#373a40] text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
        {tip}
      </div>
    </div>
  )
}

interface OutputContentProps {
  output: { type: string; content: string; timestamp: number }[]
  showBanner: boolean
}

function OutputContent({ output, showBanner }: OutputContentProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {showBanner && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-brand-500/10 border border-brand-500/20 mb-1">
          <span className="text-brand-400 font-bold text-xs">✓</span>
          <span className="text-brand-300 text-xs font-medium">Code executed successfully</span>
        </div>
      )}
      {output.filter(e => e.type !== 'success').map(renderEntry)}
    </div>
  )
}

function renderEntry(entry: { type: string; content: string; timestamp: number }) {
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
        return <TableRenderer key={entry.timestamp} columns={t.columns} rows={t.rows} />
      } catch {
        return <div key={entry.timestamp} className="whitespace-pre-wrap text-brand-300">{entry.content}</div>
      }
    default:
      return <div key={entry.timestamp} className="whitespace-pre-wrap text-slate-400">{entry.content}</div>
  }
}
