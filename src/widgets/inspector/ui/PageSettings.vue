<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import {
  type PageDocument,
  RenameDocumentCommand,
  UpdateThemeCommand,
  useDocumentStore,
} from '@/entities/document'
import {
  contrastRatio,
  FONT_IDS,
  FONTS,
  type PageTheme,
  RADII,
  RADIUS_IDS,
  THEME_PRESETS,
} from '@/entities/theme'
import { cn } from '@/shared/lib'
import { focusRing, UiColorInput, UiInput, UiSegmented, UiSelect } from '@/shared/ui'

const { document } = defineProps<{ document: PageDocument }>()

const documentStore = useDocumentStore()
const theme = computed(() => document.theme)

const name = ref(document.name)
watch(
  () => document.name,
  (value) => (name.value = value),
)
const nameError = computed(() => (name.value.trim() ? undefined : 'The page needs a name'))

function rename(value: string) {
  name.value = value
  if (value.trim()) documentStore.execute(new RenameDocumentCommand(value))
}

function updateTheme(patch: Partial<PageTheme>, label?: string) {
  documentStore.execute(new UpdateThemeCommand(patch, label))
}

const isActivePreset = (preset: PageTheme) =>
  (Object.keys(preset) as (keyof PageTheme)[]).every((key) => preset[key] === theme.value[key])

const contrast = computed(() => contrastRatio(theme.value.foreground, theme.value.background))

const radiusOptions = RADIUS_IDS.map((id) => ({ value: id, label: RADII[id].label }))
const fontOptions = FONT_IDS.map((id) => ({ value: id, label: FONTS[id].label }))
</script>

<template>
  <div class="h-full space-y-6 overflow-y-auto p-4">
    <header>
      <h2 class="text-sm font-semibold">Page settings</h2>
      <p class="mt-0.5 text-xs text-fg-muted">Select a block on the canvas to edit its content.</p>
    </header>

    <UiInput
      size="sm"
      label="Page name"
      maxlength="100"
      :error="nameError"
      :model-value="name"
      @update:model-value="rename"
      @blur="name = document.name"
    />

    <section class="space-y-2" aria-labelledby="theme-presets">
      <h3 id="theme-presets" class="text-[13px] font-medium">Theme</h3>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="preset in THEME_PRESETS"
          :key="preset.id"
          type="button"
          :aria-pressed="isActivePreset(preset.theme)"
          :class="
            cn(
              'rounded-lg border p-1.5 text-left transition-colors',
              focusRing,
              'focus-visible:ring-offset-0',
              isActivePreset(preset.theme)
                ? 'border-accent ring-1 ring-accent'
                : 'border-line hover:border-fg-muted/40',
            )
          "
          @click="updateTheme({ ...preset.theme }, `Apply ${preset.name} theme`)"
        >
          <span
            class="flex h-11 items-center justify-between rounded-md px-2.5"
            :style="{
              background: preset.theme.background,
              color: preset.theme.foreground,
              fontFamily: FONTS[preset.theme.headingFont].stack,
            }"
          >
            <span class="text-lg font-semibold">Aa</span>
            <span class="size-4 rounded-full" :style="{ background: preset.theme.primary }" />
          </span>
          <span class="mt-1 block px-0.5 text-xs font-medium">{{ preset.name }}</span>
        </button>
      </div>
    </section>

    <section class="space-y-3" aria-labelledby="theme-colors">
      <h3 id="theme-colors" class="text-[13px] font-medium">Colors</h3>
      <UiColorInput
        label="Accent"
        :model-value="theme.primary"
        @update:model-value="updateTheme({ primary: $event })"
      />
      <UiColorInput
        label="Background"
        :model-value="theme.background"
        @update:model-value="updateTheme({ background: $event })"
      />
      <UiColorInput
        label="Text"
        :model-value="theme.foreground"
        @update:model-value="updateTheme({ foreground: $event })"
      />
      <p
        :class="[
          'flex items-center gap-1.5 text-xs',
          contrast < 4.5 ? 'text-amber-600 dark:text-amber-400' : 'text-fg-muted',
        ]"
      >
        <TriangleAlert v-if="contrast < 4.5" class="size-3.5 shrink-0" aria-hidden="true" />
        Text contrast {{ contrast.toFixed(1) }}:1
        <template v-if="contrast < 4.5"> — below WCAG AA (4.5:1)</template>
      </p>
    </section>

    <section class="space-y-3" aria-labelledby="theme-shape">
      <h3 id="theme-shape" class="text-[13px] font-medium">Shape & type</h3>
      <div class="space-y-1.5">
        <p class="text-[13px] text-fg-muted">Corner radius</p>
        <UiSegmented
          size="sm"
          stretch
          label="Corner radius"
          :options="radiusOptions"
          :model-value="theme.radius"
          @update:model-value="updateTheme({ radius: $event })"
        />
      </div>
      <UiSelect
        label="Heading font"
        :options="fontOptions"
        :model-value="theme.headingFont"
        @update:model-value="updateTheme({ headingFont: $event })"
      />
      <UiSelect
        label="Body font"
        :options="fontOptions"
        :model-value="theme.bodyFont"
        @update:model-value="updateTheme({ bodyFont: $event })"
      />
    </section>
  </div>
</template>
