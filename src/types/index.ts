export type Language = 'html' | 'python' | 'sql' | 'c'
export type ThemeMode = 'dark' | 'light'
export type MobileTab = 'editor' | 'preview' | 'console'

export interface OutputEntry {
  type: 'stdout' | 'stderr' | 'error' | 'table' | 'system' | 'success'
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
  accent: string
  tagline: string
  bg: string
  cardBg: string
  darkCardBg: string
}

export interface Lesson {
  id: string
  language: Language
  title: string
  description: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  code: string
}

export interface AppState {
  language: Language
  theme: ThemeMode
  code: string
  output: OutputEntry[]
  activeMobileTab: MobileTab
  isLoading: boolean
  loadingMessage: string
  fontSize: number
  isFullscreen: boolean
  showWelcome: boolean
}
