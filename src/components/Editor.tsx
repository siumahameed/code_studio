import { useRef, useCallback, useEffect } from 'react'
import Editor, { type OnMount, type BeforeMount } from '@monaco-editor/react'
import { useAppContext } from '../context/AppContext'
import { LANGUAGES, MONACO_THEMES, MIN_FONT_SIZE, MAX_FONT_SIZE } from '../utils/constants'
import { downloadFile, uploadFile, copyToClipboard } from '../utils/helpers'

const langAccent: Record<string, string> = {
  html: 'from-orange-500 to-rose-500',
  python: 'from-blue-500 to-cyan-500',
  sql: 'from-amber-500 to-yellow-500',
  c: 'from-emerald-500 to-teal-500',
}

const QUICK_KEYS: Record<string, string[]> = {
  html: ['<', '>', '/', '=', '"', '!', '{', '}', '[', ']', 'class="', 'id="'],
  python: [':', '(', ')', '[', ']', '"', "'", '=', ',', '_', '+', '-'],
  sql: ['*', ',', "'", ';', '(', ')', '=', '_', 'SELECT ', 'WHERE ', 'FROM '],
  c: [';', '{', '}', '(', ')', '"', '&', '|', '=', '+', '-', '#'],
}

export default function CodeEditor() {
  const { state, setCode, setFontSize, resetCode, setFullscreen, setTheme } = useAppContext()
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const currentLang = LANGUAGES.find(l => l.id === state.language)!
  const isDark = state.theme === 'dark'

  const handleBeforeMount: BeforeMount = () => {}

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      window.dispatchEvent(new CustomEvent('codestudio-run'))
      return undefined
    })

    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => { window.dispatchEvent(new CustomEvent('codestudio-run')) },
    })

    editor.onDidChangeModelContent(() => {
      setCode(editor.getValue())
    })

    setTimeout(() => editor.layout(), 100)
  }

  // Insert character or word at cursor in Monaco Editor
  const handleInsertText = (text: string) => {
    const editor = editorRef.current
    if (!editor) return
    const position = editor.getPosition()
    if (position) {
      editor.executeEdits('quick-key', [
        {
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },
          text,
          forceMoveMarkers: true,
        },
      ])
      editor.focus()
    }
  }

  // Force re-layout when switching back to editor tab on mobile
  useEffect(() => {
    if (state.activeMobileTab === 'editor') {
      setTimeout(() => editorRef.current?.layout(), 50)
    }
  }, [state.activeMobileTab])

  // Re-layout when virtual keyboard opens/closes on mobile
  useEffect(() => {
    const handleResize = () => editorRef.current?.layout()
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
      return () => window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleCopy = useCallback(async () => { await copyToClipboard(state.code) }, [state.code])
  const handleDownload = useCallback(() => { downloadFile(state.code, `code${currentLang.extension}`) }, [state.code, currentLang.extension])
  const handleUpload = useCallback(async () => { try { setCode(await uploadFile()) } catch { /* */ } }, [setCode])
  const handleReset = useCallback(() => { resetCode() }, [resetCode])

  return (
    <div className={`flex flex-col flex-1 min-h-0 transition-all duration-300 ${
      state.isFullscreen
        ? 'rounded-none border-none h-full w-full'
        : 'rounded-2xl border'
    } ${
      isDark
        ? 'bg-[#1a1a2e]/85 backdrop-blur-sm border border-white/[0.06] shadow-xl shadow-black/30'
        : 'bg-white border border-slate-200/80 shadow-md shadow-slate-200/10'
    }`}>
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-3.5 py-2.5 border-b transition-colors duration-300 ${
        isDark
          ? 'border-white/[0.06] bg-white/[0.01]'
          : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${langAccent[state.language]} shadow-sm`} />
          <span className={`font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500 font-medium'}`}>
            code{currentLang.extension}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={handleCopy} label="Copy" icon="📋" />
          <ToolbarButton onClick={handleDownload} label="Download" icon="⬇️" className="hidden sm:flex" />
          <ToolbarButton onClick={handleUpload} label="Upload" icon="📂" className="hidden sm:flex" />
          <ToolbarButton onClick={handleReset} label="Reset" icon="↺" />
          <span className={`w-px h-4 mx-1 hidden sm:block ${isDark ? 'bg-white/[0.06]' : 'bg-slate-200'}`} />
          <ToolbarButton onClick={() => setFontSize(Math.max(MIN_FONT_SIZE, state.fontSize - 1))} label="Smaller" icon="A−" />
          <ToolbarButton onClick={() => setFontSize(Math.min(MAX_FONT_SIZE, state.fontSize + 1))} label="Larger" icon="A+" />
          <span className={`w-px h-4 mx-1 hidden sm:block ${isDark ? 'bg-white/[0.06]' : 'bg-slate-200'}`} />
          <ToolbarButton onClick={() => setTheme(isDark ? 'light' : 'dark')} label="Toggle Theme" icon={isDark ? "☀️" : "🌙"} />
          <span className={`w-px h-4 mx-1 hidden sm:block ${isDark ? 'bg-white/[0.06]' : 'bg-slate-200'}`} />
          <ToolbarButton onClick={() => setFullscreen(!state.isFullscreen)} label={state.isFullscreen ? "Exit Fullscreen" : "Fullscreen"} icon={state.isFullscreen ? "🗗" : "⛶"} />
        </div>
      </div>

      {/* Mobile Quick Keys Helper Bar */}
      <div className="md:hidden flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto bg-slate-50/50 dark:bg-white/[0.01] border-b border-slate-200/50 dark:border-white/[0.05] no-scrollbar flex-shrink-0">
        {QUICK_KEYS[state.language]?.map((key) => (
          <button
            key={key}
            onClick={() => handleInsertText(key)}
            className="flex-shrink-0 px-3 py-1 text-xs font-mono rounded-md bg-white dark:bg-[#252542] border border-slate-250/60 dark:border-white/[0.08] shadow-sm active:scale-95 text-slate-700 dark:text-slate-200 active:bg-slate-50 dark:active:bg-[#2d2d50] select-none transition-all duration-150"
          >
            {key}
          </button>
        ))}
      </div>

      {/* Monaco Editor */}
      <div className={`flex-1 min-h-0 relative ${isDark ? 'bg-transparent' : 'bg-white'}`}>
        <Editor
          key={state.language + state.theme}
          language={currentLang.monacoLanguage}
          value={state.code}
          theme={state.theme === 'dark' ? MONACO_THEMES.dark : MONACO_THEMES.light}
          beforeMount={handleBeforeMount}
          onMount={handleMount}
          onChange={(value) => setCode(value ?? '')}
          options={{
            fontSize: state.fontSize,
            fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 16 },
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoIndent: 'full',
            formatOnPaste: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            folding: true,
            links: false,
            fixedOverflowWidgets: true,
          }}
        />
      </div>
    </div>
  )
}

function ToolbarButton({ onClick, label, icon, className = '' }: { onClick: () => void; label: string; icon: string; className?: string }) {
  const { state } = useAppContext()
  const isDark = state.theme === 'dark'
  return (
    <button
      onClick={onClick}
      className={`w-7.5 h-7.5 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs sm:text-sm transition-all duration-200 active:scale-90 ${
        isDark
          ? 'hover:bg-white/[0.06] text-slate-400 hover:text-slate-200'
          : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
      } ${className}`}
      title={label}
    >
      {icon}
    </button>
  )
}
