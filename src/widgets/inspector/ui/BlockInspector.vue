<script setup lang="ts">
import { Copy, Puzzle, Trash2, X } from '@lucide/vue'
import { computed, ref } from 'vue'
import { type AnyField, type BlockNode, useBlockRegistry } from '@/entities/block'
import { useEditorStore } from '@/entities/editor'
import { useBlockActions } from '@/features/block-actions'
import { UiIconButton, UiSegmented } from '@/shared/ui'
import FieldControl from './FieldControl.vue'
import StylePanel from './StylePanel.vue'

const { block } = defineProps<{ block: BlockNode }>()

const registry = useBlockRegistry()
const editor = useEditorStore()
const actions = useBlockActions()

const definition = computed(() => registry.get(block.type))
const fields = computed(() => (definition.value?.fields ?? []) as AnyField[])

const tab = ref<'content' | 'style'>('content')
const tabs = [
  { value: 'content', label: 'Content' },
  { value: 'style', label: 'Style' },
] as const

const errors = computed(() => {
  const map = new Map<string, string>()
  const result = definition.value?.schema.safeParse(block.props)
  if (result && !result.success) {
    for (const issue of result.error.issues) {
      const path = issue.path.map(String).join('.')
      if (!map.has(path)) map.set(path, issue.message)
    }
  }
  return map
})
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="flex items-start gap-3 border-b border-line p-4">
      <span
        class="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent [&_svg]:size-4.5"
      >
        <component :is="definition?.meta.icon ?? Puzzle" aria-hidden="true" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="truncate text-sm font-semibold">{{ definition?.meta.name ?? block.type }}</h2>
        <p class="line-clamp-2 text-xs text-fg-muted">
          {{ definition?.meta.description ?? 'This block type is not registered.' }}
        </p>
      </div>
      <div class="-mt-1 -mr-2 flex">
        <UiIconButton size="sm" label="Duplicate block" @click="actions.duplicateBlock(block.id)">
          <Copy />
        </UiIconButton>
        <UiIconButton size="sm" label="Delete block" @click="actions.removeBlock(block.id)">
          <Trash2 />
        </UiIconButton>
        <UiIconButton size="sm" label="Close inspector" @click="editor.select(null)">
          <X />
        </UiIconButton>
      </div>
    </header>

    <div class="px-4 pt-3">
      <UiSegmented v-model="tab" size="sm" stretch label="Inspector section" :options="tabs" />
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <div v-if="tab === 'content'" class="space-y-4 p-4">
        <p v-if="!definition" class="text-sm text-fg-muted">
          There is nothing to edit for an unknown block. You can still move or delete it.
        </p>
        <FieldControl
          v-for="field in fields"
          :key="field.key"
          :field
          :value="block.props[field.key]"
          :path="field.key"
          :errors
          @update="actions.updateProps(block.id, { [field.key]: $event })"
        />
      </div>
      <StylePanel v-else :block />
    </div>
  </div>
</template>
