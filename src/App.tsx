import { Outlet } from '@tanstack/react-router'
import { memo, useEffect } from 'react'
import { AppSidebar } from './components/app-siderbar'
import { useTheme } from './hooks/use-theme'

const App = memo(() => {
  const { theme } = useTheme()

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      document.documentElement.classList.add(systemTheme)
    } else {
      document.documentElement.classList.add(theme)
    }
  }, [theme])

  return (
    <>
      <AppSidebar />
      <main className="min-h-screen w-full bg-background text-foreground overflow-hidden">
        <Outlet />
      </main>
    </>
  )
})

export default App
