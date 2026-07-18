import { useRef, useEffect, useCallback } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { useAppContext } from '../../context/AppContext'
import { LANGUAGES, MONACO_THEMES, MIN_FONT_SIZE, MAX_FONT_SIZE } from '../../utils/constants'
import { downloadFile, uploadFile, copyToClipboard } from '../../utils/helpers'

const QUICK_KEYS: Record<string, string[]> = {
  html: ['<', '>', '/', '=', '"', '{', '}', 'class=""', 'div'],
  python: ['(', ')', '[', ']', ':', '"', "'", '=', 'def ', 'print()'],
  sql: ['*', ',', "'", ';', '(', ')', '=', 'SELECT ', 'WHERE ', 'FROM '],
  c: [';', '{', '}', '(', ')', '"', '&', '=', '#include '],
}

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

  const handleInsertText = useCallback((text: string) => {
    const editor = editorRef.current
    if (!editor) return
    const pos = editor.getPosition()
    if (pos) {
      editor.executeEdits('quick-key', [{
        range: { startLineNumber: pos.lineNumber, startColumn: pos.column, endLineNumber: pos.lineNumber, endColumn: pos.column },
        text, forceMoveMarkers: true,
      }])
      editor.focus()
    }
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
    <div className={`flex flex-col flex-1 min-h-0 rounded-2xl border overflow-hidden transition-colors ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm shadow-slate-100'}`}>
      <div className={`flex items-center justify-between px-3 py-2 border-b ${isDark ? 'border-slate-700/80 bg-slate-800' : 'border-slate-100 bg-slate-50/80'}`}>
        <div className="flex items-center gap-2">
          <span className={`font-mono text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>code{currentLang.extension}</span>
          <span className={`w-px h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{currentLang.label}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <EditorToolbarButton onClick={() => copyToClipboard(state.code)} label="Copy code" icon={<CopyIcon />} />
          <EditorToolbarButton onClick={() => downloadFile(state.code, `code${currentLang.extension}`)} label="Download" icon={<DownloadIcon />} className="hidden sm:flex" />
          <EditorToolbarButton onClick={() => uploadFile().then(setCode).catch(() => {})} label="Upload" icon={<UploadIcon />} className="hidden sm:flex" />
          <EditorToolbarButton onClick={resetCode} label="Reset to template" icon={<RefreshIcon />} />
          <div className={`w-px h-4 mx-0.5 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          <EditorToolbarButton onClick={() => setFontSize(Math.max(MIN_FONT_SIZE, state.fontSize - 1))} label="Decrease font size" icon={<FontSizeSmallIcon />} />
          <EditorToolbarButton onClick={() => setFontSize(Math.min(MAX_FONT_SIZE, state.fontSize + 1))} label="Increase font size" icon={<FontSizeLargeIcon />} />
          <span className={`text-xs font-mono font-medium px-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{state.fontSize}px</span>
          <div className={`w-px h-4 mx-0.5 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          <EditorToolbarButton onClick={() => setTheme(isDark ? 'light' : 'dark')} label="Toggle theme" icon={isDark ? <SunIcon /> : <MoonIcon />} />
          <EditorToolbarButton onClick={() => setFullscreen(!state.isFullscreen)} label="Toggle fullscreen" icon={state.isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />} />
        </div>
      </div>

      <div className="md:hidden flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto no-scrollbar flex-shrink-0 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50">
        {QUICK_KEYS[state.language]?.map((key) => (
          <button key={key} onClick={() => handleInsertText(key)}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-100 dark:bg-slate-700/60 border border-slate-200/60 dark:border-slate-600/60 text-slate-600 dark:text-slate-300 active:scale-95 transition select-none">{key}</button>
        ))}
      </div>

      <div className="flex-1 min-h-0 relative" style={{ height: '100%', minHeight: 0 }}>
        <div style={{ width: '100%', height: '100%', minHeight: 0 }}>
          <Editor key={state.language + state.theme} language={currentLang.monacoLanguage} value={state.code}
          theme={state.theme === 'dark' ? MONACO_THEMES.dark : MONACO_THEMES.light}
          onMount={handleMount} onChange={(value) => setCode(value ?? '')}
          options={{
            fontSize: state.fontSize, fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
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
  )
}

function EditorToolbarButton({ onClick, label, icon, className = '' }: { onClick: () => void; label: string; icon: React.ReactNode; className?: string }) {
  const { state } = useAppContext()
  const isDark = state.theme === 'dark'
  return (
    <button onClick={onClick} className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm transition-all active:scale-90 ${isDark ? 'hover:bg-slate-700/80 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-200/80 text-slate-400 hover:text-slate-700'} ${className}`}
      title={label} aria-label={label}>{icon}</button>
  )
}

function CopyIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
}

function DownloadIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
}

function UploadIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
}

function RefreshIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
}

function FontSizeSmallIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
}

function FontSizeLargeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-9 2 9-18 9 18-9-2zm0 0v-8" /></svg>
}

function SunIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
}

function MoonIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
}

function FullscreenIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
}

function FullscreenExitIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
}
