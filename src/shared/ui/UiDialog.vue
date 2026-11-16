<script setup lang="ts">
import { X } from '@lucide/vue'
import { onMounted, useId, useTemplateRef, watch } from 'vue'
import { cn } from '@/shared/lib'
import UiIconButton from './UiIconButton.vue'

/**
 * Built on the native <dialog>: focus trapping, Esc, top layer and inert background
 * come from the platform instead of JavaScript.
 */
const {
  title,
  description,
  size = 'md',
  bare = false,
} = defineProps<{
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** No visible header (the title stays available to assistive tech). */
  bare?: boolean
}>()

defineSlots<{ default?: () => unknown; footer?: () => unknown }>()

const open = defineModel<boolean>('open', { default: false })

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const titleId = useId()
const descriptionId = useId()

function sync(value: boolean) {
  const el = dialog.value
  if (!el) return
  if (value && !el.open) el.showModal()
  if (!value && el.open) el.close()
}

watch(open, sync, { flush: 'post' })
onMounted(() => sync(open.value))

function onBackdropClick(event: MouseEvent) {
  if (event.target === dialog.value) open.value = false
}

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
</script>

<template>
  <dialog
    ref="dialog"
    :aria-labelledby="titleId"
    :aria-describedby="description ? descriptionId : undefined"
    :class="
      cn(
        'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-fg shadow-2xl',
        'backdrop:bg-black/40 backdrop:backdrop-blur-[2px]',
        'scale-95 opacity-0 transition-[opacity,scale,display,overlay] transition-discrete duration-150 open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0',
        sizes[size],
      )
    "
    @close="open = false"
    @click="onBackdropClick"
  >
    <div class="flex max-h-[calc(100dvh-2rem)] flex-col">
      <header v-if="!bare" class="flex items-start gap-3 px-5 pt-5 pb-3">
        <div class="min-w-0 flex-1">
          <h2 :id="titleId" class="text-base font-semibold">{{ title }}</h2>
          <p v-if="description" :id="descriptionId" class="mt-1 text-sm text-fg-muted">
            {{ description }}
          </p>
        </div>
        <UiIconButton label="Close" size="sm" class="-mt-1 -mr-2" @click="open = false">
          <X />
        </UiIconButton>
      </header>
      <h2 v-else :id="titleId" class="sr-only">{{ title }}</h2>

      <div :class="cn('min-h-0 flex-1 overflow-y-auto', !bare && 'px-5 pb-5')">
        <slot />
      </div>

      <footer
        v-if="$slots.footer"
        class="flex flex-wrap justify-end gap-2 border-t border-line bg-surface-muted/50 px-5 py-3"
      >
        <slot name="footer" />
      </footer>
    </div>
  </dialog>
</template>
