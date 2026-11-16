<script setup lang="ts">
import { LayoutTemplate, Plus, Upload } from '@lucide/vue'
import { computed, onMounted, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { useBlockRegistry } from '@/entities/block'
import {
  cloneDocument,
  listDocuments,
  type PageDocument,
  useDocumentRepository,
} from '@/entities/document'
import { NewPageDialog } from '@/features/create-page'
import { exportJson } from '@/features/export-page'
import { importAndSave } from '@/features/import-page'
import { AppHeader } from '@/widgets/app-header'
import { PageCard } from '@/widgets/page-card'
import { RouteName } from '@/shared/config'
import { pickTextFile } from '@/shared/lib'
import { toast, UiButton, UiDialog, UiEmptyState } from '@/shared/ui'

const router = useRouter()
const repository = useDocumentRepository()
const registry = useBlockRegistry()

const pages = shallowRef<PageDocument[]>([])
const loading = ref(true)
const newPageOpen = ref(false)
const pageToDelete = shallowRef<PageDocument | null>(null)

const deleteOpen = computed({
  get: () => pageToDelete.value !== null,
  set: (open) => {
    if (!open) pageToDelete.value = null
  },
})

async function refresh() {
  const { documents, unreadable } = await listDocuments(repository, registry)
  pages.value = documents
  loading.value = false
  if (unreadable) {
    toast({
      tone: 'warning',
      title: `${unreadable} saved ${unreadable === 1 ? 'page' : 'pages'} couldn’t be read`,
    })
  }
}

onMounted(refresh)

const openEditor = (id: string) => router.push({ name: RouteName.Editor, params: { id } })

async function create(document: PageDocument) {
  await repository.save(document)
  await openEditor(document.id)
}

async function duplicate(page: PageDocument) {
  const copy = cloneDocument(page, `${page.name} (copy)`)
  await repository.save(copy)
  await refresh()
  toast({ tone: 'success', title: `Duplicated “${page.name}”` })
}

async function confirmDelete() {
  const page = pageToDelete.value
  if (!page) return
  await repository.remove(page.id)
  pageToDelete.value = null
  await refresh()
  toast({ title: `Deleted “${page.name}”` })
}

async function importFile() {
  const file = await pickTextFile('.json,application/json')
  if (!file) return

  const result = await importAndSave(file.text, registry, repository)
  if (!result.ok) {
    toast({ tone: 'error', title: 'Import failed', description: result.reason })
    return
  }
  toast(
    result.issues.length
      ? {
          tone: 'warning',
          title: `Imported “${result.document.name}” with ${result.issues.length} issue(s)`,
          description: 'Some blocks may show a placeholder.',
        }
      : { tone: 'success', title: `Imported “${result.document.name}”` },
  )
  await openEditor(result.document.id)
}
</script>

<template>
  <div class="min-h-svh">
    <AppHeader />

    <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">Pages</h1>
          <p class="mt-1 text-sm text-fg-muted">Build landing pages from ready-made blocks.</p>
        </div>
        <div class="flex gap-2">
          <UiButton @click="importFile">
            <template #icon><Upload /></template>
            Import
          </UiButton>
          <UiButton variant="primary" @click="newPageOpen = true">
            <template #icon><Plus /></template>
            New page
          </UiButton>
        </div>
      </div>

      <div v-if="loading" class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        <div
          v-for="n in 3"
          :key="n"
          class="overflow-hidden rounded-xl border border-line bg-surface"
        >
          <div class="aspect-16/10 animate-pulse bg-surface-muted" />
          <div class="space-y-2 p-4">
            <div class="h-3.5 w-2/3 animate-pulse rounded bg-surface-muted" />
            <div class="h-3 w-1/3 animate-pulse rounded bg-surface-muted" />
          </div>
        </div>
      </div>

      <UiEmptyState
        v-else-if="!pages.length"
        class="mt-8"
        :icon="LayoutTemplate"
        title="No pages yet"
        description="Start from a template or a blank canvas: pick blocks, tune the content and see how it looks on any device."
      >
        <template #actions>
          <UiButton variant="primary" @click="newPageOpen = true">
            <template #icon><Plus /></template>
            Create a page
          </UiButton>
          <UiButton @click="importFile">
            <template #icon><Upload /></template>
            Import a project file
          </UiButton>
        </template>
      </UiEmptyState>

      <ul v-else class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="page in pages" :key="page.id">
          <PageCard
            :page
            @duplicate="duplicate(page)"
            @export="exportJson(page)"
            @delete="pageToDelete = page"
          />
        </li>
      </ul>
    </main>

    <NewPageDialog v-model:open="newPageOpen" @create="create" />

    <UiDialog
      v-model:open="deleteOpen"
      size="sm"
      title="Delete page?"
      :description="`“${pageToDelete?.name}” will be deleted permanently. This can’t be undone.`"
    >
      <template #footer>
        <UiButton @click="deleteOpen = false">Cancel</UiButton>
        <UiButton variant="danger" @click="confirmDelete">Delete</UiButton>
      </template>
    </UiDialog>
  </div>
</template>
