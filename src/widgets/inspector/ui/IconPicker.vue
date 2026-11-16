<script setup lang="ts">
import { cn } from '@/shared/lib'
import { CONTENT_ICONS, type ContentIconName, focusRing } from '@/shared/ui'

defineProps<{ label: string }>()

const model = defineModel<string>({ required: true })

const icons = Object.entries(CONTENT_ICONS) as [
  ContentIconName,
  (typeof CONTENT_ICONS)[ContentIconName],
][]
</script>

<template>
  <fieldset class="min-w-0">
    <legend class="mb-1.5 text-[13px] font-medium text-fg">{{ label }}</legend>
    <div role="radiogroup" :aria-label="label" class="grid grid-cols-7 gap-1">
      <button
        v-for="[name, icon] in icons"
        :key="name"
        type="button"
        role="radio"
        :aria-checked="model === name"
        :aria-label="name"
        :title="name"
        :class="
          cn(
            'grid aspect-square place-items-center rounded-md border transition-colors',
            focusRing,
            'focus-visible:ring-offset-0',
            model === name
              ? 'border-accent bg-accent-soft text-accent'
              : 'border-line text-fg-muted hover:bg-surface-muted hover:text-fg',
          )
        "
        @click="model = name"
      >
        <component :is="icon" class="size-4" aria-hidden="true" />
      </button>
    </div>
  </fieldset>
</template>
