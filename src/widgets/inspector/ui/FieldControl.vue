<script setup lang="ts">
import { computed } from 'vue'
import type { AnyField, BlockLink } from '@/entities/block'
import { UiInput, UiSegmented, UiSelect, UiSwitch, UiTextarea } from '@/shared/ui'
import IconPicker from './IconPicker.vue'
import ListControl from './ListControl.vue'

defineOptions({ name: 'FieldControl' })

const { field, value, path, errors } = defineProps<{
  field: AnyField
  value: unknown
  path: string
  errors: ReadonlyMap<string, string>
}>()

const emit = defineEmits<{ update: [value: unknown] }>()

const error = computed(() => errors.get(path))
const text = computed(() => (typeof value === 'string' ? value : ''))
const choice = computed(() => (typeof value === 'string' || typeof value === 'number' ? value : ''))
const link = computed<BlockLink>(() =>
  typeof value === 'object' && value !== null && 'label' in value && 'href' in value
    ? (value as BlockLink)
    : { label: '', href: '' },
)

const updateLink = (patch: Partial<BlockLink>) => emit('update', { ...link.value, ...patch })
</script>

<template>
  <UiInput
    v-if="field.control === 'text'"
    size="sm"
    :label="field.label"
    :hint="field.hint"
    :error
    :placeholder="field.placeholder"
    :model-value="text"
    @update:model-value="emit('update', $event)"
  />

  <UiTextarea
    v-else-if="field.control === 'textarea'"
    :label="field.label"
    :hint="field.hint"
    :error
    :rows="field.rows"
    :placeholder="field.placeholder"
    :model-value="text"
    @update:model-value="emit('update', $event)"
  />

  <div v-else-if="field.control === 'choice'" class="flex flex-col gap-1.5">
    <p class="text-[13px] font-medium text-fg">{{ field.label }}</p>
    <UiSegmented
      v-if="field.options.length <= 4"
      size="sm"
      stretch
      :label="field.label"
      :options="field.options"
      :model-value="choice"
      @update:model-value="emit('update', $event)"
    />
    <UiSelect
      v-else
      :options="field.options"
      :model-value="choice"
      @update:model-value="emit('update', $event)"
    />
    <p v-if="error" class="text-xs text-danger">{{ error }}</p>
    <p v-else-if="field.hint" class="text-xs text-fg-muted">{{ field.hint }}</p>
  </div>

  <UiSwitch
    v-else-if="field.control === 'toggle'"
    :label="field.label"
    :hint="field.hint"
    :model-value="value === true"
    @update:model-value="emit('update', $event)"
  />

  <IconPicker
    v-else-if="field.control === 'icon'"
    :label="field.label"
    :model-value="text"
    @update:model-value="emit('update', $event)"
  />

  <fieldset v-else-if="field.control === 'link'" class="min-w-0 space-y-2">
    <legend class="mb-1.5 text-[13px] font-medium text-fg">{{ field.label }}</legend>
    <div class="grid grid-cols-[2fr_3fr] gap-2">
      <UiInput
        size="sm"
        placeholder="Label"
        aria-label="Button label"
        :error="errors.get(`${path}.label`)"
        :model-value="link.label"
        @update:model-value="updateLink({ label: $event })"
      />
      <UiInput
        size="sm"
        placeholder="URL"
        aria-label="Button URL"
        :error="errors.get(`${path}.href`)"
        :model-value="link.href"
        @update:model-value="updateLink({ href: $event })"
      />
    </div>
    <p v-if="field.hint" class="text-xs text-fg-muted">{{ field.hint }}</p>
  </fieldset>

  <ListControl
    v-else-if="field.control === 'list'"
    :field
    :value
    :path
    :errors
    @update="emit('update', $event)"
  />
</template>
