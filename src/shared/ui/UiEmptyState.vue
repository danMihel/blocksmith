<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  description?: string
  icon?: Component
}>()

defineSlots<{ actions?: () => unknown }>()
</script>

<template>
  <div
    class="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-16 text-center"
  >
    <div
      v-if="icon"
      class="mb-4 grid size-12 place-items-center rounded-xl bg-accent-soft text-accent [&_svg]:size-6"
    >
      <component :is="icon" aria-hidden="true" />
    </div>
    <h2 class="text-base font-semibold text-fg">{{ title }}</h2>
    <p v-if="description" class="mt-1.5 max-w-sm text-sm text-pretty text-fg-muted">
      {{ description }}
    </p>
    <div v-if="$slots.actions" class="mt-6 flex flex-wrap justify-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
