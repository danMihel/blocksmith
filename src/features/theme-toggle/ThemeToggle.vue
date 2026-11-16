<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import { UiIconButton } from '@/shared/ui'
import { useDarkMode } from './model/use-dark-mode'

const { size = 'md' } = defineProps<{ size?: 'sm' | 'md' }>()

const { isDark, toggle } = useDarkMode()
</script>

<template>
  <UiIconButton
    :size
    :label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle()"
  >
    <Sun v-if="isDark" />
    <Moon v-else />
  </UiIconButton>
</template>
