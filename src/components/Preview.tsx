import { useRef, useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { copyToClipboard } from '../utils/helpers'

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
      if (!doc) { setError('Preview unavailable'); return }
      doc.open()
      doc.write(state.code)
      doc.close()
    } catch (err) {
      setError(`Preview error: ${err}`)
    }
  }, [state.code])

  const handleOpenNewTab = () => {
    const blob = new Blob([state.code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60000)
  }

  return (
    <div className={`flex flex-col flex-1 h-full min-h-0 transition-all duration-300 ${
      state.isFullscreen
        ? 'rounded-none border-none w-full'
        : 'rounded-2xl border'
    } ${
      isDark
        ? 'bg-[#1a1a2e]/85 backdrop-blur-sm border-white/[0.06] shadow-xl shadow-black/30'
        : 'bg-white border-slate-200/80 shadow-md shadow-slate-200/10'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-3.5 py-2.5 border-b transition-colors duration-300 ${
        isDark
          ? 'border-white/[0.06] bg-white/[0.01]'
          : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-sm select-none">👁️</span>
          <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Preview</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium border border-emerald-500/20">Auto</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => copyToClipboard(state.code)}
            className={`w-7.5 h-7.5 flex items-center justify-center rounded-lg text-xs transition-all duration-200 active:scale-90 ${
              isDark
                ? 'hover:bg-white/[0.08] text-slate-500 hover:text-slate-200'
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
            title="Copy HTML"
          >
            📋
          </button>
          <button
            onClick={handleOpenNewTab}
            className={`w-7.5 h-7.5 flex items-center justify-center rounded-lg text-xs transition-all duration-200 active:scale-90 ${
              isDark
                ? 'hover:bg-white/[0.08] text-slate-500 hover:text-slate-200'
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
            title="Open in new tab"
          >
            ↗
          </button>
        </div>
      </div>

      {/* Frame content */}
      <div className="flex-1 bg-white relative rounded-b-2xl overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
            <p className="text-red-500 text-sm px-4 text-center font-medium">{error}</p>
          </div>
        ) : (
          <iframe ref={iframeRef} title="Preview" className="w-full h-full border-0 bg-white" sandbox="allow-scripts allow-modals allow-same-origin" />
        )}
      </div>
    </div>
  )
}
