<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { computed } from 'vue'
import { type AnyBlockDefinition, BLOCK_CATEGORIES, useBlockRegistry } from '@/entities/block'
import { useBlockActions } from '@/features/block-actions'
import { startDrag } from '@/features/drag-drop'
import { focusRing } from '@/shared/ui'

const registry = useBlockRegistry()
const actions = useBlockActions()

const groups = computed(() =>
  [...registry.groupByCategory()].map(([category, definitions]) => ({
    category,
    label: BLOCK_CATEGORIES[category],
    definitions,
  })),
)

function onPointerDown(event: PointerEvent, definition: AnyBlockDefinition) {
  startDrag(event, {
    kind: 'new',
    blockType: definition.type,
    label: definition.meta.name,
    icon: definition.meta.icon,
  })
}
</script>

<template>
  <div class="space-y-5 p-3">
    <p class="px-1 text-xs text-fg-muted">
      Click to add after the selected block, or drag onto the page.
    </p>

    <section
      v-for="group in groups"
      :key="group.category"
      :aria-labelledby="`lib-${group.category}`"
    >
      <h3
        :id="`lib-${group.category}`"
        class="px-1 text-[11px] font-semibold tracking-wide text-fg-muted uppercase"
      >
        {{ group.label }}
      </h3>
      <ul class="mt-1.5 space-y-0.5">
        <li v-for="definition in group.definitions" :key="definition.type">
          <button
            type="button"
            :class="[
              'group flex w-full cursor-grab items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-surface-muted active:cursor-grabbing',
              focusRing,
              'focus-visible:ring-offset-0',
            ]"
            @click="actions.addBlock(definition.type)"
            @pointerdown="onPointerDown($event, definition)"
          >
            <span
              class="grid size-9 shrink-0 place-items-center rounded-md border border-line bg-surface text-fg-muted transition-colors group-hover:border-accent/40 group-hover:text-accent"
            >
              <component :is="definition.meta.icon" class="size-4.5" aria-hidden="true" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-medium text-fg">{{ definition.meta.name }}</span>
              <span class="line-clamp-2 block text-xs text-fg-muted">
                {{ definition.meta.description }}
              </span>
            </span>
            <Plus
              class="size-4 shrink-0 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden="true"
            />
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>
