import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react'
import type { Language, OutputEntry, ThemeMode, AppState, MobileTab } from '../types'
import { getTemplate } from '../utils/templates'
import { STORAGE_KEY, STORAGE_LANGUAGE_KEY, STORAGE_THEME_KEY, STORAGE_FONT_KEY, DEFAULT_FONT_SIZE } from '../utils/constants'

type Action =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_CODE'; payload: string }
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'ADD_OUTPUT'; payload: OutputEntry }
  | { type: 'CLEAR_OUTPUT' }
  | { type: 'SET_LOADING'; payload: { loading: boolean; message?: string } }
  | { type: 'SET_MOBILE_TAB'; payload: MobileTab }
  | { type: 'SET_FONT_SIZE'; payload: number }
  | { type: 'SET_FULLSCREEN'; payload: boolean }
  | { type: 'RESET_CODE' }
  | { type: 'LOAD_LESSON'; payload: { language: Language; code: string } }
  | { type: 'SET_SHOW_WELCOME'; payload: boolean }
  | { type: 'RESTORE_STATE'; payload: Partial<AppState> }

function loadFromStorage<T>(key: string, fallback: T): T {
  try { const item = localStorage.getItem(key); return item ? (JSON.parse(item) as T) : fallback }
  catch { return fallback }
}
function saveToStorage(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}

function applyTheme(theme: ThemeMode): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

const savedLanguage = loadFromStorage<Language>(STORAGE_LANGUAGE_KEY, 'html')
const savedTheme = loadFromStorage<ThemeMode>(STORAGE_THEME_KEY, 'dark')
const savedFontSize = loadFromStorage<number>(STORAGE_FONT_KEY, DEFAULT_FONT_SIZE)
const savedCode = loadFromStorage<Record<string, string>>(STORAGE_KEY, {})

function initialState(): AppState {
  return {
    language: savedLanguage, theme: savedTheme,
    code: savedCode[savedLanguage] || getTemplate(savedLanguage),
    output: [], activeMobileTab: savedLanguage === 'html' ? 'preview' : 'editor',
    isLoading: false, loadingMessage: '',
    fontSize: savedFontSize, isFullscreen: false,
    showWelcome: true,
  }
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LANGUAGE': {
      const saved = loadFromStorage<Record<string, string>>(STORAGE_KEY, {})
      return { ...state, language: action.payload, code: saved[action.payload] || getTemplate(action.payload), output: [], showWelcome: false, activeMobileTab: action.payload === 'html' ? 'preview' : 'editor' }
    }
    case 'SET_CODE': return { ...state, code: action.payload }
    case 'SET_THEME': return { ...state, theme: action.payload }
    case 'ADD_OUTPUT': return { ...state, output: [...state.output, action.payload] }
    case 'CLEAR_OUTPUT': return { ...state, output: [] }
    case 'SET_LOADING': return { ...state, isLoading: action.payload.loading, loadingMessage: action.payload.message || '' }
    case 'SET_MOBILE_TAB': return { ...state, activeMobileTab: action.payload }
    case 'SET_FONT_SIZE': return { ...state, fontSize: action.payload }
    case 'SET_FULLSCREEN': return { ...state, isFullscreen: action.payload }
    case 'RESET_CODE': return { ...state, code: getTemplate(state.language) }
    case 'LOAD_LESSON': return { ...state, language: action.payload.language, code: action.payload.code, output: [], showWelcome: false, activeMobileTab: action.payload.language === 'html' ? 'preview' : 'editor' }
    case 'SET_SHOW_WELCOME': return { ...state, showWelcome: action.payload }
    case 'RESTORE_STATE': return { ...state, ...action.payload }
    default: return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
  setLanguage: (lang: Language) => void
  setCode: (code: string) => void
  setTheme: (theme: ThemeMode) => void
  addOutput: (entry: OutputEntry) => void
  clearOutput: () => void
  setLoading: (loading: boolean, message?: string) => void
  setMobileTab: (tab: MobileTab) => void
  setFontSize: (size: number) => void
  setFullscreen: (fs: boolean) => void
  resetCode: () => void
  loadLesson: (language: Language, code: string) => void
  setShowWelcome: (show: boolean) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  useEffect(() => {
    applyTheme(state.theme)
  }, [state.theme])

  const setLanguage = useCallback((lang: Language) => { dispatch({ type: 'SET_LANGUAGE', payload: lang }); saveToStorage(STORAGE_LANGUAGE_KEY, lang) }, [])
  const setCode = useCallback((code: string) => { dispatch({ type: 'SET_CODE', payload: code }) }, [])
  const setTheme = useCallback((theme: ThemeMode) => { dispatch({ type: 'SET_THEME', payload: theme }); saveToStorage(STORAGE_THEME_KEY, theme) }, [])
  const addOutput = useCallback((entry: OutputEntry) => { dispatch({ type: 'ADD_OUTPUT', payload: entry }) }, [])
  const clearOutput = useCallback(() => { dispatch({ type: 'CLEAR_OUTPUT' }) }, [])
  const setLoading = useCallback((loading: boolean, message?: string) => { dispatch({ type: 'SET_LOADING', payload: { loading, message } }) }, [])
  const setMobileTab = useCallback((tab: MobileTab) => { dispatch({ type: 'SET_MOBILE_TAB', payload: tab }) }, [])
  const setFontSize = useCallback((size: number) => { dispatch({ type: 'SET_FONT_SIZE', payload: size }); saveToStorage(STORAGE_FONT_KEY, size) }, [])
  const setFullscreen = useCallback((fs: boolean) => { dispatch({ type: 'SET_FULLSCREEN', payload: fs }) }, [])
  const resetCode = useCallback(() => { dispatch({ type: 'RESET_CODE' }) }, [])
  const loadLesson = useCallback((language: Language, code: string) => { dispatch({ type: 'LOAD_LESSON', payload: { language, code } }); saveToStorage(STORAGE_LANGUAGE_KEY, language) }, [])
  const setShowWelcome = useCallback((show: boolean) => { dispatch({ type: 'SET_SHOW_WELCOME', payload: show }) }, [])

  return (
    <AppContext.Provider value={{ state, dispatch, setLanguage, setCode, setTheme, addOutput, clearOutput, setLoading, setMobileTab, setFontSize, setFullscreen, resetCode, loadLesson, setShowWelcome }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}