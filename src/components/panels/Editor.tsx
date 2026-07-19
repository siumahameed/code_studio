import { useRef, useEffect, useCallback, useState } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { useAppContext } from '../../context/AppContext'
import { LANGUAGES, MONACO_THEMES, MIN_FONT_SIZE, MAX_FONT_SIZE } from '../../utils/constants'
import { downloadFile, uploadFile, copyToClipboard } from '../../utils/helpers'
import EditorToolbar from './EditorToolbar'
import SnippetsModal from './SnippetsModal'

export default function CodeEditor() {
  const { state, setCode, setFontSize, resetCode, setFullscreen, setTheme } = useAppContext()
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const monacoRef = useRef<any>(null)
  const [snippetsOpen, setSnippetsOpen] = useState(false)
  const currentLang = LANGUAGES.find(l => l.id === state.language)!
  const isDark = state.theme === 'dark'

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => window.dispatchEvent(new CustomEvent('codestudio-run')))
    editor.onDidChangeCursorPosition(e => {
      window.dispatchEvent(new CustomEvent('codestudio-cursor-change', {
        detail: { line: e.position.lineNumber, column: e.position.column }
      }))
    })
    setTimeout(() => editor.layout(), 100)
  }, [])

  const insertSnippet = (text: string) => {
    const editor = editorRef.current
    if (!editor) return
    const selection = editor.getSelection()
    if (!selection) return
    editor.executeEdits('snippet', [{ range: selection, text }])
    editor.focus()
  }

  const selectLine = () => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco) return
    const pos = editor.getPosition()
    if (!pos) return
    const model = editor.getModel()
    if (!model) return
    const sel = new monaco.Selection(pos.lineNumber, 1, pos.lineNumber, model.getLineMaxColumn(pos.lineNumber))
    editor.setSelection(sel)
    editor.revealLineInCenter(pos.lineNumber)
    editor.focus()
  }

  const selectRange = () => {
    const rng = prompt('Enter range (start-end)')
    if (!rng) return
    const [s, e] = rng.split('-').map(n => parseInt(n.trim(), 10))
    if (isNaN(s) || isNaN(e)) return
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco) return
    const model = editor.getModel()
    if (!model) return
    const sel = new monaco.Selection(s, 1, e, model.getLineMaxColumn(e))
    editor.setSelection(sel)
    editor.revealRangeInCenter(sel)
    editor.focus()
  }

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
    <div className={`panel-shell flex flex-col flex-1 min-h-0 ${isDark ? 'bg-[#0f1113]/95' : 'bg-white'}`}>
      <EditorToolbar
        language={state.language}
        fontSize={state.fontSize}
        isDark={isDark}
        isFullscreen={state.isFullscreen}
        onCopy={() => copyToClipboard(state.code)}
        onDownload={() => downloadFile(state.code, `code${currentLang.extension}`)}
        onUpload={() => uploadFile().then(setCode).catch(() => {})}
        onReset={resetCode}
        onFontDec={() => setFontSize(Math.max(MIN_FONT_SIZE, state.fontSize - 1))}
        onFontInc={() => setFontSize(Math.min(MAX_FONT_SIZE, state.fontSize + 1))}
        onSnippets={() => setSnippetsOpen(true)}
        onSelectLine={selectLine}
        onSelectRange={selectRange}
        onThemeToggle={() => setTheme(isDark ? 'light' : 'dark')}
        onFullscreenToggle={() => setFullscreen(!state.isFullscreen)}
      />

      <div key={state.language} className="flex-1 min-h-0 relative animate-fade-in">
        <div className="absolute inset-0">
          <Editor
            key={state.theme}
            language={currentLang.monacoLanguage}
            value={state.code}
            theme={state.theme === 'dark' ? MONACO_THEMES.dark : MONACO_THEMES.light}
            onMount={handleMount}
            onChange={(value) => setCode(value ?? '')}
            options={{
              fontSize: state.fontSize,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
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
              padding: { top: 12 },
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

      {snippetsOpen && <SnippetsModal isDark={isDark} onSelect={insertSnippet} onClose={() => setSnippetsOpen(false)} />}
    </div>
  )
}
