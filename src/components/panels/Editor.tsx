import { useRef, useEffect, useCallback } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { useAppContext } from '../../context/AppContext'
import { LANGUAGES, MONACO_THEMES, MIN_FONT_SIZE, MAX_FONT_SIZE } from '../../utils/constants'
import { downloadFile, uploadFile, copyToClipboard } from '../../utils/helpers'

export default function CodeEditor() {
  const { state, setCode, setFontSize, resetCode, setFullscreen, setTheme } = useAppContext()
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const currentLang = LANGUAGES.find((l) => l.id === state.language)!
  const isDark = state.theme === 'dark'

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => window.dispatchEvent(new CustomEvent('codestudio-run')))
    editor.onDidChangeCursorPosition((e) => {
      window.dispatchEvent(new CustomEvent('codestudio-cursor-change', { detail: { line: e.position.lineNumber, column: e.position.column } }))
    })
    setTimeout(() => editor.layout(), 100)
  }, [])

  useEffect(() => {
    if (state.activeMobileTab === 'editor') setTimeout(() => editorRef.current?.layout(), 50)
  }, [state.activeMobileTab])

  useEffect(() => {
    const handleResize = () => editorRef.current?.layout()
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
      return () => window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const el = document.getElementById('split-container')
    if (!el) return
    if (state.isFullscreen) {
      el.requestFullscreen?.().catch(() => {})
    } else if (document.fullscreenElement === el) {
      document.exitFullscreen?.()
    }
  }, [state.isFullscreen])

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setFullscreen(false)
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [setFullscreen])

  return (
    <div className={`flex flex-col flex-1 min-h-0 rounded-lg border overflow-hidden transition-colors ${isDark ? 'bg-[#25262b] border-[#373a40]' : 'bg-white border-slate-200'}`}>
      <div className={`flex items-center justify-between px-3 py-1.5 border-b ${isDark ? 'border-[#373a40] bg-[#25262b]' : 'border-slate-100 bg-slate-50/50'}`}>
        <div className="flex items-center gap-2">
          <span className={`font-mono text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>code{currentLang.extension}</span>
          <span className={`w-px h-3.5 ${isDark ? 'bg-[#373a40]' : 'bg-slate-200'}`} />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDark ? 'bg-[#2c2e33] text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{currentLang.label}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={() => copyToClipboard(state.code)} className="btn-icon" title="Copy" aria-label="Copy code">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </button>
          <button onClick={() => downloadFile(state.code, `code${currentLang.extension}`)} className="btn-icon hidden sm:flex" title="Download" aria-label="Download">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </button>
          <button onClick={() => uploadFile().then(setCode).catch(() => {})} className="btn-icon hidden sm:flex" title="Upload" aria-label="Upload">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </button>
          <button onClick={resetCode} className="btn-icon" title="Reset" aria-label="Reset to template">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
          <div className={`w-px h-3.5 mx-1 ${isDark ? 'bg-[#373a40]' : 'bg-slate-200'}`} />
          <button onClick={() => setFontSize(Math.max(MIN_FONT_SIZE, state.fontSize - 1))} className="btn-icon" title="Smaller font" aria-label="Decrease font size">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M4 20l8-16 8 16" /></svg>
          </button>
          <span className={`text-xs font-mono px-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{state.fontSize}</span>
          <button onClick={() => setFontSize(Math.min(MAX_FONT_SIZE, state.fontSize + 1))} className="btn-icon" title="Larger font" aria-label="Increase font size">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M12 4v16" /></svg>
          </button>
          <div className={`w-px h-3.5 mx-1 ${isDark ? 'bg-[#373a40]' : 'bg-slate-200'}`} />
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="btn-icon" title="Toggle theme" aria-label="Toggle theme">
            {isDark ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <button onClick={() => setFullscreen(!state.isFullscreen)} className="btn-icon" title="Fullscreen" aria-label="Toggle fullscreen">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          </button>
        </div>
      </div>

      <div key={state.language} className="flex-1 min-h-0 relative animate-fade-in">
        <div className="absolute inset-0">
          <Editor key={state.theme} language={currentLang.monacoLanguage} value={state.code}
            theme={state.theme === 'dark' ? MONACO_THEMES.dark : MONACO_THEMES.light}
            onMount={handleMount} onChange={(value) => setCode(value ?? '')}
            options={{
              fontSize: state.fontSize, fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
              minimap: { enabled: false }, scrollBeyondLastLine: false, lineNumbers: 'on',
              renderLineHighlight: 'all', cursorBlinking: 'smooth', cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true, automaticLayout: true, tabSize: 2, wordWrap: 'on',
              padding: { top: 12 }, bracketPairColorization: { enabled: true },
              autoClosingBrackets: 'always', autoClosingQuotes: 'always', autoIndent: 'full',
              formatOnPaste: true, suggestOnTriggerCharacters: true, quickSuggestions: true,
              folding: true, links: false, fixedOverflowWidgets: true,
            }} />
        </div>
      </div>
    </div>
  )
}
