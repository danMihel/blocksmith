import { useDark, useToggle } from '@vueuse/core'
import { THEME_STORAGE_KEY } from '../config'

export function useDarkMode() {
  const isDark = useDark({ storageKey: THEME_STORAGE_KEY })
  const toggle = useToggle(isDark)
  return { isDark, toggle }
}
