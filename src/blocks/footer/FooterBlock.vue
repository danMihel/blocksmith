<script setup lang="ts">
import type { FooterProps } from './schema'

const { brand, tagline, columns, copyright } = defineProps<FooterProps>()
</script>

<template>
  <footer class="border-t border-page-line px-6 pt-(--pt) pb-(--pb)">
    <div class="mx-auto max-w-6xl">
      <div class="grid gap-10 @3xl:grid-cols-[1.2fr_2fr]">
        <div>
          <p
            class="flex items-center gap-2.5 [font-family:var(--page-font-heading)] text-lg font-semibold tracking-tight text-page-fg"
          >
            <span
              class="grid size-8 place-items-center rounded-[calc(var(--page-radius)*0.6)] bg-page-primary text-sm font-bold text-page-primary-fg"
              aria-hidden="true"
            >
              {{ brand.charAt(0) }}
            </span>
            {{ brand }}
          </p>
          <p v-if="tagline" class="mt-4 max-w-xs text-sm text-pretty text-page-muted">
            {{ tagline }}
          </p>
        </div>

        <div v-if="columns.length" class="grid grid-cols-2 gap-8 @xl:grid-cols-3">
          <nav v-for="(column, index) in columns" :key="index" :aria-label="column.title">
            <p class="text-sm font-semibold text-page-fg">{{ column.title }}</p>
            <ul class="mt-4 space-y-3">
              <li v-for="(link, linkIndex) in column.links" :key="linkIndex">
                <a
                  :href="link.href"
                  class="text-sm text-page-muted transition-colors hover:text-page-fg"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <p v-if="copyright" class="mt-12 border-t border-page-line pt-6 text-sm text-page-muted">
        {{ copyright }}
      </p>
    </div>
  </footer>
</template>
