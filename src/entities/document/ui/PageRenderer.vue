<script setup lang="ts">
import { computed } from 'vue'
import { type BlockNode, PageBlock } from '@/entities/block'
import { DEFAULT_THEME, type PageTheme, themeToCssVars } from '@/entities/theme'

const { blocks, theme = DEFAULT_THEME } = defineProps<{
  blocks: readonly BlockNode[]
  theme?: PageTheme
}>()

/** The editor canvas wraps every block with selection chrome through this slot. */
defineSlots<{ block?: (props: { block: BlockNode; index: number }) => unknown }>()

const themeVars = computed(() => themeToCssVars(theme))
</script>

<template>
  <!--
    `page-root` applies the page theme (see app/styles/page-theme.css).
    `@container` makes blocks respond to the width of the page, not the browser window:
    that's what lets the editor preview any device by simply resizing the frame.
  -->
  <div class="page-root @container" :style="themeVars">
    <template v-for="(block, index) in blocks" :key="block.id">
      <slot name="block" :block :index>
        <PageBlock :block />
      </slot>
    </template>
  </div>
</template>
