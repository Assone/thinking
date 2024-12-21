import { useSettingsStore } from '@/services/stores/settings'
import { useCallback, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const { theme, setTheme } = useSettingsStore()

  const applyTheme = useCallback((theme: Theme) => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (theme.theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    applyTheme(theme.theme)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme.theme, applyTheme])

  const setThemeValue = useCallback(
    (newTheme: Theme) => {
      setTheme({ theme: newTheme })
      applyTheme(newTheme)
    },
    [setTheme, applyTheme],
  )

  return {
    theme: theme.theme,
    setTheme: setThemeValue,
    isDark:
      theme.theme === 'dark' ||
      (theme.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches),
  }
}
