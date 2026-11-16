<script setup lang="ts">
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Copy,
  Download,
  Eye,
  FileQuestion,
  Layers,
  LayoutGrid,
  Moon,
  PanelLeft,
  PanelRight,
  Plus,
  Redo2,
  Search,
  Settings2,
  Trash2,
  Undo2,
} from '@lucide/vue'
import { useMediaQuery } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { BREAKPOINT_META, BREAKPOINTS, type Breakpoint, useBlockRegistry } from '@/entities/block'
import { loadDocument, useDocumentRepository, useDocumentStore } from '@/entities/document'
import { useEditorStore } from '@/entities/editor'
import { SaveStatusIndicator, useAutosave } from '@/features/autosave'
import { useBlockActions } from '@/features/block-actions'
import { CommandPalette, type PaletteCommand } from '@/features/command-palette'
import { useEditorHotkeys } from '@/features/editor-hotkeys'
import { ExportDialog } from '@/features/export-page'
import { ThemeToggle, useDarkMode } from '@/features/theme-toggle'
import { BlockLibrary } from '@/widgets/block-library'
import { EditorCanvas } from '@/widgets/canvas'
import { Inspector } from '@/widgets/inspector'
import { LayersPanel } from '@/widgets/layers-panel'
import { APP_NAME, RouteName } from '@/shared/config'
import { shortcutKeys } from '@/shared/lib'
import {
  type SegmentedOption,
  toast,
  UiButton,
  UiEmptyState,
  UiIconButton,
  UiKbd,
  UiSegmented,
} from '@/shared/ui'

const { id } = defineProps<{ id: string }>()

const router = useRouter()
const repository = useDocumentRepository()
const registry = useBlockRegistry()
const documentStore = useDocumentStore()
const editor = useEditorStore()
const actions = useBlockActions()
const autosave = useAutosave()
const { toggle: toggleDarkMode } = useDarkMode()

const { document, canUndo, canRedo, undoLabel, redoLabel } = storeToRefs(documentStore)

/* ---------- Loading ---------- */

const state = ref<'loading' | 'ready' | 'missing' | 'invalid'>('loading')

watch(
  () => id,
  async (pageId) => {
    await autosave.flush()
    state.value = 'loading'
    editor.reset()
    const result = await loadDocument(repository, registry, pageId)
    if (result.status !== 'ok') {
      documentStore.close()
      state.value = result.status === 'not-found' ? 'missing' : 'invalid'
      return
    }
    documentStore.open(result.document)
    state.value = 'ready'
    if (result.issues.length) {
      toast({
        tone: 'warning',
        title: `This page has ${result.issues.length} problem(s)`,
        description: 'Affected blocks show a placeholder; you can fix or remove them.',
      })
    }
  },
  { immediate: true },
)

watch(
  () => document.value?.name,
  (name) => {
    if (name) window.document.title = `${name} · ${APP_NAME}`
  },
)

onBeforeRouteLeave(() => autosave.flush())

// Undo/redo can remove the selected or hovered block.
watch(
  () => documentStore.blocks,
  (blocks) => {
    const exists = (blockId: string | null) => !!blockId && blocks.some((b) => b.id === blockId)
    if (!exists(editor.selectedBlockId)) editor.select(null)
    if (!exists(editor.hoveredBlockId)) editor.hover(null)
  },
)

/* ---------- Layout ---------- */

const isLarge = useMediaQuery('(min-width: 1024px)')
const leftOpen = ref(false)
const rightOpen = ref(false)
const leftTab = ref<'blocks' | 'layers'>('blocks')

const leftTabs = [
  { value: 'blocks', label: 'Blocks', icon: LayoutGrid },
  { value: 'layers', label: 'Layers', icon: Layers },
] as const

const breakpointOptions: SegmentedOption<Breakpoint>[] = BREAKPOINTS.map((bp) => ({
  value: bp,
  label: BREAKPOINT_META[bp].label,
  icon: BREAKPOINT_META[bp].icon,
  iconOnly: true,
}))

// On small screens, selecting a block opens the inspector drawer.
watch(
  () => editor.selectedBlockId,
  (selected) => {
    if (selected && !isLarge.value) {
      leftOpen.value = false
      rightOpen.value = true
    }
  },
)

function togglePanel(side: 'left' | 'right') {
  leftOpen.value = side === 'left' ? !leftOpen.value : false
  rightOpen.value = side === 'right' ? !rightOpen.value : false
}

/* ---------- Commands ---------- */

const paletteOpen = ref(false)
const exportOpen = ref(false)

const openPreview = () => router.push({ name: RouteName.Preview, params: { id } })

function withSelected(run: (blockId: string) => void) {
  return () => {
    if (editor.selectedBlockId) run(editor.selectedBlockId)
  }
}

