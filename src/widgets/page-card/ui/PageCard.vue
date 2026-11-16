<script setup lang="ts">
import { Copy, Download, Eye, Trash2 } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { type PageDocument, PageThumbnail } from '@/entities/document'
import { RouteName } from '@/shared/config'
import { formatRelativeTime } from '@/shared/lib'
import { UiIconButton } from '@/shared/ui'

const { page } = defineProps<{ page: PageDocument }>()

const emit = defineEmits<{ duplicate: []; export: []; delete: [] }>()

const router = useRouter()
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-xl border border-line bg-surface shadow-xs transition focus-within:ring-2 focus-within:ring-ring hover:-translate-y-0.5 hover:shadow-lg"
  >
    <RouterLink
      :to="{ name: RouteName.Editor, params: { id: page.id } }"
      class="block outline-none"
      :aria-label="`Open ${page.name}`"
    >
      <PageThumbnail
        class="aspect-16/10 border-b border-line"
        :blocks="page.blocks"
        :theme="page.theme"
      />
    </RouterLink>

    <div class="flex items-center gap-2 p-3 pl-4">
      <div class="min-w-0 flex-1">
        <h3 class="truncate text-sm font-medium">{{ page.name }}</h3>
        <p class="truncate text-xs text-fg-muted">
          Edited {{ formatRelativeTime(page.updatedAt) }} · {{ page.blocks.length }}
          {{ page.blocks.length === 1 ? 'block' : 'blocks' }}
        </p>
      </div>
      <div
        class="flex transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
      >
        <UiIconButton
          size="sm"
          label="Preview"
          @click="router.push({ name: RouteName.Preview, params: { id: page.id } })"
        >
          <Eye />
        </UiIconButton>
        <UiIconButton size="sm" label="Duplicate" @click="emit('duplicate')">
          <Copy />
        </UiIconButton>
        <UiIconButton size="sm" label="Download project file" @click="emit('export')">
          <Download />
        </UiIconButton>
        <UiIconButton size="sm" label="Delete" @click="emit('delete')">
          <Trash2 />
        </UiIconButton>
      </div>
    </div>
  </article>
</template>
