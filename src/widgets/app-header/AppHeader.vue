<script setup lang="ts">
import { Blocks } from '@lucide/vue'
import { ThemeToggle } from '@/features/theme-toggle'
import { APP_NAME, RouteName } from '@/shared/config'
import { focusRing } from '@/shared/ui'

defineSlots<{ default?: () => unknown }>()
</script>

<template>
  <header class="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
      <RouterLink
        :to="{ name: RouteName.Dashboard }"
        :class="['flex items-center gap-2.5 rounded-lg font-semibold tracking-tight', focusRing]"
      >
        <span
          class="grid size-8 place-items-center rounded-lg bg-accent text-accent-fg shadow-sm [&_svg]:size-4.5"
        >
          <Blocks aria-hidden="true" />
        </span>
        {{ APP_NAME }}
      </RouterLink>

      <div class="ml-auto flex items-center gap-2">
        <slot />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