useEditorHotkeys({
  undo: documentStore.undo,
  redo: documentStore.redo,
  openPalette: () => (paletteOpen.value = true),
  removeSelected: withSelected(actions.removeBlock),
  duplicateSelected: withSelected(actions.duplicateBlock),
  moveSelected: (delta) => withSelected((blockId) => actions.moveBy(blockId, delta))(),
  deselect: () => editor.select(null),
})

const paletteCommands = computed<PaletteCommand[]>(() => {
  const hasSelection = !!editor.selectedBlockId
  return [
    {
      id: 'undo',
      group: 'Edit',
      label: undoLabel.value ? `Undo: ${undoLabel.value}` : 'Undo',
      icon: Undo2,
      shortcut: ['mod', 'z'],
      disabled: !canUndo.value,
      run: documentStore.undo,
    },
    {
      id: 'redo',
      group: 'Edit',
      label: redoLabel.value ? `Redo: ${redoLabel.value}` : 'Redo',
      icon: Redo2,
      shortcut: ['mod', 'shift', 'z'],
      disabled: !canRedo.value,
      run: documentStore.redo,
    },
    {
      id: 'duplicate',
      group: 'Edit',
      label: 'Duplicate selected block',
      icon: Copy,
      shortcut: ['mod', 'd'],
      disabled: !hasSelection,
      run: withSelected(actions.duplicateBlock),
    },
    {
      id: 'move-up',
      group: 'Edit',
      label: 'Move selected block up',
      icon: ArrowUp,
      shortcut: ['alt', '↑'],
      disabled: !hasSelection,
      run: withSelected((blockId) => actions.moveBy(blockId, -1)),
    },
    {
      id: 'move-down',
      group: 'Edit',
      label: 'Move selected block down',
      icon: ArrowDown,
      shortcut: ['alt', '↓'],
      disabled: !hasSelection,
      run: withSelected((blockId) => actions.moveBy(blockId, 1)),
    },
    {
      id: 'delete',
      group: 'Edit',
      label: 'Delete selected block',
      icon: Trash2,
      shortcut: ['delete'],
      disabled: !hasSelection,
      run: withSelected(actions.removeBlock),
    },
    ...registry.list().map((definition) => ({
      id: `add-${definition.type}`,
      group: 'Add block',
      label: `Add ${definition.meta.name}`,
      keywords: definition.meta.description,
      icon: Plus,
      run: () => actions.addBlock(definition.type),
    })),
    ...documentStore.blocks.map((block, index) => ({
      id: `select-${block.id}`,
      group: 'Go to block',
      label: `${index + 1}. ${actions.nameOf(block.id)}`,
      keywords: typeof block.props.title === 'string' ? block.props.title : '',
      icon: registry.get(block.type)?.meta.icon,
      run: () => editor.select(block.id),
    })),
    ...BREAKPOINTS.map((bp) => ({
      id: `breakpoint-${bp}`,
      group: 'View',
      label: `Preview on ${BREAKPOINT_META[bp].label}`,
      icon: BREAKPOINT_META[bp].icon,
      run: () => (editor.breakpoint = bp),
    })),
    {
      id: 'dark-mode',
      group: 'View',
      label: 'Toggle dark mode',
      icon: Moon,
      run: () => toggleDarkMode(),
    },
    {
      id: 'page-settings',
      group: 'Page',
      label: 'Page settings & theme',
      icon: Settings2,
      run: () => {
        editor.select(null)
        if (!isLarge.value) rightOpen.value = true
      },
    },
    { id: 'preview', group: 'Page', label: 'Open preview', icon: Eye, run: openPreview },
    {
      id: 'export',
      group: 'Page',
      label: 'Export page…',
      keywords: 'download html json',
      icon: Download,
      run: () => (exportOpen.value = true),
    },
    {
      id: 'back',
      group: 'Page',
      label: 'Back to all pages',
      icon: ArrowLeft,
      run: () => router.push({ name: RouteName.Dashboard }),
    },
  ]
})

const asideBase =
  'flex shrink-0 flex-col bg-surface max-lg:absolute max-lg:inset-y-0 max-lg:z-30 max-lg:shadow-2xl max-lg:transition-transform max-lg:duration-200'
</script>

