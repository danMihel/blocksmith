import { readonly, shallowRef } from 'vue'

export type ToastTone = 'info' | 'success' | 'warning' | 'error'

export type Toast = {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

const toasts = shallowRef<readonly Toast[]>([])
let nextId = 1

export function toast({
  title,
  description,
  tone = 'info',
  duration = 4000,
}: {
  title: string
  description?: string
  tone?: ToastTone
  duration?: number
}): number {
  const id = nextId++
  toasts.value = [...toasts.value, { id, title, description, tone }].slice(-4)
  if (duration > 0) setTimeout(() => dismissToast(id), duration)
  return id
}

export function dismissToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

export function useToasts() {
  return readonly(toasts)
}
