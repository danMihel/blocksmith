<script setup lang="ts">
import { computed } from 'vue'
import { styleToCssVars } from '../model/styles'
import type { BlockNode } from '../model/types'
import BlockRenderer from './BlockRenderer.vue'

const { block } = defineProps<{ block: BlockNode }>()

const vars = computed(() => styleToCssVars(block.style))
</script>

<template>
  <!-- Spacing and visibility per breakpoint come from CSS variables + container queries. -->
  <div class="page-block" :style="vars">
    <BlockRenderer :block />
  </div>
</template>
