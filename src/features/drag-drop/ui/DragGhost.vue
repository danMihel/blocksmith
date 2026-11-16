<script setup lang="ts">
import { dragState } from '../model/drag'
</script>

<template>
  <Teleport to="body">
    <div
      v-if="dragState.payload"
      class="pointer-events-none fixed top-0 left-0 z-50 flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-fg shadow-xl ring-1 ring-accent/30"
      :style="{ transform: `translate(${dragState.x + 14}px, ${dragState.y + 10}px)` }"
      aria-hidden="true"
    >
      <component :is="dragState.payload.icon" class="size-4 text-accent" />
      {{ dragState.payload.label }}
    </div>
  </Teleport>
</template>
