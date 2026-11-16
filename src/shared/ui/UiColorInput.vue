<script setup lang="ts">
import { ref, watch } from 'vue'
import { cn } from '@/shared/lib'
import { inputBase, inputSizes } from './styles'
import UiField from './UiField.vue'

const { label, hint } = defineProps<{ label: string; hint?: string }>()

const model = defineModel<string>({ required: true })

const HEX = /^#[0-9a-f]{6}$/i

// The text field may hold an incomplete value while typing; only valid colors reach the model.
const draft = ref(model.value)
watch(model, (value) => (draft.value = value))

function commitDraft() {
  const value = draft.value.startsWith('#') ? draft.value : `#${draft.value}`
  if (HEX.test(value)) model.value = value.toLowerCase()
  else draft.value = model.value
}
</script>

<template>
  <UiField :label :hint>
    <template #default="field">
      <div class="flex items-center gap-2">
        <input
          type="color"
          :value="model"
          :aria-label="`${label} picker`"
          class="size-8 shrink-0 cursor-pointer rounded-md border border-line bg-surface p-0.5 [&::-moz-color-swatch]:rounded [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
          @input="model = ($event.target as HTMLInputElement).value"
        />
        <input
          :id="field.id"
          v-model="draft"
          :aria-describedby="field.describedBy"
          spellcheck="false"
          maxlength="7"
          :class="cn(inputBase, inputSizes.sm, 'font-mono uppercase')"
          @change="commitDraft"
          @keydown.enter="commitDraft"
        />
      </div>
    </template>
  </UiField>
</template>
