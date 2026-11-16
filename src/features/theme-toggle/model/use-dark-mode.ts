import { useDark, useToggle } from '@vueuse/core'
import { THEME_STORAGE_KEY } from '../config'

/** Editor UI color scheme (not the page theme). */
export function useDarkMode() {
  const isDark = useDark({ storageKey: THEME_STORAGE_KEY })
  const toggle = useToggle(isDark)
  return { isDark, toggle }
}
