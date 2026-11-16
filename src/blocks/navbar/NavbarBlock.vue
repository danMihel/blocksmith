<script setup lang="ts">
import { Menu, X } from '@lucide/vue'
import type { NavbarProps } from './schema'

const { brand, links, action } = defineProps<NavbarProps>()
</script>

<template>
  <header class="relative px-6 pt-(--pt) pb-(--pb)">
    <nav class="mx-auto flex h-16 max-w-6xl items-center gap-6" aria-label="Main">
      <a
        href="#"
        class="flex items-center gap-2.5 [font-family:var(--page-font-heading)] text-lg font-semibold tracking-tight text-page-fg"
      >
        <span
          class="grid size-8 place-items-center rounded-[calc(var(--page-radius)*0.6)] bg-page-primary text-sm font-bold text-page-primary-fg"
          aria-hidden="true"
        >
          {{ brand.charAt(0) }}
        </span>
        {{ brand }}
      </a>

      <ul class="ml-auto hidden items-center gap-1 @3xl:flex">
        <li v-for="(link, index) in links" :key="index">
          <a
            :href="link.href"
            class="rounded-page px-3 py-2 text-sm font-medium text-page-muted transition-colors hover:text-page-fg"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
      <a
        v-if="action.label"
        :href="action.href"
        class="hidden h-10 items-center rounded-page bg-page-primary px-4 text-sm font-medium text-page-primary-fg transition hover:brightness-110 @3xl:inline-flex"
      >
        {{ action.label }}
      </a>

      <details class="group ml-auto @3xl:hidden">
        <summary
          class="grid size-10 cursor-pointer list-none place-items-center rounded-page border border-page-line text-page-fg [&::-webkit-details-marker]:hidden"
        >
          <Menu class="size-5 group-open:hidden" aria-hidden="true" />
          <X class="hidden size-5 group-open:block" aria-hidden="true" />
          <span class="sr-only">Menu</span>
        </summary>
        <div
          class="absolute inset-x-4 top-full z-10 mt-1 flex flex-col gap-1 rounded-page border border-page-line bg-page-bg p-2 shadow-xl"
        >
          <a
            v-for="(link, index) in links"
            :key="index"
            :href="link.href"
            class="rounded-page px-3 py-2.5 text-sm font-medium text-page-fg hover:bg-page-surface"
          >
            {{ link.label }}
          </a>
          <a
            v-if="action.label"
            :href="action.href"
            class="mt-1 inline-flex h-11 items-center justify-center rounded-page bg-page-primary text-sm font-medium text-page-primary-fg"
          >
            {{ action.label }}
          </a>
        </div>
      </details>
    </nav>
  </header>
</template>
