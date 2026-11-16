<script setup lang="ts">
import { DragGhost } from '@/features/drag-drop'
import { UiToaster } from '@/shared/ui'
</script>

<template>
  <RouterView />
  <DragGhost />
  <UiToaster />
</template>
