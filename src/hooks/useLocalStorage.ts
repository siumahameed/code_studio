import { useEffect, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import { STORAGE_KEY, STORAGE_LANGUAGE_KEY, STORAGE_THEME_KEY, STORAGE_FONT_KEY } from '../utils/constants'

const SAVE_DELAY = 500

export function useAutoSave() {
  const { state } = useAppContext()
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const prevStateRef = useRef(state)

  useEffect(() => {
    const hasChanged = 
      state.code !== prevStateRef.current.code ||
      state.language !== prevStateRef.current.language ||
      state.theme !== prevStateRef.current.theme ||
      state.fontSize !== prevStateRef.current.fontSize

    if (!hasChanged) return

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      try {
        const savedCode = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, string>
        savedCode[state.language] = state.code
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCode))
        localStorage.setItem(STORAGE_LANGUAGE_KEY, state.language)
        localStorage.setItem(STORAGE_THEME_KEY, state.theme)
        localStorage.setItem(STORAGE_FONT_KEY, String(state.fontSize))
      } catch { /* ignore */ }
    }, SAVE_DELAY)
    prevStateRef.current = state
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [state.code, state.language, state.theme, state.fontSize])
}
