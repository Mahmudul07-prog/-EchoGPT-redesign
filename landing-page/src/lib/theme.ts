import { useCallback, useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'echogpt-theme'

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}

/**
 * Tracks the user's theme preference (light/dark/system), persists it to
 * localStorage, keeps the `.dark` class on <html> in sync, and follows the
 * OS setting live while preference is "system".
 */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => readStoredPreference())
  const [resolved, setResolved] = useState<ResolvedTheme>(() => {
    const pref = readStoredPreference()
    return pref === 'system' ? getSystemTheme() : pref
  })

  useEffect(() => {
    const next = preference === 'system' ? getSystemTheme() : preference
    setResolved(next)
    applyTheme(next)
  }, [preference])

  useEffect(() => {
    if (preference !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const next = getSystemTheme()
      setResolved(next)
      applyTheme(next)
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [preference])

  const setTheme = useCallback((next: ThemePreference) => {
    setPreference(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const toggle = useCallback(() => {
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setTheme])

  return { preference, resolved, setTheme, toggle }
}
