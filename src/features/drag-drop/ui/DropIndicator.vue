<script setup lang="ts">
import { computed } from 'vue'
import { dragState } from '../model/drag'

const { listId } = defineProps<{ listId: string }>()

const target = computed(() => (dragState.target?.listId === listId ? dragState.target : null))
</script>

<template>
  <div
    v-if="target"
    class="pointer-events-none absolute inset-x-0 z-30 flex -translate-y-1/2 items-center"
    :style="{ top: `${target.offset}px` }"
    aria-hidden="true"
  >
    <span class="size-2.5 rounded-full border-2 border-accent bg-surface" />
    <span class="h-0.5 flex-1 bg-accent" />
    <span class="size-2.5 rounded-full border-2 border-accent bg-surface" />
  </div>
</template>
