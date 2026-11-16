<script setup lang="ts">
import { Bug, Puzzle } from '@lucide/vue'
import { computed, onErrorCaptured, shallowRef, watch } from 'vue'
import { useBlockRegistry } from '../model/registry'
import type { BlockNode } from '../model/types'
import BlockFallback from './BlockFallback.vue'

const { block } = defineProps<{ block: BlockNode }>()

const registry = useBlockRegistry()
const definition = computed(() => registry.get(block.type))

const error = shallowRef<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err instanceof Error ? err : new Error(String(err))
  console.error(`[BlockRenderer] "${block.type}" (${block.id}) failed to render`, err)
  return false
})

watch(
  () => block.props,
  () => (error.value = null),
)
</script>

<template>
  <BlockFallback
    v-if="!definition"
    :icon="Puzzle"
    :title="`Unknown block “${block.type}”`"
    description="This block type isn't registered. It is kept in the document but can't be displayed."
  />
  <BlockFallback
    v-else-if="error"
    :icon="Bug"
    :title="`“${definition.meta.name}” failed to render`"
    :description="error.message"
  />
  <component :is="definition.component" v-else v-bind="block.props" />
</template>
