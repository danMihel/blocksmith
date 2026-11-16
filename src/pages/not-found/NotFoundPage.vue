<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { RouteName } from '@/shared/config'
import { UiButton } from '@/shared/ui'

const router = useRouter()
</script>

<template>
  <main class="grid min-h-svh place-items-center px-4 text-center">
    <div>
      <p class="text-sm font-semibold text-accent">404</p>
      <h1 class="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p class="mt-2 text-fg-muted">The page you are looking for doesn't exist or was moved.</p>
      <UiButton class="mt-8" @click="router.push({ name: RouteName.Dashboard })">
        <template #icon><ArrowLeft /></template>
        Back to pages
      </UiButton>
    </div>
  </main>
</template>
