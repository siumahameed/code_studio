import { useEffect, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import { STORAGE_KEY } from '../utils/constants'

const SAVE_DELAY = 500

export function useAutoSave() {
  const { state } = useAppContext()
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, string>
        saved[state.language] = state.code
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
      } catch { /* ignore */ }
    }, SAVE_DELAY)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [state.code, state.language])
}
