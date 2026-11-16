<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'
import type { BlockNode } from '@/entities/block'
import { DEFAULT_THEME, type PageTheme } from '@/entities/theme'
import PageRenderer from './PageRenderer.vue'

const { blocks, theme = DEFAULT_THEME } = defineProps<{
  blocks: readonly BlockNode[]
  theme?: PageTheme
}>()

/** Renders the real page at desktop width and scales it down to fit the card. */
const RENDER_WIDTH = 1280

const container = useTemplateRef<HTMLElement>('container')
const { width } = useElementSize(container)
const scale = computed(() => width.value / RENDER_WIDTH)
</script>

<template>
  <div
    ref="container"
    class="relative overflow-hidden"
    :style="{ backgroundColor: theme.background }"
    aria-hidden="true"
    inert
  >
    <div
      v-if="width"
      class="absolute top-0 left-0 origin-top-left"
      :style="{ width: `${RENDER_WIDTH}px`, transform: `scale(${scale})` }"
    >
      <PageRenderer :blocks :theme />
    </div>
  </div>
</template>
