<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useDocumentStore } from '@/entities/document'
import { useEditorStore } from '@/entities/editor'
import BlockInspector from './BlockInspector.vue'
import PageSettings from './PageSettings.vue'

const documentStore = useDocumentStore()
const editor = useEditorStore()
const { document } = storeToRefs(documentStore)

const selectedBlock = computed(() =>
  editor.selectedBlockId ? documentStore.getBlock(editor.selectedBlockId) : undefined,
)
</script>

<template>
  <BlockInspector v-if="selectedBlock" :key="selectedBlock.id" :block="selectedBlock" />
  <PageSettings v-else-if="document" :document />
</template>
