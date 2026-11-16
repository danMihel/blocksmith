<script setup lang="ts">
import { computed } from 'vue'
import { type BlockNode, PageBlock } from '@/entities/block'
import { DEFAULT_THEME, type PageTheme, themeToCssVars } from '@/entities/theme'

const { blocks, theme = DEFAULT_THEME } = defineProps<{
  blocks: readonly BlockNode[]
  theme?: PageTheme
}>()

defineSlots<{ block?: (props: { block: BlockNode; index: number }) => unknown }>()

const themeVars = computed(() => themeToCssVars(theme))
</script>

<template>
  <div class="page-root @container" :style="themeVars">
    <template v-for="(block, index) in blocks" :key="block.id">
      <slot name="block" :block :index>
        <PageBlock :block />
      </slot>
    </template>
  </div>
</template>
