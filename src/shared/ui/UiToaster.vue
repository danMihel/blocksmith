<script setup lang="ts">
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from '@lucide/vue'
import { dismissToast, type ToastTone, useToasts } from './toast'

const toasts = useToasts()

const icons = { info: Info, success: CircleCheck, warning: TriangleAlert, error: CircleAlert }
const iconColors: Record<ToastTone, string> = {
  info: 'text-accent',
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  error: 'text-danger',
}
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:left-auto sm:w-96"
  >
    <TransitionGroup
      enter-from-class="translate-y-2 opacity-0"
      leave-to-class="translate-x-4 opacity-0"
      enter-active-class="transition duration-200 ease-out"
      leave-active-class="transition duration-150 ease-in absolute"
      move-class="transition duration-200"
    >
      <div
        v-for="item in toasts"
        :key="item.id"
        class="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-line bg-surface p-3.5 text-fg shadow-lg"
      >
        <component
          :is="icons[item.tone]"
          :class="['mt-0.5 size-4.5 shrink-0', iconColors[item.tone]]"
          aria-hidden="true"
        />
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium">{{ item.title }}</p>
          <p v-if="item.description" class="mt-0.5 text-[13px] text-fg-muted">
            {{ item.description }}
          </p>
        </div>
        <button
          type="button"
          class="-m-1 rounded p-1 text-fg-muted hover:text-fg"
          aria-label="Dismiss"
          @click="dismissToast(item.id)"
        >
          <X class="size-3.5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
