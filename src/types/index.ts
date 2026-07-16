export type Language = 'html' | 'python' | 'sql' | 'c'

export interface OutputEntry {
  type: 'stdout' | 'stderr' | 'error' | 'table' | 'system'
  content: string
  timestamp: number
}

export interface RunnerResult {
  stdout: string
  stderr: string
  error: string | null
  table?: { columns: string[]; rows: string[][] }
}

export interface LanguageConfig {
  id: Language
  label: string
  icon: string
  monacoLanguage: string
  extension: string
  outputMode: 'console' | 'preview'
  color: string
}

export type ThemeMode = 'dark' | 'light'

export interface AppState {
  language: Language
  theme: ThemeMode
  code: string
  output: OutputEntry[]
  activeMobileTab: 'editor' | 'preview' | 'console'
  isLoading: boolean
  loadingMessage: string
  fontSize: number
  isFullscreen: boolean
}