<template>
  <div class="flex h-svh flex-col">
    <header
      class="flex h-14 shrink-0 items-center gap-1 border-b border-line bg-surface px-2 sm:gap-2 sm:px-3"
    >
      <UiIconButton
        label="Back to pages"
        size="sm"
        @click="router.push({ name: RouteName.Dashboard })"
      >
        <ArrowLeft />
      </UiIconButton>
      <UiIconButton
        class="lg:hidden"
        label="Blocks and layers"
        size="sm"
        :pressed="leftOpen"
        @click="togglePanel('left')"
      >
        <PanelLeft />
      </UiIconButton>

      <div class="flex min-w-0 flex-1 items-center gap-3">
        <span class="truncate text-sm font-medium">{{ document?.name ?? 'Loading…' }}</span>
        <SaveStatusIndicator v-if="state === 'ready'" :status="autosave.status.value" />
      </div>

      <template v-if="state === 'ready'">
        <div class="flex items-center">
          <UiIconButton
            size="sm"
            :label="undoLabel ? `Undo: ${undoLabel}` : 'Nothing to undo'"
            :disabled="!canUndo"
            @click="documentStore.undo()"
          >
            <Undo2 />
          </UiIconButton>
          <UiIconButton
            size="sm"
            :label="redoLabel ? `Redo: ${redoLabel}` : 'Nothing to redo'"
            :disabled="!canRedo"
            @click="documentStore.redo()"
          >
            <Redo2 />
          </UiIconButton>
        </div>

        <UiSegmented
          v-model="editor.breakpoint"
          class="max-sm:hidden"
          label="Preview device"
          size="sm"
          :options="breakpointOptions"
        />

        <div class="flex flex-1 items-center justify-end gap-1 sm:gap-1.5">
          <UiButton size="sm" variant="ghost" class="max-xl:hidden" @click="paletteOpen = true">
            <template #icon><Search /></template>
            Commands
            <span class="ml-1 flex gap-0.5">
              <UiKbd v-for="key in shortcutKeys(['mod', 'k'])" :key>{{ key }}</UiKbd>
            </span>
          </UiButton>
          <UiIconButton class="xl:hidden" size="sm" label="Commands" @click="paletteOpen = true">
            <Search />
          </UiIconButton>
          <ThemeToggle size="sm" class="max-sm:hidden" />
          <UiIconButton size="sm" label="Export" @click="exportOpen = true">
            <Download />
          </UiIconButton>
          <UiButton size="sm" variant="primary" @click="openPreview">
            <template #icon><Eye /></template>
            <span class="max-sm:sr-only">Preview</span>
          </UiButton>
          <UiIconButton
            class="lg:hidden"
            label="Inspector"
            size="sm"
            :pressed="rightOpen"
            @click="togglePanel('right')"
          >
            <PanelRight />
          </UiIconButton>
        </div>
      </template>
    </header>

    <div v-if="state === 'ready'" class="relative flex min-h-0 flex-1 overflow-hidden">
      <aside
        :class="[
          asideBase,
          'w-72 border-r border-line max-lg:left-0',
          leftOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full',
        ]"
        :inert="!isLarge && !leftOpen"
        aria-label="Blocks and layers"
      >
        <div class="border-b border-line p-2">
          <UiSegmented v-model="leftTab" size="sm" stretch label="Sidebar" :options="leftTabs" />
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto" data-autoscroll>
          <BlockLibrary v-if="leftTab === 'blocks'" />
          <LayersPanel v-else />
        </div>
      </aside>

      <main class="min-w-0 flex-1">
        <EditorCanvas />
      </main>

      <aside
        :class="[
          asideBase,
          'w-80 border-l border-line max-lg:right-0',
          rightOpen ? 'max-lg:translate-x-0' : 'max-lg:translate-x-full',
        ]"
        :inert="!isLarge && !rightOpen"
        aria-label="Inspector"
      >
        <Inspector />
      </aside>

      <Transition
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
        enter-active-class="transition-opacity"
        leave-active-class="transition-opacity"
      >
        <div
          v-if="!isLarge && (leftOpen || rightOpen)"
          class="absolute inset-0 z-20 bg-black/30"
          aria-hidden="true"
          @click="leftOpen = rightOpen = false"
        />
      </Transition>
    </div>

    <div v-else-if="state === 'loading'" class="grid flex-1 place-items-center" aria-busy="true">
      <span class="size-6 animate-spin rounded-full border-2 border-line border-t-accent" />
    </div>

    <main v-else class="mx-auto w-full max-w-lg px-4 py-24">
      <UiEmptyState
        :icon="FileQuestion"
        :title="state === 'missing' ? 'Page not found' : 'This page can’t be opened'"
        :description="
          state === 'missing'
            ? 'It may have been deleted, or it was saved in another browser.'
            : 'The saved data is damaged or comes from a newer version of the app.'
        "
      >
        <template #actions>
          <UiButton @click="router.push({ name: RouteName.Dashboard })">Back to pages</UiButton>
        </template>
      </UiEmptyState>
    </main>

    <CommandPalette v-model:open="paletteOpen" :commands="paletteCommands" />
    <ExportDialog v-if="document" v-model:open="exportOpen" :page="document" />
  </div>
</template>
