// =============================================================================
// Color theme (dark default, optional light). Persists to localStorage and
// reflects onto <html data-theme>. Initialized by plugins/theme.client.ts.
// =============================================================================
export type ThemeName = 'dark' | 'light'

const STORAGE_KEY = 'brand-drive-theme'

export const useTheme = () => {
  const theme = useState<ThemeName>('theme', () => 'dark')

  const apply = (value: ThemeName) => {
    if (import.meta.client) {
      document.documentElement.dataset.theme = value
      try {
        localStorage.setItem(STORAGE_KEY, value)
      } catch {
        /* storage unavailable — ignore */
      }
    }
  }

  const set = (value: ThemeName) => {
    theme.value = value
    apply(value)
  }

  const toggle = () => set(theme.value === 'dark' ? 'light' : 'dark')

  const initFromStorage = () => {
    if (!import.meta.client) return
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null
      if (stored === 'dark' || stored === 'light') set(stored)
      else apply(theme.value)
    } catch {
      apply(theme.value)
    }
  }

  return { theme, set, toggle, initFromStorage }
}
