import { useRef, useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { copyToClipboard } from '../../utils/helpers'
import { Eye, Copy as CopyIcon, External } from '../icons'

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
    <div className="panel-shell flex flex-col flex-1 min-h-0">
      <div className={`flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Eye className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={`text-[10px] sm:text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Preview</span>
          <span className="badge badge-green text-[8px] sm:text-[9px]">Live</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={() => copyToClipboard(state.code)} className="btn-icon" title="Copy code">
            <CopyIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
          <button onClick={handleOpenNewTab} className="btn-icon" title="Open in new tab">
            <External className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-rose-50/90 dark:bg-rose-500/10">
            <p className="text-rose-500 text-sm text-center font-medium px-4">{error}</p>
          </div>
        ) : (
          <iframe ref={iframeRef} title="Preview" className="w-full h-full border-0 bg-white" sandbox="allow-scripts allow-modals allow-same-origin" />
        )}
      </div>
    </div>
  )
}
