<script setup lang="ts">
import { Braces, FileCode } from '@lucide/vue'
import { useBlockRegistry } from '@/entities/block'
import type { PageDocument } from '@/entities/document'
import { focusRing, toast, UiDialog } from '@/shared/ui'
import { exportHtml, exportJson } from '../model/export'

const { page } = defineProps<{ page: PageDocument }>()

const open = defineModel<boolean>('open', { default: false })

const registry = useBlockRegistry()

const formats = [
  {
    id: 'html',
    icon: FileCode,
    title: 'HTML page',
    description: 'A single self-contained file, ready to host anywhere. Responsive, no JavaScript.',
    run: () => exportHtml(page, registry),
  },
  {
    id: 'json',
    icon: Braces,
    title: 'Blocksmith project',
    description: 'The page document as JSON. Import it later to keep editing.',
    run: () => exportJson(page),
  },
]

async function run(format: (typeof formats)[number]) {
  await format.run()
  open.value = false
  toast({ tone: 'success', title: `Exported ${format.title.toLowerCase()}` })
}
</script>

<template>
  <UiDialog
    v-model:open="open"
    title="Export page"
    description="Download the page to use it elsewhere."
  >
    <div class="grid gap-3 sm:grid-cols-2">
      <button
        v-for="format in formats"
        :key="format.id"
        type="button"
        :class="[
          'group flex flex-col items-start gap-3 rounded-xl border border-line p-4 text-left transition-colors hover:border-accent hover:bg-accent-soft/40',
          focusRing,
        ]"
        @click="run(format)"
      >
        <span
          class="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent [&_svg]:size-5"
        >
          <component :is="format.icon" aria-hidden="true" />
        </span>
        <span>
          <span class="block text-sm font-semibold">{{ format.title }}</span>
          <span class="mt-1 block text-[13px] text-fg-muted">{{ format.description }}</span>
        </span>
      </button>
    </div>
  </UiDialog>
</template>
