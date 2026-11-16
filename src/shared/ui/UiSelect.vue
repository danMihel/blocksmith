<script setup lang="ts" generic="T extends string | number">
import { ChevronDown } from '@lucide/vue'
import { computed } from 'vue'
import { cn } from '@/shared/lib'
import { inputBase, inputSizes } from './styles'
import type { ControlSize } from './types'
import UiField from './UiField.vue'

const {
  options,
  label,
  hint,
  error,
  size = 'sm',
} = defineProps<{
  options: readonly { value: T; label: string }[]
  label?: string
  hint?: string
  error?: string
  size?: ControlSize
}>()

const model = defineModel<T>({ required: true })

const selectedIndex = computed(() => options.findIndex((o) => o.value === model.value))

function onChange(event: Event) {
  const option = options[Number((event.target as HTMLSelectElement).value)]
  if (option) model.value = option.value
}
</script>

<template>
  <UiField :label :hint :error>
    <template #default="field">
      <div class="relative">
        <select
          :id="field.id"
          :value="selectedIndex"
          :aria-describedby="field.describedBy"
          :aria-invalid="field.invalid || undefined"
          :class="cn(inputBase, inputSizes[size], 'appearance-none pr-8')"
          @change="onChange"
        >
          <option v-for="(option, index) in options" :key="String(option.value)" :value="index">
            {{ option.label }}
          </option>
        </select>
        <ChevronDown
          class="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-fg-muted"
          aria-hidden="true"
        />
      </div>
    </template>
  </UiField>
</template>
