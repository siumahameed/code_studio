import { Copy, Download, Upload, Reset, Maximize, FontDecrease, FontIncrease, Code, List, Lines, Sun, Moon } from '../icons'
import { LANGUAGES } from '../../utils/constants'
import type { Language } from '../../types'

interface Props {
  language: Language
  fontSize: number
  isDark: boolean
  isFullscreen: boolean
  onCopy: () => void
  onDownload: () => void
  onUpload: () => void
  onReset: () => void
  onFontDec: () => void
  onFontInc: () => void
  onSnippets: () => void
  onSelectLine: () => void
  onSelectRange: () => void
  onThemeToggle: () => void
  onFullscreenToggle: () => void
}

export default function EditorToolbar({
  language, fontSize, isDark, isFullscreen,
  onCopy, onDownload, onUpload, onReset,
  onFontDec,   onFontInc, onSnippets,
  onSelectLine, onSelectRange,
  onThemeToggle, onFullscreenToggle,
}: Props) {
  void isFullscreen
  const lang = LANGUAGES.find(l => l.id === language)!

  return (
    <div className={`flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className={`font-mono text-[10px] sm:text-xs font-semibold truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{lang.label}{lang.extension}</span>
      </div>
      <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
        <div className="hidden 2xs:block"><ToolbarBtn onClick={onSnippets} title="Insert snippet" isDark={isDark}><Code className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></ToolbarBtn></div>
        <div className="hidden sm:block"><ToolbarBtn onClick={onSelectLine} title="Select current line" isDark={isDark}><List className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></ToolbarBtn></div>
        <div className="hidden sm:block"><ToolbarBtn onClick={onSelectRange} title="Select line range" isDark={isDark}><Lines className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></ToolbarBtn></div>
        <ToolbarBtn onClick={onCopy} title="Copy code" isDark={isDark}><Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></ToolbarBtn>
        <ToolbarBtn onClick={onDownload} title="Download" isDark={isDark}><Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></ToolbarBtn>
        <ToolbarBtn onClick={onUpload} title="Upload" isDark={isDark}><Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></ToolbarBtn>
        <ToolbarBtn onClick={onReset} title="Reset to template" isDark={isDark}><Reset className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></ToolbarBtn>
        <Divider isDark={isDark} />
        <ToolbarBtn onClick={onFontDec} title="Smaller font" isDark={isDark}><FontDecrease className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></ToolbarBtn>
        <span className={`text-[10px] sm:text-xs font-mono px-1 min-w-[18px] sm:min-w-[20px] text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{fontSize}</span>
        <ToolbarBtn onClick={onFontInc} title="Larger font" isDark={isDark}><FontIncrease className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></ToolbarBtn>
        <Divider isDark={isDark} />
        <div className="hidden 2xs:block"><ToolbarBtn onClick={onThemeToggle} title="Toggle theme" isDark={isDark}>
          {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </ToolbarBtn></div>
        <ToolbarBtn onClick={onFullscreenToggle} title="Toggle fullscreen" isDark={isDark}>
          <Maximize className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </ToolbarBtn>
      </div>
    </div>
  )
}

function ToolbarBtn({ children, onClick, title, isDark }: { children: React.ReactNode; onClick: () => void; title: string; isDark: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all active:scale-90 ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
    >
      {children}
    </button>
  )
}

function Divider({ isDark }: { isDark: boolean }) {
  return <div className={`w-px h-4 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
}
