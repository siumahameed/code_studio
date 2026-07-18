import { useRef, useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { copyToClipboard } from '../../utils/helpers'

export default function Preview() {
  const { state } = useAppContext()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState<string | null>(null)
  const isDark = state.theme === 'dark'

  useEffect(() => {
    if (!iframeRef.current) return
    setError(null)
    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if (!doc) { setError('Preview not available.'); return }
      doc.open(); doc.write(state.code); doc.close()
    } catch (err) { setError(`Preview error: ${err}`) }
  }, [state.code])

  const handleOpenNewTab = () => {
    const blob = new Blob([state.code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60000)
  }

  return (
    <div className={`flex flex-col flex-1 min-h-0 rounded-2xl border overflow-hidden transition-colors ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm shadow-slate-100'}`}>
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDark ? 'border-slate-700/80 bg-slate-800' : 'border-slate-100 bg-slate-50/80'}`}>
        <div className="flex items-center gap-2">
          <svg className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Preview</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">Live</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={() => copyToClipboard(state.code)} className="w-8 h-8 flex items-center justify-center rounded-xl text-sm transition active:scale-90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80" title="Copy code" aria-label="Copy code">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </button>
          <button onClick={handleOpenNewTab} className="w-8 h-8 flex items-center justify-center rounded-xl text-sm transition active:scale-90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80" title="Open in new tab" aria-label="Open in new tab">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-rose-50 dark:bg-rose-500/10">
            <p className="text-rose-500 text-sm text-center font-medium px-4">{error}</p>
          </div>
        ) : (
          <iframe ref={iframeRef} title="Preview" className="w-full h-full border-0 bg-white" sandbox="allow-scripts allow-modals allow-same-origin" />
        )}
      </div>
    </div>
  )
}
