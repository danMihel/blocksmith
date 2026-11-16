<script setup lang="ts">
import { CONTENT_ICONS } from '@/shared/ui'
import type { FeaturesProps } from './schema'

const { eyebrow, title, subtitle, columns, items } = defineProps<FeaturesProps>()

// Full class names so Tailwind can see them at build time.
const gridColumns: Record<FeaturesProps['columns'], string> = {
  2: '@2xl:grid-cols-2',
  3: '@2xl:grid-cols-2 @5xl:grid-cols-3',
  4: '@2xl:grid-cols-2 @5xl:grid-cols-4',
}
</script>

<template>
  <section class="px-6 pt-(--pt) pb-(--pb)">
    <div class="mx-auto max-w-6xl">
      <header v-if="eyebrow || title || subtitle" class="mx-auto max-w-2xl text-center">
        <p v-if="eyebrow" class="text-sm font-semibold tracking-wide text-page-primary uppercase">
          {{ eyebrow }}
        </p>
        <h2
          v-if="title"
          class="mt-3 text-3xl font-semibold tracking-tight text-balance text-page-fg @3xl:text-5xl"
        >
          {{ title }}
        </h2>
        <p v-if="subtitle" class="mt-4 text-lg text-pretty text-page-muted">{{ subtitle }}</p>
      </header>

      <ul :class="['mt-14 grid gap-4 @3xl:gap-6', gridColumns[columns]]">
        <li
          v-for="(item, index) in items"
          :key="index"
          class="group rounded-page border border-page-line bg-page-surface p-6 transition-colors hover:border-page-primary/40 @3xl:p-8"
        >
          <div
            class="grid size-11 place-items-center rounded-[calc(var(--page-radius)*0.75)] bg-page-primary/10 text-page-primary ring-1 ring-page-primary/15 transition-transform ring-inset group-hover:scale-105"
          >
            <component :is="CONTENT_ICONS[item.icon]" class="size-5" aria-hidden="true" />
          </div>
          <h3 class="mt-5 text-lg font-semibold text-page-fg">{{ item.title }}</h3>
          <p class="mt-2 text-[15px]/relaxed text-page-muted">{{ item.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
