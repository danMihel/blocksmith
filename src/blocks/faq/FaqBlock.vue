<script setup lang="ts">
import { Plus } from '@lucide/vue'
import type { FaqProps } from './schema'

const { title, subtitle, items } = defineProps<FaqProps>()
</script>

<template>
  <section class="px-6 pt-(--pt) pb-(--pb)">
    <div class="mx-auto grid max-w-6xl gap-10 @4xl:grid-cols-[1fr_1.6fr] @4xl:gap-16">
      <header class="@4xl:sticky @4xl:top-8 @4xl:self-start">
        <h2
          v-if="title"
          class="text-3xl font-semibold tracking-tight text-balance text-page-fg @3xl:text-4xl"
        >
          {{ title }}
        </h2>
        <p v-if="subtitle" class="mt-4 text-lg text-pretty text-page-muted">{{ subtitle }}</p>
      </header>

      <!-- Native disclosure widgets: accessible and interactive without JavaScript -->
      <div class="divide-y divide-page-line border-y border-page-line">
        <details v-for="(item, index) in items" :key="index" class="group">
          <summary
            class="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-medium text-page-fg [&::-webkit-details-marker]:hidden"
          >
            {{ item.question }}
            <Plus
              class="size-5 shrink-0 text-page-muted transition-transform duration-200 group-open:rotate-45"
              aria-hidden="true"
            />
          </summary>
          <p class="pr-10 pb-5 text-[15px]/relaxed text-pretty text-page-muted">
            {{ item.answer }}
          </p>
        </details>
      </div>
    </div>
  </section>
</template>
