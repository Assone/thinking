import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ReadingSettings {
  doublePage: boolean
  autoPageTurn: boolean
  defaultScale: number
  defaultRotation: number
}

interface ThemeSettings {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'sm' | 'md' | 'lg'
  accentColor: string
}

interface SettingsState {
  reading: ReadingSettings
  theme: ThemeSettings
  setReading: (settings: Partial<ReadingSettings>) => void
  setTheme: (settings: Partial<ThemeSettings>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      reading: {
        doublePage: false,
        autoPageTurn: true,
        defaultScale: 1,
        defaultRotation: 0,
      },
      theme: {
        theme: 'system',
        fontSize: 'md',
        accentColor: '#0284C7',
      },
      setReading: (settings) =>
        set((state) => ({
          reading: { ...state.reading, ...settings },
        })),
      setTheme: (settings) =>
        set((state) => ({
          theme: { ...state.theme, ...settings },
        })),
    }),
    {
      name: 'thinking-settings',
    },
  ),
)
