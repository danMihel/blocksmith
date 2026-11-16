<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import { PAGE_TEMPLATES } from '@/blocks'
import { createDocument, type PageDocument, PageThumbnail } from '@/entities/document'
import { cn } from '@/shared/lib'
import { focusRing, UiButton, UiDialog, UiInput } from '@/shared/ui'

const emit = defineEmits<{ create: [document: PageDocument] }>()
const open = defineModel<boolean>('open', { default: false })

const BLANK = 'blank'
const selected = ref<string>(PAGE_TEMPLATES[0]?.id ?? BLANK)
const name = ref('')

const previews = computed(() =>
  open.value ? PAGE_TEMPLATES.map((template) => ({ template, document: template.create() })) : [],
)

watch(open, (value) => {
  if (value) name.value = ''
})

const placeholder = computed(
  () =>
    previews.value.find((p) => p.template.id === selected.value)?.document.name ?? 'Untitled page',
)

function create() {
  const pageName = name.value.trim() || placeholder.value
  const template = PAGE_TEMPLATES.find((t) => t.id === selected.value)
  emit('create', template ? template.create(pageName) : createDocument({ name: pageName }))
  open.value = false
}

const cardClass = (active: boolean) =>
  cn(
    'group flex flex-col overflow-hidden rounded-xl border text-left transition',
    focusRing,
    active ? 'border-accent ring-2 ring-accent/30' : 'border-line hover:border-fg-muted/40',
  )
</script>

<template>
  <UiDialog
    v-model:open="open"
    title="New page"
    description="Start from a template or a blank canvas."
    size="xl"
  >
    <form id="new-page-form" class="space-y-5" @submit.prevent="create">
      <div role="radiogroup" aria-label="Template" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          role="radio"
          :aria-checked="selected === BLANK"
          :class="cardClass(selected === BLANK)"
          @click="selected = BLANK"
        >
          <span class="grid aspect-4/3 place-items-center bg-surface-muted text-fg-muted">
            <Plus class="size-6" aria-hidden="true" />
          </span>
          <span class="border-t border-line p-3">
            <span class="block text-sm font-medium">Blank</span>
            <span class="mt-0.5 block text-xs text-fg-muted">Start from scratch</span>
          </span>
        </button>

        <button
          v-for="{ template, document } in previews"
          :key="template.id"
          type="button"
          role="radio"
          :aria-checked="selected === template.id"
          :class="cardClass(selected === template.id)"
          @click="selected = template.id"
        >
          <PageThumbnail class="aspect-4/3" :blocks="document.blocks" :theme="document.theme" />
          <span class="border-t border-line p-3">
            <span class="block text-sm font-medium">{{ template.name }}</span>
            <span class="mt-0.5 block text-xs text-fg-muted">{{ template.description }}</span>
          </span>
        </button>
      </div>

      <UiInput v-model="name" label="Page name" :placeholder maxlength="100" />
    </form>

    <template #footer>
      <UiButton @click="open = false">Cancel</UiButton>
      <UiButton type="submit" form="new-page-form" variant="primary">Create page</UiButton>
    </template>
  </UiDialog>
</template>
