interface Props {
  columns: string[]
  rows: string[][]
}

export function TableRenderer({ columns, rows }: Props) {
  return (
    <div className="overflow-x-auto py-1">
      <table className="w-full border-collapse text-sm rounded-lg overflow-hidden bg-[#2c2e33]">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="text-left px-3 py-2 font-bold text-xs uppercase tracking-wider text-brand-300 bg-brand-500/10 border-b border-brand-500/20 whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="even:bg-white/5">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2 border-b border-[#373a40] whitespace-nowrap text-slate-300">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
