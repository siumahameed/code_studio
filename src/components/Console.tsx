import { useRef, useEffect, useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { copyToClipboard } from '../utils/helpers'

const CODING_TIPS: Record<string, string[]> = {
  html: [
    "Tip: Use <style> to add CSS styles directly inside your HTML header!",
    "Challenge: Try to create a div with a rounded gradient border!",
    "Tip: Use target='_blank' in your links to open them in a new tab.",
    "Challenge: Build a mini profile card with an image and links!"
  ],
  python: [
    "Tip: Indentation is key in Python. Use spaces (normally 4) to define code blocks!",
    "Challenge: Write a loop that prints only even numbers from 1 to 20.",
    "Tip: Python was named after the comedy group 'Monty Python'!",
    "Challenge: Use input() to ask the user's age, then print if they can vote."
  ],
  sql: [
    "Tip: Writing SQL keywords in UPPERCASE (like SELECT) makes your query clean and easy to read.",
    "Challenge: Try to query students order by grade descending: ORDER BY grade DESC.",
    "Tip: SQLite runs fully in your browser! Changes are saved automatically in your local storage.",
    "Challenge: Filter students from 'Chicago' using: WHERE city = 'Chicago'."
  ],
  c: [
    "Tip: Every C program starts execution from the main() function.",
    "Challenge: Try dividing two numbers, but watch out for division by zero!",
    "Tip: Always use \\n to print a new line in printf().",
    "Challenge: Declare a float variable and print it using %f formatting."
  ]
}

export default function Console() {
  const { state, clearOutput } = useAppContext()
  const terminalRef = useRef<HTMLDivElement>(null)
  const isDark = state.theme === 'dark'

  const randomTip = useMemo(() => {
    const tips = CODING_TIPS[state.language] || []
    return tips[Math.floor(Math.random() * tips.length)]
  }, [state.language, state.output.length])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [state.output, state.isLoading])

  const handleCopy = async () => {
    const text = state.output.map(e => e.content).join('\n')
    await copyToClipboard(text)
  }

  const renderEntry = (entry: { type: string; content: string; timestamp: number }) => {
    const key = entry.timestamp
    switch (entry.type) {
      case 'stdout':
        return <div key={key} className={`whitespace-pre-wrap break-words leading-relaxed ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{entry.content}</div>
      case 'stderr':
        return <div key={key} className={`whitespace-pre-wrap break-words leading-relaxed ${isDark ? 'text-rose-400' : 'text-rose-650 font-medium'}`}>{entry.content}</div>
      case 'error':
        return (
          <div key={key} className={`rounded-lg px-3 py-2 whitespace-pre-wrap break-words leading-relaxed border ${
            isDark
              ? 'text-rose-350 bg-rose-500/10 border-rose-500/20'
              : 'text-rose-700 bg-rose-50 border-rose-200/60'
          }`}>
            {entry.content}
          </div>
        )
      case 'system':
        return <div key={key} className={`whitespace-pre-wrap text-xs leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-450'}`}>{entry.content}</div>
      case 'table':
        try {
          const table = JSON.parse(entry.content) as { columns: string[]; rows: string[][] }
          return (
            <div key={key} className="overflow-x-auto py-1 my-1">
              <table className="w-full border-collapse text-xs rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    {table.columns.map((col, i) => (
                      <th key={i} className={`text-left px-3 py-2 font-semibold border-b whitespace-nowrap ${
                        isDark
                          ? 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30'
                          : 'text-indigo-700 bg-indigo-50 border-indigo-200/60'
                      }`}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i} className={isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50/50'}>
                      {row.map((cell, j) => (
                        <td key={j} className={`px-3 py-1.5 border-b whitespace-nowrap ${
                          isDark
                            ? 'text-slate-300 border-white/[0.03]'
                            : 'text-slate-650 border-slate-100'
                        }`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        } catch {
          return <div key={key} className={`whitespace-pre-wrap ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{entry.content}</div>
        }
      default:
        return <div key={key} className={`whitespace-pre-wrap leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-655'}`}>{entry.content}</div>
    }
  }

  return (
    <div className={`flex flex-col h-full transition-all duration-300 ${
      state.isFullscreen
        ? 'rounded-none border-none h-full w-full'
        : 'rounded-2xl border'
    } ${
      isDark
        ? 'bg-[#1a1a2e]/85 backdrop-blur-sm border border-white/[0.06] shadow-xl shadow-black/30'
        : 'bg-white border-slate-200/80 shadow-md shadow-slate-200/10'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-3.5 py-2.5 border-b transition-colors duration-300 ${
        isDark
          ? 'border-white/[0.06] bg-white/[0.01]'
          : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-sm select-none">🖥️</span>
          <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Output</span>
          {state.isLoading && (
            <span className="flex items-center gap-1 ml-1 select-none">
              <span className={`loading-dot inline-block w-1.5 h-1.5 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`}></span>
              <span className={`loading-dot inline-block w-1.5 h-1.5 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`}></span>
              <span className={`loading-dot inline-block w-1.5 h-1.5 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`}></span>
            </span>
          )}
          {state.isLoading && (
            <span className={`text-[10px] font-semibold ${isDark ? 'text-indigo-400/80' : 'text-indigo-600/80'}`}>{state.loadingMessage || 'Running...'}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {state.output.length > 0 && (
            <>
              <ConsoleButton onClick={clearOutput} label="Clear" icon="🗑️" />
              <ConsoleButton onClick={handleCopy} label="Copy" icon="📋" />
            </>
          )}
        </div>
      </div>

      {/* Terminal area */}
      <div
        ref={terminalRef}
        className={`flex-1 overflow-y-auto p-3 font-mono text-sm leading-relaxed transition-colors duration-300 ${
          isDark ? 'bg-[#0a0a1a]/50 text-slate-100' : 'bg-slate-50/60 text-slate-800 border-t border-slate-100/50'
        }`}
        style={{ fontFamily: "'JetBrains Mono', 'Consolas', monospace" }}
      >
        {state.output.length === 0 ? (
          state.isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-indigo-400">
              <span className="flex items-center gap-1.5">
                <span className={`loading-dot inline-block w-2 h-2 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`} />
                <span className={`loading-dot inline-block w-2 h-2 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`} />
                <span className={`loading-dot inline-block w-2 h-2 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`} />
              </span>
              <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{state.loadingMessage || 'Executing code...'}</span>
            </div>
          ) : (
            <div className={`h-full flex flex-col items-center justify-center p-6 text-center gap-4 ${isDark ? 'text-slate-400' : 'text-slate-655'}`}>
              <div className="flex flex-col items-center gap-2 select-none">
                <span className="text-4xl animate-bounce select-none">💡</span>
                <span className={`text-sm font-semibold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Ready to learn?</span>
              </div>
              <div className={`max-w-xs p-3.5 rounded-xl border text-xs font-medium leading-relaxed shadow-sm ${
                isDark
                  ? 'bg-white/[0.02] border-white/[0.06] text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                {randomTip}
              </div>
              <span className="text-[11px] text-slate-500">Press the <strong className={isDark ? 'text-indigo-400' : 'text-indigo-600 font-semibold'}>Run Code</strong> button to see your output!</span>
            </div>
          )
        ) : (
          state.output.map(renderEntry)
        )}
      </div>
    </div>
  )
}

function ConsoleButton({ onClick, label, icon }: { onClick: () => void; label: string; icon: string }) {
  const { state } = useAppContext()
  const isDark = state.theme === 'dark'
  return (
    <button
      onClick={onClick}
      className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-all duration-200 active:scale-90 ${
        isDark
          ? 'hover:bg-white/[0.08] text-slate-500 hover:text-slate-200'
          : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
      }`}
      title={label}
    >
      {icon}
    </button>
  )
}
