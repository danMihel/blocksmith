<script setup lang="ts">
import { CornerDownLeft, Search } from '@lucide/vue'
import { computed, nextTick, ref, useId, useTemplateRef, watch } from 'vue'
import { cn, shortcutKeys } from '@/shared/lib'
import { UiDialog, UiKbd } from '@/shared/ui'
import { fuzzyFilter } from '../model/fuzzy'
import type { PaletteCommand } from '../model/types'

const { commands } = defineProps<{ commands: readonly PaletteCommand[] }>()

const open = defineModel<boolean>('open', { default: false })

const query = ref('')
const activeIndex = ref(0)
const input = useTemplateRef<HTMLInputElement>('input')
const list = useTemplateRef<HTMLElement>('list')
const listId = useId()

const results = computed(() =>
  fuzzyFilter(
    commands.filter((c) => !c.disabled),
    query.value,
    (c) => `${c.group} ${c.label} ${c.keywords ?? ''}`,
  ),
)

const groups = computed(() => {
  const map = new Map<string, { command: PaletteCommand; index: number }[]>()
  results.value.forEach(({ item }, index) => {
    const group = map.get(item.group) ?? []
    group.push({ command: item, index })
    map.set(item.group, group)
  })
  return [...map.entries()]
})

const optionId = (index: number) => `${listId}-option-${index}`

watch(query, () => (activeIndex.value = 0))
watch(open, async (value) => {
  if (!value) return
  query.value = ''
  activeIndex.value = 0
  await nextTick()
  input.value?.focus()
})

function move(delta: number) {
  const count = results.value.length
  if (count === 0) return
  activeIndex.value = (activeIndex.value + delta + count) % count
  void nextTick(() =>
    list.value?.querySelector(`#${CSS.escape(optionId(activeIndex.value))}`)?.scrollIntoView({
      block: 'nearest',
    }),
  )
}

function run(command: PaletteCommand | undefined) {
  if (!command) return
  open.value = false
  command.run()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') move(1)
  else if (event.key === 'ArrowUp') move(-1)
  else if (event.key === 'Enter') run(results.value[activeIndex.value]?.item)
  else return
  event.preventDefault()
}
</script>

<template>
  <UiDialog v-model:open="open" title="Command palette" size="md" bare>
    <div class="flex items-center gap-2.5 border-b border-line px-4">
      <Search class="size-4 shrink-0 text-fg-muted" aria-hidden="true" />
      <input
        ref="input"
        v-model="query"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="results.length > 0"
        :aria-controls="listId"
        :aria-activedescendant="results.length ? optionId(activeIndex) : undefined"
        aria-label="Search commands"
        placeholder="Type a command or search…"
        class="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted"
        @keydown="onKeydown"
      />
    </div>

    <div :id="listId" ref="list" role="listbox" class="max-h-[min(60vh,420px)] overflow-y-auto p-2">
      <p v-if="!results.length" class="px-3 py-8 text-center text-sm text-fg-muted">
        No commands found
      </p>
      <div v-for="[group, entries] in groups" :key="group" role="group" :aria-label="group">
        <p class="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-fg-muted uppercase">
          {{ group }}
        </p>
        <div
          v-for="{ command, index } in entries"
          :id="optionId(index)"
          :key="command.id"
          role="option"
          :aria-selected="index === activeIndex"
          :class="
            cn(
              'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg',
              index === activeIndex && 'bg-accent-soft',
            )
          "
          @click="run(command)"
          @pointermove="activeIndex = index"
        >
          <component
            :is="command.icon"
            v-if="command.icon"
            class="size-4 shrink-0 text-fg-muted"
            aria-hidden="true"
          />
          <span class="min-w-0 flex-1 truncate">{{ command.label }}</span>
          <span v-if="command.shortcut" class="flex gap-1">
            <UiKbd v-for="key in shortcutKeys(command.shortcut)" :key>{{ key }}</UiKbd>
          </span>
          <CornerDownLeft
            v-else-if="index === activeIndex"
            class="size-3.5 text-fg-muted"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>

    <footer
      class="flex items-center gap-4 border-t border-line px-4 py-2 text-[11px] text-fg-muted"
    >
      <span class="flex items-center gap-1"><UiKbd>↑</UiKbd><UiKbd>↓</UiKbd> navigate</span>
      <span class="flex items-center gap-1"><UiKbd>↵</UiKbd> run</span>
      <span class="flex items-center gap-1"><UiKbd>Esc</UiKbd> close</span>
    </footer>
  </UiDialog>
</template>
