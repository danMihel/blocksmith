<script setup lang="ts">
import { ArrowLeft, FileQuestion } from '@lucide/vue'
import { shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBlockRegistry } from '@/entities/block'
import {
  loadDocument,
  type PageDocument,
  PageRenderer,
  useDocumentRepository,
} from '@/entities/document'
import { APP_NAME, RouteName } from '@/shared/config'
import { UiButton, UiEmptyState } from '@/shared/ui'

const { id } = defineProps<{ id: string }>()

const router = useRouter()
const repository = useDocumentRepository()
const registry = useBlockRegistry()

const page = shallowRef<PageDocument | null>(null)
const missing = shallowRef(false)

watch(
  () => id,
  async (pageId) => {
    const result = await loadDocument(repository, registry, pageId)
    page.value = result.status === 'ok' ? result.document : null
    missing.value = result.status !== 'ok'
    if (page.value) document.title = `${page.value.name} · ${APP_NAME}`
  },
  { immediate: true },
)
</script>

<template>
  <div class="min-h-svh">
    <template v-if="page">
      <PageRenderer class="min-h-svh" :blocks="page.blocks" :theme="page.theme" />

      <div class="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
        <div
          class="flex items-center gap-3 rounded-full border border-line bg-surface/90 py-1.5 pr-1.5 pl-4 text-fg shadow-2xl backdrop-blur"
        >
          <span class="text-xs text-fg-muted">
            Preview of <span class="font-medium text-fg">{{ page.name }}</span>
          </span>
          <UiButton
            size="sm"
            variant="primary"
            class="rounded-full"
            @click="router.push({ name: RouteName.Editor, params: { id } })"
          >
            <template #icon><ArrowLeft /></template>
            Back to editor
          </UiButton>
        </div>
      </div>
    </template>

    <main v-else-if="missing" class="mx-auto max-w-lg px-4 py-24">
      <UiEmptyState
        :icon="FileQuestion"
        title="Page not found"
        description="It may have been deleted, or it was saved in another browser."
      >
        <template #actions>
          <UiButton @click="router.push({ name: RouteName.Dashboard })">Back to pages</UiButton>
        </template>
      </UiEmptyState>
    </main>
  </div>
</template>
