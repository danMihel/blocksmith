<script setup lang="ts">
import { Quote } from '@lucide/vue'
import type { TestimonialsProps } from './schema'

const { eyebrow, title, subtitle, items } = defineProps<TestimonialsProps>()

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
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

      <!-- Masonry via CSS columns: cards of different heights pack without gaps -->
      <div class="mt-14 columns-1 gap-4 @3xl:columns-2 @3xl:gap-6 @5xl:columns-3">
        <figure
          v-for="(item, index) in items"
          :key="index"
          class="mb-4 break-inside-avoid rounded-page border border-page-line bg-page-surface p-6 @3xl:mb-6 @3xl:p-7"
        >
          <Quote class="size-6 text-page-primary/60" aria-hidden="true" />
          <blockquote class="mt-4 text-[15px]/relaxed text-pretty text-page-fg">
            {{ item.quote }}
          </blockquote>
          <figcaption class="mt-6 flex items-center gap-3">
            <span
              class="grid size-10 shrink-0 place-items-center rounded-full bg-page-primary/12 text-sm font-semibold text-page-primary"
              aria-hidden="true"
            >
              {{ initials(item.author) }}
            </span>
            <span class="min-w-0">
              <span class="block text-sm font-semibold text-page-fg">{{ item.author }}</span>
              <span v-if="item.role" class="block text-sm text-page-muted">{{ item.role }}</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
