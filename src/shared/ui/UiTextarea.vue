<script setup lang="ts">
import { cn } from '@/shared/lib'
import { inputBase } from './styles'
import UiField from './UiField.vue'

defineOptions({ inheritAttrs: false })

const {
  label,
  hint,
  error,
  rows = 3,
} = defineProps<{
  label?: string
  hint?: string
  error?: string
  rows?: number
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <UiField :label :hint :error>
    <template #default="field">
      <textarea
        :id="field.id"
        v-model="model"
        v-bind="$attrs"
        :rows
        :aria-describedby="field.describedBy"
        :aria-invalid="field.invalid || undefined"
        :class="
          cn(
            inputBase,
            'field-sizing-content min-h-16 resize-y rounded-md px-2.5 py-1.5 text-[13px]/relaxed',
          )
        "
      />
    </template>
  </UiField>
</template>
