<script setup lang="ts">
import { cn } from '@/shared/lib'
import { inputBase, inputSizes } from './styles'
import type { ControlSize } from './types'
import UiField from './UiField.vue'

defineOptions({ inheritAttrs: false })

const {
  label,
  hint,
  error,
  size = 'md',
  id,
} = defineProps<{
  label?: string
  hint?: string
  error?: string
  size?: ControlSize
  id?: string
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <UiField :id :label :hint :error>
    <template #default="field">
      <input
        :id="field.id"
        v-model="model"
        v-bind="$attrs"
        :aria-describedby="field.describedBy"
        :aria-invalid="field.invalid || undefined"
        :class="cn(inputBase, inputSizes[size])"
      />
    </template>
  </UiField>
</template>
