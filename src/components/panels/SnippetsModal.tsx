import { useState, useMemo } from 'react'
import { Search, Close } from '../icons'

interface Snippet {
  id: string
  label: string
  code: string
}

const SNIPPETS: Snippet[] = [
  { id: 'print', label: 'Print / Log', code: 'print("Hello, world!")\n' },
  { id: 'for_py', label: 'Python for-loop', code: 'for i in range(5):\n    print(i)\n' },
  { id: 'html_boiler', label: 'HTML Boilerplate', code: '<!doctype html>\n<html>\n  <head><meta charset="utf-8"></head>\n  <body>\n  </body>\n</html>' },
  { id: 'sql_select', label: 'SQL SELECT', code: 'SELECT *\nFROM table_name\nWHERE condition;\n' },
  { id: 'c_main', label: 'C main', code: '#include <stdio.h>\nint main() {\n  printf("Hello\\n");\n  return 0;\n}\n' },
]

interface Props {
  isDark: boolean
  onSelect: (code: string) => void
  onClose: () => void
}

export default function SnippetsModal({ isDark, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SNIPPETS
    return SNIPPETS.filter(s => s.label.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.id.includes(q))
  }, [query])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`absolute inset-0 ${isDark ? 'bg-black/50' : 'bg-slate-900/30'}`} />
      <div
        className={`relative max-w-lg w-full rounded-lg border shadow-xl overflow-hidden ${isDark ? 'bg-[#1a1b1e] border-white/10' : 'bg-white border-slate-200'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          <div className={`flex items-center gap-2 flex-1 rounded-lg border px-3 py-2 ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'}`}>
            <Search className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search snippets..."
              className="flex-1 bg-transparent text-sm outline-none"
              autoFocus
            />
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg transition-all active:scale-90 ${isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            <Close className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 max-h-80 overflow-y-auto grid gap-2">
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => { onSelect(s.code); onClose() }}
              className={`text-left p-3 rounded-lg border transition-all active:scale-[0.99] ${isDark ? 'border-white/5 hover:border-white/20 bg-white/[0.02]' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
            >
              <div className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{s.label}</div>
              <pre className={`mt-1.5 text-xs font-mono whitespace-pre-wrap max-h-16 overflow-hidden ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.code}</pre>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
