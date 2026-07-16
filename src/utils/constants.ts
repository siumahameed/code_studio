import type { LanguageConfig } from '../types'

export const LANGUAGES: LanguageConfig[] = [
  {
    id: 'html',
    label: 'HTML',
    icon: '🌐',
    monacoLanguage: 'html',
    extension: '.html',
    outputMode: 'preview',
    color: 'text-orange-400',
  },
  {
    id: 'python',
    label: 'Python',
    icon: '🐍',
    monacoLanguage: 'python',
    extension: '.py',
    outputMode: 'console',
    color: 'text-blue-400',
  },
  {
    id: 'sql',
    label: 'SQL',
    icon: '🗄️',
    monacoLanguage: 'sql',
    extension: '.sql',
    outputMode: 'console',
    color: 'text-amber-400',
  },
  {
    id: 'c',
    label: 'C',
    icon: '⚙️',
    monacoLanguage: 'c',
    extension: '.c',
    outputMode: 'console',
    color: 'text-emerald-400',
  },
]

export const STORAGE_KEY = 'codestudio-saved-code'
export const STORAGE_LANGUAGE_KEY = 'codestudio-language'
export const STORAGE_THEME_KEY = 'codestudio-theme'
export const STORAGE_FONT_KEY = 'codestudio-font-size'

export const DEFAULT_FONT_SIZE = 14
export const MIN_FONT_SIZE = 10
export const MAX_FONT_SIZE = 30

export const MONACO_THEMES = {
  dark: 'vs-dark',
  light: 'vs',
}

export const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.js'
export const SQL_WASM_URL = 'https://sql.js.org/dist/sql-wasm.wasm'
