<script setup lang="ts">
import { useId } from 'vue'
import { cn } from '@/shared/lib'
import { focusRing } from './styles'

const { label, hint } = defineProps<{ label: string; hint?: string }>()

const model = defineModel<boolean>({ default: false })

const id = useId()
</script>

<template>
  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0">
      <label :for="id" class="text-[13px] font-medium text-fg">{{ label }}</label>
      <p v-if="hint" :id="`${id}-hint`" class="text-xs text-fg-muted">{{ hint }}</p>
    </div>
    <button
      :id
      type="button"
      role="switch"
      :aria-checked="model"
      :aria-describedby="hint ? `${id}-hint` : undefined"
      :class="
        cn(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
          focusRing,
          model ? 'bg-accent' : 'bg-line',
        )
      "
      @click="model = !model"
    >
      <span
        :class="
          cn(
            'size-4 rounded-full bg-white shadow-sm transition-transform',
            model ? 'translate-x-4.5' : 'translate-x-0.5',
          )
        "
      />
    </button>
  </div>
</template>
