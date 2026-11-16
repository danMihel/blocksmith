<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  title: string
  description: string
}>()
</script>

<template>
  <div role="alert" class="px-6 py-4">
    <div
      class="mx-auto flex max-w-3xl items-start gap-3 rounded-xl border border-dashed border-amber-400/60 bg-amber-50 p-4 text-left text-amber-900"
    >
      <component :is="icon" class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div class="min-w-0">
        <p class="text-sm font-semibold">{{ title }}</p>
        <p class="mt-0.5 text-sm break-words opacity-80">{{ description }}</p>
      </div>
    </div>
  </div>
</template>
