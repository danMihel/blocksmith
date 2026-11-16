<script setup lang="ts">
import { Cloud, CloudOff, LoaderCircle } from '@lucide/vue'
import { computed } from 'vue'
import type { SaveStatus } from '../model/use-autosave'

const { status } = defineProps<{ status: SaveStatus }>()

const view = computed(
  () =>
    ({
      saved: { icon: Cloud, label: 'Saved', class: 'text-fg-muted' },
      pending: { icon: Cloud, label: 'Unsaved changes', class: 'text-fg-muted' },
      saving: { icon: LoaderCircle, label: 'Saving…', class: 'text-fg-muted [&_svg]:animate-spin' },
      error: { icon: CloudOff, label: 'Not saved', class: 'text-danger' },
    })[status],
)
</script>

<template>
  <span
    :class="['inline-flex items-center gap-1.5 text-xs whitespace-nowrap', view.class]"
    role="status"
    :title="view.label"
  >
    <component :is="view.icon" class="size-3.5" aria-hidden="true" />
    <span class="max-md:sr-only">{{ view.label }}</span>
  </span>
</template>
