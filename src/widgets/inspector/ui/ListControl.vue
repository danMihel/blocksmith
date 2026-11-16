<script setup lang="ts">
import { ArrowDown, ArrowUp, ChevronRight, Plus, Trash2 } from '@lucide/vue'
import { computed, ref } from 'vue'
import type { AnyListField } from '@/entities/block'
import { cn } from '@/shared/lib'
import { focusRing, UiButton, UiIconButton } from '@/shared/ui'
import FieldControl from './FieldControl.vue'

const { field, value, path, errors } = defineProps<{
  field: AnyListField
  value: unknown
  path: string
  errors: ReadonlyMap<string, string>
}>()

const emit = defineEmits<{ update: [value: unknown[]] }>()

type Item = Record<string, unknown>
const items = computed(() => (Array.isArray(value) ? value : []) as Item[])

const expanded = ref<number | null>(null)

const canAdd = computed(() => field.max === undefined || items.value.length < field.max)
const canRemove = computed(() => items.value.length > (field.min ?? 0))
const listError = computed(() => errors.get(path))

const capitalized = computed(
  () => field.itemLabel.charAt(0).toUpperCase() + field.itemLabel.slice(1),
)

function titleOf(item: Item, index: number) {
  const title = field.titleKey ? item[field.titleKey] : undefined
  return typeof title === 'string' && title.trim() ? title : `${capitalized.value} ${index + 1}`
}

const hasError = (index: number) =>
  [...errors.keys()].some((key) => key.startsWith(`${path}.${index}.`))

function setItem(index: number, key: string, next: unknown) {
  emit('update', items.value.with(index, { ...items.value[index], [key]: next }))
}

function add() {
  emit('update', [...items.value, field.createItem()])
  expanded.value = items.value.length
}

function remove(index: number) {
  emit('update', items.value.toSpliced(index, 1))
  if (expanded.value === index) expanded.value = null
  else if (expanded.value !== null && expanded.value > index) expanded.value--
}

function move(index: number, delta: -1 | 1) {
  const next = [...items.value]
  const [item] = next.splice(index, 1)
  next.splice(index + delta, 0, item!)
  emit('update', next)
  if (expanded.value === index) expanded.value = index + delta
  else if (expanded.value === index + delta) expanded.value = index
}
</script>

<template>
  <fieldset class="min-w-0">
    <legend class="mb-1.5 flex w-full items-center justify-between text-[13px] font-medium text-fg">
      {{ field.label }}
      <span class="text-xs font-normal text-fg-muted tabular-nums">
        {{ items.length }}<template v-if="field.max"> / {{ field.max }}</template>
      </span>
    </legend>

    <ul class="space-y-1.5">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="rounded-lg border border-line bg-surface"
      >
        <div class="flex items-center gap-0.5 pr-1">
          <button
            type="button"
            :class="
              cn(
                'flex min-w-0 flex-1 items-center gap-2 rounded-l-lg px-2.5 py-2 text-left text-[13px] text-fg',
                focusRing,
                'focus-visible:ring-offset-0',
              )
            "
            :aria-expanded="expanded === index"
            @click="expanded = expanded === index ? null : index"
          >
            <ChevronRight
              :class="[
                'size-3.5 shrink-0 text-fg-muted transition-transform',
                expanded === index && 'rotate-90',
              ]"
              aria-hidden="true"
            />
            <span class="truncate">{{ titleOf(item, index) }}</span>
            <span
              v-if="hasError(index)"
              class="size-1.5 shrink-0 rounded-full bg-danger"
              role="img"
              aria-label="Has errors"
            />
          </button>
          <UiIconButton size="sm" label="Move up" :disabled="index === 0" @click="move(index, -1)">
            <ArrowUp />
          </UiIconButton>
          <UiIconButton
            size="sm"
            label="Move down"
            :disabled="index === items.length - 1"
            @click="move(index, 1)"
          >
            <ArrowDown />
          </UiIconButton>
          <UiIconButton
            size="sm"
            :label="`Remove ${field.itemLabel}`"
            :disabled="!canRemove"
            @click="remove(index)"
          >
            <Trash2 />
          </UiIconButton>
        </div>

        <div v-if="expanded === index" class="space-y-3 border-t border-line p-3">
          <FieldControl
            v-for="sub in field.fields"
            :key="sub.key"
            :field="sub"
            :value="item[sub.key]"
            :path="`${path}.${index}.${sub.key}`"
            :errors
            @update="setItem(index, sub.key, $event)"
          />
        </div>
      </li>
    </ul>

    <p v-if="listError" class="mt-1.5 text-xs text-danger">{{ listError }}</p>

    <UiButton size="sm" block class="mt-2" :disabled="!canAdd" @click="add">
      <template #icon><Plus /></template>
      Add {{ field.itemLabel }}
    </UiButton>
  </fieldset>
</template>
