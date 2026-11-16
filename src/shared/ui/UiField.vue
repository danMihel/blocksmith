<script setup lang="ts">
import { computed, useId } from 'vue'

/**
 * Label + hint/error wrapper. Owns the ids and hands them to the control through the slot,
 * so every control gets correct `for` / `aria-describedby` / `aria-invalid` wiring.
 */
const { label, hint, error, id } = defineProps<{
  label?: string
  hint?: string
  error?: string
  id?: string
}>()

defineSlots<{
  default: (props: { id: string; describedBy: string | undefined; invalid: boolean }) => unknown
  aside?: () => unknown
}>()

const autoId = useId()
const fieldId = computed(() => id ?? autoId)
const messageId = computed(() => `${fieldId.value}-message`)
const describedBy = computed(() => (error || hint ? messageId.value : undefined))
</script>

<template>
  <div class="flex min-w-0 flex-col gap-1.5">
    <div v-if="label || $slots.aside" class="flex min-h-5 items-center justify-between gap-2">
      <label v-if="label" :for="fieldId" class="text-[13px] font-medium text-fg">
        {{ label }}
      </label>
      <slot name="aside" />
    </div>
    <slot v-bind="{ id: fieldId, describedBy, invalid: !!error }" />
    <p v-if="error" :id="messageId" class="text-xs text-danger">{{ error }}</p>
    <p v-else-if="hint" :id="messageId" class="text-xs text-fg-muted">{{ hint }}</p>
  </div>
</template>
